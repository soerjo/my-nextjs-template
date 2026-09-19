import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiClient, ApiError } from "@/lib/api-client";
import { TokenManager } from "@/features/auth/services/token-manager";
import { API_ROUTES } from "@/constants";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function unauthorizedResponse(): Response {
  return new Response("Unauthorized", { status: 401 });
}

function isRefreshUrl(input: unknown): boolean {
  return String(input).endsWith(API_ROUTES.refreshToken);
}

describe("ApiClient", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("resolves after a successful refresh and retries with the new access token", async () => {
    const client = new ApiClient("http://api.test");
    TokenManager.setAccessToken("old-access");
    TokenManager.setRefreshToken("refresh-old");

    let apiCalls = 0;
    let retryInit: RequestInit | undefined;
    const fetchMock = vi.fn(async (input: unknown, init?: RequestInit) => {
      if (isRefreshUrl(input)) {
        return jsonResponse(200, { data: { accessToken: "new-access" } });
      }
      apiCalls += 1;
      if (apiCalls === 1) {
        return unauthorizedResponse();
      }
      retryInit = init;
      return jsonResponse(200, { data: { ok: true } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await client.get<{ ok: boolean }>("/secure");

    expect(result).toEqual({ data: { ok: true } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(retryInit?.headers).toMatchObject({
      Authorization: "Bearer new-access",
    });
  });

  it("does not loop forever when the retried request also returns 401", async () => {
    const client = new ApiClient("http://api.test");
    const unauthorized = vi.fn();
    window.addEventListener("auth:unauthorized", unauthorized);

    TokenManager.setAccessToken("old-access");
    TokenManager.setRefreshToken("refresh-old");

    let fetchCalls = 0;
    const fetchMock = vi.fn(async (input: unknown) => {
      fetchCalls += 1;
      if (fetchCalls > 6) {
        throw new Error("abort: refresh loop detected");
      }
      if (isRefreshUrl(input)) {
        return jsonResponse(200, { data: { accessToken: "new-access" } });
      }
      return unauthorizedResponse();
    });
    vi.stubGlobal("fetch", fetchMock);

    let rejection: unknown = null;
    await client.get("/secure").catch((err) => {
      rejection = err;
    });

    expect(rejection).toBeInstanceOf(ApiError);
    expect((rejection as ApiError).status).toBe(401);
    expect(fetchCalls).toBeLessThanOrEqual(3);
    expect(TokenManager.getAccessToken()).toBeNull();
    expect(unauthorized).toHaveBeenCalled();

    window.removeEventListener("auth:unauthorized", unauthorized);
  });

  it("settles queued requests when the refresh call fails", async () => {
    const client = new ApiClient("http://api.test");
    TokenManager.setAccessToken("old-access");
    TokenManager.setRefreshToken("refresh-old");

    const fetchMock = vi.fn(async (input: unknown) => {
      if (isRefreshUrl(input)) {
        return jsonResponse(500, { message: "server error" });
      }
      return unauthorizedResponse();
    });
    vi.stubGlobal("fetch", fetchMock);

    let settled = false;
    let timeoutId!: ReturnType<typeof setTimeout>;
    const guard = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        if (!settled) reject(new Error("queued requests hung"));
      }, 2000);
    });

    const results = await Promise.race([
      Promise.allSettled([client.get("/secure"), client.get("/secure")]),
      guard,
    ]);
    settled = true;
    clearTimeout(timeoutId);

    expect(results).toHaveLength(2);
    for (const result of results) {
      expect(result.status).toBe("rejected");
      if (result.status === "rejected") {
        expect(result.reason).toBeInstanceOf(ApiError);
      }
    }
  });
});