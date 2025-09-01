// src/pages/StudentUI/Forum/ForumHome.jsx
import React, { useState } from "react";

const ForumHome = () => {
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How to prepare for DSA exam?",
      description: "Please share notes or tips if you have.",
      likes: 3,
      dislikes: 0,
      comments: [
        { id: 1, text: "Check past papers!", editing: false },
        { id: 2, text: "Use GeeksforGeeks practice problems.", editing: false },
      ],
    },
  ]);

  // Like / dislike
  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  // Add comment
  const handleAddComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), text, editing: false },
              ],
            }
          : post
      )
    );
  };

  // Edit comment
  const handleEditComment = (postId, commentId, newText) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId ? { ...c, text: newText, editing: false } : c
              ),
            }
          : post
      )
    );
  };

  // Toggle editing mode
  const toggleEditing = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId ? { ...c, editing: !c.editing } : c
              ),
            }
          : post
      )
    );
  };

  // Delete comment
  const handleDeleteComment = (postId, commentId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
            }
          : post
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {["Campus", "Course", "Year", "Semester", "Subject"].map((label) => (
          <select
            key={label}
            className="border p-2 rounded"
            value={filters[label.toLowerCase()]}
            onChange={(e) =>
              setFilters({ ...filters, [label.toLowerCase()]: e.target.value })
            }
          >
            <option value="">{label}</option>
            <option value="Option1">{label} 1</option>
            <option value="Option2">{label} 2</option>
          </select>
        ))}
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="mt-2">{post.description}</p>

          {/* Like/Dislike */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => handleLike(post.id)}
              className="px-3 py-1 bg-green-200 rounded"
            >
              👍 {post.likes}
            </button>
            <button
              onClick={() => handleDislike(post.id)}
              className="px-3 py-1 bg-red-200 rounded"
            >
              👎 {post.dislikes}
            </button>
          </div>

          {/* Comments */}
          <div className="mt-4 space-y-3">
            <h3 className="font-semibold">Comments</h3>
            {post.comments.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border p-2 rounded"
              >
                {c.editing ? (
                  <input
                    type="text"
                    defaultValue={c.text}
                    className="border rounded p-1 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditComment(post.id, c.id, e.target.value);
                      }
                    }}
                  />
                ) : (
                  <span>{c.text}</span>
                )}
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => toggleEditing(post.id, c.id)}
                    className="text-blue-500"
                  >
                    {c.editing ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDeleteComment(post.id, c.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="border p-2 rounded flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  handleAddComment(post.id, input.value);
                  input.value = "";
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumHome;
