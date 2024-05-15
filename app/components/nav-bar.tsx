'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoHome, IoSettings } from "react-icons/io5";

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
      <ul>
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
    </nav>
  );
};

export default NavBar;
