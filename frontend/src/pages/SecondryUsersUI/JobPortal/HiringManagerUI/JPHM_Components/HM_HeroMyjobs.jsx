import React from 'react'
import { useState } from 'react';

function HM_HeroMyjobs() {

  const [activeTab, setActiveTab] = useState('current');

  // dummy data -- Temp
  const [jobs] = useState({
    current: [
      {
        id: 1,
        title: 'Software Developer Intern',
        department: 'Computer Science',
        applications: 24,
        views: 156,
        datePosted: '2023-10-15',
        status: 'active',
        deadline: '2023-11-15'
      },
      {
        id: 2,
        title: 'Research Assistant - Biology',
        department: 'Biology Department',
        applications: 18,
        views: 132,
        datePosted: '2023-10-10',
        status: 'active',
        deadline: '2023-11-10'
      },
      {
        id: 3,
        title: 'Campus Tour Guide',
        department: 'Admissions Office',
        applications: 32,
        views: 245,
        datePosted: '2023-10-05',
        status: 'active',
        deadline: '2023-11-05'
      }
    ],
    pending: [
      {
        id: 4,
        title: 'IT Support Specialist',
        department: 'IT Services',
        applications: 0,
        views: 42,
        datePosted: '2023-10-20',
        status: 'pending',
        deadline: '2023-11-20'
      },
      {
        id: 5,
        title: 'Social Media Coordinator',
        department: 'Marketing',
        applications: 0,
        views: 28,
        datePosted: '2023-10-18',
        status: 'pending',
        deadline: '2023-11-18'
      }
    ],
    previous: [
      {
        id: 6,
        title: 'Library Assistant',
        department: 'University Library',
        applications: 45,
        views: 321,
        datePosted: '2023-09-01',
        status: 'closed',
        deadline: '2023-10-01',
        hired: 3
      },
      {
        id: 7,
        title: 'Math Tutor',
        department: 'Student Success Center',
        applications: 38,
        views: 287,
        datePosted: '2023-08-15',
        status: 'closed',
        deadline: '2023-09-15',
        hired: 2
      },
      {
        id: 8,
        title: 'Resident Advisor',
        department: 'Housing Services',
        applications: 67,
        views: 412,
        datePosted: '2023-08-01',
        status: 'closed',
        deadline: '2023-09-01',
        hired: 12
      }
    ]
  });

  const handleNewJob = () => {
    // In a real app, this would navigate to a job creation form
    alert('Opening new job form...');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="badge badge-success badge-sm">Active</span>;
      case 'pending':
        return <span className="badge badge-warning badge-sm">Pending Review</span>;
      case 'closed':
        return <span className="badge badge-error badge-sm">Closed</span>;
      default:
        return <span className="badge badge-info badge-sm">{status}</span>;
    }
  };

  const renderJobCard = (job) => (
    <div key={job.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="card-title text-lg">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.department}</p>
          </div>
          {getStatusBadge(job.status)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="font-semibold">{job.applications}</span>
            <span className="text-gray-600 ml-1">Applications</span>
          </div>
          <div>
            <span className="font-semibold">{job.views}</span>
            <span className="text-gray-600 ml-1">Views</span>
          </div>
          <div>
            <span className="text-gray-600">Posted: </span>
            <span>{job.datePosted}</span>
          </div>
          <div>
            <span className="text-gray-600">Deadline: </span>
            <span>{job.deadline}</span>
          </div>
          {job.hired && (
            <div className="col-span-2">
              <span className="font-semibold text-success">{job.hired}</span>
              <span className="text-gray-600 ml-1">Candidates Hired</span>
            </div>
          )}
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-ghost btn-sm">View Details</button>
          <button className="btn btn-primary btn-sm">
            {job.status === 'active' ? 'Manage' : job.status === 'pending' ? 'Edit' : 'Reopen'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
      <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Job Listings</h1>
            <p className="text-gray-600 mt-2">Manage your current, pending, and previous job postings</p>
          </div>
          <button 
            onClick={handleNewJob}
            className="btn btn-primary mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add New Job
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs tabs-boxed bg-base-100 mb-8">
          <a 
            className={`tab ${activeTab === 'current' ? 'tab-active' : ''}`} 
            onClick={() => setActiveTab('current')}
          >
            Current Listings
            <span className="badge badge-sm badge-primary ml-2">{jobs.current.length}</span>
          </a> 
          <a 
            className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`} 
            onClick={() => setActiveTab('pending')}
          >
            Pending Listings
            <span className="badge badge-sm badge-warning ml-2">{jobs.pending.length}</span>
          </a> 
          <a 
            className={`tab ${activeTab === 'previous' ? 'tab-active' : ''}`} 
            onClick={() => setActiveTab('previous')}
          >
            Previous Listings
            <span className="badge badge-sm badge-error ml-2">{jobs.previous.length}</span>
          </a>
        </div>

        {/* Content Section */}
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          {activeTab === 'current' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Current Job Listings</h2>
              {jobs.current.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.current.map(renderJobCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700">No active job listings</h3>
                  <p className="text-gray-500 mt-2">Get started by creating your first job posting</p>
                  <button 
                    onClick={handleNewJob}
                    className="btn btn-primary mt-4"
                  >
                    Create New Job
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Pending Job Listings</h2>
              {jobs.pending.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.pending.map(renderJobCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700">No pending job listings</h3>
                  <p className="text-gray-500 mt-2">All your job postings have been approved</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'previous' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Previous Job Listings</h2>
              {jobs.previous.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.previous.map(renderJobCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700">No previous job listings</h3>
                  <p className="text-gray-500 mt-2">Your closed job postings will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="stats shadow bg-base-100 w-full mt-8">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-title">Total Jobs Posted</div>
            <div className="stat-value text-primary">{jobs.current.length + jobs.pending.length + jobs.previous.length}</div>
            <div className="stat-desc">Across all categories</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Active Listings</div>
            <div className="stat-value text-success">{jobs.current.length}</div>
            <div className="stat-desc">Currently accepting applications</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Pending Approval</div>
            <div className="stat-value text-warning">{jobs.pending.length}</div>
            <div className="stat-desc">Awaiting admin review</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HM_HeroMyjobs