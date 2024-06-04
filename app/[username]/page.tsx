'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { IoAddSharp } from 'react-icons/io5'
import { useAuth } from '@/providers/AuthProvider'
import { fetchUserPosts, deletePost } from '@/actions/posts'
import { fetchIsFollowing, followUser, unfollowUser } from '@/actions/follows'
import { User, Post } from '@/types'
import { borderClassNames, iconClassNames } from '@/styles/classNames'
import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'

const UserBlog = () => {
  const params = useParams<{ username: string }>()
  const { currentUser } = useAuth()

  const [author, setAuthor] = useState<User>({} as User)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const handleFetchPosts = useCallback(async (): Promise<void> => {
    const data = await fetchUserPosts(params.username)

    if (data) {
      setAuthor({ id: data.id, username: data.username } as User)
      setPosts(data.posts)
    }
  }, [params.username])

  const handleFetchIsFollowing = useCallback(async (): Promise<void> => {
    const data = await fetchIsFollowing(author.id)

    setIsFollowing(!!data)
  }, [author.id])

  const handleDeletePost = async (id: number): Promise<void> => {
    await deletePost(id, handleFetchPosts)
  }

  const handleFollowUser = async (): Promise<void> => {
    await followUser(author.id, refetch)
  }

  const handleUnfollowUser = async (): Promise<void> => {
    await unfollowUser(author.id, refetch)
  }

  const refetch = async (): Promise<void> => {
    await handleFetchPosts()
    await handleFetchIsFollowing()
  }

  useEffect(() => {
    if (currentUser) {
      handleFetchPosts()
    }
  }, [currentUser, params.username, handleFetchPosts])

  useEffect(() => {
    if (author.id) {
      handleFetchIsFollowing()
    }
  }, [author.id, handleFetchIsFollowing])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="flex items-center gap-1.5 mb-4">
          <h3 className="font-semibold">{params.username}</h3>
          {isFollowing && (
            <div
              className={`cursor-pointer text-sm font-medium py-1 px-2 flex items-center gap-0.5 bg-white ${borderClassNames({})}`}
              onClick={handleUnfollowUser}
            >
              Following
            </div>
          )}
          {!isFollowing && (
            <div
              className={`cursor-pointer text-sm font-medium py-1 px-2 flex items-center gap-0.5 bg-white ${borderClassNames({})}`}
              onClick={handleFollowUser}
            >
              Follow
              <IoAddSharp className={iconClassNames({ size: 'x-small' })} />
            </div>
          )}
        </div>

        {posts.map((post) => (
          <BlogPost
            key={post.id}
            currentUserId={currentUser?.id as number}
            author={author}
            post={post}
            refetch={refetch}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default UserBlog
