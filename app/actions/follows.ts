// QUERIES

// Check if user follows a specific user
export const fetchIsFollowing = async (
  blogId: string,
): Promise<boolean | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/users/follows/${blogId}`,
      {
        method: 'GET',
      },
    )

    if (response.ok) {
      const data = await response.json()

      return data as boolean | null
    } else {
      const errorData = await response.json()

      console.error('Failed to fetch follow record:', errorData.error)

      return null
    }
  } catch (error) {
    console.error('Error:', error)

    return null
  }
}

// Follow user
export const followUser = async (
  blogId: string,
  cb: () => Promise<void>,
): Promise<void> => {
  try {
    const response = await fetch('/api/users/follows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blogId }),
    })

    if (response.ok) {
      await cb()
    } else {
      const errorData = await response.json()

      console.error('Failed to follow user:', errorData.error)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

// Unfollow user
export const unfollowUser = async (
  blogId: string,
  cb: () => void,
): Promise<void> => {
  try {
    const response = await fetch(`/api/users/follows/${blogId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      cb()
    } else {
      const errorData = await response.json()

      console.error('Failed to follow user:', errorData.error)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
