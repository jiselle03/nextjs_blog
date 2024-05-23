import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { setCookie } from 'cookies-next'

const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const response = NextResponse.json({ id: user.id }, { status: 200 })

    setCookie('userId', user.id, { req, res: response})

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while logging in.' },
      { status: 500 },
    )
  }
}
