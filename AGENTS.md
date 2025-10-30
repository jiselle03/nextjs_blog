# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives under `app/`, with route segments like `app/dashboard` and mutating server actions in `app/actions`. Shared UI resides in `app/components`, while utilities and types sit in `app/utils` and `app/types`. `prisma/schema.prisma` defines the data model; run migrations against it. Static assets stay in `public/`, and global Tailwind styles are in `app/globals.css`. Configuration files (`next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`) anchor the project root.

## Build, Test, and Development Commands
- `npm run dev` – launch the local dev server with hot reload on http://localhost:3000.
- `npm run build` – create an optimized production build; run before deployment.
- `npm run start` – serve the compiled build.
- `npm run lint` – execute ESLint with the Next.js config; run prior to each PR.
- `npx prisma migrate dev` – apply schema updates locally and regenerate the client.
- `npx prisma generate` – refresh the Prisma client after schema edits when no migration is needed.

## Coding Style & Naming Conventions
Code is TypeScript-first, using functional React components and the App Router conventions. Follow Prettier defaults (2-space indentation, single quotes via ESLint rules) and Tailwind utility classes for styling; co-locate component-specific styles near the component. Name components in PascalCase (`PostList.tsx`), utility functions in camelCase, and route directories with readable kebab-case segments. Run `npm run lint` or enable the ESLint/Prettier extensions in your editor.

## Testing Guidelines
A formal test runner is not yet configured. When introducing tests, prefer React Testing Library + Vitest or Jest, mirror the route structure under `app/__tests__`, and name files `*.test.tsx`. Include coverage for server actions and key UI interactions. Document any new scripts in `package.json` and update this guide once a test suite lands.

## Commit & Pull Request Guidelines
Craft succinct, imperative commit subjects (e.g., "Add comment form validation") and group related changes with feature branches. Pull requests should describe the problem, outline the solution, and list side effects. Link issues when available, attach UI screenshots for visual updates, and note schema changes or new environment variables. Ensure `npm run lint` and relevant Prisma commands complete before requesting review.

## Data & Configuration Notes
Keep environment secrets in `.env.local`; never commit them. After updating the Prisma schema, run `npx prisma generate` so `@prisma/client` stays in sync. If you add new third-party services, document required keys and update the README accordingly.

## Active Technologies
- TypeScript on Next.js 14.2 (Node 18 runtime) + React 18, Tailwind CSS 3.4 (`@theme` directive), Prisma 5, Day.js 1.11, React Icons 5, iron-session 8 (001-tumblr-blog)
- PostgreSQL managed through Prisma schema/models (001-tumblr-blog)

## Recent Changes
- 001-tumblr-blog: Added TypeScript on Next.js 14.2 (Node 18 runtime) + React 18, Tailwind CSS 3.4 (`@theme` directive), Prisma 5, Day.js 1.11, React Icons 5, iron-session 8
