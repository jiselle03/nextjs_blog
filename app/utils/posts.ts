export const fetchPosts = async () => {
  try {
    const response = await fetch('/api/posts', {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return data
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

export const fetchUserPosts = async (username: string) => {
  if (!username) return null

  try {
    const response = await fetch(`/api/users/${username}`, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return data
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
  }
}
