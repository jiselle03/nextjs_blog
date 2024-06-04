'use client'

import { useCallback, useEffect, useState } from 'react'
import { IoAddSharp } from 'react-icons/io5'
import { User } from '@/types'
import { fetchIsFollowing, followUser, unfollowUser } from '@/actions/follows'
import { borderClassNames, iconClassNames } from '@/styles/classNames'

type FollowButtonProps = {
  author: User
  refetch: () => Promise<void>
}

const FollowButton = ({ author, refetch }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const handleFollowUser = async (): Promise<void> => {
    await followUser(author.id, refetch)
  }

  const handleUnfollowUser = async (): Promise<void> => {
    await unfollowUser(author.id, refetch)
  }

  const handleFetchIsFollowing = useCallback(async (): Promise<void> => {
    const data = await fetchIsFollowing(author.id)

    setIsFollowing(!!data)
  }, [author.id])

  useEffect(() => {
    if (author.id) {
      handleFetchIsFollowing()
    }
  }, [author.id, handleFetchIsFollowing])

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
