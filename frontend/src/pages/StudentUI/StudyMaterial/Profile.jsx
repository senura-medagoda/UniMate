import React, { useState } from "react";
import { FaUser, FaEnvelope, FaGraduationCap, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const ProfilePage = ({ user, setUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Student User",
        email: "student@example.com",
        campus: "Malabe",
        course: "Information Technology",
        year: "2",
        semester: "1",
        bio: "Passionate student sharing knowledge and learning from the community.",
        profilePic: "https://via.placeholder.com/150"
    });

    const [editForm, setEditForm] = useState(profile);

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);
        // TODO: Save to backend
    };

    const handleCancel = () => {
        setEditForm(profile);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <>
            <Navbar user={user} setUser={setUser} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <FaEdit />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                <FaSave />
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <FaTimes />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-orange-900 to-orange-700 text-white p-8">
                        <div className="flex items-center gap-6">
                            <img
                                src={profile.profilePic}
                                alt="Profile"
                                className="h-24 w-24 rounded-full border-4 border-white"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{profile.name}</h2>
                                <p className="text-orange-200">{profile.email}</p>
                                <p className="text-orange-200">{profile.campus} Campus</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaUser />
                                    Personal Information
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profile.name}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                            <FaEnvelope />
                                            Email
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profile.email}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Bio
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                value={editForm.bio}
                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profile.bio}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaGraduationCap />
                                    Academic Information
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-medium text-gray-600 mb-1">
                                            <FaMapMarkerAlt />
                                            Campus
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editForm.campus}
                                                onChange={(e) => handleInputChange('campus', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="Malabe">Malabe</option>
                                                <option value="Kandy">Kandy</option>
                                                <option value="Matara">Matara</option>
                                                <option value="Jaffna">Jaffna</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-800">{profile.campus}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Course
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editForm.course}
                                                onChange={(e) => handleInputChange('course', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <p className="text-gray-800">{profile.course}</p>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Year
                                            </label>
                                            {isEditing ? (
                                                <select
                                                    value={editForm.year}
                                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="1">Year 1</option>
                                                    <option value="2">Year 2</option>
                                                    <option value="3">Year 3</option>
                                                    <option value="4">Year 4</option>
                                                </select>
                                            ) : (
                                                <p className="text-gray-800">Year {profile.year}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Semester
                                            </label>
                                            {isEditing ? (
                                                <select
                                                    value={editForm.semester}
                                                    onChange={(e) => handleInputChange('semester', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="1">Semester 1</option>
                                                    <option value="2">Semester 2</option>
                                                </select>
                                            ) : (
                                                <p className="text-gray-800">Semester {profile.semester}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    Change Password
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                                    Update Profile Picture
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default ProfilePage;
