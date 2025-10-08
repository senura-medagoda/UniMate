import React from "react";
import { FaGraduationCap, FaUsers, FaFileUpload, FaComments, FaChartLine } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const AboutPage = ({ user, setUser }) => {
    return (
        <>
        <Navbar user={user} setUser={setUser}/>
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-900 to-orange-700 text-white py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to UniMate
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Your comprehensive platform for sharing and discovering study materials across campuses
                    </p>
                    <div className="flex justify-center">
                        <img 
                            src="/Logo.png" 
                            alt="UniMate Logo" 
                            className="h-24 w-auto"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        What We Offer
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <FaFileUpload className="text-4xl text-orange-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Study Material Sharing</h3>
                            <p className="text-gray-600">
                                Upload and share your study materials, notes, and resources with fellow students across different campuses.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <FaComments className="text-4xl text-orange-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Academic Forum</h3>
                            <p className="text-gray-600">
                                Engage in meaningful discussions, ask questions, and collaborate with peers through our Reddit-style forum.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <FaChartLine className="text-4xl text-orange-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Analytics & Insights</h3>
                            <p className="text-gray-600">
                                Track your uploads, view engagement metrics, and understand which materials are most helpful to others.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <FaUsers className="text-4xl text-orange-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Community Building</h3>
                            <p className="text-gray-600">
                                Connect with students from different campuses, courses, and academic levels to build a supportive learning community.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <FaGraduationCap className="text-4xl text-orange-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Quality Control</h3>
                            <p className="text-gray-600">
                                Our admin team ensures all uploaded content meets academic standards and community guidelines.
                            </p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="text-4xl text-orange-600 mx-auto mb-4">📚</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Multi-Campus Support</h3>
                            <p className="text-gray-600">
                                Access materials from Malabe, Kandy, Matara, Jaffna, and other campuses all in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-orange-900 text-white py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Platform Statistics
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
                            <div className="text-orange-200">Study Materials</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                            <div className="text-orange-200">Active Users</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                            <div className="text-orange-200">Forum Discussions</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2">4</div>
                            <div className="text-orange-200">Campuses</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        How It Works
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Upload</h3>
                            <p className="text-gray-600">
                                Share your study materials, notes, and resources with the community.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Discover</h3>
                            <p className="text-gray-600">
                                Browse and search through materials uploaded by other students.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Engage</h3>
                            <p className="text-gray-600">
                                Like, comment, and participate in forum discussions to enhance learning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">
                        Get Started Today
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of students who are already benefiting from UniMate's collaborative learning platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors duration-200">
                            Start Sharing
                        </button>
                        <button className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-600 hover:text-white transition-colors duration-200">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
};

export default AboutPage;
