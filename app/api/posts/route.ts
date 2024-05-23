import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getCookies } from 'cookies-next'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  const { title, content, tags, authorId } = await req.json()

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags,
        author: {
          connect: {
            id: Number(authorId),
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

export const GET = async (req: NextRequest) => {
  const cookies = getCookies({ req })
  const userId = Number(cookies.userId)

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          // Fetch the posts of the current user
          { authorId: userId },
          // And the posts of users that the current user is following
          {
            author: {
              followers: {
                some: { followerId: userId },
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

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
