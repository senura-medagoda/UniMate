// Request.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Request = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    campus: "",
    course: "",
    year: "",
    semester: "",
    urgency: "normal"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5001/api/study-materials/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requestedBy: 'student1', // TODO: Get from auth context
          status: 'pending'
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Navigate to RequestedSM page to show the request
        navigate('/RequestedSM', { 
          state: { 
            newRequest: result,
            message: 'Request submitted successfully!' 
          } 
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit request');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Request Study Material</h1>
            <p className="text-gray-600">Let us know what study material you need and our community will help you find it!</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBook className="inline mr-2 text-orange-600" />
                Material Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Advanced Calculus Notes, Data Structures Lab Manual"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBook className="inline mr-2 text-orange-600" />
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Programming">Programming</option>
                <option value="OOP">Object-Oriented Programming</option>
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="Database">Database Management</option>
                <option value="Networking">Computer Networking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe the specific material you need, including topics, chapters, or any other relevant details..."
                required
              />
            </div>

            {/* Academic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-orange-600" />
                  Campus *
                </label>
                <select
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Campus</option>
                  <option value="Malabe">Malabe</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Matara">Matara</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGraduationCap className="inline mr-2 text-orange-600" />
                  Course *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Course</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-orange-600" />
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-orange-600" />
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                </select>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="low">Low - Can wait</option>
                <option value="normal">Normal - Within a week</option>
                <option value="high">High - Need within 2-3 days</option>
                <option value="urgent">Urgent - Need immediately</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaPaperPlane className="mr-2" />
                  Submit Request
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Your request will be visible to all students who can help fulfill it.</p>
            <p className="mt-2">
              <button 
                onClick={() => navigate('/RequestedSM')}
                className="text-orange-600 hover:text-orange-700 underline"
              >
                View All Requests
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
