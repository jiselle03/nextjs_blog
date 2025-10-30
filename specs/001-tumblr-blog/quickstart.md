# Quickstart — Tumblr-Style Blogging Dashboard

## Prerequisites
- Node.js 18+
- PostgreSQL instance reachable via `DATABASE_URL`
- Prisma CLI (`npx prisma` available)

## Setup Steps
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   - Copy `.env.example` → `.env.local` (or update existing).
   - Set `DATABASE_URL` pointing to your PostgreSQL database.
   - Preserve existing iron-session secrets (`IRON_SESSION_PASSWORD`, etc.).
3. **Sync database schema**
   ```bash
   npx prisma migrate dev
   ```
   - Add seed data for users/blogs/posts as needed for manual testing.
4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```
   *(Included with migrate but keep handy after schema tweaks.)*
5. **Run the app**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000/dashboard to exercise the feature.

## Development Conventions
- Define palette tokens in `app/globals.css` using Tailwind `@theme`. Reference semantic tokens like `bg-surface`, `text-accent`.
- Centralize Day.js utilities in `app/utils/date.ts` for consistent formatting (`fromNow`, `format('MMM D, YYYY')`).
- Import icons from `react-icons` subsets (e.g., `react-icons/fi`) to keep bundle size minimal.
- Implement new server actions inside `app/actions/` with iron-session guards; reuse helper factories for Prisma access.
- Keep layout composition under `app/dashboard/` with left navigation, feed, and right search panel split into dedicated components.
- Manual testing only this phase—document steps in PR descriptions (create/edit/delete post, follow/unfollow, like/unlike, tag search).
