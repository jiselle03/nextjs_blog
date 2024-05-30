export interface User {
  id: number
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
}

export type UserPosts = User & { posts: Post[] }

export interface Post {
  id: number
  title: string
  content: string
  tags: string[]
  author: User
  createdAt: string
}

export interface SessionData {
  id: number
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

export type EditPostForm = CreatePostForm & { id: number }
