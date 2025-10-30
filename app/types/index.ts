export interface Blog {
  id: string
  handle: string
  title: string
  description?: string | null
  accentTheme?: string | null
}

export interface User {
  id: string
  email: string
  username: string
  displayName?: string | null
  avatarUrl?: string | null
  blog?: Blog | null
  blogId?: string
}

export type UserPosts = User & { posts: Post[] }

export interface Post {
  id: string
  title: string
  content: string
  tags: string[]
  author: User
  createdAt: string
  updatedAt: string
  likeCount: number
  excerpt?: string | null
  isFollowing?: boolean | null
}

export interface SessionData {
  id: string
  email: string
  username: string
  isLoggedIn: boolean
}

// Form
export interface CreateUserForm {
  email: string
  username: string
}

export interface CreatePostForm {
  title: string
  content: string
  tags: string[]
}

export type EditPostForm = CreatePostForm & { id: string }
