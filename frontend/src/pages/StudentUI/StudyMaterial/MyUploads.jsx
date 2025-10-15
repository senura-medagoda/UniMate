import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaThumbsUp, FaThumbsDown, FaStar, FaChartBar, FaPlus, FaUpload, FaBook, FaGraduationCap, FaCalendar, FaTag, FaArrowLeft } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const MyUploadsPage = ({ user, setUser }) => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        campus: '',
        course: '',
        year: '',
        semester: '',
        subject: '',
        keywords: ''
    });
    const [analytics, setAnalytics] = useState({
        totalUploads: 0,
        totalLikes: 0,
        totalDownloads: 0,
        averageRating: 0,
        topPerforming: null
    });

    // Fetch user's uploaded materials
    const fetchMyUploads = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('studentToken');
            if (!token) {
                console.error('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5001/api/study-materials/my-uploads', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch uploads');
            }
            
            const myUploads = await response.json();
            setMaterials(myUploads);
            
            // Calculate analytics
            const totalLikes = myUploads.reduce((sum, material) => sum + (material.likeCount || 0), 0);
            const totalDownloads = myUploads.reduce((sum, material) => sum + (material.downloadCount || 0), 0);
            const totalRating = myUploads.reduce((sum, material) => sum + (material.rating || 0), 0);
            const averageRating = myUploads.length > 0 ? totalRating / myUploads.length : 0;
            
            const topPerforming = myUploads.reduce((top, material) => {
                const score = (material.likeCount || 0) + (material.downloadCount || 0) * 2;
                return score > (top?.score || 0) ? { ...material, score } : top;
            }, null);

            setAnalytics({
                totalUploads: myUploads.length,
                totalLikes,
                totalDownloads,
                averageRating,
                topPerforming
            });
        } catch (error) {
            console.error('Error fetching uploads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyUploads();
    }, []);

    const handleDelete = async (materialId) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        
        try {
            const response = await fetch(`http://localhost:5001/api/study-materials/${materialId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                fetchMyUploads();
            }
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    const handleEdit = (material) => {
        // Set the material being edited and populate form data
        setEditingMaterial(material);
        setEditFormData({
            title: material.title || '',
            description: material.description || '',
            campus: material.campus || '',
            course: material.course || '',
            year: material.year || '',
            semester: material.semester || '',
            subject: material.subject || '',
            keywords: material.keywords ? material.keywords.join(', ') : ''
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = async () => {
        if (!editingMaterial) return;

        try {
            const token = localStorage.getItem('studentToken');
            if (!token) {
                alert('Authentication required');
                return;
            }

            const response = await fetch(`http://localhost:5001/api/study-materials/${editingMaterial._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                alert('Material updated successfully!');
                setEditingMaterial(null);
                fetchMyUploads(); // Refresh the list
            } else {
                alert('Failed to update material');
            }
        } catch (error) {
            console.error('Error updating material:', error);
            alert('Error updating material');
        }
    };

    const handleCancelEdit = () => {
        setEditingMaterial(null);
        setEditFormData({
            title: '',
            description: '',
            campus: '',
            course: '',
            year: '',
            semester: '',
            subject: '',
            keywords: ''
        });
    };

    const handleDownload = async (material) => {
        try {
            // If there are multiple files, download the first one
            const fileUrl = material.fileUrl || (material.fileUrls && material.fileUrls[0]);
            
            if (!fileUrl) {
                alert('No file available for download');
                return;
            }

            // Create a temporary link to download the file
            const link = document.createElement('a');
            link.href = `http://localhost:5001${fileUrl}`;
            link.download = material.title || 'study-material';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Track download in backend
            const token = localStorage.getItem('studentToken');
            if (token) {
                await fetch(`http://localhost:5001/api/study-materials/${material._id}/download`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            // Download functionality works, no need to show alert
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
        <Navbar user={user} setUser={setUser}/>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
           

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            <FaChartBar />
                            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                        </button>
                        <button 
                            onClick={() => window.location.href = '/UploadSM'}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            <FaPlus />
                            Upload New
                        </button>
                    </div>
                </div>

                {/* Analytics Section */}
                {showAnalytics && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">Upload Analytics</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                                <div className="text-4xl font-bold text-blue-600 mb-2">{analytics.totalUploads}</div>
                                <div className="text-gray-700 font-medium">Total Uploads</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                                <div className="text-4xl font-bold text-green-600 mb-2">{analytics.totalLikes}</div>
                                <div className="text-gray-700 font-medium">Total Likes</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                                <div className="text-4xl font-bold text-purple-600 mb-2">{analytics.totalDownloads}</div>
                                <div className="text-gray-700 font-medium">Total Downloads</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
                                <div className="text-4xl font-bold text-yellow-600 mb-2">{analytics.averageRating.toFixed(1)}</div>
                                <div className="text-gray-700 font-medium">Average Rating</div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                                <div className="text-4xl font-bold text-orange-600 mb-2">
                                    {analytics.topPerforming ? analytics.topPerforming.score : 0}
                                </div>
                                <div className="text-gray-700 font-medium">Top Score</div>
                            </div>
                        </div>

                        {analytics.topPerforming && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">🏆 Top Performing Material</h3>
                                <p className="text-gray-700 text-lg mb-4">{analytics.topPerforming.title}</p>
                                <div className="flex gap-6 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <FaThumbsUp className="mr-2 text-green-500" />
                                        {analytics.topPerforming.likeCount || 0} likes
                                    </span>
                                    <span className="flex items-center">
                                        <FaDownload className="mr-2 text-blue-500" />
                                        {analytics.topPerforming.downloadCount || 0} downloads
                                    </span>
                                    <span className="flex items-center">
                                        <FaStar className="mr-2 text-yellow-500" />
                                        {analytics.topPerforming.rating?.toFixed(1) || 0} rating
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Materials List */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading your uploads...</p>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaUpload className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Uploads Yet</h3>
                        <p className="text-gray-600 text-lg mb-6">Start sharing your study materials with the community!</p>
                        <button 
                            onClick={() => window.location.href = '/UploadSM'}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Upload Your First Material
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {materials.map((material) => (
                            <div key={material._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                {/* Material Preview */}
                                <div className="h-48 bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10"></div>
                                    <div className="text-center relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FaBook className="text-2xl text-white" />
                                        </div>
                                        <p className="text-orange-800 font-semibold text-lg">{material.subject}</p>
                                    </div>
                                </div>
                                
                                {/* Material Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">{material.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
                                    
                                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <FaGraduationCap className="w-4 h-4 mr-2 text-orange-500" />
                                            <span>{material.campus}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBook className="w-4 h-4 mr-2 text-orange-500" />
                                            <span>{material.course} • Year {material.year} • Sem {material.semester}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendar className="w-4 h-4 mr-2 text-orange-500" />
                                            <span>Uploaded: {formatDate(material.createdAt)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="flex justify-between text-sm text-gray-600 mb-6">
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <FaThumbsUp className="mr-1 text-green-500" />
                                                {material.likeCount || 0}
                                            </span>
                                            <span className="flex items-center">
                                                <FaThumbsDown className="mr-1 text-red-500" />
                                                {material.unlikeCount || 0}
                                            </span>
                                            <span className="flex items-center">
                                                <FaStar className="mr-1 text-yellow-500" />
                                                {material.rating?.toFixed(1) || 0}
                                            </span>
                                            <span className="flex items-center">
                                                <FaDownload className="mr-1 text-blue-500" />
                                                {material.downloadCount || 0}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleEdit(material)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDelete(material._id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                        
                                        {(material.fileUrl || (material.fileUrls && material.fileUrls.length > 0)) && (
                                            <button 
                                                onClick={() => handleDownload(material)}
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-all duration-200 hover:shadow-lg"
                                            >
                                                <FaDownload />
                                                Download
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Edit Modal */}
        {editingMaterial && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Material</h2>
                            <button
                                onClick={handleCancelEdit}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Academic Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Campus */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Campus *
                                    </label>
                                    <input
                                        type="text"
                                        name="campus"
                                        value={editFormData.campus}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Course */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course *
                                    </label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={editFormData.course}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Year *
                                    </label>
                                    <input
                                        type="text"
                                        name="year"
                                        value={editFormData.year}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Semester */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Semester *
                                    </label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={editFormData.semester}
                                        onChange={handleEditFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={editFormData.subject}
                                    onChange={handleEditFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keywords
                                </label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={editFormData.keywords}
                                    onChange={handleEditFormChange}
                                    placeholder="e.g. calculus, algebra, programming (comma separated)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default MyUploadsPage;
