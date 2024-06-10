'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { fetchPost, updatePost } from '@/actions/posts'
import { borderClassNames, buttonClassNames } from '@/styles/classNames'

const Edit = () => {
  const router = useRouter()
  const params = useParams()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [tags, setTags] = useState<string>('')

  const id = Number(params.id)

  const handleFetchPost = useCallback(async (): Promise<void> => {
    const post = await fetchPost(id)

    if (post) {
      setTitle(post.title)
      setContent(post.content)
      setTags(post.tags.join(', '))
    } else {
      router.push('/dashboard')
    }
  }, [id, router])

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()

    await updatePost(
      {
        id,
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

  useEffect(() => {
    handleFetchPost()
  }, [id, handleFetchPost])

  return (
    <div className="min-h-screen p-24">
      <h3 className="w-36 font-medium">Edit Post</h3>
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
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default Edit
