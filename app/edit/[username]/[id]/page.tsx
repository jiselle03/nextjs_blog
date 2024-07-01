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
      <form
        className={`${borderClassNames({ size: 'large' })} bg-white p-4 mt-2`}
        onSubmit={handleSubmit}
      >
        <div className="flex gap-1.5">
          <input
            className={`${borderClassNames({ type: 'input' })} w-full text-2xl`}
            type="text"
            id="title"
            value={title}
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
            placeholder="This can't be empty!"
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
            placeholder="Tags (comma separated)"
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
