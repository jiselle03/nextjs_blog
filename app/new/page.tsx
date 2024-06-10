'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { borderClassNames, buttonClassNames } from '@/styles/classNames'
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

  const onCancel = (): void => {
    router.push('/dashboard')
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
            className={buttonClassNames({ type: 'cancel' })}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className={buttonClassNames({})} type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default New
