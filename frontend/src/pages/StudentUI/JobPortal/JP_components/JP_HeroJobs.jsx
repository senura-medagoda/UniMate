// components/JP_HeroJobs.jsx
import React, { useState } from 'react';

const JP_HeroJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    category: '',
    experience: ''
  });

  // Sample job data
  const [jobs] = useState([
    {
      id: 1,
      title: 'Campus Tour Guide',
      company: 'Admissions Office',
      type: 'On-Campus',
      location: 'Main Campus',
      posted: '2 days ago',
      description: 'Lead campus tours for prospective students and families. Excellent communication skills required.',
      pay: '$12/hr',
      deadline: '2023-10-25',
      isSaved: false
    },
    {
      id: 2,
      title: 'Social Media Assistant',
      company: 'Marketing Department',
      type: 'Work-Study',
      location: 'Remote',
      posted: '1 day ago',
      description: 'Create content for university social media channels. Graphic design skills a plus.',
      pay: '$15/hr',
      deadline: '2023-10-24',
      isSaved: true
    },
    {
      id: 3,
      title: 'Math Tutor',
      company: 'Student Success Center',
      type: 'Part-Time',
      location: 'Learning Commons',
      posted: '3 days ago',
      description: 'Tutor students in introductory math courses. Must have completed Calculus II.',
      pay: '$13/hr',
      deadline: '2023-10-23',
      isSaved: false
    },
    {
      id: 4,
      title: 'Resident Advisor',
      company: 'Housing Services',
      type: 'On-Campus',
      location: 'Dormitories',
      posted: '4 days ago',
      description: 'Support students in residence halls and organize community activities.',
      pay: 'Room + Stipend',
      deadline: '2023-10-22',
      isSaved: false
    },
    {
      id: 5,
      title: 'Research Assistant - Computer Science',
      company: 'CS Department',
      type: 'Research',
      location: 'Tech Building',
      posted: '5 days ago',
      description: 'Assist professors with ongoing research projects. Python experience required.',
      pay: '$16/hr',
      deadline: '2023-10-28',
      isSaved: false
    },
    {
      id: 6,
      title: 'Cafeteria Staff',
      company: 'Food Services',
      type: 'Part-Time',
      location: 'Student Union',
      posted: '6 hours ago',
      description: 'Serve food and maintain cleanliness in campus dining facilities.',
      pay: '$11/hr',
      deadline: '2023-10-20',
      isSaved: false
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger an API call
    console.log('Searching for:', searchTerm, filters);
  };

  const handleApply = (jobId) => {
    // In a real app, this would open an application modal or page
    alert(`Applying for job #${jobId}`);
  };

  const toggleSaveJob = (jobId) => {
    // In a real app, this would update the backend
    console.log(`Toggling save for job #${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Find Your Perfect <span className="text-primary">Student Job</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse hundreds of on-campus jobs, internships, and local opportunities designed for students.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-base-100 p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="label">
                  <span className="label-text">What are you looking for?</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    className="input input-bordered w-full pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn btn-primary w-full md:w-auto">
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="label">
                  <span className="label-text">Job Type</span>
                </label>
                <select 
                  className="select select-bordered w-full"
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
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                  <option value="">All Locations</option>
                  <option value="main-campus">Main Campus</option>
                  <option value="north-campus">North Campus</option>
                  <option value="remote">Remote</option>
                  <option value="local">Local</option>
                </select>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select 
                  className="select select-bordered w-full"
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
                <label className="label">
                  <span className="label-text">Experience Level</span>
                </label>
                <select 
                  className="select select-bordered w-full"
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {jobs.length} Available Jobs
          </h2>
          <div className="flex items-center mt-2 md:mt-0">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <select className="select select-bordered select-sm">
              <option>Most Recent</option>
              <option>Deadline</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="card-title text-lg">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm">{job.company}</span>
                    </div>
                  </div>
                  <button 
                    className={`btn btn-ghost btn-sm btn-circle ${job.isSaved ? 'text-yellow-500' : 'text-gray-400'}`}
                    onClick={() => toggleSaveJob(job.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={job.isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-outline badge-primary">{job.type}</span>
                  <span className="badge badge-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="badge badge-outline badge-accent">{job.pay}</span>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm">{job.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-xs text-gray-500">
                    <div>Posted {job.posted}</div>
                    <div>Apply by: {job.deadline}</div>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApply(job.id)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
    </div>
  );
};

export default JP_HeroJobs;