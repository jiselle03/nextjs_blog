import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookies } from 'cookies-next'

export const middleware = (req: NextRequest) => {
  const cookies = getCookies({ req })
  
  const loggedIn = !!Number(cookies.userId)

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
