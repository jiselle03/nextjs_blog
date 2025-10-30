import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/utils/cookies'
import { Post, User } from '@/types'

const prisma = new PrismaClient()

const normalizeHandle = (handle: string) =>
  handle
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

export const GET = async (
  _req: NextRequest,
  { params }: { params: { username: string } },
) => {
  try {
    const session = await getSession()
    const currentUserId = session?.isLoggedIn && session.id ? session.id : ''
    const followRecords = currentUserId
      ? await prisma.follow.findMany({ where: { followerId: currentUserId } })
      : []

    const followingBlogIds = new Set<string>(
      followRecords.map((record) => record.blogId),
    )

    const handle = normalizeHandle(params.username)

    const blog = await prisma.blog.findUnique({
      where: { handle },
      include: {
        owner: true,
        posts: {
          orderBy: { publishedAt: 'desc' },
        },
      },
    })

    if (!blog || !blog.owner) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const author: User = {
      id: blog.owner.id,
      email: blog.owner.email,
      username: blog.handle,
      displayName: blog.owner.displayName,
      avatarUrl: blog.owner.avatarUrl,
      blog,
      blogId: blog.id,
    }

    const isOwnBlog = blog.ownerId === currentUserId
    const isFollowing = isOwnBlog ? null : followingBlogIds.has(blog.id)

    const posts: Post[] = blog.posts.map((post) => ({
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
    }))

    return NextResponse.json({
      id: author.id,
      username: author.username,
      email: author.email,
      blogId: author.blogId,
      blog: {
        id: blog.id,
        handle: blog.handle,
        title: blog.title,
        description: blog.description,
        accentTheme: blog.accentTheme,
      },
      posts,
    })
  } catch (error) {
    console.error('Error fetching user:', error)

    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 })
  }
}
