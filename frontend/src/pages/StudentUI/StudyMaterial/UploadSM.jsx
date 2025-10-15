// SM - Upload Study Materials Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFile, FaBook, FaGraduationCap, FaCalendar, FaTag, FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaTimes } from "react-icons/fa";
import Navbar from "./Components/Navbar.jsx";

const Upload = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
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
  const [isDragOver, setIsDragOver] = useState(false);
  
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

  // Load system data on component mount
  useEffect(() => {
    fetchSystemData();
  }, []);

  // Check for edit data and pre-fill form (wait for system data to load)
  useEffect(() => {
    // Only proceed if system data has loaded
    if (systemDataLoading) return;
    
    const editData = localStorage.getItem('editMaterialData');
    if (editData) {
      try {
        const data = JSON.parse(editData);
        console.log('Edit data found:', data);
        
        // Set all form values
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCampus(data.campus || '');
        setCourse(data.course || '');
        setYear(data.year || '');
        setSemester(data.semester || '');
        setSubject(data.subject || '');
        setKeywords(data.keywords || '');
        
        console.log('Form values set for editing');
        
        // Clear the edit data after a short delay to ensure state updates
        setTimeout(() => {
          localStorage.removeItem('editMaterialData');
          console.log('Edit data cleared from localStorage');
        }, 1000);
      } catch (error) {
        console.error('Error parsing edit data:', error);
        localStorage.removeItem('editMaterialData');
      }
    }
  }, [systemDataLoading]); // Depend on systemDataLoading to ensure system data is loaded first

  // Debug: Log files state changes
  useEffect(() => {
    console.log('Files state updated:', files);
    console.log('Number of files in state:', files.length);
  }, [files]);

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const addFiles = (newFiles) => {
    setFiles(prevFiles => {
      // Filter out duplicates based on file name and size
      const existingFiles = prevFiles.map(f => `${f.name}-${f.size}`);
      const uniqueNewFiles = newFiles.filter(file => 
        !existingFiles.includes(`${file.name}-${file.size}`)
      );
      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', droppedFiles);
    console.log('Number of dropped files:', droppedFiles.length);
    console.log('Dropped file names:', droppedFiles.map(f => f.name));
    // Add dropped files with duplicate prevention
    addFiles(droppedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('=== UPLOAD DEBUG START ===');
      console.log('Files to upload:', files);
      console.log('Number of files:', files.length);
      console.log('Form data:', {
        title, description, campus, course, year, semester, subject, keywords
      });
      
      // Validate required fields
      if (!title.trim()) {
        setError("Title is required");
        setLoading(false);
        return;
      }
      if (!subject.trim()) {
        setError("Subject is required");
        setLoading(false);
        return;
      }
      if (files.length === 0) {
        setError("Please select at least one file");
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      
      // Append all files
      files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, 'Size:', file.size);
        formData.append(`file${index}`, file);
      });
      formData.append("fileCount", files.length);
      
      formData.append("title", title);
      formData.append("description", description);
      formData.append("campus", campus);
      formData.append("course", course);
      formData.append("year", year);
      formData.append("semester", semester);
      formData.append("subject", subject);
      formData.append("keywords", keywords);
      // uploadedBy will be set by the backend from the authenticated user
      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log('Sending request to:', 'http://localhost:5001/api/study-materials/upload');
      
      // Get authentication token
      const token = localStorage.getItem('studentToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5001/api/study-materials/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        alert('Study material uploaded successfully!');
        // Reset form
        setFiles([]);
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
        console.error('Upload failed:', errorData);
        setError(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('=== UPLOAD ERROR ===');
      console.error('Error uploading:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('=== UPLOAD DEBUG END ===');
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
                  <FaUpload className="text-xl text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Upload Study Material</h1>
                  <p className="text-sm text-gray-600">Share your study materials with the community</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/BrowseSM')}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
              >
                <FaArrowLeft />
                Back to Browse
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Landscape Form */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-white">
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center text-sm">
                <FaExclamationCircle className="mr-2 text-red-500" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Left Column - File Upload & Basic Info */}
                    <div className="space-y-6">
                      {/* File Upload */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FaFile className="text-orange-600 mr-2" />
                          <label className="text-base font-semibold text-gray-900">
                            File Upload *
                          </label>
                        </div>
                        
                        <div 
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                            isDragOver 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-300 hover:border-orange-400'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx"
                            onChange={(e) => {
                              console.log('Files selected:', e.target.files);
                              console.log('Number of files:', e.target.files.length);
                              console.log('Multiple attribute:', e.target.multiple);
                              const selectedFiles = Array.from(e.target.files);
                              console.log('File names:', selectedFiles.map(f => f.name));
                              console.log('Setting files state with:', selectedFiles.length, 'files');
                              // Add new files to existing files (with duplicate prevention)
                              addFiles(selectedFiles);
                              // Clear the input so the same files can be selected again
                              e.target.value = '';
                            }}
                            className="hidden"
                            id="file-upload"
                            multiple
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <FaUpload className="text-xl text-orange-600" />
                            </div>
                            <p className="text-base font-medium text-gray-900 mb-2">
                              {isDragOver 
                                ? "Drop files here" 
                                : files.length > 0 
                                  ? `${files.length} file${files.length > 1 ? 's' : ''} selected` 
                                  : "Click to upload files"
                              }
                            </p>
                            {files.length > 0 ? (
                              <p className="text-sm text-green-600 font-medium">
                                ✓ {files.length} file{files.length > 1 ? 's' : ''} ready
                              </p>
                            ) : (
                              <p className="text-sm text-red-600 font-medium">
                                ⚠ Select at least one file
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, JPG, PNG, DOCX, PPTX
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                console.log('Button clicked, triggering file input');
                                const fileInput = document.getElementById('file-upload');
                                console.log('File input element:', fileInput);
                                console.log('Multiple attribute:', fileInput?.multiple);
                                // Clear the input first to allow re-selection
                                if (fileInput) {
                                  fileInput.value = '';
                                  fileInput.click();
                                }
                              }}
                              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Select Files
                            </button>
                          </label>
                        </div>
                        
                        {/* Selected Files List */}
                        {files.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                              <button
                                type="button"
                                onClick={clearAllFiles}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                  <div className="flex items-center">
                                    <FaFile className="text-orange-500 mr-2 text-sm" />
                                    <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <FaTimes className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

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
                          placeholder="Enter a descriptive title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaFile className="text-orange-600 mr-2" />
                          <label className="text-base font-semibold text-gray-900">
                            Description *
                          </label>
                        </div>
                        <textarea
                          placeholder="Describe the content and topics covered"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          rows="3"
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
                            <FaGraduationCap className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Campus *
                            </label>
                          </div>
                          <select
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Campus"}</option>
                            {systemData.campuses.map((campusItem) => (
                              <option key={campusItem._id} value={campusItem.name}>
                                {campusItem.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Course */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaBook className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Course *
                            </label>
                          </div>
                          <select
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Course"}</option>
                            {systemData.courses.map((courseItem) => (
                              <option key={courseItem._id} value={courseItem.name}>
                                {courseItem.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Year */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaCalendar className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Year *
                            </label>
                          </div>
                          <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Year"}</option>
                            {systemData.years.map((yearItem) => (
                              <option key={yearItem._id} value={yearItem.year}>
                                {yearItem.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Semester */}
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <FaCalendar className="text-orange-600 mr-2" />
                            <label className="text-sm font-semibold text-gray-900">
                              Semester *
                            </label>
                          </div>
                          <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                            required
                            disabled={systemDataLoading}
                          >
                            <option value="">{systemDataLoading ? "Loading..." : "Select Semester"}</option>
                            {systemData.semesters.map((semesterItem) => (
                              <option key={semesterItem._id} value={semesterItem.semester}>
                                {semesterItem.name}
                              </option>
                            ))}
                          </select>
                        </div>
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
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
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

                      {/* Keywords */}
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FaTag className="text-orange-600 mr-2" />
                          <label className="text-base font-semibold text-gray-900">
                            Keywords
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. calculus, algebra, programming (comma separated)"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Separate keywords with commas for better searchability
                        </p>
                      </div>

                      {/* Upload Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading || files.length === 0}
                          className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
                            files.length === 0 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                          } ${loading ? 'from-gray-400 to-gray-400 cursor-not-allowed' : ''}`}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Uploading...
                            </>
                          ) : files.length === 0 ? (
                            <>
                              <FaUpload className="mr-2" />
                              Select Files to Upload
                            </>
                          ) : (
                            <>
                              <FaUpload className="mr-2" />
                              Upload Study Material ({files.length} file{files.length > 1 ? 's' : ''})
                            </>
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

export default Upload;