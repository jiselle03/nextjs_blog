import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUserId } from '@/utils/cookies'

export const middleware = (req: NextRequest) => {
  const loggedIn = !!getCurrentUserId(req)

  const url = req.nextUrl.clone()

  if (url.pathname === '/' && !loggedIn) {
    url.pathname = '/login'

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
