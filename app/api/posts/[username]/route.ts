import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (_req: NextRequest, { params }: { params: { username: string } }) => {
  const { username } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { posts: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const posts = user.posts.sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    return NextResponse.json({
      username: user.username,
      posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
};
