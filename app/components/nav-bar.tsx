'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoHome, IoSettings, IoAddSharp } from 'react-icons/io5';
import { iconClassNames } from '@/styles/classNames';

const NavBar = () => {
  const pathname = usePathname();

  const navItems = [{
    title: 'Home',
    pathname: '/dashboard',
    icon: <IoHome />
  }, {
    title: 'Settings',
    pathname: '/settings',
    icon: <IoSettings />
  }]

  return (
    <nav className="w-1/4 p-4">
      <ul className="border-b-2 border-gray-300 pb-4">
        {navItems.map(item => (
          <li
            key={item.title}
            className="p-2 hover:bg-gray-300"
          >
            <Link
              href={item.pathname}
              className={`flex items-center gap-1.5 text-gray-${pathname === item.pathname ? '800' : '500'}`}
            >
              {item.icon}
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/new"
        className="pt-4 p-2 flex items-center gap-1.5 text-gray-800"
      >
        <IoAddSharp className={iconClassNames({})} />
        New
      </Link>
    </nav>
  );
};

export default NavBar;
