import { User, CreateUserForm } from '@/types'

// QUERIES

// Fetch current user
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()

      return data as User
    } else {
      const errorData = await response.json()

      console.error('Failed to fetch current user:', errorData.error)

      return null
    }
  } catch (error) {
    console.error('Error:', error)

    return null
  }
}

// MUTATIONS

// Register
export const createUser = async (
  { username, email }: CreateUserForm,
  cb: () => void,
) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email }),
    })

    if (response.ok) {
      await response.json()
      cb()
    } else {
      const errorData = await response.json()

      console.error('Failed to create user:', errorData.error)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
