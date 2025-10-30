# Implementation Plan: Tumblr-Style Blogging Dashboard

**Branch**: `001-tumblr-blog` | **Date**: 2025-10-30 | **Spec**: specs/001-tumblr-blog/spec.md  
**Input**: Feature specification from `specs/001-tumblr-blog/spec.md`

## Summary

Deliver a Tumblr-inspired blogging dashboard where authenticated users manage their own posts, follow other blogs, and interact with a unified feed. The implementation will extend the existing Next.js App Router project, introducing a three-column layout that respects the current theme while centralizing color tokens via Tailwind CSS `@theme`, formatting timestamps with Day.js, and surfacing icons through `react-icons`. Server actions will continue to use Prisma for data access and iron-session for session handling in this phase.

## Technical Context

**Language/Version**: TypeScript on Next.js 14.2 (Node 18 runtime)  
**Primary Dependencies**: React 18, Tailwind CSS 3.4 (`@theme` directive), Prisma 5, Day.js 1.11, React Icons 5, iron-session 8  
**Storage**: PostgreSQL managed through Prisma schema/models  
**Testing**: Manual exploratory testing only (unit/integration/E2E deferred per instructions)  
**Target Platform**: Web application delivered via Next.js App Router (SSR/ISR capable)  
**Project Type**: Full-stack Next.js app with server actions and Prisma ORM  
**Performance Goals**: Feed renders within 2 seconds of dashboard load; tag searches respond within 1 second for 95% of interactions (per success criteria)  
**Constraints**: Preserve existing visual theme, manage palette through Tailwind `@theme`, avoid adding new dependencies beyond requested libraries, honor clipboard accessibility, and minimize regression risk during session handling  
**Scale/Scope**: Initial release optimized for tens of blogs per user and hundreds of posts; design choices leave room for pagination and caching in future iterations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The `.specify/memory/constitution.md` file is still a placeholder with no enforceable principles. Proceeding under repository guidelines (clean code, minimal dependencies) already captured in the spec and project README. Gate passes; will re-evaluate if the constitution is populated later.

## Project Structure

### Documentation (this feature)

```text
specs/001-tumblr-blog/
├── plan.md          # Implementation plan (this file)
├── research.md      # Phase 0 research outputs
├── data-model.md    # Phase 1 entity and schema design
├── quickstart.md    # Phase 1 setup/run instructions for implementers
├── contracts/       # Phase 1 API/server action contracts
└── tasks.md         # Generated during /speckit.tasks (not part of this step)
```

### Source Code (repository root)

```text
app/
├── actions/             # Server actions for posts, follows, likes, tag search
├── dashboard/           # Main dashboard route with three-column layout
├── tagged/[tag]/        # Existing tag route (to align with right-panel search)
├── components/          # Shared UI (BlogPost, navigation menu, panels)
├── layout.tsx           # Global layout (apply theme tokens, wrappers)
└── globals.css          # Tailwind base styles with @theme color tokens

app/utils/               # Helpers (Day.js formatters, clipboard utilities)

prisma/
├── schema.prisma        # User, Blog, Post, Follow, Like, Tag models
└── migrations/          # Prisma migrations (generated as needed)

public/                  # Static assets (avatars, logos)

specs/001-tumblr-blog/   # Planning artifacts produced by this workflow
```

**Structure Decision**: Maintain the single Next.js App Router project. Add a new `app/dashboard` route and extend `app/actions` + `app/components` for feed/layout concerns, keeping Prisma schema changes within `prisma/schema.prisma`. No additional workspaces are required.

## Complexity Tracking

No constitution violations or additional complexity justifications needed at this time.
