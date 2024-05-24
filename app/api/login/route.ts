import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/utils/cookies'
import { SessionData } from '@/types'

const prisma = new PrismaClient()

const defaultSession: SessionData = {
  id: 0,
  email: '',
  username: '',
  isLoggedIn: false,
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
      session.id = defaultSession.id
      session.email = defaultSession.email
      session.username = defaultSession.username
      session.isLoggedIn = defaultSession.isLoggedIn
    }

    session.id = user.id
    session.email = user.email
    session.username = user.username
    session.isLoggedIn = true
    await session.save()
    revalidatePath('/dashboard')

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

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'An error occurred while logging out.' },
      { status: 500 },
    )
  }
}
