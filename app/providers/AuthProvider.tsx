'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'

interface AuthContextType {
  currentUser: User | null
  fetchCurrentUser: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()

        if (!data.id) {
          router.push('/login')

          return
        }

        setCurrentUser(data)
      } else {
        const errorData = await response.json()

        console.error('Failed to fetch current user:', errorData.error)

        router.push('/login')
      }
    } catch (error) {
      console.error('Error:', error)

      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
