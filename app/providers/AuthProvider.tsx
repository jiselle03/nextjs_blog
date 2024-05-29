'use client'

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/navigation'
import { fetchCurrentUser } from '@/actions/users'
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

  const handleFetchCurrentUser = useCallback(async () => {
    const user = await fetchCurrentUser()

    if (!user?.id) {
      router.push('/login')

      return
    }

    setCurrentUser(user)
  }, [router])

  useEffect(() => {
    handleFetchCurrentUser()
  }, [handleFetchCurrentUser])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        fetchCurrentUser: handleFetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
