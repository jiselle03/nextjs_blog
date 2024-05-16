'use client';

import { useState } from 'react';
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
  <div className="relative w-1/4 p-4">
      <IoSearch
        className={`absolute h-6 w-6 text-gray-300 inset-6 left-6 text-gray-${isFocused ? '800' : '300'}`}
      />
      <input
        type="text"
        placeholder="Search Blogr"
        id="search"
        name="search"
        className="border border-gray-300 rounded p-2 pl-10 outline-0 placeholder-gray-300 text-gray-300 focus:text-gray-800 bg-zinc-100 focus:bg-white"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchBar;
