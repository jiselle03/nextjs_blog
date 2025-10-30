import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'
import { Post, User } from '@/types'

const prisma = new PrismaClient()

const normalizeTags = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) return []
  return tags
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter((tag) => tag.length > 0)
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const mapPost = (
  post: Awaited<ReturnType<typeof prisma.post.findUnique>>,
  followingBlogIds: Set<string>,
  currentUserId: string,
): Post => {
  const blog = post?.blog
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
  const isFollowing = isOwnBlog ? null : followingBlogIds.has(blog?.id ?? '')

  return {
    id: post?.id ?? '',
    title: post?.title ?? '',
    content: post?.body ?? '',
    tags: post?.tagList ?? [],
    author,
    createdAt: post?.publishedAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: post?.updatedAt?.toISOString() ?? new Date().toISOString(),
    likeCount: post?.likeCount ?? 0,
    excerpt: post?.excerpt ?? null,
    isFollowing,
  }
}

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const session = await getSession()
    const currentUserId = session?.isLoggedIn && session.id ? session.id : ''
    const followingRecords = currentUserId
      ? await prisma.follow.findMany({
          where: { followerId: currentUserId },
        })
      : []

    const followingBlogIds = new Set<string>(
      followingRecords.map((record) => record.blogId),
    )

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        blog: {
          include: {
            owner: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(mapPost(post, followingBlogIds, currentUserId), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching post:', error)

    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 })
  }
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const session = await getSession()

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, tags } = await req.json()
    const normalizedTags = (() => {
      const list = normalizeTags(tags)
      return list.length ? list : ['untagged']
    })()
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        blog: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.blog.ownerId !== session.id) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this post.' },
        { status: 403 },
      )
    }

    const tagRecords = await Promise.all(
      normalizedTags.map((tag) =>
        prisma.tag.upsert({
          where: { slug: slugify(tag) },
          update: { name: tag },
          create: { name: tag, slug: slugify(tag) },
        }),
      ),
    )

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        body: content,
        excerpt: content?.slice(0, 160) ?? null,
        tagList: normalizedTags,
        updatedAt: new Date(),
      },
      include: {
        blog: {
          include: {
            owner: true,
          },
        },
      },
    })

    await prisma.postTag.deleteMany({ where: { postId: updatedPost.id } })

    if (tagRecords.length) {
      await prisma.postTag.createMany({
        data: tagRecords.map((tag) => ({
          postId: updatedPost.id,
          tagId: tag.id,
        })),
        skipDuplicates: true,
      })
    }

    const followingRecords = await prisma.follow.findMany({
      where: { followerId: session.id },
    })

    const followingBlogIds = new Set<string>(
      followingRecords.map((record) => record.blogId),
    )

    return NextResponse.json(
      mapPost(updatedPost, followingBlogIds, session.id),
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating post:', error)

    return NextResponse.json({ error: 'Error updating post' }, { status: 500 })
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

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        blog: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.blog.ownerId !== session.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this post.' },
        { status: 403 },
      )
    }

    await prisma.post.delete({ where: { id: params.id } })

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error deleting post:', error)

    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}
