import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/2fa'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isPublicPath) return NextResponse.next();

  // All other routes are protected
  if (!refreshToken) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
