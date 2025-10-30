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

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blogId = params.id

    const blog = await prisma.blog.findUnique({ where: { id: blogId } })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    if (blog.ownerId === session.id) {
      return NextResponse.json(null, { status: 200 })
    }

    const followRecord = await prisma.follow.findUnique({
      where: {
        followerId_blogId: {
          followerId: session.id,
          blogId,
        },
      },
    })

    const isFollowing = !!followRecord

    return NextResponse.json(isFollowing, { status: 200 })
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

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blogId = params.id

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_blogId: {
          followerId: session.id,
          blogId,
        },
      },
    })

    if (!existingFollow) {
      return NextResponse.json(
        { error: 'Follow relationship not found' },
        { status: 404 },
      )
    }

    if (existingFollow.followerId !== session.id) {
      return NextResponse.json(
        {
          error:
            'Unauthorized: You do not have permission to unfollow this blog.',
        },
        { status: 403 },
      )
    }

    await prisma.follow.delete({
      where: {
        followerId_blogId: {
          followerId: session.id,
          blogId,
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
