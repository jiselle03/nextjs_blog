import { PrismaClient, Prisma, Tag } from '@prisma/client';

const prisma = new PrismaClient();

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

type UserWithBlog = Prisma.UserGetPayload<{ include: { blog: true } }>;
type UsersByEmail = Record<string, UserWithBlog>;
type BlogsByHandle = Record<string, NonNullable<UserWithBlog['blog']>>;
type TagsBySlug = Record<string, Tag>;

async function resetDatabase() {
  await prisma.$transaction([
    prisma.like.deleteMany(),
    prisma.postTag.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.post.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.blog.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function seedTags(): Promise<TagsBySlug> {
  const tagDefinitions = [
    { name: 'Design', slug: 'design' },
    { name: 'Productivity', slug: 'productivity' },
    { name: 'Technology', slug: 'tech' },
    { name: 'Personal', slug: 'personal' },
    { name: 'Inspiration', slug: 'inspiration' },
  ];

  const tags = await Promise.all(
    tagDefinitions.map((tag) =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: tag,
        create: tag,
      }),
    ),
  );

  return tags.reduce<TagsBySlug>((acc, tag) => {
    acc[tag.slug] = tag;
    return acc;
  }, {});
}

async function seedUsersWithBlogs(): Promise<{
  usersByEmail: UsersByEmail;
  blogsByHandle: BlogsByHandle;
}> {
  const userSeeds = [
    {
      email: 'demo@codex.dev',
      displayName: 'Demo Creator',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
      blog: {
        handle: 'demo-journal',
        title: 'Demo Journal',
        description: 'Working notes on building a social blogging experience.',
        accentTheme: 'iris',
      },
    },
    {
      email: 'fiona@codex.dev',
      displayName: 'Fiona Fields',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      blog: {
        handle: 'design-galore',
        title: 'Design Galore',
        description: 'Mood boards, typography crushes, and weekly inspo.',
        accentTheme: 'sunset',
      },
    },
    {
      email: 'carlos@codex.dev',
      displayName: 'Carlos Vega',
      avatarUrl: 'https://i.pravatar.cc/150?img=45',
      blog: {
        handle: 'tech-daily',
        title: 'Tech Daily Digest',
        description: 'Quick takes on frameworks, AI tools, and shipping velocity.',
        accentTheme: 'mint',
      },
    },
  ];

  const users = await Promise.all(
    userSeeds.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          blog: {
            create: {
              handle: user.blog.handle,
              title: user.blog.title,
              description: user.blog.description,
              accentTheme: user.blog.accentTheme,
            },
          },
        },
        include: { blog: true },
      }),
    ),
  );

  const usersByEmail: UsersByEmail = {};
  const blogsByHandle: BlogsByHandle = {};

  users.forEach((entry) => {
    usersByEmail[entry.email] = entry;
    if (entry.blog) {
      blogsByHandle[entry.blog.handle] = entry.blog;
    }
  });

  return { usersByEmail, blogsByHandle };
}

async function seedFollows(usersByEmail: UsersByEmail, blogsByHandle: BlogsByHandle) {
  const followSeeds = [
    { follower: 'demo@codex.dev', blog: 'design-galore' },
    { follower: 'demo@codex.dev', blog: 'tech-daily' },
    { follower: 'fiona@codex.dev', blog: 'demo-journal' },
  ];

  await Promise.all(
    followSeeds.map(async ({ follower, blog }) => {
      const followerUser = usersByEmail[follower];
      const targetBlog = blogsByHandle[blog];

      if (!followerUser || !targetBlog) {
        throw new Error(`Missing follow seed reference for ${follower} → ${blog}`);
      }

      await prisma.follow.upsert({
        where: {
          followerId_blogId: {
            followerId: followerUser.id,
            blogId: targetBlog.id,
          },
        },
        update: {},
        create: {
          followerId: followerUser.id,
          blogId: targetBlog.id,
        },
      });
    }),
  );
}

async function seedPosts(
  blogsByHandle: BlogsByHandle,
  usersByEmail: UsersByEmail,
  tagsBySlug: TagsBySlug,
) {
  const postSeeds = [
    {
      blogHandle: 'demo-journal',
      title: 'Why we built the dashboard first',
      slug: 'why-we-built-the-dashboard-first',
      excerpt: 'The dashboard is the heartbeat of a social blogging app—here is why it ships before anything else.',
      body: [
        'The personalized dashboard keeps creators in the loop without leaving the experience.',
        'We focused on merging owned and followed content, wiring actions to one place, and keeping the experience fast.',
      ].join('\n\n'),
      tags: ['tech', 'productivity'],
      publishedAt: hoursAgo(6),
      likedBy: ['fiona@codex.dev'],
    },
    {
      blogHandle: 'design-galore',
      title: 'Palette study: moody iris and neon mint',
      slug: 'palette-study-moody-iris-neon-mint',
      excerpt: 'Color pairing explorations for the dashboard shell.',
      body: [
        'The dashboard needs to feel vibrant without sacrificing legibility.',
        'Pairing iris with neon mint keeps the experience energetic and readable across light/dark surfaces.',
      ].join('\n\n'),
      tags: ['design', 'inspiration'],
      publishedAt: hoursAgo(4),
      likedBy: ['demo@codex.dev', 'carlos@codex.dev'],
    },
    {
      blogHandle: 'tech-daily',
      title: 'Tag search performance checklist',
      slug: 'tag-search-performance',
      excerpt: 'Baseline guardrails for keeping tag intersections snappy.',
      body: [
        'Array containment queries keep the tag search fast while we explore more advanced indexing strategies.',
        'Cache misses are handled with a 1s budget—including network, render, and hydration.',
      ].join('\n\n'),
      tags: ['tech', 'productivity'],
      publishedAt: hoursAgo(2),
      likedBy: ['demo@codex.dev'],
    },
    {
      blogHandle: 'demo-journal',
      title: 'Shipping notes: empty states that convert',
      slug: 'shipping-notes-empty-states',
      body: [
        'Empty states are an opportunity to celebrate the product voice.',
        'We provide clear calls to create or follow so new users know what to do next.',
      ].join('\n\n'),
      tags: ['personal'],
      publishedAt: hoursAgo(1),
      likedBy: ['fiona@codex.dev', 'carlos@codex.dev'],
    },
    {
      blogHandle: 'design-galore',
      title: 'Quick sketches: feed card variations',
      slug: 'quick-sketches-feed-card-variations',
      body: [
        'Here are three quick sketches exploring typography lockups for feed cards.',
        'Vote on your favorite—I will turn the winner into a Figma component this weekend.',
      ].join('\n\n'),
      tags: ['design', 'inspiration'],
      publishedAt: hoursAgo(0.5),
      likedBy: [],
    },
  ];

  for (const seed of postSeeds) {
    const blog = blogsByHandle[seed.blogHandle];

    seed.tags.forEach((slug) => {
      if (!tagsBySlug[slug]) {
        throw new Error(`Missing tag for slug "${slug}"`);
      }
    });

    if (!blog) {
      throw new Error(`Missing blog for handle "${seed.blogHandle}"`);
    }

    const createdPost = await prisma.post.upsert({
      where: {
        blogId_slug: {
          blogId: blog.id,
          slug: seed.slug,
        },
      },
      update: {
        title: seed.title,
        excerpt: seed.excerpt,
        body: seed.body,
        tagList: seed.tags,
        publishedAt: seed.publishedAt,
        updatedAt: new Date(),
        likeCount: seed.likedBy.length,
      },
      create: {
        blogId: blog.id,
        title: seed.title,
        slug: seed.slug,
        excerpt: seed.excerpt,
        body: seed.body,
        tagList: seed.tags,
        publishedAt: seed.publishedAt,
        likeCount: seed.likedBy.length,
      },
    });

    await prisma.postTag.deleteMany({
      where: { postId: createdPost.id },
    });

    if (seed.tags.length) {
      await prisma.postTag.createMany({
        data: seed.tags.map((slug) => ({
          postId: createdPost.id,
          tagId: tagsBySlug[slug].id,
        })),
        skipDuplicates: true,
      });
    }

    await prisma.like.deleteMany({
      where: { postId: createdPost.id },
    });

    if (seed.likedBy.length) {
      await Promise.all(
        seed.likedBy.map(async (email) => {
          const user = usersByEmail[email];
          if (!user) {
            throw new Error(`Missing user for like seed: ${email}`);
          }
          await prisma.like.create({
            data: {
              userId: user.id,
              postId: createdPost.id,
            },
          });
        }),
      );
    }

    await prisma.post.update({
      where: { id: createdPost.id },
      data: { likeCount: seed.likedBy.length },
    });
  }
}

async function main() {
  console.log('🌱 Seeding database...');
  await resetDatabase();
  const tagsBySlug = await seedTags();
  const { usersByEmail, blogsByHandle } = await seedUsersWithBlogs();
  await seedFollows(usersByEmail, blogsByHandle);
  await seedPosts(blogsByHandle, usersByEmail, tagsBySlug);
  console.log('✅ Seed data ready.');
}

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
