import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/utils/cookies'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  try {
    const { username, email } = await req.json()

    const user = await prisma.user.create({
      data: {
        username,
        email,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'An error occurred while creating the user.' },
      { status: 500 },
    )
  }
}

export const GET = async (req: NextRequest) => {
  try {
    const currentUserId = getCurrentUserId(req)

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'An error occurred while querying the user.' },
      { status: 500 },
    )
  }
}
