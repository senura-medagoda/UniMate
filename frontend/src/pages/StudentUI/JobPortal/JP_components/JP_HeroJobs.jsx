// components/JP_HeroJobs.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import JobDetailsPopup from './JobDetailsPopup';

const JP_HeroJobs = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    category: '',
    experience: ''
  });
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log('Fetching jobs from API...');
        console.log('User session:', user);
        
        // Get token from localStorage
        const token = localStorage.getItem('studentToken');
        
        const response = await api.get('/job/', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          // Transform the data to match the expected format
          const transformedJobs = response.data.data.map(job => {
            try {
              return {
                id: job._id || 'unknown',
                title: job.title || 'Untitled Job',
                company: job.department || 'Unknown Department',
                type: job.jobtype || 'Not specified',
                location: job.location || 'Not specified',
                posted: formatPostedDate(job.createdAt),
                description: job.description || 'No description available',
                pay: job.compensation || 'Not specified',
                deadline: formatDeadline(job.deadline),
                isSaved: false,
                // Additional fields from database
                responsibilities: job.responsibilities || '',
                requirements: job.requirements || '',
                benefits: job.benefits || '',
                status: job.status || 'unknown',
                postedby: job.postedby || 'unknown'
              };
            } catch (error) {
              console.error('Error transforming job:', job, error);
              return null;
            }
          }).filter(job => job !== null); // Remove any null entries
          
          console.log('Transformed jobs:', transformedJobs);
          setJobs(transformedJobs);
          setFilteredJobs(transformedJobs);
          setError(null);
        } else {
          console.error('API returned success: false');
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('Error config:', err.config);
        
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
          setError('Cannot connect to server. Please make sure the backend is running on port 5001.');
        } else if (err.response?.status === 404) {
          setError('API endpoint not found. Please check the server configuration.');
        } else {
          setError(`Failed to load jobs: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper function to format posted date
  const formatPostedDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return `${Math.ceil(diffDays / 30)} months ago`;
    } catch (error) {
      console.error('Error formatting posted date:', error);
      return 'Unknown';
    }
  };

  // Helper function to format deadline
  const formatDeadline = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting deadline:', error);
      return 'Invalid date';
    }
  };

  // Filter jobs based on search term and filters
  const filterJobs = () => {
    let filtered = [...jobs];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by job type
    if (filters.jobType) {
      filtered = filtered.filter(job => 
        job.type.toLowerCase() === filters.jobType.toLowerCase()
      );
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by category (department)
    if (filters.category) {
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  // Apply filters whenever search term or filters change
  useEffect(() => {
    filterJobs();
  }, [searchTerm, filters, jobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    filterJobs();
    console.log('Searching for:', searchTerm, filters);
  };

  const handleApply = (jobId) => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to apply for jobs');
      return;
    }
    
    console.log('=== JP_HeroJobs DEBUG ===');
    console.log('User object in JP_HeroJobs:', user);
    console.log('User s_status:', user?.s_status);
    console.log('========================');
    
    setSelectedJobId(jobId);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedJobId(null);
  };

  const handleApplicationSuccess = () => {
    // Optionally refresh the jobs list or show a success message
    console.log('Application submitted successfully');
  };

  const toggleSaveJob = (jobId) => {
    // Check if user is logged in
    if (!user) {
      alert('Please log in to save jobs');
      return;
    }
    
    // In a real app, this would update the backend
    console.log(`User ${user.name || user.email} toggling save for job #${jobId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-2">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            Find Your Perfect{' '}
            <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Student Job
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Browse hundreds of on-campus jobs, internships, and local opportunities designed for students.
            Start building your career today.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:gap-6">
            {/* Main Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <label className="label pb-2">
                  <span className="label-text font-medium text-gray-700">What are you looking for?</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    className="input input-bordered w-full pl-12 h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="btn btn-primary w-full sm:w-auto h-12 px-8 border-0 text-white font-semibold" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Jobs
                </button>
                {(searchTerm || filters.jobType || filters.location || filters.category || filters.experience) && (
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ jobType: '', location: '', category: '', experience: '' });
                    }}
                    className="btn btn-outline h-12 px-4 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <div>
                <label className="label pb-2">
                  <span className="label-text font-medium text-gray-700">Job Type</span>
                </label>
                <select 
                  className="select select-bordered w-full h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  value={filters.jobType}
                  onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="on-campus">On-Campus</option>
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-Time</option>
                  <option value="work-study">Work-Study</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              
              <div>
                <label className="label pb-2">
                  <span className="label-text font-medium text-gray-700">Location</span>
                </label>
                <select 
                  className="select select-bordered w-full h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  <option value="kandy">Kandy</option>
                  <option value="matale">Matale</option>
                  <option value="nuwara eliya">Nuwara Eliya</option>
                  <option value="galle">Galle</option>
                  <option value="matara">Matara</option>
                  <option value="hambantota">Hambantota</option>
                  <option value="jaffna">Jaffna</option>
                  <option value="kilinochchi">Kilinochchi</option>
                  <option value="mannar">Mannar</option>
                  <option value="mullaitivu">Mullaitivu</option>
                  <option value="vavuniya">Vavuniya</option>
                  <option value="batticaloa">Batticaloa</option>
                  <option value="ampara">Ampara</option>
                  <option value="trincomalee">Trincomalee</option>
                  <option value="kurunegala">Kurunegala</option>
                  <option value="puttalam">Puttalam</option>
                  <option value="anuradhapura">Anuradhapura</option>
                  <option value="polonnaruwa">Polonnaruwa</option>
                  <option value="badulla">Badulla</option>
                  <option value="moneragala">Moneragala</option>
                  <option value="ratnapura">Ratnapura</option>
                  <option value="kegalle">Kegalle</option>
                </select>
              </div>
              
              <div>
                <label className="label pb-2">
                  <span className="label-text font-medium text-gray-700">Category</span>
                </label>
                <select 
                  className="select select-bordered w-full h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">All Categories</option>
                  <option value="administrative">Administrative</option>
                  <option value="it">IT & Tech</option>
                  <option value="research">Research</option>
                  <option value="tutoring">Tutoring</option>
                  <option value="hospitality">Hospitality</option>
                </select>
              </div>
              
              <div>
                <label className="label pb-2">
                  <span className="label-text font-medium text-gray-700">Experience Level</span>
                </label>
                <select 
                  className="select select-bordered w-full h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                >
                  <option value="">Any Experience</option>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Some Experience</option>
                  <option value="experienced">Experienced</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            <span style={{ color: '#fc944c' }}>{filteredJobs.length}</span> Available Jobs
            {filteredJobs.length !== jobs.length && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                (filtered from {jobs.length} total)
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Sort by:</span>
            <select className="select select-bordered select-sm h-10 text-sm border-gray-300 focus:ring-2 transition-all duration-200" style={{ '--tw-ring-color': '#fc944c', '--tw-border-opacity': '1', 'border-color': '#fc944c' }}>
              <option>Most Recent</option>
              <option>Deadline</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {jobs.length === 0 ? 'No Jobs Available' : 'No Jobs Found'}
            </h3>
            <p className="text-gray-500">
              {jobs.length === 0 
                ? 'There are currently no job postings available. Check back later for new opportunities!'
                : 'Try adjusting your search criteria or filters to find more jobs.'
              }
            </p>
            {jobs.length > 0 && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ jobType: '', location: '', category: '', experience: '' });
                }}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredJobs.map(job => (
            <div key={job.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm font-medium truncate">{job.company}</span>
                    </div>
                  </div>
                  <button 
                    className={`ml-3 p-2 rounded-full transition-colors ${job.isSaved ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                    onClick={() => toggleSaveJob(job.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={job.isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {job.type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {job.pay}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3 flex-grow">
                  {job.description}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Posted {job.posted}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Apply by: {job.deadline}
                    </div>
                  </div>
                  <button 
                    className="w-full sm:w-auto text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                    style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                    onClick={() => handleApply(job.id)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <div className="btn-group">
            <button className="btn btn-outline btn-disabled">Previous</button>
            <button className="btn btn-outline btn-active">1</button>
            <button className="btn btn-outline">2</button>
            <button className="btn btn-outline">3</button>
            <button className="btn btn-outline">Next</button>
          </div>
        </div>
      </div>

      {/* Job Details Popup */}
      <JobDetailsPopup
        jobId={selectedJobId}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        user={user}
        onApplicationSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JP_HeroJobs;