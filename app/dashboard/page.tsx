import BlogPost from '@/components/blog-post';
import NavBar from '@/components/nav-bar';
import SearchBar from '@/components/search-bar';

const Dashboard = () => {
  return (
    <div className="flex flex-row min-h-screen justify-between p-24 divide-x divide-gray-300">
      {/* Navbar */}
      <NavBar />
      

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

      {/* Right panel */}
      <SearchBar />
    </div>
  );
};

export default Dashboard;
