import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { title, content, tags, authorId } = await req.json();

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags,
        author: {
          connect: {
            id: Number(authorId),
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error( error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  // Assume that you are getting the userId from the query parameters or cookies
  const userId = Number(req.nextUrl.searchParams.get('userId'));

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Fetch the posts of the users that the current user is following
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            author: {
              followers: {
                some: { followerId: userId },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { author: true },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
};
