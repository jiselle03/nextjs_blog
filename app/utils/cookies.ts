import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, User } from '@/types'

const MAX_AGE_IN_MILLISECONDS = 86400 // 1 day

const defaultSession: SessionData = {
  id: 0,
  email: '',
  username: '',
  isLoggedIn: false,
}

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: 'user',
  cookieOptions: {
    secure: true,
    maxAge: MAX_AGE_IN_MILLISECONDS,
  },
}

let cachedSession: SessionData | null = null

export const getSession = async (): Promise<SessionData> => {
  try {
    if (cachedSession?.isLoggedIn) {
      return cachedSession
    }

    const sessionData = await getIronSession<SessionData>(
      cookies(),
      sessionOptions,
    )

    if (!sessionData || !sessionData.isLoggedIn) {
      cachedSession = defaultSession

      return defaultSession
    }

    cachedSession = sessionData

    return sessionData
  } catch (error) {
    console.error('An error occurred retreiving the session:', error)

    return defaultSession
  }
}

export const createSession = async (user: User): Promise<void> => {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    session.id = user.id
    session.email = user.email
    session.username = user.username
    session.isLoggedIn = true

    await session.save()

    cachedSession = session
  } catch (error) {
    console.error('An error occurred creating the session:', error)
  }
}

export const deleteSession = async (): Promise<void> => {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    session.destroy()

    cachedSession = defaultSession
  } catch (error) {
    console.error('An error occurred deleting the session:', error)
  }
}
