import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="home">

      {/* Hero Section with Background Image */}
      <div
        className="h-[650px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('https://media.istockphoto.com/id/507009337/photo/students-helping-each-other.jpg?s=2048x2048&w=is&k=20&c=S9Ez-M8dfnjybb-iAOFFc4MJ1Tt9Cksj9iGLEiZxjEU=')" }}
      >
        <div className="bg-black bg-opacity-50 p-20 rounded-xl text-center">
          {/* Search */}
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-96 rounded-l-md focus:outline-none text-black"
            />
            <Link to="/BrowseSM">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-r-md hover:bg-orange-600">
                Search
              </button>
            </Link>
          </div>

          {/* Paragraph */}
          <p className="mt-4 text-lg">
            Welcome to Study Materials. Access, upload, and request resources easily.
          </p>

          {/* Learn More Button */}
          <button className="mt-6 px-6 py-2 bg-blue-500 rounded-md hover:bg-blue-600">
            Learn More
          </button>
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex justify-center gap-4 mt-8 flex-wrap ">
        <Link to="/Top_RecentSM">
          <button className="h-[100px] w-[150px] px-4 py-2 bg-gray-200 rounded-md hover:bg-orange-500 hover:text-white">
            Top Rated
          </button>
        </Link>

        <button className="h-[100px] w-[150px] px-4 py-2 bg-gray-200 rounded-md hover:bg-orange-500 hover:text-white">
          Recent Uploads
        </button>
        <Link to="/RequestSM">
          <button className="h-[100px] w-[150px] px-4 py-2 bg-gray-200 rounded-md hover:bg-orange-500 hover:text-white">
            Request
          </button>
        </Link>
        <Link to="/UploadSM">
          <button className="h-[100px] w-[150px] px-4 py-2 bg-gray-200 rounded-md hover:bg-orange-500 hover:text-white">
            Upload
          </button>
        </Link>
        <Link to="/ForumSM">
          <button className="h-[100px] w-[150px] px-4 py-2 bg-gray-200 rounded-md hover:bg-orange-500 hover:text-white">
            Forum
          </button>
        </Link>
      </div>

    </div>


  );
};

export default Home;
