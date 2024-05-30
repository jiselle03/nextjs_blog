import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await req.json()

    const followerId = Number(session.id)

    if (followerId === followingId) {
      return NextResponse.json(
        { error: 'You cannot follow yourself.' },
        { status: 400 },
      )
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'You are already following this user.' },
        { status: 400 },
      )
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'An error occurred while following the user.' },
      { status: 500 },
    )
  }
}
