import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (req: NextRequest) => {
  // TODO: Use real user ID
  const mockUserId = process.env.NEXT_PUBLIC_MOCK_USER_ID

  const loggedIn = !!Number(mockUserId)

  const url = req.nextUrl.clone()

  if (url.pathname === '/' && !loggedIn) {
    url.pathname = '/login'

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/', // Only run this middleware on the root path
}
