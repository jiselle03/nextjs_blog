'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { fetchUserPosts, deletePost } from '@/actions/posts'
import { User, Post } from '@/types'
import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import FollowButton from '@/components/follow-button'
import SearchBar from '@/components/search-bar'

const UserBlog = () => {
  const params = useParams<{ username: string }>()
  const { currentUser } = useAuth()

  const [author, setAuthor] = useState<User>({} as User)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean | null | undefined>(
    undefined,
  )

  const onFollowingUpdate = useCallback((following: boolean | null) => {
    setIsFollowing(following)
    setPosts((posts) =>
      posts.map((post) => ({ ...post, isFollowing: following })),
    )
  }, [])

  const handleFetchPosts = useCallback(async (): Promise<void> => {
    const data = await fetchUserPosts(params.username)

    if (data) {
      setAuthor({ id: data.id, username: data.username } as User)
      setPosts(data.posts)
    }
  }, [params.username])

  const handleDeletePost = async (id: number): Promise<void> => {
    await deletePost(id, handleFetchPosts)
  }

  useEffect(() => {
    if (currentUser) {
      handleFetchPosts()
    }
  }, [currentUser, params.username, handleFetchPosts])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="flex items-center gap-1.5 mb-4">
          <h3 className="font-semibold">{params.username}</h3>
          <FollowButton
            author={author}
            initialIsFollowing={isFollowing}
            onFollowingUpdate={onFollowingUpdate}
          />
        </div>

        {posts.map((post) => (
          <BlogPost
            key={post.id}
            currentUserId={currentUser?.id as number}
            author={author}
            post={post}
            onDelete={handleDeletePost}
            onFollowingUpdate={onFollowingUpdate}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default UserBlog
