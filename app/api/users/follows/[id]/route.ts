import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const followerId = Number(session.id)
    const followingId = Number(params.id)

    if (followerId === followingId) {
      return NextResponse.json(null, { status: 201 })
    }

    const followRecord = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    const isFollowing = !!followRecord

    return NextResponse.json(isFollowing, { status: 201 })
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'An error occurred while checking follow record.' },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const session = await getSession()

    const followingId = Number(params.id)
    const followerId = session.id

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    if (!existingFollow) {
      return NextResponse.json(
        { error: 'Follow relationship not found' },
        { status: 404 },
      )
    }

    if (existingFollow.followerId !== followerId) {
      return NextResponse.json(
        {
          error:
            'Unauthorized: You do not have permission to unfollow this user.',
        },
        { status: 403 },
      )
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    return NextResponse.json(
      { message: 'Unfollowed successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'Error unfollowing user' },
      { status: 500 },
    )
  }
}
