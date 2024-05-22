'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { User } from '@/types'

const Home = () => {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()

        setUser(data)
      } else {
        setUser(null)
        const errorData = await response.json()

        console.error('Failed to fetch current user:', errorData.error)
      }
    } catch (error) {
      console.error('Error:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [user, router])

  return null
}

export default Home
