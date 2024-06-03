import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const GET = async (
  _req: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const postId = Number(params.id as string)
    console.log(postId)
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    })
    console.log(post)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post, { status: 200 })
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
    const postId = Number(params.id)
    const { title, content } = await req.json()

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if currentUser is the author of the post
    if (post.author.id !== session.id) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this post.' },
        { status: 403 },
      )
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
      },
    })

    return NextResponse.json(updatedPost, { status: 200 })
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
    const postId = Number(params.id)

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.author.id !== session.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this post.' },
        { status: 403 },
      )
    }

    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    })

    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not deleted' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error deleting post:', error)

    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}
