# Feature Specification: Tumblr-Style Blogging Dashboard

**Feature Branch**: `001-tumblr-blog`  
**Created**: 2025-10-30  
**Status**: Draft  
**Input**: User description: "This application should be a blog similar to Tumblr. Users can create, edit, and delete their own blog with their own blog posts. They can also follow other user blogs, like those blog posts, and copy the blog post's link to send to friends. The center/main part of the dashboard after log in will be all the blog posts from your own blog and the blogs you follow in reverse chronological order. The left panel will have the vertical menu, with Home, Settings, New, Log Out, etc. options. To add new blog posts, users can click on the 'New' button. The right panel will have a search bar to search for tags that users include with their blog posts. Let's keep the current theme of the existing codebase."

## Clarifications

### Session 2025-10-30

- Q: When a user enters multiple tags in the right-panel search, how should matching posts be selected? → A: Treat multiple tags as an AND filter.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consume personalized feed (Priority: P1)

As a signed-in blogger, I want a dashboard feed that combines my posts and posts from blogs I follow in reverse chronological order so I can quickly catch up on new content.

**Why this priority**: The personalized feed is the core value proposition; without it the dashboard fails to deliver timely content.

**Independent Test**: Seed posts across a user’s own blog and followed blogs, log in as that user, and verify the feed ordering and source mix without touching other features.

**Acceptance Scenarios**:

1. **Given** a user with posts from their blog and followed blogs in the last 24 hours, **When** they open the dashboard, **Then** the center column lists those posts newest-first with clear attribution to each source blog.
2. **Given** a user who currently follows no blogs and has no posts, **When** they open the dashboard, **Then** they see an empty-state message that points them to create a post or follow someone.

---

### User Story 2 - Manage my posts (Priority: P2)

As a blog owner, I want to create, edit, and delete posts from the dashboard so I can maintain my blog without leaving the main experience.

**Why this priority**: Publishing and maintenance tools are essential for bloggers to keep their space up to date.

**Independent Test**: Log in as a blog owner, create a post via “New”, edit its content, and delete it, confirming each action updates the feed without invoking social interactions.

**Acceptance Scenarios**:

1. **Given** a signed-in user on the dashboard, **When** they click “New”, complete the composer, and publish, **Then** the new post appears at the top of the feed with assigned tags.
2. **Given** a user viewing one of their posts, **When** they choose “Edit”, modify the content or tags, and save, **Then** the feed shows the updated post details and timestamps.
3. **Given** a user reviewing their post, **When** they confirm deletion, **Then** the post disappears from the feed and a confirmation toast is shown.

---

### User Story 3 - Engage with other blogs (Priority: P3)

As a community member, I want to follow blogs, like posts, and copy share links so I can curate my feed and share content externally.

**Why this priority**: Social actions deepen engagement and ensure users return, but they rely on the feed and creation flows already existing.

**Independent Test**: Use a secondary blog to publish posts, follow it, like its posts, and copy links from the primary user account without modifying publishing features.

**Acceptance Scenarios**:

1. **Given** a user viewing a post from an unfollowed blog, **When** they tap “Follow” on the blog header, **Then** the blog is added to their follow list and future posts appear in the feed.
2. **Given** a user viewing any post, **When** they toggle “Like”, **Then** the like count updates and the UI reflects their action persistently across sessions.
3. **Given** a user wanting to share a post, **When** they choose “Copy link”, **Then** the canonical post URL is copied and a success message confirms availability for sharing.

---

### Edge Cases

- Empty feed: Display a friendly prompt and quick links when a user has no posts and follows nobody.
- Unavailable blogs: If a followed blog is deactivated or made private, hide its posts and surface a notice explaining why content is missing.
- Duplicate interactions: Prevent multiple follows, likes, or copy success messages when users trigger the same action repeatedly or rapidly.
- Tagless content: Handle posts without tags by keeping them searchable via general queries and indicating that no tags were added.
- Tag search with no matches: Return a clear “No posts found” state and suggest popular tags to explore.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST present a three-column layout—left navigation, center feed, right tag search—consistent with the existing theme.
- **FR-002**: The center feed MUST merge posts from the user’s blog and followed blogs in reverse chronological order, showing source attribution and timestamps.
- **FR-003**: The left navigation MUST include Home, Settings, New, and Log Out options, with “New” launching the post composer in-context.
- **FR-004**: Authenticated users MUST be able to create posts with title, body, and optional tags, and see the new post immediately in their feed.
- **FR-005**: Authenticated users MUST be able to edit the content and tags of their own posts and have the feed reflect updates instantly.
- **FR-006**: Authenticated users MUST be able to delete their own posts with a confirmation step and receive feedback that the deletion succeeded.
- **FR-007**: Users MUST be able to follow and unfollow other blogs directly from the feed or blog header, with the follow state persisting across sessions.
- **FR-008**: Users MUST be able to like and unlike individual posts, with visual state changes and updated like counts reflected in the feed.
- **FR-009**: The system MUST provide a control to copy a post’s shareable link to the clipboard and surface success or error states.
- **FR-010**: The right panel MUST offer tag search that filters the center feed results to posts matching entered tags, supporting partial matches and requiring posts to include every tag entered (AND behavior).
- **FR-011**: The interface MUST show informative empty or error states for feed, follow, like, and search actions when data is unavailable or actions fail.

### Key Entities *(include if feature involves data)*

- **User**: Authenticated person interacting with the platform; owns one blog and performs follows, likes, and post management.
- **Blog**: The branded space associated with a user; provides metadata (name, avatar/theme) and is the target for follows.
- **Post**: Published entry belonging to a blog; contains title, body, tags, timestamps, and engagement counts.
- **Follow**: Relationship linking a follower (user) to a blog they subscribe to; drives feed aggregation.
- **Like**: Relationship recording that a user endorsed a specific post; supports like counts and personalization.
- **Tag**: Keyword applied to posts for discovery; enables the right-panel search and filtering.

## Assumptions

- Each authenticated user manages a single blog identity within the application.
- Authentication and authorization flows already exist and gate access to the dashboard.
- Posts primarily contain text; media attachments follow existing theme standards if added later.
- Shareable links point to publicly accessible post URLs unless the destination blog is private.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of signed-in sessions display the personalized feed with correctly ordered posts within 2 seconds of dashboard load under typical network conditions.
- **SC-002**: In usability testing, at least 90% of participants publish a new post via “New” without assistance in under 3 minutes.
- **SC-003**: At least 80% of users performing a follow or like action receive confirmation within 1 second and can refresh the page without losing the recorded action.
- **SC-004**: Tag searches that have matching posts return filtered results within 1 second in 95% of cases, and searches without matches present guidance that keeps bounce rate below 20% for those sessions.
