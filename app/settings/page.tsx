'use client'

import { Fragment, useState, useEffect } from 'react'
import { IoPencil } from 'react-icons/io5'
import { iconClassNames, borderClassNames } from '@/styles/classNames'
import { useAuth } from '@/providers/AuthProvider'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'

type EditingType = 'email' | 'username' | 'password' | 'language'

interface ItemType {
  title: string
  type: EditingType
  content: string
}

const Settings = () => {
  const { currentUser, fetchCurrentUser } = useAuth()

  const [editingType, setEditingType] = useState<EditingType | null>(null)
  const [editingContent, setEditingContent] = useState<string>('')

  const items: ItemType[] = [
    {
      title: 'Username',
      type: 'username',
      content: currentUser?.username || '',
    },
    { title: 'Email', type: 'email', content: currentUser?.email || '' },
    { title: 'Password', type: 'password', content: '********' },
    { title: 'Language', type: 'language', content: 'English' },
  ]

  const onEdit = (type: EditingType, content: string): void => {
    setEditingType(type)
    setEditingContent(content)
  }

  const handleCancel = (): void => {
    setEditingType(null)
    setEditingContent('')
  }

  const handleSave = (): void => {
    // TODO: Handle save logic here
    setEditingType(null)
    setEditingContent('')
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className={`bg-white p-4 ${borderClassNames({ size: 'large' })}`}>
          <h2 className="pb-6 border-b-2 border-gray-300 text-xl font-semibold">
            Account
          </h2>
          <div className="divide-y divide-gray-300">
            {items.map((item) => (
              <div
                key={item.title}
                className="py-4 flex justify-between items-center"
              >
                <h3 className="w-36 font-medium self-start">{item.title}</h3>
                {editingType === item.type ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className={`${borderClassNames({})} p-2 w-60 mb-4`}
                    />
                    <div className="flex justify-start space-x-4">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <Fragment>
                    <p className="flex-grow">{item.content}</p>
                    <IoPencil
                      className={iconClassNames({})}
                      onClick={() => onEdit(item.type, item.content)}
                    />
                  </Fragment>
                )}
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

export default Settings
