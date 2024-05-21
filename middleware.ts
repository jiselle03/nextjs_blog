import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const mockUserId = process.env.NEXT_PUBLIC_MOCK_USER_ID;

  const loggedIn = !!Number(mockUserId);

  const url = req.nextUrl.clone();

  if (url.pathname === '/' && loggedIn) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/' && !loggedIn) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/', // Only run this middleware on the root path
};
