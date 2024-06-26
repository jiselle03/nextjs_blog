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
      <form
        onSubmit={handleSubmit}
        className={`${borderClassNames({ size: 'large' })} bg-white p-4 mt-2`}
      >
        <div className="flex gap-1.5">
          <input
            className={`${borderClassNames({ type: 'input' })} w-full text-2xl`}
            type="text"
            id="title"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          <textarea
            className={`border-none w-full`}
            id="content"
            value={content}
            rows={10}
            placeholder="What's on your mind?"
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          <input
            className={`${borderClassNames({ size: 'large' })} px-2 w-full`}
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
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
