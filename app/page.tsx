'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'

const Home = () => {
  const router = useRouter()

  const { currentUser, fetchCurrentUser } = useAuth()

  useEffect(() => {
    fetchCurrentUser()
  })

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [currentUser, router])

  return null
}

export default Home
