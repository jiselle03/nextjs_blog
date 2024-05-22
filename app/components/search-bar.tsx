'use client';

import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { iconClassNames, borderClassNames } from '@/styles/classNames';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
  <div className="relative w-1/4 p-4">
      <IoSearch
        className={`absolute inset-6 left-6 ${isFocused ? iconClassNames({ size: 'large' }) : iconClassNames({ size: 'large', color: 'light' })}`}
      />
      <input
        type="text"
        placeholder="Search Blogr"
        id="search"
        name="search"
        className={`${borderClassNames({})} p-2 pl-10 outline-0 placeholder-gray-300 text-gray-300 focus:text-gray-800 bg-zinc-100 focus:bg-white`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchBar;
