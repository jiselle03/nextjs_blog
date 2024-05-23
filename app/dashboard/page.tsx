'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'
import { Post } from '@/types'

const userId = process.env.NEXT_PUBLIC_MOCK_USER_ID // TODO: Replace with real current user ID

const Dashboard = () => {
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])

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
    if (!userId) {
      router.push('/login')

      return
    }

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
            userId={`${post.id}`}
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
