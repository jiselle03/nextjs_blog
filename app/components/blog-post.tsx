'use client';

import { useState } from 'react';
import { IoPerson, IoSend, IoHeartOutline, IoHeart } from "react-icons/io5";

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
    <div className="border border-gray-300 rounded p-4 mb-4">
      <div className="flex items-center gap-1.5 text-gray-800 hover:text-gray-500 border-b border-gray-300 pb-4">
        <IoPerson />
        {username}
      </div>
      <div className="pt-4">
        Blog post {num}
      </div>
      <div className="pt-4 flex justify-end items-center gap-1.5">
        <IoSend className="cursor-pointer" />
        {liked ? (
          <IoHeart onClick={toggleLike} className="cursor-pointer text-red-500" />
        ) : (
          <IoHeartOutline onClick={toggleLike} className="cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default BlogPost;
