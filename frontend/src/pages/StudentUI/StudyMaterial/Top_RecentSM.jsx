import React, { useState } from "react";

const MaterialsPage = () => {
  const [view, setView] = useState("recent"); // default: recently uploaded

  // Example data (replace with API calls)
  const recent = [
    { id: 1, title: "Math Notes", uploader: "Student A", likes: 12 },
    { id: 2, title: "Physics PDF", uploader: "Student B", likes: 5 },
  ];

  const topRated = [
    { id: 3, title: "Algorithms Book", uploader: "Student C", likes: 25 },
    { id: 4, title: "Chemistry Guide", uploader: "Student D", likes: 18 },
  ];

  const data = view === "recent" ? recent : topRated;

  return (
    <div className="p-6">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setView("recent")}
          className={`px-4 py-2 rounded ${
            view === "recent" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Recently Uploaded
        </button>
        <button
          onClick={() => setView("top")}
          className={`px-4 py-2 rounded ${
            view === "top" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Top Rated
        </button>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600">Uploaded by {item.uploader}</p>
            <p className="mt-2">👍 {item.likes} Likes</p>
            <div className="flex gap-2 mt-2">
              <button className="px-2 bg-green-500 text-white rounded">Like</button>
              <button className="px-2 bg-red-500 text-white rounded">Unlike</button>
              <button className="px-2 bg-yellow-500 text-white rounded">Rate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsPage;
