'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { fetchUserPosts, deletePost } from '@/utils/posts'
import { User, Post } from '@/types'
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
        <h3 className="font-semibold mb-4">{params.username}</h3>

        {posts.map((post) => (
          <BlogPost
            key={post.id}
            id={post.id}
            currentUserId={currentUser?.id as number}
            userId={author.id}
            username={author.username}
            title={post.title}
            content={post.content}
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
