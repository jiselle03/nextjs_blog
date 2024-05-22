'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@/types';
import BlogPost from '@/components/blog-post';
import NavBar from '@/components/nav-bar';
import SearchBar from '@/components/search-bar';

const Blog = () => {
  const params = useParams<{ username: string }>();

  const [username, setUsername] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/${params.username}`, {
          method: 'GET',
        });
  
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setPosts(data.posts);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch posts:', errorData.error);
        }
      } catch (error) {
        console.error('Error:', error);
      };
    };
  
    fetchPosts();
  }, [params.username]);

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <h3 className="font-semibold mb-4">{params.username}</h3>

        {posts.map(post => (
          <BlogPost
            key={post.id}
            userId={`${post.id}`}
            username={username}
            title={post.title}
            content={post.content}
          />
        ))}
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  );
};

export default Blog;
