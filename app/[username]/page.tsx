'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { IoAddSharp } from 'react-icons/io5'
import { useAuth } from '@/providers/AuthProvider'
import { fetchUserPosts, deletePost } from '@/actions/posts'
import { followUser, unfollowUser } from '@/actions/users'
import { User, Post } from '@/types'
import { borderClassNames, iconClassNames } from '@/styles/classNames'
import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'

const Blog = () => {
  const params = useParams<{ username: string }>()
  const { currentUser } = useAuth()

  const [author, setAuthor] = useState<User>({} as User)
  const [posts, setPosts] = useState<Post[]>([])

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

  const handleFollowUser = async (): Promise<void> => {
    await followUser(author.id, handleFetchPosts)
  }

  const handleUnfollowUser = async (): Promise<void> => {
    await unfollowUser(author.id, handleFetchPosts)
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
          {/* TODO: If current user is following this user, badge should say Following */}
          <div
            className={`cursor-pointer text-sm font-medium py-1 px-2 flex items-center gap-0.5 bg-white ${borderClassNames({})}`}
            onClick={handleFollowUser}
          >
            Follow
            <IoAddSharp className={iconClassNames({ size: 'x-small' })} />
          </div>
        </div>

        {posts.map((post) => (
          <BlogPost
            key={post.id}
            id={post.id}
            currentUserId={currentUser?.id as number}
            userId={author.id}
            username={author.username}
            title={post.title}
            content={post.content}
            tags={post.tags}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default Blog
