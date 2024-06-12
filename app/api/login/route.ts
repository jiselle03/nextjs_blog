import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { createSession, deleteSession } from '@/utils/cookies'

const prisma = new PrismaClient()

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

    await createSession(user)

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
    deleteSession()

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
