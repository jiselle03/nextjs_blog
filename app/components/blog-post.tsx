'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  IoPerson,
  IoEllipsisHorizontal,
  IoTrash,
  IoPencil,
  IoSend,
  IoHeartOutline,
  IoHeart,
} from 'react-icons/io5'
import { iconClassNames, borderClassNames } from '@/styles/classNames'

type BlogPostProps = {
  id: number
  currentUserId: number
  userId: number
  username: string
  title: string
  content: string
  onDelete: (id: number) => Promise<void>
}

const BlogPost = ({
  id,
  currentUserId,
  userId,
  username,
  title,
  content,
  onDelete,
}: BlogPostProps) => {
  const [liked, setLiked] = useState<boolean>(false)

  const toggleLike = (): void => {
    setLiked(!liked)
  }

  return (
    <div className={`p-4 mb-4 bg-white ${borderClassNames({})}`}>
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <Link
          href={`/${username}`}
          className="cursor-pointer flex items-center gap-1.5 text-gray-800 hover:text-gray-500"
        >
          <IoPerson className={iconClassNames({})} />
          {username}
        </Link>
        <div className="cursor-pointer">
          <IoEllipsisHorizontal className={iconClassNames({})} />
        </div>
      </div>
      <div className="pt-4">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      {userId === currentUserId && (
        <div className="py-4 flex justify-end items-center gap-1.5 border-b border-gray-300">
          <IoTrash
            className={iconClassNames({})}
            onClick={() => onDelete(id)}
          />
          <IoPencil className={iconClassNames({})} />
        </div>
      )}
      <div className="pt-4 flex justify-end items-center gap-1.5">
        <IoSend className={iconClassNames({})} />
        {liked ? (
          <IoHeart
            className={iconClassNames({ color: 'red' })}
            onClick={toggleLike}
          />
        ) : (
          <IoHeartOutline className={iconClassNames({})} onClick={toggleLike} />
        )}
      </div>
    </div>
  )
}

export default BlogPost
