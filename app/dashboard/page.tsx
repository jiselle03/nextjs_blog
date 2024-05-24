'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'
import { Post } from '@/types'

const Dashboard = () => {
  const router = useRouter()

  const [currentUserId, setCurrentUserId] = useState<number>(0)
  const [posts, setPosts] = useState<Post[]>([])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()

        if (!data.id) {
          return router.push('/login')
        }

        setCurrentUserId(data.id)
      } else {
        const errorData = await response.json()

        console.error('Failed to fetch current user:', errorData.error)

        return router.push('/login')
      }
    } catch (error) {
      console.error('Error:', error)

      return router.push('/login')
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()

        setPosts(data)
      } else {
        const errorData = await response.json()

        console.error('Failed to fetch posts:', errorData.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
    fetchPosts()
  }, [router])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        {posts.map((post) => (
          <BlogPost
            key={post.id}
            currentUserId={currentUserId}
            userId={post.author.id}
            username={post.author?.username}
            title={post.title}
            content={post.content}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default Dashboard
