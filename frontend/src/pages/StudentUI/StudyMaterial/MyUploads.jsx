import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaThumbsUp, FaThumbsDown, FaStar, FaChartBar, FaPlus } from "react-icons/fa";

const MyUploadsPage = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
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
            const response = await fetch('http://localhost:5001/api/study-materials/all');
            const data = await response.json();
            // Filter for current user's uploads (using student1 as example)
            const myUploads = data.filter(material => material.uploadedBy === 'student1');
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
        setEditingMaterial(material);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Uploads</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                            <FaChartBar />
                            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <FaPlus />
                            Upload New
                        </button>
                    </div>
                </div>

                {/* Analytics Section */}
                {showAnalytics && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Analytics</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalUploads}</div>
                                <div className="text-gray-600">Total Uploads</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">{analytics.totalLikes}</div>
                                <div className="text-gray-600">Total Likes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.totalDownloads}</div>
                                <div className="text-gray-600">Total Downloads</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-600 mb-2">{analytics.averageRating.toFixed(1)}</div>
                                <div className="text-gray-600">Average Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {analytics.topPerforming ? analytics.topPerforming.score : 0}
                                </div>
                                <div className="text-gray-600">Top Score</div>
                            </div>
                        </div>

                        {analytics.topPerforming && (
                            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                                <h3 className="font-bold text-gray-800 mb-2">Top Performing Material:</h3>
                                <p className="text-gray-600">{analytics.topPerforming.title}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span>👍 {analytics.topPerforming.likeCount || 0} likes</span>
                                    <span>📥 {analytics.topPerforming.downloadCount || 0} downloads</span>
                                    <span>⭐ {analytics.topPerforming.rating?.toFixed(1) || 0} rating</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Materials List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your uploads...</p>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Uploads Yet</h3>
                        <p className="text-gray-600 mb-6">Start sharing your study materials with the community!</p>
                        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                            Upload Your First Material
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {materials.map((material) => (
                            <div key={material._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Material Preview */}
                                <div className="h-48 bg-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📄</div>
                                        <p className="text-gray-500 text-sm">{material.title}</p>
                                    </div>
                                </div>
                                
                                {/* Material Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{material.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                                    
                                    <div className="text-xs text-gray-500 mb-3">
                                        <p>Campus: {material.campus}</p>
                                        <p>Course: {material.course} | Year: {material.year} | Semester: {material.semester}</p>
                                        <p>Subject: {material.subject}</p>
                                        <p>Uploaded: {formatDate(material.createdAt)}</p>
                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                                        <span>👍 {material.likeCount || 0}</span>
                                        <span>👎 {material.unlikeCount || 0}</span>
                                        <span>⭐ {material.rating?.toFixed(1) || 0}</span>
                                        <span>📥 {material.downloadCount || 0}</span>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleEdit(material)}
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        
                                        <button
                                            onClick={() => handleDelete(material._id)}
                                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                        
                                        <button className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors duration-200">
                                            <FaEye />
                                            View
                                        </button>
                                        
                                        {material.fileUrl && (
                                            <button className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors duration-200">
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
    );
};

export default MyUploadsPage;
