import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFile, FaBook, FaGraduationCap, FaCalendar, FaTag, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const Upload = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campus, setCampus] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("campus", campus);
      formData.append("course", course);
      formData.append("year", year);
      formData.append("semester", semester);
      formData.append("subject", subject);
      formData.append("keywords", keywords);
      formData.append("uploadedBy", user?.email || user?.s_email || 'student123');

      const response = await fetch('http://localhost:5001/api/study-materials/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Study material uploaded successfully!');
        // Reset form
        setFile(null);
        setTitle("");
        setDescription("");
        setCampus("");
        setCourse("");
        setYear("");
        setSemester("");
        setSubject("");
        setKeywords("");
        // Navigate to browse page
        navigate('/BrowseSM');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaUpload className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Study Material</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Share your study materials with the community and help fellow students
              </p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Material Details</h2>
              <p className="text-gray-600 mt-2">Fill in the details about your study material</p>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                  <FaExclamationCircle className="mr-3 text-red-500" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaFile className="text-orange-600 mr-3" />
                    <label className="text-lg font-semibold text-gray-900">
                      File Upload *
                    </label>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUpload className="text-2xl text-orange-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {file ? file.name : "Click to upload file"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supported formats: PDF, JPG, PNG, DOCX, PPTX
                      </p>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaBook className="text-orange-600 mr-3" />
                    <label className="text-lg font-semibold text-gray-900">
                      Material Title *
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter a descriptive title for your material"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaFile className="text-orange-600 mr-3" />
                    <label className="text-lg font-semibold text-gray-900">
                      Description *
                    </label>
                  </div>
                  <textarea
                    placeholder="Describe the content, topics covered, and any additional notes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
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
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaBook className="text-orange-600 mr-3" />
                      <label className="text-lg font-semibold text-gray-900">
                        Course *
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. IT, Engineering, Business"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                      required
                    />
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
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
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
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                      required
                    >
                      <option value="">Select Semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
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
                  <input
                    type="text"
                    placeholder="e.g. Mathematics, Physics, Programming"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    required
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaTag className="text-orange-600 mr-3" />
                    <label className="text-lg font-semibold text-gray-900">
                      Keywords
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. calculus, algebra, programming, java (comma separated)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  />
                  <p className="text-sm text-gray-500">
                    Separate keywords with commas for better searchability
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-3" />
                        Upload Study Material
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;