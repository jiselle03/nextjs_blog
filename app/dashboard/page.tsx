import Link from 'next/link';
import { IoHome } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";

export default function Dashboard() {
  return (
    <div className="flex flex-row min-h-screen justify-between p-24">
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
        Dashboard here
      </div>
    </div>
  );
}
