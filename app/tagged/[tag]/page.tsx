'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { fetchPostsWithTag, deletePost } from '@/actions/posts'
import { Post } from '@/types'
import BlogPost from '@/components/blog-post'
import NavBar from '@/components/nav-bar'
import SearchBar from '@/components/search-bar'

const PostsWithTag = () => {
  const params = useParams<{ tag: string }>()
  const { currentUser } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])

  const handleFetchPosts = useCallback(async (): Promise<void> => {
    const data = await fetchPostsWithTag(params.tag)

    if (data) {
      setPosts(data)
    }
  }, [params.tag])

  const handleDeletePost = async (id: number): Promise<void> => {
    await deletePost(id, handleFetchPosts)
  }

  useEffect(() => {
    if (currentUser) {
      handleFetchPosts()
    }
  }, [currentUser, params.tag, handleFetchPosts])

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="flex items-center gap-1.5 mb-4">
          <h3 className="font-semibold">{params.tag}</h3>
        </div>

        {posts.map((post) => (
          <BlogPost
            key={post.id}
            currentUserId={currentUser?.id as number}
            author={post.author}
            post={post}
            allowFollow={true}
            refetch={handleFetchPosts}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  )
}

export default PostsWithTag
