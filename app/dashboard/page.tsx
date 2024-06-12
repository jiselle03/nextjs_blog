'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { fetchPosts, deletePost } from '@/actions/posts'
import { Post } from '@/types'
import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'

const Dashboard = () => {
  const { currentUser, fetchCurrentUser } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])

  const handleFetchPosts = async (): Promise<void> => {
    const data = await fetchPosts()

    if (data) {
      setPosts(data)
    }
  }

  const handleDeletePost = async (id: number): Promise<void> => {
    await deletePost(id, handleFetchPosts)
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      currentUser ? await handleFetchPosts() : await fetchCurrentUser()
    }

    fetchData()
  }, [currentUser, fetchCurrentUser])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        {posts.map((post) => (
          <BlogPost
            key={post.id}
            currentUserId={currentUser?.id as number}
            post={post}
            author={post.author}
            onDelete={handleDeletePost}
            onFollowingUpdate={handleFetchPosts}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default Dashboard
