This project is a Tumblr-inspired blogging platform built with [Next.js](https://nextjs.org/), Tailwind CSS, and Prisma. Each user maintains their own blog, can follow other blogs, and curates a personalized feed—while the UI keeps the existing visual theme of the codebase.

## Product Overview

- `Multi-blog ownership`: users create, edit, and delete posts on their personal blog.
- `Social graph`: users follow other blogs and see combined content in a unified feed.
- `Engagement`: posts can be liked and their direct links copied for easy sharing.
- `Tag discovery`: a search panel on the right lets users filter by tags authors add to posts.
- `Dashboard layout`: after login, the center column lists posts from the user and followed blogs in reverse chronological order; the left column hosts navigation (Home, Settings, New, Log Out, etc.); the right column focuses on tag search and discovery.
- `New post flow`: the “New” action in the left menu opens the composer to publish additional content.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Database setup with Prisma

Install postgresql. 

install Prisma globally:
```bash
npm install -g prisma
```

Set up environment variables:
Create a .env file in the root directory and add the following
```bash
DATABASE_URL="postgresql://database_username:database_password@localhost:5432/datebase_name?schema=public"
```

With Prisma installed and environment variables set up, you can now run migrations to sync your Prisma schema with your database:
```bash
npx prisma migrate dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
