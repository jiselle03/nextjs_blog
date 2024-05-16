'use client';

import { useState } from 'react';
import { IoPerson, IoEllipsisHorizontal, IoSend, IoHeartOutline, IoHeart } from "react-icons/io5";

type Props = {
  username: string;
  num: number;
}

const BlogPost = ({ username, num }: Props) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = (): void => {
    setLiked(!liked);
  };

  return (
    <div className="border border-gray-300 rounded p-4 mb-4 bg-white">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <div className="cursor-pointer flex items-center gap-1.5 text-gray-800 hover:text-gray-500">
          <IoPerson className="h-6 w-6" />
          {username}
        </div>
        <div className="cursor-pointer">
          <IoEllipsisHorizontal className="h-6 w-6" />
        </div>
      </div>
      <div className="pt-4">
        Blog post {num}
      </div>
      <div className="pt-4 flex justify-end items-center gap-1.5">
        <IoSend className="cursor-pointer h-5 w-5" />
        {liked ? (
          <IoHeart onClick={toggleLike} className="cursor-pointer text-red-500 h-5 w-5" />
        ) : (
          <IoHeartOutline onClick={toggleLike} className="cursor-pointer h-5 w-5" />
        )}
      </div>
    </div>
  );
};

export default BlogPost;
