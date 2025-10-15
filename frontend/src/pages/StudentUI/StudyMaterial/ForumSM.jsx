// SM - Study Material Forum Component
import React, { useState, useEffect } from "react";
import { FaPlus, FaHome, FaUser, FaSearch, FaThumbsUp, FaThumbsDown, FaComment, FaEdit, FaTrash, FaComments, FaFilter, FaBook, FaGraduationCap, FaCalendar, FaTag, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const ForumSMM = ({ user, setUser }) => {
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
    year: "",
    semester: "",
    subject: "",
    sort: "newest"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [newComments, setNewComments] = useState({});

  // System data states
  const [systemData, setSystemData] = useState({
    campuses: [],
    courses: [],
    years: [],
    semesters: [],
    subjects: []
  });
  const [systemDataLoading, setSystemDataLoading] = useState(false);

  // Fetch system data for dropdowns
  const fetchSystemData = async () => {
    setSystemDataLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/all');
      const data = await response.json();
      if (data.success) {
        setSystemData(data.data);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setSystemDataLoading(false);
    }
  };

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    console.log('Fetching posts...');
    try {
      let url = 'http://localhost:5001/api/forum/posts?';
      const params = new URLSearchParams();
      
      // Only send backend filters, not search query (we do client-side search)
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(url + params.toString());
      const data = await response.json();
      console.log('API Response:', data);
      // Handle the API response format - data might be wrapped in 'value' property
      const postsArray = Array.isArray(data) ? data : (data.value || data.posts || []);
      console.log('Posts Array:', postsArray);
      // Normalize the data to use 'id' field instead of '_id'
      const normalizedData = postsArray.map(post => ({
        ...post,
        id: post._id || post.id
      }));
      console.log('Normalized Data:', normalizedData);
      setPosts(normalizedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Fallback to local data if API fails
      setPosts([
        {
          id: 1,
          title: "Need help with Calculus integration problems",
          description: "I'm struggling with integration by parts in Calculus. Can anyone share some practice problems or explain the concept?",
          campus: "Malabe",
          course: "IT",
          year: "2",
          semester: "1",
          subject: "Mathematics",
          tags: "calculus,integration,math",
          likes: 5,
          dislikes: 0,
          comments: [],
          createdAt: new Date().toISOString(),
          author: "student123"
        },
        {
          id: 2,
          title: "Best resources for Data Structures and Algorithms",
          description: "Looking for good study materials for DSA. Any recommendations for books, online courses, or practice platforms?",
          campus: "Kandy",
          course: "IT",
          year: "3",
          semester: "2",
          subject: "Programming",
          tags: "dsa,programming,algorithms",
          likes: 8,
          dislikes: 1,
          comments: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          author: "student456"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSystemData();
  }, [filters]);

  // Clear search when switching away from Forum Home
  useEffect(() => {
    if (activeTab !== "home") {
      setSearchQuery("");
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPost.title && newPost.description) {
      try {
        const response = await fetch('http://localhost:5001/api/forum/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newPost, author: 'student123' })
        });
        
        if (response.ok) {
          const newPostData = await response.json();
          // Normalize the new post data
          const normalizedPost = {
            ...newPostData,
            id: newPostData._id || newPostData.id
          };
          setPosts([normalizedPost, ...posts]);
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
      
      // Fallback to local state update
      setPosts([...posts, { 
        ...newPost, 
        id: posts.length + 1, 
        likes: 0, 
        dislikes: 0, 
        comments: [],
        createdAt: new Date().toISOString(),
        author: "student123"
      }]);
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
      // Fallback to local state update
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
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
      // Fallback to local state update
      setPosts(posts.map(p => p.id === postId ? { ...p, dislikes: (p.dislikes || 0) + 1 } : p));
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // Fallback to local state update
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  // Comment handling functions
  const toggleComments = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
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
        // Clear the comment input
        setNewComments(prev => ({ ...prev, [postId]: '' }));
        // Refresh posts to show new comment
        fetchPosts();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!postId || !commentId) {
      console.error('Missing postId or commentId:', { postId, commentId });
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      } else {
        const errorData = await response.text();
        console.error('Delete failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' })
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislikeComment = async (postId, commentId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/forum/posts/${postId}/comments/${commentId}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'student123' })
      });
      
      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Apply filter criteria
    const matchesFilters = (
      (!filters.year || post.year === filters.year) &&
      (!filters.semester || post.semester === filters.semester) &&
      (!filters.subject || post.subject === filters.subject)
    );

    // Apply search query if provided
    if (!searchQuery.trim()) {
      return matchesFilters;
    }

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.campus.toLowerCase().includes(searchTerm) ||
      post.course.toLowerCase().includes(searchTerm) ||
      post.year.toLowerCase().includes(searchTerm) ||
      post.semester.toLowerCase().includes(searchTerm) ||
      post.subject.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );

    return matchesFilters && matchesSearch;
  });

  console.log('Rendering ForumSMM with posts:', posts.length);
  
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaComments className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Material Forum</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with fellow students, ask questions, and share knowledge about study materials
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8 py-4">
                <button
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === "home" 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                  onClick={() => setActiveTab("home")}
                >
                  <FaHome className="mr-2" />
                  Forum Home
                </button>
                
                <button
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === "add" 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                  onClick={() => setActiveTab("add")}
                >
                  <FaPlus className="mr-2" />
                  Create Post
                </button>
                
                <button
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === "my-posts" 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                  onClick={() => setActiveTab("my-posts")}
                >
                  <FaUser className="mr-2" />
                  My Posts
                </button>
              </nav>
            </div>

            {/* Search and Filters - Only show for Forum Home */}
            {activeTab === "home" && (
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search by title, campus, course, year, semester, subject, author, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="space-y-8">
            {/* Forum Home */}
            {activeTab === "home" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Recent Discussions</h2>
                    {searchQuery && (
                      <p className="text-sm text-gray-600 mt-1">
                        Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={filters.sort}
                      onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="most-liked">Most Liked</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading discussions...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaComments className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No discussions found</h3>
                    <p className="text-gray-600 text-lg">Be the first to start a discussion!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors duration-200">{post.title}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">{post.campus}</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{post.course}</span>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Year {post.year}</span>
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Sem {post.semester}</span>
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">{post.subject}</span>
                            </div>
                            
                            {post.tags && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(Array.isArray(post.tags) ? post.tags : post.tags.split(',')).map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                    #{typeof tag === 'string' ? tag.trim() : tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaUser className="mr-2 text-orange-500" />
                              {post.author}
                            </span>
                            <span className="flex items-center">
                              <FaCalendar className="mr-2 text-orange-500" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200"
                            >
                              <FaComment className="mr-2" />
                              {post.comments?.length || 0} comments
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleLike(post.id)}
                              className="flex items-center space-x-2 text-green-600 hover:text-green-700 px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-200"
                            >
                              <FaThumbsUp />
                              <span className="font-medium">{post.likes || 0}</span>
                            </button>
                            <button
                              onClick={() => handleDislike(post.id)}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                            >
                              <FaThumbsDown />
                              <span className="font-medium">{post.dislikes || 0}</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {expandedPosts.has(post.id) && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="space-y-4">
                              {/* Existing Comments */}
                              {post.comments && post.comments.length > 0 ? (
                                <div className="space-y-4">
                                  {post.comments.map((comment) => (
                                    <div key={comment._id || comment.id} className="bg-gray-50 rounded-xl p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-gray-900">{comment.userId}</span>
                                          <span className="text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        {comment.userId === 'student123' && (
                                          <button
                                            onClick={() => handleDeleteComment(post.id, comment._id || comment.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                          >
                                            <FaTrash className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                      <p className="text-gray-700 mb-3">{comment.text}</p>
                                      <div className="flex items-center space-x-4">
                                        <button
                                          onClick={() => handleLikeComment(post.id, comment._id || comment.id)}
                                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200"
                                        >
                                          <FaThumbsUp className="w-4 h-4" />
                                          <span className="text-sm">{comment.likes || 0}</span>
                                        </button>
                                        <button
                                          onClick={() => handleDislikeComment(post.id, comment._id || comment.id)}
                                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                                        >
                                          <FaThumbsDown className="w-4 h-4" />
                                          <span className="text-sm">{comment.dislikes || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  <FaComments className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                  <p>No comments yet. Be the first to comment!</p>
                                </div>
                              )}

                              {/* Add Comment Form */}
                              <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex space-x-3">
                                  <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={newComments[post.id] || ''}
                                    onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddComment(post.id, e.target.value);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleAddComment(post.id, newComments[post.id] || '')}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                                  >
                                    <FaPaperPlane className="w-4 h-4" />
                                    <span>Post</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create Post */}
            {activeTab === "add" && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Discussion</h2>
                  <p className="text-gray-600 mt-2">Start a new discussion about study materials</p>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaBook className="text-orange-600 mr-3" />
                        <label className="text-lg font-semibold text-gray-900">
                          Discussion Title *
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter a clear and descriptive title for your discussion"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaComment className="text-orange-600 mr-3" />
                        <label className="text-lg font-semibold text-gray-900">
                          Description *
                        </label>
                      </div>
                      <textarea
                        placeholder="Describe your question, topic, or what you'd like to discuss..."
                        value={newPost.description}
                        onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                        rows="4"
                        required
                      />
                    </div>

                    {/* Academic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Campus */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaGraduationCap className="text-orange-600 mr-3" />
                          <label className="text-lg font-semibold text-gray-900">
                            Campus *
                          </label>
                        </div>
                        <select
                          value={newPost.campus}
                          onChange={(e) => setNewPost(prev => ({ ...prev, campus: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                          required
                          disabled={systemDataLoading}
                        >
                          <option value="">{systemDataLoading ? "Loading..." : "Select Campus"}</option>
                          {systemData.campuses.map((campus) => (
                            <option key={campus._id} value={campus.name}>
                              {campus.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Course */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaBook className="text-orange-600 mr-3" />
                          <label className="text-lg font-semibold text-gray-900">
                            Course *
                          </label>
                        </div>
                        <select
                          value={newPost.course}
                          onChange={(e) => setNewPost(prev => ({ ...prev, course: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                          required
                          disabled={systemDataLoading}
                        >
                          <option value="">{systemDataLoading ? "Loading..." : "Select Course"}</option>
                          {systemData.courses.map((course) => (
                            <option key={course._id} value={course.name}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Year */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaCalendar className="text-orange-600 mr-3" />
                          <label className="text-lg font-semibold text-gray-900">
                            Year *
                          </label>
                        </div>
                        <select
                          value={newPost.year}
                          onChange={(e) => setNewPost(prev => ({ ...prev, year: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                          required
                          disabled={systemDataLoading}
                        >
                          <option value="">{systemDataLoading ? "Loading..." : "Select Year"}</option>
                          {systemData.years.map((year) => (
                            <option key={year._id} value={year.year}>
                              {year.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Semester */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaCalendar className="text-orange-600 mr-3" />
                          <label className="text-lg font-semibold text-gray-900">
                            Semester *
                          </label>
                        </div>
                        <select
                          value={newPost.semester}
                          onChange={(e) => setNewPost(prev => ({ ...prev, semester: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                          required
                          disabled={systemDataLoading}
                        >
                          <option value="">{systemDataLoading ? "Loading..." : "Select Semester"}</option>
                          {systemData.semesters.map((semester) => (
                            <option key={semester._id} value={semester.semester}>
                              {semester.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaBook className="text-orange-600 mr-3" />
                        <label className="text-lg font-semibold text-gray-900">
                          Subject *
                        </label>
                      </div>
                      <select
                        value={newPost.subject}
                        onChange={(e) => setNewPost(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                        required
                        disabled={systemDataLoading}
                      >
                        <option value="">{systemDataLoading ? "Loading..." : "Select Subject"}</option>
                        {systemData.subjects.map((subjectOption) => (
                          <option key={subjectOption._id} value={subjectOption.name}>
                            {subjectOption.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaTag className="text-orange-600 mr-3" />
                        <label className="text-lg font-semibold text-gray-900">
                          Tags
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. calculus, programming, java (comma separated)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                      />
                      <p className="text-sm text-gray-500">
                        Separate tags with commas for better searchability
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <FaPaperPlane className="mr-3" />
                        Create Discussion
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* My Posts */}
            {activeTab === "my-posts" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">My Discussions</h2>
                
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your posts...</p>
                  </div>
                ) : posts.filter(post => post.author === 'student123').length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaUser className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 text-lg">Start your first discussion!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {posts.filter(post => post.author === 'student123').map((post) => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors duration-200">{post.title}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">{post.campus}</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{post.course}</span>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Year {post.year}</span>
                              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Sem {post.semester}</span>
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">{post.subject}</span>
                            </div>
                            
                            {post.tags && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(Array.isArray(post.tags) ? post.tags : post.tags.split(',')).map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                    #{typeof tag === 'string' ? tag.trim() : tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaCalendar className="mr-2 text-orange-500" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200"
                            >
                              <FaComment className="mr-2" />
                              {post.comments?.length || 0} comments
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                            >
                              <FaTrash />
                              <span className="font-medium">Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {expandedPosts.has(post.id) && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="space-y-4">
                              {/* Existing Comments */}
                              {post.comments && post.comments.length > 0 ? (
                                <div className="space-y-4">
                                  {post.comments.map((comment) => (
                                    <div key={comment._id || comment.id} className="bg-gray-50 rounded-xl p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-gray-900">{comment.userId}</span>
                                          <span className="text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        {comment.userId === 'student123' && (
                                          <button
                                            onClick={() => handleDeleteComment(post.id, comment._id || comment.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                          >
                                            <FaTrash className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                      <p className="text-gray-700 mb-3">{comment.text}</p>
                                      <div className="flex items-center space-x-4">
                                        <button
                                          onClick={() => handleLikeComment(post.id, comment._id || comment.id)}
                                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200"
                                        >
                                          <FaThumbsUp className="w-4 h-4" />
                                          <span className="text-sm">{comment.likes || 0}</span>
                                        </button>
                                        <button
                                          onClick={() => handleDislikeComment(post.id, comment._id || comment.id)}
                                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                                        >
                                          <FaThumbsDown className="w-4 h-4" />
                                          <span className="text-sm">{comment.dislikes || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  <FaComments className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                  <p>No comments yet. Be the first to comment!</p>
                                </div>
                              )}

                              {/* Add Comment Form */}
                              <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex space-x-3">
                                  <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={newComments[post.id] || ''}
                                    onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddComment(post.id, e.target.value);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleAddComment(post.id, newComments[post.id] || '')}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                                  >
                                    <FaPaperPlane className="w-4 h-4" />
                                    <span>Post</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumSMM;