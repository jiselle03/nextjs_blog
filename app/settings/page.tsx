'use client'

import { useEffect } from 'react'
import { IoPencil } from 'react-icons/io5'
import { iconClassNames, borderClassNames } from '@/styles/classNames'
import { useAuth } from '@/providers/AuthProvider'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'

const Dashboard = () => {
  const { currentUser, fetchCurrentUser } = useAuth()

  const items = [
    { title: 'Email', content: currentUser?.email },
    { title: 'Password', content: 'Password' },
    { title: 'Language', content: 'English' },
  ]

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className={`bg-white p-4 ${borderClassNames({})}`}>
          <h2 className="pb-6 border-b-2 border-gray-300 text-xl font-semibold">
            Account
          </h2>
          <div className="divide-y divide-gray-300">
            {items.map((item) => (
              <div
                key={item.title}
                className="py-4 flex justify-between items-center"
              >
                <h3 className="w-36 font-medium">{item.title}</h3>
                <p className="flex-grow">{item.content}</p>
                <IoPencil className={iconClassNames({})} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default Dashboard
