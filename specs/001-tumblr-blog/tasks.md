# Tasks: Tumblr-Style Blogging Dashboard

**Input**: Design documents from `specs/001-tumblr-blog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared assets and workflows supporting all user stories.

- [ ] T001 Create Prisma seed data script for demo blogs/posts in `prisma/seed.ts`
- [ ] T002 Add `db:seed` npm script in `package.json` calling `tsx prisma/seed.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story work.

- [ ] T003 Update blog/post/follow/like/tag models per data model in `prisma/schema.prisma`
- [ ] T004 Generate Day.js helper with relative/date-format utilities in `app/utils/date.ts`
- [ ] T005 Define Tailwind `@theme` color tokens and semantic classes in `app/globals.css`
- [ ] T006 Expose semantic color tokens via `tailwind.config.ts` theme extensions

**Checkpoint**: Run `npx prisma migrate dev` and `npx prisma generate` after T003.

---

## Phase 3: User Story 1 – Consume personalized feed (Priority: P1) 🎯 MVP

**Goal**: Authenticated users see a unified feed of their posts plus followed blogs in reverse chronological order, with three-column dashboard layout and tag search.

**Independent Test**: Seed posts across owned and followed blogs, log in, confirm center column ordering, left nav visibility, tag search filtering (AND matching), and empty state when no posts exist.

### Implementation

- [ ] T007 [US1] Implement feed aggregation server action returning merged posts in `app/actions/dashboard-feed.ts`
- [ ] T008 [P] [US1] Create three-column dashboard layout scaffold in `app/dashboard/layout.tsx`
- [ ] T009 [P] [US1] Build vertical navigation menu with required links in `app/dashboard/components/LeftNav.tsx`
- [ ] T010 [P] [US1] Implement feed list component leveraging Day.js formatting in `app/dashboard/components/FeedList.tsx`
- [ ] T011 [P] [US1] Implement AND-based tag search server action in `app/actions/tag-search.ts`
- [ ] T012 [US1] Build right-panel tag search UI wired to server action in `app/dashboard/components/TagSearch.tsx`
- [ ] T013 [US1] Wire `app/dashboard/page.tsx` to load feed, render empty state, and compose layout components
- [ ] T014 [US1] Handle feed fetch failures and unavailable-followed-blog messaging in `app/dashboard/page.tsx`
- [ ] T015 [US1] Display tagless-post indicators and fallback styling in `app/dashboard/components/FeedList.tsx`
- [ ] T016 [US1] Surface tag search loading/error states and retry affordances in `app/dashboard/components/TagSearch.tsx`

**Checkpoint**: Feed renders newest-first with attribution, tag search filters correctly, and empty states display when needed.

---

## Phase 4: User Story 2 – Manage my posts (Priority: P2)

**Goal**: Blog owners can create, edit, and delete posts from the dashboard without leaving the experience.

**Independent Test**: Using seeded data, create a post via the “New” entry point, edit its content/tags, delete it, and verify feed updates after each action.

### Implementation

- [ ] T017 [US2] Implement create/edit/delete post server actions in `app/actions/posts.ts`
- [ ] T018 [P] [US2] Build post composer modal triggered by “New” in `app/components/posts/PostComposer.tsx`
- [ ] T019 [P] [US2] Update `app/components/blog-post.tsx` to show edit/delete controls for owner posts
- [ ] T020 [US2] Connect left navigation “New” action to composer workflows in `app/dashboard/components/LeftNav.tsx`

**Checkpoint**: Owners can publish, modify, and remove posts with immediate feed updates.

---

## Phase 5: User Story 3 – Engage with other blogs (Priority: P3)

**Goal**: Users can follow/unfollow blogs, like/unlike posts, and copy share links for external sharing.

**Independent Test**: From the dashboard, follow a blog, like/unlike its posts, copy share links, refresh the page, and confirm states persist.

### Implementation

- [ ] T021 [US3] Implement follow/unfollow server actions with session guard and unavailable-blog handling in `app/actions/follows.ts`
- [ ] T022 [US3] Implement like/unlike server actions with idempotent duplicate handling in `app/actions/likes.ts`
- [ ] T023 [P] [US3] Add clipboard utility for post share URLs in `app/utils/clipboard.ts`
- [ ] T024 [P] [US3] Enhance `app/components/blog-post.tsx` with follow/like/share controls and success messaging
- [ ] T025 [US3] Refresh feed state after engagement actions in `app/dashboard/page.tsx`
- [ ] T026 [US3] Provide follow/like action error feedback and disabled states in `app/components/blog-post.tsx`
- [ ] T027 [US3] Surface share-link failure fallback messaging in `app/utils/clipboard.ts`

**Checkpoint**: Social interactions reflect instantly and persist after navigation/refresh.

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: Final cleanup, documentation, validation, and performance verification across stories.

- [ ] T028 Document manual QA flow covering all stories in `specs/001-tumblr-blog/quickstart.md`
- [ ] T029 Update project overview with dashboard access instructions in `README.md`
- [ ] T030 Audit accessibility states (focus/ARIA) for new controls in `app/dashboard/components/`*
- [ ] T031 Benchmark feed render and tag search response times against success criteria, recording results in `specs/001-tumblr-blog/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: Foundational work depends on setup scripts existing (seed workflow).
- **Phase 2 → Phase 3/4/5**: User stories require Prisma schema, theme tokens, and date helpers to be completed.
- **User Story Order**: US1 (feed) unlocks base UI; US2 (post management) builds on nav/feed; US3 (engagement) extends feed interactions.
- **Polish** runs after targeted user stories reach acceptance checkpoints.

---

## Parallel Opportunities

- T001 and T002 can proceed concurrently.
- Within Phase 2, T004–T006 are independent once schema (T003) is finalized.
- In US1, tasks T008–T012 can run in parallel after T007 defines feed payload shape, and T015–T016 can follow once core components exist.
- US2 tasks T018 and T019 are parallelizable once server actions (T017) exist.
- US3 tasks T023 and T024 can run alongside T021/T022 because they touch distinct files, while T026 and T027 can proceed after UI controls are in place.
- Different user stories may proceed in parallel once Phase 2 closes, provided shared files are coordinated.

---

## Implementation Strategy

1. Complete Phase 1 and Phase 2 sequentially to stabilize schema, theme tokens, and utilities.
2. Deliver MVP by finishing all US1 tasks, validating feed rendering and search before expanding scope.
3. Layer US2 capabilities next so content creation keeps pace with feed consumption.
4. Add US3 engagement features to deepen user retention and sharing.
5. Conclude with polish/documentation to support manual QA and accessibility.
