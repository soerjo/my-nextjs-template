import { TokenManager } from "@/features/auth/services/token-manager";
import { API_ROUTES } from "@/constants";
import { logger } from "./logger";

type RequestOptions = {
  body?: string;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  _retried?: boolean;
  timeout?: number;
};

const DEFAULT_TIMEOUT_MS = 30_000;

type RefreshSubscriber = {
  resolve: () => void;
  reject: (reason?: unknown) => void;
};

export class ApiClient {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: RefreshSubscriber[] = [];

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "") {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(skipAuth: boolean = false): Record<string, string> {
    if (skipAuth) return {};
    
    const token = TokenManager.getAccessToken();
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private subscribeTokenRefresh(subscriber: RefreshSubscriber): void {
    this.refreshSubscribers.push(subscriber);
  }

  private onTokenRefreshed(): void {
    this.refreshSubscribers.forEach(({ resolve }) => resolve());
    this.refreshSubscribers = [];
  }

  private onTokenRefreshFailed(): void {
    this.refreshSubscribers.forEach(({ reject }) =>
      reject(new ApiError(401, "Failed to refresh token")),
    );
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      TokenManager.clearTokens();
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}${API_ROUTES.refreshToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        TokenManager.clearTokens();
        return null;
      }

      const data = await response.json();
      if (data.data?.accessToken) {
        TokenManager.setAccessToken(data.data.accessToken);
        if (data.data.refreshToken) {
          TokenManager.setRefreshToken(data.data.refreshToken);
        }
        return data.data.accessToken;
      }

      return null;
      } catch (error) {
        logger.warn("Token refresh request failed", { error: error instanceof Error ? error.message : String(error) });
        logger.info("Clearing tokens after failed token refresh");
        TokenManager.clearTokens();
        return null;
      }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {},
  ): Promise<T> {
    const {
      body,
      headers: customHeaders,
      skipAuth = false,
      _retried = false,
      timeout = DEFAULT_TIMEOUT_MS,
      signal,
      ...rest
    }: (RequestInit & RequestOptions) = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new DOMException("Request timed out", "TimeoutError"));
    }, timeout);

    const onExternalAbort = () => {
      controller.abort(signal?.reason);
    };
    if (signal) {
      if (signal.aborted) {
        onExternalAbort();
      } else {
        signal.addEventListener("abort", onExternalAbort);
      }
    }

    const headers: Record<string, string> = {
      ...this.getAuthHeaders(skipAuth),
      ...customHeaders,
    };
    const hasBody = body !== undefined && body !== "";
    if (hasBody) {
      headers["Content-Type"] = customHeaders?.["Content-Type"] ?? "application/json";
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...rest,
        headers,
        body: hasBody ? body : undefined,
        signal: controller.signal,
      });

      if (response.ok) {
        const text = await response.text();
        if (!text) {
          return null as T;
        }
        return JSON.parse(text) as T;
      }

      return await this.handleErrorResponse<T>(response, endpoint, options, skipAuth, _retried);
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onExternalAbort);
    }
  }

  private async handleErrorResponse<T>(
    response: Response,
    endpoint: string,
    options: RequestInit & RequestOptions,
    skipAuth: boolean,
    _retried: boolean,
  ): Promise<T> {
    if (response.status === 401 && !skipAuth) {
      if (_retried) {
        TokenManager.clearTokens();
        logger.warn("Token refresh retry exhausted, clearing tokens", { endpoint });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        throw new ApiError(response.status, await response.text());
      }

      const refreshToken = TokenManager.getRefreshToken();
      
      if (!refreshToken) {
        TokenManager.clearTokens();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        throw new ApiError(response.status, await response.text());
      }

      if (this.isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          this.subscribeTokenRefresh({
            resolve: () => {
              this.request<T>(endpoint, { ...options, _retried: true })
                .then(resolve)
                .catch(reject);
            },
            reject,
          });
        });
      }

      this.isRefreshing = true;

      let refreshFailed = false;

      try {
        const newToken = await this.refreshAccessToken();

        if (newToken) {
          this.onTokenRefreshed();
        } else {
          refreshFailed = true;
          this.onTokenRefreshFailed();
        }
      } catch {
        refreshFailed = true;
        this.onTokenRefreshFailed();
      } finally {
        this.isRefreshing = false;
      }

      if (refreshFailed) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        throw new ApiError(response.status, "Failed to refresh token");
      }

      return this.request<T>(endpoint, { ...options, _retried: true });
    }

    if (response.status === 403 && !skipAuth) {
      const errorText = await response.text();
      logger.warn("Forbidden response", { endpoint, status: response.status });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:forbidden"));
      }
      throw new ApiError(response.status, errorText);
    }

    const errorText = await response.text();
    logger.warn("Request failed with non-OK response", { endpoint, status: response.status });
    throw new ApiError(response.status, errorText);
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient();
