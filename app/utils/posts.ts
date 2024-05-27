import { UserPosts, Post, CreatePostForm, EditPostForm } from '@/types'

// QUERIES

// Fetch all posts followed by user
export const fetchPosts = async (): Promise<Post[] | null> => {
  try {
    const response = await fetch('/api/posts', {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return data as Post[]
    } else {
      const errorData = await response.json()

      console.error('Failed to fetch posts:', errorData.error)

      return null
    }
  } catch (error) {
    console.error('Error:', error)

    return null
  }
}

// Fetch one post
export const fetchPost = async (id: number): Promise<Post | null> => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return data as Post
    } else {
      const errorData = await response.json()

      console.error('Failed to fetch post:', errorData.error)

      return null
    }
  } catch (error) {
    console.error('Error:', error)

    return null
  }
}

// Fetch specific user's posts
export const fetchUserPosts = async (
  username: string,
): Promise<UserPosts | null> => {
  if (!username) return null

  try {
    const response = await fetch(`/api/users/${username}`, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return {
        id: data.id,
        username: data.username,
        posts: data.posts,
      } as UserPosts
    } else {
      const errorData = await response.json()

      console.error('Failed to fetch user:', errorData.error)

      return null
    }
  } catch (error) {
    console.error('Error:', error)

    return null
  }
}

// MUTATIONS

// Create post
export const createPost = async (
  { title, content, tags }: CreatePostForm,
  cb: () => void,
): Promise<void> => {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        tags,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()

      console.error('Failed to create post:', errorData.error)

      return
    }

    cb()
  } catch (error) {
    console.error('Error:', error)

    return
  }
}

// Edit post
export const updatePost = async (
  { id, title, content, tags }: EditPostForm,
  cb: () => void,
): Promise<void> => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        tags,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()

      console.error('Failed to create post:', errorData.error)

      return
    }

    cb()
  } catch (error) {
    console.error('Error:', error)

    return
  }
}

// Delete post
export const deletePost = async (
  id: number,
  cb: () => Promise<void>,
): Promise<void> => {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()

      console.error('Failed to delete post:', errorData.error)

      return
    }

    await cb()
  } catch (error) {
    console.error('Error:', error)

    return
  }
}
