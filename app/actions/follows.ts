// QUERIES

// Check if user follows a specific user
export const fetchIsFollowing = async (
  followingId: number,
): Promise<boolean | null> => {
  try {
    const response = await fetch(`/api/users/follows/${followingId}`, {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return data as boolean
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
  followingId: number,
  cb: () => Promise<void>,
): Promise<void> => {
  try {
    const response = await fetch('/api/users/follows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ followingId }),
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
  followingId: number,
  cb: () => Promise<void>,
): Promise<void> => {
  try {
    const response = await fetch(`/api/users/follows/${followingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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
