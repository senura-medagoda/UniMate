// src/pages/StudentUI/StudyMaterial/Forum.jsx
import React, { useState } from "react";

const Forum = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "OOP Notes",
      description: "Complete lecture notes for OOP.",
      campus: "SLIIT Malabe",
      course: "IT",
      year: "Year 2",
      semester: "Sem 2",
      subject: "OOP",
      likes: 5,
      dislikes: 1,
      comments: ["Thanks!", "Very useful!"],
    },
  ]);

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    file: null,
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
  });

  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
  });

  const handleAddPost = () => {
    setPosts([...posts, { ...newPost, id: posts.length + 1, likes: 0, dislikes: 0, comments: [] }]);
    setNewPost({ title: "", description: "", file: null, campus: "", course: "", year: "", semester: "", subject: "" });
    setActiveTab("home");
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  const handleDislike = (id) => {
    setPosts(posts.map(p => (p.id === id ? { ...p, dislikes: p.dislikes + 1 } : p)));
  };

  const handleComment = (id, comment) => {
    setPosts(posts.map(p => (p.id === id ? { ...p, comments: [...p.comments, comment] } : p)));
  };

  const filteredPosts = posts.filter(post => {
    return (
      (!filters.campus || post.campus === filters.campus) &&
      (!filters.course || post.course === filters.course) &&
      (!filters.year || post.year === filters.year) &&
      (!filters.semester || post.semester === filters.semester) &&
      (!filters.subject || post.subject === filters.subject)
    );
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Forum</h2>
        <ul>
          <li
            className={`cursor-pointer p-2 rounded ${activeTab === "home" && "bg-gray-600"}`}
            onClick={() => setActiveTab("home")}
          >
            Forum Home
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${activeTab === "add" && "bg-gray-600"}`}
            onClick={() => setActiveTab("add")}
          >
            Add Post
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${activeTab === "uploads" && "bg-gray-600"}`}
            onClick={() => setActiveTab("uploads")}
          >
            My Uploads
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="w-4/5 p-6 overflow-y-auto">
        {/* Forum Home */}
        {activeTab === "home" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Forum Home</h2>

            {/* Filters */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {["Campus", "Course", "Year", "Semester", "Subject"].map((label) => (
                <select
                  key={label}
                  className="p-2 border rounded"
                  value={filters[label.toLowerCase()]}
                  onChange={(e) => setFilters({ ...filters, [label.toLowerCase()]: e.target.value })}
                >
                  <option value="">{label}</option>
                  <option value={`${label} 1`}>{label} 1</option>
                  <option value={`${label} 2`}>{label} 2</option>
                  <option value={`${label} 3`}>{label} 3</option>
                </select>
              ))}
            </div>

            {/* Posts */}
            {filteredPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded mb-4 shadow">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p>{post.description}</p>
                <p className="text-sm text-gray-500">
                  {post.campus} | {post.course} | {post.year} | {post.semester} | {post.subject}
                </p>
                <div className="flex gap-4 mt-2">
                  <button onClick={() => handleLike(post.id)} className="text-green-600">👍 {post.likes}</button>
                  <button onClick={() => handleDislike(post.id)} className="text-red-600">👎 {post.dislikes}</button>
                </div>

                {/* Comments */}
                <div className="mt-2">
                  <h4 className="font-bold">Comments</h4>
                  {post.comments.map((c, i) => (
                    <p key={i} className="text-sm">- {c}</p>
                  ))}
                  <input
                    type="text"
                    placeholder="Add comment..."
                    className="border rounded p-1 mt-2 w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Post */}
        {activeTab === "add" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add Post</h2>
            <input
              type="text"
              placeholder="Title"
              className="border p-2 rounded w-full mb-2"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="border p-2 rounded w-full mb-2"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
            />
            <input
              type="file"
              className="mb-2"
              onChange={(e) => setNewPost({ ...newPost, file: e.target.files[0] })}
            />

            {/* Dropdowns for Campus, Course, Year, Semester, Subject */}
            <div className="grid grid-cols-5 gap-2 mb-2">
              {["Campus", "Course", "Year", "Semester", "Subject"].map((label) => (
                <select
                  key={label}
                  className="p-2 border rounded"
                  value={newPost[label.toLowerCase()]}
                  onChange={(e) => setNewPost({ ...newPost, [label.toLowerCase()]: e.target.value })}
                >
                  <option value="">{label}</option>
                  <option value={`${label} 1`}>{label} 1</option>
                  <option value={`${label} 2`}>{label} 2</option>
                  <option value={`${label} 3`}>{label} 3</option>
                </select>
              ))}
            </div>

            <button onClick={handleAddPost} className="bg-blue-600 text-white p-2 rounded">
              Add Post
            </button>
          </div>
        )}

        {/* My Uploads */}
        {activeTab === "uploads" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Uploads</h2>
            {posts.map((post) => (
              <div key={post.id} className="border p-4 rounded mb-4 shadow">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p>{post.description}</p>
                <div className="flex gap-2 mt-2">
                  <button className="bg-yellow-500 text-white p-1 rounded">Edit</button>
                  <button className="bg-red-600 text-white p-1 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
