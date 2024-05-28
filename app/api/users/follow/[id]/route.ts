import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const session = await getSession()
  const followingId = Number(params.id)
  const followerId = session.id
  console.log(followingId, followerId)

  try {
    const session = await getSession()

    const followingId = Number(params.id)
    const followerId = session.id

    const existingFollow = await prisma.follows.findUnique({
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

    await prisma.follows.delete({
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
