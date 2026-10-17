# Authentication System

This project implements a secure authentication system consuming backend microservices API following industry best practices.

## Hybrid Auth (server gate + client validity)

- **Server gate**: `src/proxy.ts` (Next 16.3+ convention `proxy.ts`, BUKAN `middleware.ts` yang deprecated & menyebabkan blank page) — checks PRESENCE of httpOnly cookie `refresh_token`; protected route without cookie → redirects to `/login`; WITHOUT inverse rule (infinite loop hazard with stale cookies).
- **Client**: Access token in `localStorage` (only `accessToken`), silent auto-refresh when expired via httpOnly cookie (`credentials: 'include'`), refresh-failure → dispatches `auth:unauthorized` event + `window.location.replace('/login')` (anti stuck).
- **Logout/logoutAll**: Best-effort revoke + full navigation (`window.location.replace`) (anti cookie/middleware race).
- **Debug channel**: `experimental.reactDebugChannel: false` (dev race fix vercel/next.js#97918).
- **Backend Note**: Refresh cookie must set `path=/` (not path scoped to `/api/auth`) so it is visible to middleware/proxy.

## Architecture

### API Integration

The authentication system connects to backend microservices at:
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **API Pattern**: `/api/v1/{resource}`
- **Example**: `https://api.example.com/api/v1/auth/login`

### Core Components

#### 1. Token Manager (`token-manager.ts`)
Centralized JWT token management with the following features:
- JWT token parsing and validation
- Token expiration checking with buffer time (1 minute)
- Secure token storage in localStorage (`accessToken`)
- Token expiration time calculations

#### 2. Auth Context (`auth-provider.tsx`)
React Context-based authentication state management:
- Centralized auth state using React Context
- TanStack Query integration for server state management
- Automatic token verification from backend
- Silent token refresh on initial load when access token is expired
- Protected route handling
- Optimistic loading states
- Error handling with proper TypeScript types

#### 3. API Client (`api-client.ts`)
Enhanced API client with auth integration:
- Automatic Authorization header injection (Bearer token)
- 401 error handling with automatic token clearing, event dispatching, and full-page redirect
- `credentials: 'include'` for cookie-based refresh requests
- Type-safe request/response handling
- Support for unauthenticated requests (skipAuth option)

#### 4. Auth Service (`auth-service.ts`)
Typed API service methods for authentication endpoints:
- `login()` - POST `/api/v1/auth/login`
- `logout()` - POST `/api/v1/auth/logout`
- `refreshToken()` - POST `/api/v1/auth/refresh-token`
- `verifyToken()` - GET `/api/v1/auth/verify-token`
- `me()` - GET `/api/v1/auth/me`

## Features

### Security
- JWT token validation from backend
- Automatic token expiration handling
- 1-minute expiration buffer for safety
- 401 error handling with automatic logout and full-page redirect
- Proper error types and handling
- Type-safe API responses

### User Experience
- Seamless auth state synchronization
- Optimistic loading states
- Automatic redirects to login for unauthorized users
- Silent token refresh support
- Proper error messages from backend

### Developer Experience
- Full TypeScript support throughout
- Type-safe auth context hooks
- Centralized token management
- Easy-to-use protected route wrapper
- Comprehensive error handling
- TanStack Query integration for caching

## API Response Format

Expected backend response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
```

### Login Response
```typescript
interface LoginResponse {
  accessToken: string;
}
```

## Usage

### Authentication Context

```tsx
import { useAuth } from "@/features/auth/hooks";

function MyComponent() {
  const { isAuthenticated, isLoading, login, logout, error } = useAuth();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) {
    return <p>Please login</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <button onClick={logout}>Logout</button>;
}
```

### Login Action

```tsx
const { login } = useAuth();

await login({ username: "user", password: "pass" });
// Automatically stores tokens and redirects to home
```

### Protected Routes

```tsx
import { ProtectedRoute } from "@/features/auth/hooks";

function Layout({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
```

### API Calls

The API client automatically includes auth headers:

```tsx
import { apiClient } from "@/lib";

// Authenticated request (includes Bearer token)
const data = await apiClient.get("/api/v1/user");

// Unauthenticated request (skip auth)
const publicData = await apiClient.get("/api/v1/health", { skipAuth: true });
```

### Token Management

```tsx
import { TokenManager } from "@/features/auth/services";

// Get access token
const token = TokenManager.getAccessToken();

// Check if token is valid
const isValid = TokenManager.isAccessTokenValid();

// Get time until expiration
const timeLeft = TokenManager.getTimeUntilExpiration(token);

// Clear all tokens
TokenManager.clearTokens();
```

## Security Best Practices Implemented

1. **JWT Validation**: Tokens are validated from backend and locally checked for expiration
2. **Expiration Handling**: Tokens are checked for expiration with buffer time
3. **401 Handling**: Automatic logout on 401 responses with full navigation
4. **Type Safety**: Full TypeScript support with proper typing for all API responses
5. **Centralized State**: Auth state managed in one place with React Context
6. **Automatic Headers**: Auth headers injected automatically for all requests
7. **Error Handling**: Comprehensive error handling with proper error types
8. **TanStack Query**: Server state management with caching and automatic refetching
9. **Optimistic Updates**: UI updates immediately, verified by backend
10. **Token Storage**: Secure localStorage for access token, HTTP-only cookie for refresh token

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_APP_NAME=Your App Name
API_PROXY_TARGET=http://localhost:3000
```

## Flow Diagram

```
User Login
    ↓
AuthService.login() → POST /api/v1/auth/login
    ↓
Backend validates credentials & sets HTTP-only refresh_token cookie
    ↓
Backend returns access token
    ↓
TokenManager stores access token in localStorage
    ↓
AuthProvider verifies tokens with GET /api/v1/auth/verify-token
    ↓
Auth state updates: isAuthenticated = true
    ↓
User redirected to protected routes
```

## Error Handling

All API errors are properly typed:

```typescript
try {
  await login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific HTTP status codes
    if (error.status === 401) {
      // Unauthorized
    } else if (error.status === 429) {
      // Rate limited
    }
  }
}
```
