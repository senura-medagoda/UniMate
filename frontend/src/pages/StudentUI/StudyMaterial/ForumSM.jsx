// src/pages/StudentUI/StudyMaterial/Forum.jsx
import React, { useState, useEffect } from "react";
import { FaPlus, FaHome, FaUser, FaSearch, FaThumbsUp, FaThumbsDown, FaComment, FaEdit, FaTrash } from "react-icons/fa";

const Forum = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
    tags: ""
  });
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    year: "",
    semester: "",
    subject: "",
    sort: "newest"
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5001/api/forum/posts?';
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(url + params.toString());
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters, searchQuery]);

  const handleAddPost = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        setNewPost({
          title: "",
          description: "",
          campus: "",
          course: "",
          year: "",
          semester: "",
          subject: "",
          tags: ""
        });
        setActiveTab("home");
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' })
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' })
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const isLiked = (post) => post.likedBy?.includes('student123');
  const isDisliked = (post) => post.dislikedBy?.includes('student123');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <FaComment className="mr-2" />
          Study Forum
        </h2>
        
        <nav className="space-y-2">
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "home" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("home")}
          >
            <FaHome className="mr-2" />
            Forum Home
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "add" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("add")}
          >
            <FaPlus className="mr-2" />
            Create Post
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "my-posts" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("my-posts")}
          >
            <FaUser className="mr-2" />
            My Posts
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="w-4/5 p-6 overflow-y-auto">
        {/* Forum Home */}
        {activeTab === "home" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Forum Home</h2>
              
              {/* Search Bar */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <select
                  value={filters.campus}
                  onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Campuses</option>
                  <option value="Malabe">Malabe</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Matara">Matara</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Course"
                  value={filters.course}
                  onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                
                <select
                  value={filters.year}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Subject"
                  value={filters.subject}
                  onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="most_commented">Most Commented</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {/* Posts */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No posts found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>By {post.author}</span>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>{post.campus} | {post.course}</span>
                          <span>Year {post.year} | Sem {post.semester}</span>
                          <span>{post.subject}</span>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {post.author === 'student123' && (
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        disabled={isLiked(post)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          isLiked(post) 
                            ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                            : 'bg-gray-100 hover:bg-green-100 hover:text-green-700'
                        }`}
                      >
                        <FaThumbsUp />
                        <span>{post.likes || 0}</span>
                      </button>
                      
                      <button
                        onClick={() => handleDislike(post._id)}
                        disabled={isDisliked(post)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                          isDisliked(post) 
                            ? 'bg-red-100 text-red-700 cursor-not-allowed' 
                            : 'bg-gray-100 hover:bg-red-100 hover:text-red-700'
                        }`}
                      >
                        <FaThumbsDown />
                        <span>{post.dislikes || 0}</span>
                      </button>
                      
                      <div className="flex items-center space-x-1 text-gray-500">
                        <FaComment />
                        <span>{post.commentCount || 0} comments</span>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Comments</h4>
                      
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{comment.userId}</p>
                                  <p className="text-gray-700">{comment.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(comment.createdAt)}
                                  </p>
                                </div>
                                <div className="flex space-x-2 text-sm">
                                  <button className="text-green-600 hover:text-green-800">
                                    👍 {comment.likes || 0}
                                  </button>
                                  <button className="text-red-600 hover:text-red-800">
                                    👎 {comment.dislikes || 0}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add Comment */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(post._id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            handleAddComment(post._id, input.value);
                            input.value = "";
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Post */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Create New Post</h2>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your post..."
                    value={newPost.description}
                    onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campus *</label>
                    <select
                      value={newPost.campus}
                      onChange={(e) => setNewPost(prev => ({ ...prev, campus: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Campus</option>
                      <option value="Malabe">Malabe</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Matara">Matara</option>
                      <option value="Jaffna">Jaffna</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                    <input
                      type="text"
                      placeholder="e.g. IT, Engineering"
                      value={newPost.course}
                      onChange={(e) => setNewPost(prev => ({ ...prev, course: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <select
                      value={newPost.year}
                      onChange={(e) => setNewPost(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                    <select
                      value={newPost.semester}
                      onChange={(e) => setNewPost(prev => ({ ...prev, semester: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      value={newPost.subject}
                      onChange={(e) => setNewPost(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddPost}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Posts */}
        {activeTab === "my-posts" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">My Posts</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading your posts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.filter(post => post.author === 'student123').map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(post.createdAt)}</span>
                          <span>👍 {post.likes || 0}</span>
                          <span>👎 {post.dislikes || 0}</span>
                          <span>💬 {post.commentCount || 0}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
