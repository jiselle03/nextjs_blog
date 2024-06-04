import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    console.error('Error fetching posts:', error)

    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}
