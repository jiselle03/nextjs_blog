import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'
import { Post, User } from '@/types'

const prisma = new PrismaClient()

export const GET = async (
  _req: NextRequest,
  { params }: { params: { tag: string } },
) => {
  try {
    const session = await getSession()
    const currentUserId = session?.isLoggedIn && session.id ? session.id : ''

    const followRecords = currentUserId
      ? await prisma.follow.findMany({ where: { followerId: currentUserId } })
      : []

    const followedBlogIds = new Set<string>(
      followRecords.map((record) => record.blogId),
    )

    const posts = await prisma.post.findMany({
      where: { tagList: { has: params.tag } },
      include: {
        blog: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    })

    const postsWithFollowStatus: Post[] = posts.map((post) => {
      const blog = post.blog
      const owner = blog?.owner

      const author: User = {
        id: owner?.id ?? '',
        email: owner?.email ?? '',
        username: blog?.handle ?? '',
        displayName: owner?.displayName ?? null,
        avatarUrl: owner?.avatarUrl ?? null,
        blog,
        blogId: blog?.id,
      }

      const isOwnBlog = blog?.ownerId === currentUserId
      const isFollowing = isOwnBlog ? null : followedBlogIds.has(blog?.id ?? '')

      return {
        id: post.id,
        title: post.title,
        content: post.body,
        tags: post.tagList,
        author,
        createdAt: post.publishedAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        likeCount: post.likeCount,
        excerpt: post.excerpt,
        isFollowing,
      }
    })

    return NextResponse.json(postsWithFollowStatus, { status: 200 })
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
