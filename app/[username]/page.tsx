'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'
import { User, Post } from '@/types'

const Blog = () => {
  const params = useParams<{ username: string }>()

  const [author, setAuthor] = useState<User>({} as User)
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUserId, setCurrentUserId] = useState<number>(0)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()

          setCurrentUserId(data.id)
        } else {
          const errorData = await response.json()

          console.error('Failed to fetch current user:', errorData.error)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/${params.username}`, {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()

          setAuthor(data.author)
          setPosts(data.posts)
        } else {
          const errorData = await response.json()

          console.error('Failed to fetch posts:', errorData.error)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchCurrentUser()
    fetchPosts()
  }, [params.username])

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
            currentUserId={currentUserId}
            userId={author.id}
            username={author.username}
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

export default Blog
