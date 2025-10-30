import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

const normalizeHandle = (handle: string) =>
  handle
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

export const POST = async (req: NextRequest) => {
  try {
    const { username, email } = await req.json()

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required.' },
        { status: 400 },
      )
    }

    const handle = normalizeHandle(username)

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email is already in use.' },
        { status: 400 },
      )
    }

    const existingHandle = await prisma.blog.findUnique({
      where: { handle },
    })

    if (existingHandle) {
      return NextResponse.json(
        { error: 'Blog handle is already taken.' },
        { status: 400 },
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        displayName: username,
        blog: {
          create: {
            handle,
            title: `${username}'s blog`,
            description: null,
            accentTheme: 'iris',
          },
        },
      },
      include: {
        blog: true,
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        username: user.blog?.handle ?? handle,
        blog: user.blog,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'An error occurred while creating the user.' },
      { status: 500 },
    )
  }
}

export const GET = async () => {
  try {
    const session = await getSession()

    if (!session?.isLoggedIn || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { blog: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        username: user.blog?.handle ?? '',
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        blogId: user.blog?.id,
        blog: user.blog
          ? {
              id: user.blog.id,
              handle: user.blog.handle,
              title: user.blog.title,
              description: user.blog.description,
              accentTheme: user.blog.accentTheme,
            }
          : null,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error:', error)

    return NextResponse.json(
      { error: 'An error occurred while fetching current user.' },
      { status: 500 },
    )
  }
}
