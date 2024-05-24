export interface User {
  id: number
  email: string
  username: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: number
  title: string
  content: string
  tags: string[]
  author: User
}
