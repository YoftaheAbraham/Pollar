import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = [
    '/dashboard',
    '/projects',
    '/templates',
    '/respondents'
  ];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const hasCookie = request.cookies.has('next-auth.session-token') || 
                     request.cookies.has('__Secure-next-auth.session-token');

    if (!hasCookie) {
      return redirectToSignIn(request, pathname);
    }

    try {
      const validationUrl = new URL('/api/auth/validate', request.url);
      const authResponse = await fetch(validationUrl, {
        headers: { cookie: request.headers.get('cookie') || '' }
      });

      if (!authResponse.ok) {
        return redirectToSignIn(request, pathname);
      }

      const { valid, expires } = await authResponse.json();

      if (!valid || (expires && new Date(expires) < new Date())) {
        return redirectToSignIn(request, pathname);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      return redirectToSignIn(request, pathname);
    }
  }

  return NextResponse.next();
}

function redirectToSignIn(request: NextRequest, pathname: string) {
  const signInUrl = new URL('/join', request.url);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|signin|api/auth|images).*)',
  ],
};