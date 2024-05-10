import Link from 'next/link';
import { IoHome, IoSettings } from "react-icons/io5";
import BlogPost from '@/components/blog-post';

const Dashboard = () => {
  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <nav className="w-1/4 p-4">
        <ul>
          <li>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-800 hover:text-gray-500"
            >
              <IoHome />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-gray-800 hover:text-gray-500"
            >
              <IoSettings />
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-4">
        {[...Array(4)].map((_, i) => (
          <BlogPost
            key={i}
            username={`username ${i + 1}`}
            num={i + 1}
          />
        ))}
      </div>

      <div className="w-1/4 p-4"></div>
    </div>
  );
};

export default Dashboard;
