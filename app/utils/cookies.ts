import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData } from '@/types'

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'user',
  cookieOptions: {
    secure: true,
    maxAge: 86400, // 1 day
  },
}

export const getSession = async () => {
  return await getIronSession<SessionData>(cookies(), sessionOptions)
}
