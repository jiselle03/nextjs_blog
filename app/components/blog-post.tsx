'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  IoPerson,
  IoEllipsisHorizontal,
  IoTrash,
  IoPencil,
  IoSend,
  IoHeartOutline,
  IoHeart,
} from 'react-icons/io5'
import { formatDateTime } from '@/utils/datetime'
import { Post, User } from '@/types'
import {
  iconClassNames,
  borderClassNames,
  tagClassNames,
  badgeClassNames,
  Color,
} from '@/styles/classNames'

type BlogPostProps = {
  currentUserId: number
  post: Post
  author: User
  onDelete: (id: number) => Promise<void>
  onUnfollow: (id: number) => Promise<void>
}

const BlogPost = ({
  currentUserId,
  post,
  author,
  onDelete,
  onUnfollow,
}: BlogPostProps) => {
  const router = useRouter()

  const [liked, setLiked] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [linkCopied, setLinkCopied] = useState<boolean>(false)

  const toggleLike = (): void => {
    setLiked(!liked)
  }

  const toggleShowInfo = (): void => {
    setShowInfo(!showInfo)

    if (!showInfo) setLinkCopied(false)
  }

  const onEdit = (): void => {
    router.push(`/edit/${author.username}/${post.id}`)
  }

  const onCopyLink = async (): Promise<void> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const link = `${baseUrl}/${author.username}/${post.id}`

    try {
      await navigator.clipboard.writeText(link)
      setLinkCopied(true)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const isCurrentUser: boolean = currentUserId === author.id

  return (
    <div className={`p-4 mb-4 bg-white ${borderClassNames({})}`}>
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <Link
          href={`/${author.username}`}
          className="cursor-pointer flex items-center gap-1.5 text-gray-800 hover:text-gray-500"
        >
          <IoPerson className={iconClassNames({})} />
          {author.username}
        </Link>
        <div className="cursor-pointer relative">
          <IoEllipsisHorizontal
            className={iconClassNames({})}
            onClick={toggleShowInfo}
          />
          {showInfo && (
            <div
              className={`absolute top-full right-0 w-48 p-2 text-center text-sm bg-white ${borderClassNames({})}`}
            >
              <div className={`pb-2 text-xs border-b border-${Color.light}`}>
                {formatDateTime(post.createdAt)}
              </div>
              {linkCopied ? (
                <div className="font-medium pt-2">Link copied!</div>
              ) : (
                <div className="font-medium pt-2" onClick={onCopyLink}>
                  Copy link
                </div>
              )}
              {!isCurrentUser && (
                <div
                  className="font-medium"
                  onClick={() => onUnfollow(author.id)}
                >
                  Unfollow @{author.username}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="pt-4">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
      <div className="pt-4 flex gap-1.5">
        {post.tags.map((tag) => (
          <div key={tag} className={tagClassNames({})}>
            #{tag}
          </div>
        ))}
      </div>
      {isCurrentUser && (
        <div className="py-4 flex justify-end items-center gap-1.5 border-b border-gray-300">
          <IoTrash
            className={iconClassNames({})}
            onClick={() => onDelete(post.id)}
          />
          <IoPencil className={iconClassNames({})} onClick={onEdit} />
        </div>
      )}
      <div className="pt-4 flex justify-between items-center">
        <div className={badgeClassNames({})}>1000 notes</div>
        <div className="flex items-center gap-1.5">
          <IoSend className={iconClassNames({})} />
          {liked ? (
            <IoHeart
              className={iconClassNames({ color: 'red' })}
              onClick={toggleLike}
            />
          ) : (
            <IoHeartOutline
              className={iconClassNames({})}
              onClick={toggleLike}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogPost
