'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buttonClassNames } from '@/styles/classNames'

const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()

        console.log(`Logged in with user ID: ${data.id}`)

        router.push('/dashboard')
      } else {
        const errorData = await response.json()

        console.error('Failed to log in:', errorData.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-6">
      <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-black dark:text-white">
          Login
        </h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="mt-1 block w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={buttonClassNames({ width: 'w-full' })}
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center">
          New to Blogr?{' '}
          <Link href="/register" className="underline cursor-pointer">
            Sign up!
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Login
