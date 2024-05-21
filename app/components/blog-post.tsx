'use client';

import { useState } from 'react';
import { IoPerson, IoEllipsisHorizontal, IoTrash, IoPencil, IoSend, IoHeartOutline, IoHeart } from "react-icons/io5";

type Props = {
  userId: string;
  username: string;
  title: string;
  content: string;
}

const BlogPost = ({ userId, username, title, content }: Props) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = (): void => {
    setLiked(!liked);
  };

  const currentUserId = "1";

  return (
    <div className="border border-gray-300 rounded p-4 mb-4 bg-white">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <div className="cursor-pointer flex items-center gap-1.5 text-gray-800 hover:text-gray-500">
          <IoPerson className="text-gray-500 h-5 w-5" />
          {username}
        </div>
        <div className="cursor-pointer">
          <IoEllipsisHorizontal className="text-gray-500 h-5 w-5" />
        </div>
      </div>
      <div className="pt-4">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      {
        userId === currentUserId && (
          <div className="py-4 flex justify-end items-center gap-1.5 border-b border-gray-300">
            <IoTrash className="cursor-pointer text-gray-500 h-5 w-5" />
            <IoPencil className="cursor-pointer text-gray-500 h-5 w-5" />
          </div>
        )
      }
      <div className="pt-4 flex justify-end items-center gap-1.5">
        <IoSend className="cursor-pointer text-gray-500 h-5 w-5" />
        {liked ? (
          <IoHeart onClick={toggleLike} className="cursor-pointer text-red-500 h-5 w-5" />
        ) : (
          <IoHeartOutline onClick={toggleLike} className="cursor-pointer text-gray-500 h-5 w-5" />
        )}
      </div>
    </div>
  );
};

export default BlogPost;
