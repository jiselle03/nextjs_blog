# Project Constitution

This document defines the guiding principles for maintaining a healthy, focused codebase for the Next.js + Tailwind CSS + Prisma project.

## Clean Code
- Keep components small, predictable, and written as pure functions when possible.
- Co-locate files by feature within `app/`, and share UI primitives through `app/components`.
- Favor readability over cleverness; explain non-obvious logic with concise comments.
- Enforce consistent formatting via Prettier defaults and the repository ESLint rules.
- Treat Prisma schema changes as part of source control—update `prisma/schema.prisma` and regenerate the client immediately.

## Simple UX
- Design flows that minimize user decisions and surface primary actions first.
- Use clear language, inline hints, and immediate feedback on user inputs.
- Avoid unnecessary animation or navigation levels that slow users down.
- Audit pages for redundant steps; eliminate or merge when a single interaction suffices.

## Responsive Design
- Build layouts mobile-first with Tailwind utility classes such as `flex`, `grid`, and breakpoint prefixes.
- Ensure typographic scale, spacing, and interactive targets adapt smoothly from small to large screens.
- Test core pages at common breakpoints (mobile portrait, tablet, desktop) before shipping.
- Prefer fluid widths and intrinsic sizing instead of fixed pixel dimensions.

## Minimal Dependencies
- Rely on the built-in capabilities of Next.js, Tailwind CSS, and Prisma before adding packages.
- Justify each new dependency with a documented need and an exit strategy for removal.
- Choose lightweight, tree-shakeable libraries when third-party code is unavoidable.
- Remove unused packages promptly and keep `package.json` scripts focused on essential tasks.

## Testing Strategy
- Formal automated tests are deferred for now; document manual validation steps alongside features.
- When the test suite is introduced, align tools with the guidelines in `README.md` and extend this constitution accordingly.

