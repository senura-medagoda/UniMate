import React, { useState } from 'react';

const JPA_HeroJobs = () => {
  const [activeTab, setActiveTab] = useState('unreviewed');

  // Sample data - unreviewed jobs
  const unreviewedJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Solutions Inc.',
      location: 'New York, NY',
      salary: '$90,000 - $120,000',
      postedDate: '2024-01-15',
      status: 'pending',
      postedBy: 'john@techsolutions.com'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'Creative Studio',
      location: 'San Francisco, CA',
      salary: '$70,000 - $90,000',
      postedDate: '2024-01-14',
      status: 'pending',
      postedBy: 'sarah@creative.com'
    },
    {
      id: 3,
      title: 'Backend Engineer',
      company: 'Data Systems LLC',
      location: 'Austin, TX',
      salary: '$85,000 - $110,000',
      postedDate: '2024-01-13',
      status: 'pending',
      postedBy: 'mike@datasystems.com'
    }
  ];

  // Sample data - live jobs
  const liveJobs = [
    {
      id: 101,
      title: 'Frontend Developer',
      company: 'Web Innovations',
      location: 'Remote',
      salary: '$80,000 - $100,000',
      postedDate: '2024-01-10',
      expiresDate: '2024-02-10',
      status: 'live',
      applications: 24
    },
    {
      id: 102,
      title: 'DevOps Engineer',
      company: 'Cloud Services',
      location: 'Seattle, WA',
      salary: '$100,000 - $130,000',
      postedDate: '2024-01-08',
      expiresDate: '2024-02-08',
      status: 'live',
      applications: 18
    }
  ];

  // Sample data - old jobs
  const oldJobs = [
    {
      id: 201,
      title: 'Junior Developer',
      company: 'Startup Co',
      location: 'Boston, MA',
      salary: '$60,000 - $75,000',
      postedDate: '2023-12-01',
      expiredDate: '2023-12-31',
      status: 'expired',
      applications: 15
    },
    {
      id: 202,
      title: 'Product Manager',
      company: 'Tech Growth',
      location: 'Chicago, IL',
      salary: '$95,000 - $120,000',
      postedDate: '2023-11-20',
      expiredDate: '2023-12-20',
      status: 'expired',
      applications: 32
    }
  ];

  const handleApprove = (jobId) => {
    console.log('Approving job:', jobId);
    // API call to approve job
  };

  const handleReject = (jobId) => {
    console.log('Rejecting job:', jobId);
    // API call to reject job
  };

  const handleEdit = (jobId) => {
    console.log('Editing job:', jobId);
    // Navigate to edit page
  };

  const handleDelete = (jobId) => {
    console.log('Deleting job:', jobId);
    // API call to delete job
  };

  const handleRepost = (jobId) => {
    console.log('Reposting job:', jobId);
    // API call to repost job
  };

  const renderJobCard = (job, type) => (
    <div key={job.id} className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">{job.title}</h3>
          <p className="text-gray-600 mb-1">{job.company} • {job.location}</p>
          <p className="text-green-600 font-medium mb-2">{job.salary}</p>
        </div>
        <div className="flex items-center space-x-2 mb-3 md:mb-0">
          <span className={`badge badge-sm ${
            job.status === 'pending' ? 'badge-warning' :
            job.status === 'live' ? 'badge-success' :
            'badge-error'
          }`}>
            {job.status}
          </span>
          {type === 'live' && (
            <span className="badge badge-info badge-sm">
              {job.applications} applications
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
        <div>
          <strong>Posted:</strong> {job.postedDate}
          {job.expiresDate && (
            <span className="ml-2">
              <strong>Expires:</strong> {job.expiresDate}
            </span>
          )}
          {job.expiredDate && (
            <span className="ml-2">
              <strong>Expired:</strong> {job.expiredDate}
            </span>
          )}
        </div>
        {job.postedBy && (
          <div>
            <strong>Posted by:</strong> {job.postedBy}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {type === 'unreviewed' && (
          <>
            <button
              onClick={() => handleReject(job.id)}
              className="btn btn-error btn-sm"
            >
              Reject
            </button>
            <button
              onClick={() => handleApprove(job.id)}
              className="btn btn-success btn-sm"
            >
              Approve
            </button>
            <button
              onClick={() => handleEdit(job.id)}
              className="btn btn-outline btn-sm"
            >
              Edit
            </button>
          </>
        )}
        {type === 'live' && (
          <>
            <button
              onClick={() => handleEdit(job.id)}
              className="btn btn-primary btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(job.id)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
          </>
        )}
        {type === 'old' && (
          <>
            <button
              onClick={() => handleRepost(job.id)}
              className="btn btn-success btn-sm"
            >
              Repost
            </button>
            <button
              onClick={() => handleDelete(job.id)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
            <button
              onClick={() => handleEdit(job.id)}
              className="btn btn-outline btn-sm"
            >
              View Details
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Job Listings Management
          </h1>
          <p className="text-gray-600">
            Review, manage, and monitor all job listings on the platform
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{unreviewedJobs.length}</div>
            <div className="text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{liveJobs.length}</div>
            <div className="text-gray-600">Live Listings</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">{oldJobs.length}</div>
            <div className="text-gray-600">Archived Jobs</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs tabs-boxed bg-white shadow-sm mb-6">
          <button
            className={`tab tab-lg ${activeTab === 'unreviewed' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('unreviewed')}
          >
            ⏳ Pending Review
            {unreviewedJobs.length > 0 && (
              <span className="badge badge-warning badge-sm ml-2">
                {unreviewedJobs.length}
              </span>
            )}
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'live' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            💼 Live Listings
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'old' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('old')}
          >
            📁 Archived
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {activeTab === 'unreviewed' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Jobs Pending Review</h2>
              {unreviewedJobs.length > 0 ? (
                unreviewedJobs.map(job => renderJobCard(job, 'unreviewed'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No jobs pending review
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Live Job Listings</h2>
              {liveJobs.length > 0 ? (
                liveJobs.map(job => renderJobCard(job, 'live'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No live job listings
                </div>
              )}
            </div>
          )}

          {activeTab === 'old' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Archived Job Listings</h2>
              {oldJobs.length > 0 ? (
                oldJobs.map(job => renderJobCard(job, 'old'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No archived jobs
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JPA_HeroJobs;