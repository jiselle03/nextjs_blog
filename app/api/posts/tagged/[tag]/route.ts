import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { fetchIsFollowing } from '@/actions/follows'

const prisma = new PrismaClient()

export const GET = async (
  _req: NextRequest,
  { params }: { params: { tag: string } },
) => {
  try {
    const posts = await prisma.post.findMany({
      where: { tags: { has: params.tag } },
      include: { author: true },
    })

    if (!posts) {
      return NextResponse.json({ error: 'Posts not found' }, { status: 404 })
    }

    const postsWithFollowStatus = await Promise.all(
      posts.map(async (post) => {
        const isFollowing = await fetchIsFollowing(post.author?.id)

        return {
          ...post,
          isFollowing,
        }
      }),
    )

    return NextResponse.json(postsWithFollowStatus, { status: 200 })
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
