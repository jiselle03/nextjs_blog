'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { borderClassNames } from '@/styles/classNames'
import { createPost } from '@/actions/posts'

const New = () => {
  const router = useRouter()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [tags, setTags] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()

    await createPost(
      {
        title,
        content,
        tags: tags.split(',').map((tag) => tag.trim()),
      },
      () => router.push('/dashboard'),
    )
  }

  return (
    <div className="min-h-screen p-24">
      <h3 className="w-36 font-medium">New Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-1.5">
          <label htmlFor="title">Title</label>
          <input
            className={borderClassNames({})}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          <label htmlFor="content">Content</label>
          <textarea
            className={borderClassNames({})}
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            className={borderClassNames({})}
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-1.5 mt-4">
          <button
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
          >
            Cancel
          </button>
          <button
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default New
