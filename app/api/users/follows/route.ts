import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession()

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { blogId } = await req.json()

    if (!blogId) {
      return NextResponse.json(
        { error: 'Target blog is required.' },
        { status: 400 },
      )
    }

    const blog = await prisma.blog.findUnique({ where: { id: blogId } })

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found.' },
        { status: 404 },
      )
    }

    if (blog.ownerId === session.id) {
      return NextResponse.json(
        { error: 'You cannot follow your own blog.' },
        { status: 400 },
      )
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_blogId: {
          followerId: session.id,
          blogId,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'You are already following this blog.' },
        { status: 400 },
      )
    }

    await prisma.follow.create({
      data: {
        followerId: session.id,
        blogId,
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
