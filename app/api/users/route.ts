// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const mockUserId = process.env.NEXT_PUBLIC_MOCK_USER_ID;

export const POST = async (req: NextRequest) => {
  try {
    const { username, email } = await req.json();

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while creating the user.' }, { status: 500 });
  }
};

// TODO: Use cookies later
export const GET = async (req: NextRequest) => {
  try {
    const userId = mockUserId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while querying the user.' }, { status: 500 });
  }
};
