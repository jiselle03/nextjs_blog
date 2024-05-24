import { NextResponse } from 'next/server'
import { getSession } from '@/utils/cookies'
import type { NextRequest } from 'next/server'

export const middleware = async (req: NextRequest) => {
  const session = await getSession()

  const url = req.nextUrl.clone()

  if (url.pathname === '/' && !session.isLoggedIn) {
    url.pathname = '/login'

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
