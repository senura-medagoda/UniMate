import React, { useState, useEffect } from "react";
import { FaUsers, FaFileUpload, FaComments, FaExclamationTriangle, FaChartBar, FaCog, FaTrash, FaEye, FaCheck, FaTimes, FaSearch, FaUser, FaBook } from "react-icons/fa";

const SMAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMaterials: 0,
    totalPosts: 0,
    totalComplaints: 0,
    pendingApprovals: 0
  });
  const [materials, setMaterials] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch materials for moderation
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/study-materials/all');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forum posts for moderation
  const fetchForumPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/forum/posts');
      const data = await response.json();
      setForumPosts(data);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === "materials") fetchMaterials();
    if (activeTab === "forum") fetchForumPosts();
    if (activeTab === "complaints") fetchComplaints();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/admin/materials/${materialId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchMaterials();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/admin/forum/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchForumPosts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleResolveComplaint = async (complaintId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/ban`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  // Fetch complaint details (material or user)
  const fetchComplaintDetails = async (complaint) => {
    setDetailLoading(true);
    setSelectedComplaint(complaint);
    setShowComplaintDetail(true);
    
    try {
      let details = null;
      
      if (complaint.type === 'material' && complaint.againstMaterial) {
        // Fetch material details
        const response = await fetch(`http://localhost:5001/api/study-materials/${complaint.againstMaterial}`);
        if (response.ok) {
          details = await response.json();
        }
      } else if (complaint.type === 'user' && complaint.againstUser) {
        // Fetch user details
        const response = await fetch(`http://localhost:5001/api/admin/users/${complaint.againstUser}`);
        if (response.ok) {
          details = await response.json();
        }
      } else if (complaint.type === 'forum_post' && complaint.againstPost) {
        // Fetch forum post details
        const response = await fetch(`http://localhost:5001/api/forum/posts/${complaint.againstPost}`);
        if (response.ok) {
          details = await response.json();
        }
      }
      
      setComplaintDetails(details);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

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
      <div className="w-1/6 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <FaCog className="mr-2" />
          Admin Dashboard
        </h2>
        
        <nav className="space-y-2">
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "overview" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartBar className="mr-2" />
            Overview
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "materials" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("materials")}
          >
            <FaFileUpload className="mr-2" />
            Materials Moderation
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "forum" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("forum")}
          >
            <FaComments className="mr-2" />
            Forum Moderation
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "complaints" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("complaints")}
          >
            <FaExclamationTriangle className="mr-2" />
            Complaints
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "users" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="mr-2" />
            User Management
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "reports" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <FaChartBar className="mr-2" />
            Reports
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="w-5/6 p-6 overflow-y-auto">
        {/* Overview Dashboard */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <FaUsers className="text-3xl text-blue-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <FaFileUpload className="text-3xl text-green-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Total Materials</p>
                    <p className="text-2xl font-bold">{stats.totalMaterials}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <FaComments className="text-3xl text-purple-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Forum Posts</p>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-3xl text-red-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Complaints</p>
                    <p className="text-2xl font-bold">{stats.totalComplaints}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <FaCog className="text-3xl text-orange-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab("materials")}
                  className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaFileUpload className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">Moderate Materials</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("forum")}
                  className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <FaComments className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">Moderate Forum</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("complaints")}
                  className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaExclamationTriangle className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">Handle Complaints</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("reports")}
                  className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaChartBar className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">Generate Reports</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Materials Moderation */}
        {activeTab === "materials" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Materials Moderation</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading materials...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{material.title}</h3>
                        <p className="text-gray-600 mb-3">{material.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>By {material.uploadedBy}</span>
                          <span>{formatDate(material.createdAt)}</span>
                          <span>{material.campus} | {material.course}</span>
                          <span>Year {material.year} | Sem {material.semester}</span>
                          <span>{material.subject}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>👍 {material.likeCount || 0}</span>
                          <span>👎 {material.unlikeCount || 0}</span>
                          <span>⭐ {material.rating?.toFixed(1) || 0}</span>
                          <span>📥 {material.downloadCount || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDeleteMaterial(material._id)}
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

        {/* Forum Moderation */}
        {activeTab === "forum" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Forum Moderation</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading forum posts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>By {post.author}</span>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>{post.campus} | {post.course}</span>
                          <span>Year {post.year} | Sem {post.semester}</span>
                          <span>{post.subject}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>👍 {post.likes || 0}</span>
                          <span>👎 {post.dislikes || 0}</span>
                          <span>💬 {post.commentCount || 0}</span>
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
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEye />
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

        {/* Complaints Management */}
        {activeTab === "complaints" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Complaints Management</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading complaints...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{complaint.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Reported by: {complaint.reportedBy}</span>
                          <span>Against: {complaint.againstUser || complaint.againstMaterial}</span>
                          <span>{formatDate(complaint.createdAt)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Type:</strong> {complaint.type}</p>
                          <p><strong>Category:</strong> {complaint.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => fetchComplaintDetails(complaint)}
                          className="text-blue-500 hover:text-blue-700"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleResolveComplaint(complaint._id, 'resolved')}
                          className="text-green-500 hover:text-green-700"
                          title="Resolve"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => handleResolveComplaint(complaint._id, 'rejected')}
                          className="text-red-500 hover:text-red-700"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name || user.email}</h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Email: {user.email}</span>
                          <span>Role: {user.role}</span>
                          <span>Status: {user.status}</span>
                          <span>Joined: {formatDate(user.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📁 Materials: {user.materialsCount || 0}</span>
                          <span>💬 Posts: {user.postsCount || 0}</span>
                          <span>⭐ Rating: {user.averageRating?.toFixed(1) || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleBanUser(user._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Content Report */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Top Materials</h3>
                <div className="space-y-3">
                  {materials.slice(0, 5).map((material, index) => (
                    <div key={material._id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{index + 1}. {material.title}</p>
                        <p className="text-sm text-gray-500">{material.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{material.likeCount || 0} likes</p>
                        <p className="text-sm text-gray-500">{material.downloadCount || 0} downloads</p>
                      </div>
                    </div>
                  )        )}
      </div>

      {/* Complaint Detail Modal */}
      {showComplaintDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Complaint Details
                </h2>
                <button
                  onClick={() => {
                    setShowComplaintDetail(false);
                    setSelectedComplaint(null);
                    setComplaintDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {selectedComplaint && (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-bold mb-2">{selectedComplaint.title}</h3>
                    <p className="text-gray-600 mb-3">{selectedComplaint.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Type:</strong> {selectedComplaint.type}</p>
                        <p><strong>Category:</strong> {selectedComplaint.category}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            selectedComplaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedComplaint.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p><strong>Reported by:</strong> {selectedComplaint.reportedBy}</p>
                        <p><strong>Date:</strong> {formatDate(selectedComplaint.createdAt)}</p>
                        <p><strong>Target ID:</strong> {selectedComplaint.againstMaterial || selectedComplaint.againstUser || selectedComplaint.againstPost}</p>
                      </div>
                    </div>
                  </div>

                  {detailLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-4">Loading details...</p>
                    </div>
                  ) : complaintDetails ? (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        {selectedComplaint.type === 'material' && <FaBook className="mr-2" />}
                        {selectedComplaint.type === 'user' && <FaUser className="mr-2" />}
                        {selectedComplaint.type === 'forum_post' && <FaComments className="mr-2" />}
                        {selectedComplaint.type === 'material' ? 'Material Details' : 
                         selectedComplaint.type === 'user' ? 'User Details' : 'Forum Post Details'}
                      </h3>

                      {selectedComplaint.type === 'material' && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-3">{complaintDetails.title}</h4>
                          <p className="text-gray-600 mb-4">{complaintDetails.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><strong>Uploaded by:</strong> {complaintDetails.uploadedBy}</p>
                              <p><strong>Campus:</strong> {complaintDetails.campus}</p>
                              <p><strong>Course:</strong> {complaintDetails.course}</p>
                            </div>
                            <div>
                              <p><strong>Year:</strong> {complaintDetails.year}</p>
                              <p><strong>Semester:</strong> {complaintDetails.semester}</p>
                              <p><strong>Subject:</strong> {complaintDetails.subject}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span>👍 {complaintDetails.likeCount || 0} likes</span>
                            <span>👎 {complaintDetails.unlikeCount || 0} dislikes</span>
                            <span>⭐ {complaintDetails.rating?.toFixed(1) || 0} rating</span>
                            <span>📥 {complaintDetails.downloadCount || 0} downloads</span>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <p><strong>Uploaded:</strong> {formatDate(complaintDetails.createdAt)}</p>
                            <p><strong>File:</strong> {complaintDetails.fileName}</p>
                          </div>
                        </div>
                      )}

                      {selectedComplaint.type === 'user' && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-3">{complaintDetails.name || complaintDetails.email}</h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><strong>Email:</strong> {complaintDetails.email}</p>
                              <p><strong>Role:</strong> {complaintDetails.role}</p>
                              <p><strong>Status:</strong> {complaintDetails.status}</p>
                            </div>
                            <div>
                              <p><strong>Campus:</strong> {complaintDetails.campus}</p>
                              <p><strong>Course:</strong> {complaintDetails.course}</p>
                              <p><strong>Joined:</strong> {formatDate(complaintDetails.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span>📁 {complaintDetails.materialsCount || 0} materials</span>
                            <span>💬 {complaintDetails.postsCount || 0} posts</span>
                            <span>⭐ {complaintDetails.averageRating?.toFixed(1) || 0} avg rating</span>
                          </div>
                          
                          {complaintDetails.bio && (
                            <div className="text-sm text-gray-600">
                              <p><strong>Bio:</strong> {complaintDetails.bio}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedComplaint.type === 'forum_post' && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-3">{complaintDetails.title}</h4>
                          <p className="text-gray-600 mb-4">{complaintDetails.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><strong>Author:</strong> {complaintDetails.author}</p>
                              <p><strong>Campus:</strong> {complaintDetails.campus}</p>
                              <p><strong>Course:</strong> {complaintDetails.course}</p>
                            </div>
                            <div>
                              <p><strong>Year:</strong> {complaintDetails.year}</p>
                              <p><strong>Semester:</strong> {complaintDetails.semester}</p>
                              <p><strong>Subject:</strong> {complaintDetails.subject}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span>👍 {complaintDetails.likes || 0} likes</span>
                            <span>👎 {complaintDetails.dislikes || 0} dislikes</span>
                            <span>💬 {complaintDetails.commentCount || 0} comments</span>
                          </div>
                          
                          {complaintDetails.tags && complaintDetails.tags.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Tags:</p>
                              <div className="flex flex-wrap gap-2">
                                {complaintDetails.tags.map((tag, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-500">
                            <p><strong>Posted:</strong> {formatDate(complaintDetails.createdAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaSearch className="text-4xl mx-auto mb-4 text-gray-300" />
                      <p>No details available for this complaint</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
              
              {/* Campus Analytics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Materials by Campus</h3>
                <div className="space-y-3">
                  {['Malabe', 'Kandy', 'Matara', 'Jaffna'].map((campus) => {
                    const count = materials.filter(m => m.campus === campus).length;
                    return (
                      <div key={campus} className="flex justify-between items-center">
                        <span className="font-medium">{campus}</span>
                        <span className="text-blue-600 font-bold">{count} materials</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Subject Analytics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Materials by Subject</h3>
                <div className="space-y-3">
                  {['Mathematics', 'Physics', 'Programming', 'OOP', 'DSA'].map((subject) => {
                    const count = materials.filter(m => m.subject === subject).length;
                    return (
                      <div key={subject} className="flex justify-between items-center">
                        <span className="font-medium">{subject}</span>
                        <span className="text-green-600 font-bold">{count} materials</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Forum Analytics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Forum Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Posts</span>
                    <span className="text-purple-600 font-bold">{forumPosts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Comments</span>
                    <span className="text-purple-600 font-bold">
                      {forumPosts.reduce((sum, post) => sum + (post.commentCount || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Likes</span>
                    <span className="text-purple-600 font-bold">
                      {forumPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMAdminDashboard;
