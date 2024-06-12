import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  const { title, content, tags } = await req.json()

  try {
    const session = await getSession()
    const currentUserId = Number(session.id)

    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags,
        author: {
          connect: {
            id: currentUserId,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
  }
}

export const GET = async () => {
  const session = await getSession()
  const currentUserId = Number(session.id)

  if (!currentUserId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          // Fetch the posts of the current user
          { authorId: currentUserId },
          // And the posts of users that the current user is following
          {
            author: {
              followers: {
                some: { followerId: currentUserId },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { author: true },
    })

    return NextResponse.json(
      posts.map((post) => ({ ...post, isFollowing: true })),
    )
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
