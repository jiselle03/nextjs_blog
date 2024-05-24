import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getIronSession } from 'iron-session'

const prisma = new PrismaClient()

interface SessionData {
  email: string
  isLoggedIn: boolean
}

const defaultSession: SessionData = {
  email: '',
  isLoggedIn: false,
}

const getSession = async () => {
  return await getIronSession<SessionData>(cookies(), {
    password: process.env.SESSION_PASSWORD as string,
    cookieName: 'user',
    cookieOptions: {
      secure: true,
      maxAge: 86400, // 1 day
    },
  })
}

export const POST = async (req: NextRequest) => {
  ;('use server')

  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const session = await getSession()

    if (!session.isLoggedIn) {
      session.isLoggedIn = defaultSession.isLoggedIn
      session.email = defaultSession.email
    }

    session.email = email
    session.isLoggedIn = true
    await session.save()
    revalidatePath('/dashboard')

    cookies().set('userId', `${user.id}`)

    return NextResponse.json({ id: user.id }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'An error occurred while logging in.' },
      { status: 500 },
    )
  }
}

export const DELETE = async () => {
  ;('use server')

  try {
    const session = await getSession()

    session.destroy()

    revalidatePath('/login')

    cookies().delete('userId')

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'An error occurred while logging out.' },
      { status: 500 },
    )
  }
}
