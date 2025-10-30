# Data Model — Tumblr-Style Blogging Dashboard

## Entities

### User
- `id` (string, UUID) — primary key.
- `email` (string, unique) — login identifier.
- `displayName` (string, optional) — shown on profile and blog header fallback.
- `avatarUrl` (string, optional) — stored asset reference.
- `createdAt` / `updatedAt` (DateTime, default now, auto-update).
- **Relationships**: Owns exactly one `Blog`; can `Follow` many blogs; can `Like` many posts.

### Blog
- `id` (string, cuid) — primary key.
- `ownerId` (foreign key → User.id, unique) — 1:1 relationship.
- `handle` (string, unique) — URL-friendly identifier.
- `title` (string) — blog display title.
- `description` (string, optional) — displayed on profile panel.
- `accentTheme` (string, optional) — key referencing Tailwind `@theme` token.
- `createdAt` / `updatedAt` (DateTime).
- **Relationships**: Has many `Post`; receives many `Follow`.

### Post
- `id` (string, cuid).
- `blogId` (foreign key → Blog.id).
- `title` (string).
- `slug` (string, unique per blog) — used for share links.
- `body` (rich text markdown/plain content).
- `excerpt` (string, optional) — derived preview text.
- `publishedAt` (DateTime) — used for chronological ordering.
- `updatedAt` (DateTime).
- `likeCount` (int, default 0, derived from `Like` relation).
- `tagList` (string array) — denormalized list for quick filtering.
- **Relationships**: Many-to-many with `Tag` via `PostTag`; liked by many `Like`.

### Tag
- `id` (string, cuid).
- `name` (string) — canonical user-facing label.
- `slug` (string, unique, lowercase) — used for search queries.
- **Relationships**: Connected to many `Post` through `PostTag`.

### PostTag (join table)
- `postId` (foreign key → Post.id).
- `tagId` (foreign key → Tag.id).
- **Compound unique**: (`postId`, `tagId`).

### Follow
- `followerId` (foreign key → User.id).
- `blogId` (foreign key → Blog.id).
- `createdAt` (DateTime).
- **Compound unique**: (`followerId`, `blogId`).

### Like
- `userId` (foreign key → User.id).
- `postId` (foreign key → Post.id).
- `createdAt` (DateTime).
- **Compound unique**: (`userId`, `postId`).

## Derived Views & Notes
- **FeedView** (virtual): Aggregates `Post` records where `Post.blogId` belongs to the current user’s blog or any blog they follow, ordered by `publishedAt` DESC with pagination cursor support.
- **Tag Search**: Filters `Post` records by intersection of requested tag slugs (AND behavior) using `tagList` array containment to minimize joins.

## State Transitions
- **Post lifecycle**: Draft (optional) → Published (`publishedAt` set) → Updated (mutable) → Deleted (soft delete optional, hard delete removes likes/follows references).
- **Follow lifecycle**: Created on follow action; deleted on unfollow; ensure idempotent toggles.
- **Like lifecycle**: Created on like; deleted on unlike; counts recalculated via aggregation or transactions.
