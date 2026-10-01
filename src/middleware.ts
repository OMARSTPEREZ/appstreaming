import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect secret admin path and any /admin subpaths
  if (pathname.startsWith('/admin') && pathname !== '/admin-access-x89') {
    // Hide standard /admin route completely -> rewrite or redirect to Home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Security gate for /admin-access-x89
  if (pathname.startsWith('/admin-access-x89')) {
    // Check for Supabase session cookies or custom role tokens
    const supabaseToken = 
      request.cookies.get('sb-access-token')?.value ||
      request.cookies.get('supabase-auth-token')?.value ||
      request.cookies.get('sb-izwzkcghyeybdljjfypo-auth-token')?.value;

    const userRoleCookie = request.cookies.get('user-role')?.value;

    // In a strict production environment, unauthenticated users without superadmin role are sent to 404/Home
    // Allow pass-through if role cookie is superadmin or during active admin session
    const isSuperAdmin = userRoleCookie === 'superadmin';

    // Allow the admin entry page to handle its internal Master PIN/Secret authentication interface
    // while protecting against generic scanning and scraping
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-access-x89/:path*',
  ],
};
