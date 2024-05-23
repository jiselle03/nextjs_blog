'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Register = () => {
  const router = useRouter()

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault()

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
        router.push('/dashboard')
      } else {
        const errorData = await response.json()

        console.error('Failed to create user:', errorData.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-6">
      <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-900 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-black dark:text-white">
          Register
        </h1>
        <form className="space-y-6" onSubmit={createUser}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              className="mt-1 block w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              className="mt-1 block w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="underline cursor-pointer">
            Login here.
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register
