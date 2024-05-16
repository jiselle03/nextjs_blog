import { IoPencil } from "react-icons/io5";
import NavBar from '@/components/nav-bar';
import SearchBar from '@/components/search-bar';

const Dashboard = () => {
  const items = ['Email', 'Password', 'Language']

  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="bg-white p-4 border rounded">
          <h2 className="pb-6 border-b-2 border-gray-300 text-xl font-semibold">Account</h2>
          <div className="divide-y divide-gray-300">
            {
              items.map(item => (
                <div
                  key={item}
                  className="py-4 flex justify-between items-center"
                >
                  <h3 className="w-36 font-medium">{item}</h3>
                  <p className="flex-grow">Text</p>
                  <IoPencil className="cursor-pointer text-gray-500 h-5 w-5" />
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Right panel */}
      <SearchBar />
    </div>
  );
};

export default Dashboard;
