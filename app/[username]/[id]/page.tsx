'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { fetchPost, deletePost } from '@/actions/posts'
import { fetchIsFollowing } from '@/actions/follows'
import { Post } from '@/types'
import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import FollowButton from '@/components/follow-button'
import SearchBar from '@/components/search-bar'

const UserBlogPost = () => {
  const params = useParams<{ username: string; id: string }>()
  const { currentUser } = useAuth()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [post, setPost] = useState<Post>({} as Post)
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)

  const onFollowingUpdate = useCallback((following: boolean | null) => {
    setIsFollowing(following)
    setPost((post) => ({ ...post, isFollowing: following }))
  }, [])

  const handleFetchPost = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    const postData = await fetchPost(Number(params.id))

    if (postData) {
      setPost(postData)

      if (!!post.author?.id) {
        const followingData = await fetchIsFollowing(post.author?.id)

        setIsFollowing(followingData)
        setPost((post) => ({ ...post, isFollowing: followingData }))
      }
    }

    setIsLoading(false)
  }, [params.id, post.author?.id])

  const handleDeletePost = async (id: number): Promise<void> => {
    setIsLoading(true)

    await deletePost(id, handleFetchPost)

    setIsLoading(false)
  }

  useEffect(() => {
    if (currentUser) {
      handleFetchPost()
    }
  }, [currentUser, params.id, handleFetchPost])

  if (isLoading) {
    return <div className="min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      {post.id ? (
        <div className="flex-grow p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <h3 className="font-semibold">{params.username}</h3>
            <FollowButton
              author={post.author}
              initialIsFollowing={isFollowing}
              onFollowingUpdate={onFollowingUpdate}
            />
          </div>

          <BlogPost
            key={post.id}
            currentUserId={currentUser?.id as number}
            author={post.author}
            post={post}
            onDelete={handleDeletePost}
            onFollowingUpdate={onFollowingUpdate}
          />
        </div>
      ) : (
        <div className="flex-grow p-4">
          <h3 className="font-semibold">{params.username}</h3>
          <p>No post found</p>
        </div>
      )}

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default UserBlogPost
