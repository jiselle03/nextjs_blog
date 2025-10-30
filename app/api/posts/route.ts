import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
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
  post: Awaited<ReturnType<typeof prisma.post.findFirst>>,
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

export const POST = async (req: NextRequest) => {
  try {
    const { title, content, tags } = await req.json()
    const session = await getSession()

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { blog: true },
    })

    if (!user?.blog) {
      return NextResponse.json(
        { error: 'Blog not found for user' },
        { status: 400 },
      )
    }

    const normalizedTags = (() => {
      const list = normalizeTags(tags)
      return list.length ? list : ['untagged']
    })()
    const tagRecords = await Promise.all(
      normalizedTags.map((tag) =>
        prisma.tag.upsert({
          where: { slug: slugify(tag) },
          update: { name: tag },
          create: { name: tag, slug: slugify(tag) },
        }),
      ),
    )

    const post = await prisma.post.create({
      data: {
        blogId: user.blog.id,
        title,
        body: content,
        excerpt: content?.slice(0, 160) ?? null,
        tagList: normalizedTags,
        publishedAt: new Date(),
      },
      include: {
        blog: {
          include: {
            owner: true,
          },
        },
      },
    })

    if (tagRecords.length) {
      await prisma.postTag.createMany({
        data: tagRecords.map((tag) => ({
          postId: post.id,
          tagId: tag.id,
        })),
        skipDuplicates: true,
      })
    }

    const followingRecords = await prisma.follow.findMany({
      where: { followerId: session.id },
    })

    const followingBlogIds = new Set<string>(
      followingRecords.map((follow) => follow.blogId),
    )

    return NextResponse.json(
      mapPost(post, followingBlogIds, session.id),
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating post:', error)

    return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
  }
}

export const GET = async () => {
  try {
    const session = await getSession()

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { blog: true },
    })

    if (!user?.blog) {
      return NextResponse.json([], { status: 200 })
    }

    const followRecords = await prisma.follow.findMany({
      where: { followerId: session.id },
    })

    const followedBlogIds = new Set(followRecords.map((record) => record.blogId))
    const feedBlogIds = new Set([user.blog.id, ...followedBlogIds])

    const posts = await prisma.post.findMany({
      where: { blogId: { in: Array.from(feedBlogIds) } },
      orderBy: { publishedAt: 'desc' },
      include: {
        blog: {
          include: {
            owner: true,
          },
        },
      },
    })

    return NextResponse.json(
      posts.map((post) => mapPost(post, followedBlogIds, session.id)),
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
