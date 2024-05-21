'use client';

import { useState } from 'react';

const New = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [authorId, setAuthorId] = useState(1); // TODO: Use real user ID

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        authorId,
      }),
    });

    if (response.ok) {
      const post = await response.json();
      console.log('Post created:', post);
    } else {
      console.error('Error creating post');
    }
  };

  return (
    <div className="min-h-screen p-24">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-1.5">
          <label htmlFor="title">Title</label>
          <input
            className="border border-gray-300 rounded"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            required
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          <label htmlFor="content">Content</label>
          <textarea
            className="border border-gray-300 rounded"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            className="border border-gray-300 rounded"
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-1.5 mt-4">
          <button
            className=" py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default New;
