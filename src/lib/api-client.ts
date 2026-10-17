import { TokenManager } from '@/features/auth/services/token-manager';
import { API_ROUTES, ROUTES } from '@/constants';
import { appConfig } from '@/config';

type RequestOptions = {
  body?: string;
  headers?: Record<string, string>;
  skipAuth?: boolean;
};

class ApiClient {
  private baseUrl: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith(this.baseUrl)) return endpoint;
    return `${this.baseUrl}${endpoint}`;
  }

  private getAuthHeaders(skipAuth: boolean = false): Record<string, string> {
    if (skipAuth) return {};

    const token = TokenManager.getAccessToken();

    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private async parseResponse<T>(response: Response): Promise<T | undefined> {
    if (response.status === 204) {
      return undefined;
    }

    if (response.headers.get('content-length') === '0') {
      return undefined;
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('application/json')) {
      await response.text().catch(() => '');

      return undefined;
    }

    const text = await response.text().catch(() => '');

    if (!text) {
      return undefined;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return undefined;
    }
  }

  private async parseErrorMessage(response: Response): Promise<string> {
    const text = await response.text().catch(() => '');

    if (!text) {
      return response.statusText || `Request failed with status ${response.status}`;
    }

    try {
      const body = JSON.parse(text) as { message?: unknown; error?: unknown };
      const message = body.message ?? body.error;

      if (typeof message === 'string' && message) {
        return message;
      }
    } catch {
      return text;
    }

    return text;
  }

  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch(this.buildUrl(API_ROUTES.refreshToken), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        TokenManager.clearTokens();
        return null;
      }

      const data = await this.parseResponse<{ accessToken?: string } | { data?: { accessToken?: string } }>(response);

      const payload = data && typeof data === 'object' && 'data' in data && data.data ? data.data : data;
      const accessToken = (payload as { accessToken?: string })?.accessToken;

      if (accessToken) {
        TokenManager.setAccessToken(accessToken);
        return accessToken;
      }

      return null;
    } catch {
      TokenManager.clearTokens();
      return null;
    }
  }

  public async refreshSession(): Promise<string | null> {
    return this.refreshAccessToken();
  }

  private async handleDummyRequest<T>(endpoint: string, _options: RequestInit & RequestOptions): Promise<T> {
    const delay = Math.floor(Math.random() * 200) + 300; // 300-500ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    const createDummyJwt = (expiresInSeconds: number = 86400) => {
      const now = Math.floor(Date.now() / 1000);
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = {
        sub: '1',
        email: 'dummy@example.com',
        name: 'Dummy User',
        iat: now,
        exp: now + expiresInSeconds,
      };

      const base64UrlEncode = (obj: object) => {
        const json = JSON.stringify(obj);
        return btoa(json).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      };

      return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.dummy-signature`;
    };

    const dummyAccessToken = createDummyJwt();
    const dummyUser = {
      id: '1',
      email: 'dummy@example.com',
      firstName: 'Dummy',
      lastName: 'User',
      name: 'Dummy User',
    };

    if (endpoint.includes(API_ROUTES.login)) {
      return {
        data: {
          accessToken: dummyAccessToken,
        },
        message: 'Login successful (Dummy Mode)',
      } as unknown as T;
    }

    if (endpoint.includes(API_ROUTES.register)) {
      return {
        data: {
          message: 'Registration successful (Dummy Mode)',
        },
        message: 'Registration successful',
      } as unknown as T;
    }

    if (endpoint.includes(API_ROUTES.forgotPassword)) {
      return {
        data: {
          message: 'Password reset email sent (Dummy Mode)',
        },
        message: 'Password reset email sent',
      } as unknown as T;
    }

    if (endpoint.includes(API_ROUTES.resetPassword)) {
      return {
        data: {
          message: 'Password reset successful (Dummy Mode)',
        },
        message: 'Password reset successful',
      } as unknown as T;
    }

    if (endpoint.includes(API_ROUTES.verifyToken)) {
      return {
        data: {
          valid: true,
          user: dummyUser,
        },
        message: 'Token verified (Dummy Mode)',
      } as unknown as T;
    }

    if (endpoint.includes(API_ROUTES.refreshToken)) {
      return {
        data: {
          accessToken: dummyAccessToken,
        },
        message: 'Token refreshed (Dummy Mode)',
      } as unknown as T;
    }

    if (endpoint.includes(API_ROUTES.logout)) {
      return {
        data: null,
        message: 'Logout successful (Dummy Mode)',
      } as unknown as T;
    }

    // Generic fallback for any other auth/API route in dummy mode
    return {
      data: dummyUser,
      message: 'Success (Dummy Mode)',
    } as unknown as T;
  }

  async request<T>(endpoint: string, options: RequestInit & RequestOptions = {}): Promise<T> {
    if (
      appConfig.isDummyMode &&
      (endpoint.includes('/auth/') ||
        endpoint.includes('login') ||
        endpoint.includes('register') ||
        endpoint.includes('verify') ||
        endpoint.includes('refresh') ||
        endpoint.includes('logout') ||
        endpoint.includes('password'))
    ) {
      return this.handleDummyRequest<T>(endpoint, options);
    }

    const { body, headers: customHeaders, skipAuth = false, ...rest } = options;

    const response = await fetch(this.buildUrl(endpoint), {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(skipAuth),
        ...customHeaders,
      },
      body,
    });

    if (response.ok) {
      const data = await this.parseResponse<T>(response);

      return data as T;
    }

    if (response.status === 401 && !skipAuth) {
      const token = TokenManager.getAccessToken();

      if (!token) {
        TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          window.location.replace(ROUTES.login);
        }
        throw new ApiError(response.status, await this.parseErrorMessage(response));
      }

      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.subscribeTokenRefresh(() => {
            this.request<T>(endpoint, options).then(resolve).catch(reject);
          });
        });
      }

      this.isRefreshing = true;

      try {
        const newToken = await this.refreshAccessToken();

        if (newToken) {
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);

          return this.request<T>(endpoint, options);
        } else {
          this.isRefreshing = false;
          TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            window.location.replace(ROUTES.login);
          }
          throw new ApiError(response.status, 'Failed to refresh token');
        }
      } catch (error) {
        this.isRefreshing = false;
        TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          window.location.replace(ROUTES.login);
        }
        throw error;
      }
    }

    throw new ApiError(response.status, await this.parseErrorMessage(response));
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();
