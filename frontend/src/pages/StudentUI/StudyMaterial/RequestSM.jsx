// SM - Request Study Materials Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const Request = ({ user, setUser }) => {
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
        console.log('System data loaded:', data.data);
        console.log('Available campuses:', data.data.campuses?.map(c => c.name));
        console.log('Available years:', data.data.years?.map(y => y.year));
        console.log('Available semesters:', data.data.semesters?.map(s => s.semester));
        setSystemData(data.data);
      } else {
        console.error('Failed to load system data:', data);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setSystemDataLoading(false);
    }
  };

  // Load system data on component mount
  useEffect(() => {
    fetchSystemData();
  }, []);

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

    // Client-side validation
    if (!formData.title.trim()) {
      setError('Material title is required');
      setLoading(false);
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }
    if (!formData.campus.trim()) {
      setError('Campus is required');
      setLoading(false);
      return;
    }
    if (!formData.course.trim()) {
      setError('Course is required');
      setLoading(false);
      return;
    }
    if (!formData.year.trim()) {
      setError('Year is required');
      setLoading(false);
      return;
    }
    if (!formData.semester.trim()) {
      setError('Semester is required');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        ...formData,
        requestedBy: 'student1', // TODO: Get from auth context
        status: 'pending'
      };
      
      console.log('Sending request data:', requestData);
      
      const response = await fetch('http://localhost:5001/api/study-materials/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/RequestedSM', { 
          state: { 
            newRequest: result,
            message: 'Request submitted successfully!' 
          } 
        });
      } else {
        const errorData = await response.json();
        console.error('Request submission failed:', errorData);
        console.error('Request data sent:', requestData);
        setError(errorData.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="max-w-full mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FaPaperPlane className="text-xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Request Study Material</h1>
                  <p className="text-sm text-gray-600">Let us know what study material you need</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/RequestedSM')}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                <FaArrowLeft />
                View Requests
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Landscape Form */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-white">
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Left Column - Basic Request Info */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaBook className="text-orange-600 mr-2" />
                          <label className="text-base font-semibold text-gray-900">
                            Material Title *
                          </label>
                        </div>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          placeholder="e.g., Advanced Calculus Notes, Data Structures Lab Manual"
                          required
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaBook className="text-orange-600 mr-2" />
                          <label className="text-base font-semibold text-gray-900">
                            Subject *
                          </label>
                        </div>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                          required
                          disabled={systemDataLoading}
                        >
                          <option value="">{systemDataLoading ? "Loading..." : "Select Subject"}</option>
                            {systemData.subjects && systemData.subjects.length > 0 ? (
                              systemData.subjects.map((subjectOption) => (
                                <option key={subjectOption._id} value={subjectOption.name}>
                                  {subjectOption.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="Programming">Programming</option>
                                <option value="Database Systems">Database Systems</option>
                                <option value="Data Structures">Data Structures</option>
                                <option value="Algorithms">Algorithms</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile Development">Mobile Development</option>
                              </>
                            )}
                        </select>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <label className="text-base font-semibold text-gray-900">
                            Description *
                          </label>
                        </div>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          placeholder="Describe the specific material you need, including topics, chapters, or any other relevant details..."
                          required
                        />
                      </div>
                    </div>

                    {/* Right Column - Academic Information */}
                    <div className="space-y-6">

                      {/* Academic Information Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Campus */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Campus *
                            </label>
                          </div>
                          <select
                            name="campus"
                            value={formData.campus}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Campus"}</option>
                            {systemData.campuses && systemData.campuses.length > 0 ? (
                              systemData.campuses.map((campusItem) => (
                                <option key={campusItem._id} value={campusItem.name}>
                                  {campusItem.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="Malabe">Malabe Campus</option>
                                <option value="Kandy">Kandy Campus</option>
                                <option value="Matara">Matara Campus</option>
                                <option value="Jaffna">Jaffna Campus</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Course */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaGraduationCap className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Course *
                            </label>
                          </div>
                          <select
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Course"}</option>
                            {systemData.courses && systemData.courses.length > 0 ? (
                              systemData.courses.map((courseItem) => (
                                <option key={courseItem._id} value={courseItem.name}>
                                  {courseItem.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="Cyber Security">Cyber Security</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Year */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Year *
                            </label>
                          </div>
                          <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Year"}</option>
                            {systemData.years && systemData.years.length > 0 ? (
                              systemData.years.map((yearItem) => (
                                <option key={yearItem._id} value={yearItem.year.toString()}>
                                  {yearItem.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Semester */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Semester *
                            </label>
                          </div>
                          <select
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Semester"}</option>
                            {systemData.semesters && systemData.semesters.length > 0 ? (
                              systemData.semesters.map((semesterItem) => (
                                <option key={semesterItem._id} value={semesterItem.semester.toString()}>
                                  {semesterItem.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      {/* Urgency */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <label className="text-base font-semibold text-gray-900">
                            Urgency Level
                          </label>
                        </div>
                        <select
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        >
                          <option value="low">Low - Can wait</option>
                          <option value="normal">Normal - Within a week</option>
                          <option value="high">High - Need within 2-3 days</option>
                          <option value="urgent">Urgent - Need immediately</option>
                        </select>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting Request...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <FaPaperPlane className="mr-2" />
                              Submit Request
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Request;
