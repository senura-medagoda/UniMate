import React, { useState } from 'react';

const JPA_HeroManagers = () => {
  const [activeTab, setActiveTab] = useState('unverified');

  // Sample data - unverified managers
  const unverifiedManagers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@techinnovate.com',
      company: 'Tech Innovate Inc.',
      position: 'HR Manager',
      registeredDate: '2024-01-15',
      status: 'unverified',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@datasolutions.com',
      company: 'Data Solutions LLC',
      position: 'Recruitment Lead',
      registeredDate: '2024-01-14',
      status: 'unverified',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@creativehub.com',
      company: 'Creative Hub Studios',
      position: 'Talent Acquisition',
      registeredDate: '2024-01-13',
      status: 'unverified',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX'
    }
  ];

  // Sample data - verified managers
  const verifiedManagers = [
    {
      id: 101,
      name: 'John Smith',
      email: 'john@webtech.com',
      company: 'Web Technologies',
      position: 'Senior HR Director',
      registeredDate: '2024-01-05',
      verifiedDate: '2024-01-08',
      status: 'verified',
      phone: '+1 (555) 111-2233',
      location: 'Seattle, WA',
      jobsPosted: 12,
      activeJobs: 5
    },
    {
      id: 102,
      name: 'Lisa Wong',
      email: 'lisa@cloudservices.com',
      company: 'Cloud Services Inc.',
      position: 'HR Manager',
      registeredDate: '2024-01-02',
      verifiedDate: '2024-01-04',
      status: 'verified',
      phone: '+1 (555) 444-5566',
      location: 'Boston, MA',
      jobsPosted: 8,
      activeJobs: 3
    }
  ];

  // Sample data - rejected managers
  const rejectedManagers = [
    {
      id: 201,
      name: 'Robert Brown',
      email: 'robert@questionable.com',
      company: 'Questionable Enterprises',
      position: 'Recruiter',
      registeredDate: '2024-01-10',
      rejectedDate: '2024-01-12',
      status: 'rejected',
      phone: '+1 (555) 777-8888',
      location: 'Miami, FL',
      reason: 'Invalid company information'
    }
  ];

  // Sample data - archived managers
  const archivedManagers = [
    {
      id: 301,
      name: 'Jennifer Lee',
      email: 'jennifer@oldtech.com',
      company: 'Old Tech Solutions',
      position: 'HR Director',
      registeredDate: '2023-11-15',
      archivedDate: '2024-01-01',
      status: 'archived',
      phone: '+1 (555) 999-0000',
      location: 'Chicago, IL',
      reason: 'Account inactive for 6 months'
    }
  ];

  const handleVerify = (managerId) => {
    console.log('Verifying manager:', managerId);
    // API call to verify manager
  };

  const handleReject = (managerId) => {
    console.log('Rejecting manager:', managerId);
    // API call to reject manager
  };

  const handleEdit = (managerId) => {
    console.log('Editing manager:', managerId);
    // Navigate to edit page
  };

  const handleDelete = (managerId) => {
    console.log('Deleting manager:', managerId);
    // API call to delete manager
  };

  const handleRestore = (managerId) => {
    console.log('Restoring manager:', managerId);
    // API call to restore manager
  };

  const handleViewDetails = (managerId) => {
    console.log('Viewing details for manager:', managerId);
    // Navigate to details page
  };

  const renderManagerCard = (manager, type) => (
    <div key={manager.id} className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">{manager.name}</h3>
          <p className="text-gray-600 mb-1">{manager.position} • {manager.company}</p>
          <p className="text-blue-600 mb-2">{manager.email}</p>
        </div>
        <div className="flex items-center space-x-2 mb-3 md:mb-0">
          <span className={`badge badge-sm ${
            manager.status === 'unverified' ? 'badge-warning' :
            manager.status === 'verified' ? 'badge-success' :
            manager.status === 'rejected' ? 'badge-error' :
            'badge-neutral'
          }`}>
            {manager.status}
          </span>
          {type === 'verified' && (
            <span className="badge badge-info badge-sm">
              {manager.activeJobs} active jobs
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm text-gray-600">
        <div>
          <strong>Phone:</strong> {manager.phone}
        </div>
        <div>
          <strong>Location:</strong> {manager.location}
        </div>
        <div>
          <strong>Registered:</strong> {manager.registeredDate}
        </div>
        {manager.verifiedDate && (
          <div>
            <strong>Verified:</strong> {manager.verifiedDate}
          </div>
        )}
        {manager.rejectedDate && (
          <div>
            <strong>Rejected:</strong> {manager.rejectedDate}
          </div>
        )}
        {manager.archivedDate && (
          <div>
            <strong>Archived:</strong> {manager.archivedDate}
          </div>
        )}
        {type === 'verified' && (
          <div>
            <strong>Total Jobs:</strong> {manager.jobsPosted}
          </div>
        )}
      </div>

      {manager.reason && (
        <div className="mb-3 p-2 bg-gray-50 rounded-md">
          <strong className="text-sm text-gray-700">Reason: </strong>
          <span className="text-sm text-gray-600">{manager.reason}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {type === 'unverified' && (
          <>
            <button
              onClick={() => handleReject(manager.id)}
              className="btn btn-error btn-sm"
            >
              Reject
            </button>
            <button
              onClick={() => handleVerify(manager.id)}
              className="btn btn-success btn-sm"
            >
              Verify
            </button>
            <button
              onClick={() => handleViewDetails(manager.id)}
              className="btn btn-outline btn-sm"
            >
              View Details
            </button>
          </>
        )}
        {type === 'verified' && (
          <>
            <button
              onClick={() => handleEdit(manager.id)}
              className="btn btn-primary btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(manager.id)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
            <button
              onClick={() => handleViewDetails(manager.id)}
              className="btn btn-outline btn-sm"
            >
              View Profile
            </button>
          </>
        )}
        {type === 'rejected' && (
          <>
            <button
              onClick={() => handleDelete(manager.id)}
              className="btn btn-error btn-sm"
            >
              Delete Permanently
            </button>
            <button
              onClick={() => handleViewDetails(manager.id)}
              className="btn btn-outline btn-sm"
            >
              View Details
            </button>
          </>
        )}
        {type === 'archived' && (
          <>
            <button
              onClick={() => handleRestore(manager.id)}
              className="btn btn-success btn-sm"
            >
              Restore
            </button>
            <button
              onClick={() => handleDelete(manager.id)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
            <button
              onClick={() => handleViewDetails(manager.id)}
              className="btn btn-outline btn-sm"
            >
              View History
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
            Hiring Managers Management
          </h1>
          <p className="text-gray-600">
            Review, verify, and manage all hiring managers on the platform
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{unverifiedManagers.length}</div>
            <div className="text-gray-600 text-sm">Pending Verification</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{verifiedManagers.length}</div>
            <div className="text-gray-600 text-sm">Verified Managers</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{rejectedManagers.length}</div>
            <div className="text-gray-600 text-sm">Rejected</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 mb-1">{archivedManagers.length}</div>
            <div className="text-gray-600 text-sm">Archived</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs tabs-boxed bg-white shadow-sm mb-6 flex-wrap">
          <button
            className={`tab tab-lg ${activeTab === 'unverified' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('unverified')}
          >
            ⏳ Unverified
            {unverifiedManagers.length > 0 && (
              <span className="badge badge-warning badge-sm ml-2">
                {unverifiedManagers.length}
              </span>
            )}
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'verified' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            ✅ Verified
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'rejected' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            ❌ Rejected
          </button>
          <button
            className={`tab tab-lg ${activeTab === 'archived' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            📁 Archived
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {activeTab === 'unverified' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Managers Pending Verification</h2>
              {unverifiedManagers.length > 0 ? (
                unverifiedManagers.map(manager => renderManagerCard(manager, 'unverified'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No managers pending verification
                </div>
              )}
            </div>
          )}

          {activeTab === 'verified' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Verified Hiring Managers</h2>
              {verifiedManagers.length > 0 ? (
                verifiedManagers.map(manager => renderManagerCard(manager, 'verified'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No verified managers
                </div>
              )}
            </div>
          )}

          {activeTab === 'rejected' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Rejected Managers</h2>
              {rejectedManagers.length > 0 ? (
                rejectedManagers.map(manager => renderManagerCard(manager, 'rejected'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No rejected managers
                </div>
              )}
            </div>
          )}

          {activeTab === 'archived' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Archived Managers</h2>
              {archivedManagers.length > 0 ? (
                archivedManagers.map(manager => renderManagerCard(manager, 'archived'))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No archived managers
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JPA_HeroManagers;