'use client';

import { useState } from 'react';
import { IoPerson, IoEllipsisHorizontal, IoTrash, IoPencil, IoSend, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { iconClassNames, borderClassNames } from '@/styles/classNames';

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

  const currentUserId = '1';

  return (
    <div className={`p-4 mb-4 bg-white ${borderClassNames({})}`}>
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <div className="cursor-pointer flex items-center gap-1.5 text-gray-800 hover:text-gray-500">
          <IoPerson className={iconClassNames({})} />
          {username}
        </div>
        <div className="cursor-pointer">
          <IoEllipsisHorizontal className={iconClassNames({})} />
        </div>
      </div>
      <div className="pt-4">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      {
        userId === currentUserId && (
          <div className="py-4 flex justify-end items-center gap-1.5 border-b border-gray-300">
            <IoTrash className={iconClassNames({})} />
            <IoPencil className={iconClassNames({})} />
          </div>
        )
      }
      <div className="pt-4 flex justify-end items-center gap-1.5">
        <IoSend className={iconClassNames({})} />
        {liked ? (
          <IoHeart
            className={iconClassNames({ color: 'red' })}
            onClick={toggleLike}
          />
        ) : (
          <IoHeartOutline
            className={iconClassNames({})}
            onClick={toggleLike}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPost;
