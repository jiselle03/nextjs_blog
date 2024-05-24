import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/utils/cookies'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  try {
    const { username, email } = await req.json()

    const user = await prisma.user.create({
      data: {
        username,
        email,
      },
    })

    return NextResponse.json(user, { status: 201 })
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

    return NextResponse.json(
      { id: session.id, email: session.email, username: session.username },
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
