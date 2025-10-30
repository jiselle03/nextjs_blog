'use client'

import { useCallback, useEffect, useState } from 'react'
import { IoAddSharp } from 'react-icons/io5'
import { User } from '@/types'
import { fetchIsFollowing, followUser, unfollowUser } from '@/actions/follows'
import { borderClassNames, iconClassNames } from '@/styles/classNames'

type FollowButtonProps = {
  author: User
  initialIsFollowing?: boolean | null
  onFollowingUpdate: (following: boolean | null) => void
}

const FollowButton = ({
  author,
  initialIsFollowing,
  onFollowingUpdate,
}: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)

  const resolveBlogId = (): string | undefined =>
    author.blogId || author.blog?.id

  const handleFollowUser = async (): Promise<void> => {
    const blogId = resolveBlogId()
    if (!blogId) return
    await followUser(blogId, handleFetchIsFollowing)
  }

  const handleUnfollowUser = async (): Promise<void> => {
    const blogId = resolveBlogId()
    if (!blogId) return
    await unfollowUser(blogId, handleFetchIsFollowing)
  }

  const handleFetchIsFollowing = useCallback(async (): Promise<void> => {
    const blogId = resolveBlogId()
    if (!blogId) {
      setIsFollowing(false)
      onFollowingUpdate(false)
      return
    }

    const data = await fetchIsFollowing(blogId)
    setIsFollowing(data)
    onFollowingUpdate(data)
  }, [author.blog?.id, author.blogId, onFollowingUpdate])

  useEffect(() => {
    handleFetchIsFollowing()
  }, [handleFetchIsFollowing])

  useEffect(() => {
    if (initialIsFollowing !== undefined) {
      setIsFollowing(initialIsFollowing)
    }
  }, [initialIsFollowing])

  if (isFollowing === null) return

  return isFollowing ? (
    <div
      className={`cursor-pointer text-sm font-medium py-1 px-2 flex items-center gap-0.5 bg-white ${borderClassNames({})}`}
      onClick={handleUnfollowUser}
    >
      Following
    </div>
  ) : (
    <div
      className={`cursor-pointer text-sm font-medium py-1 px-2 flex items-center gap-0.5 bg-white ${borderClassNames({})}`}
      onClick={handleFollowUser}
    >
      Follow
      <IoAddSharp className={iconClassNames({ size: 'x-small' })} />
    </div>
  )
}

export default FollowButton
