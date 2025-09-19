import React from 'react'

function HM_HeroDash() {

  const stats = {
    activeJobs: 12,
    pendingJobs: 5,
    totalApplicants: 247,
    newApplicants: 23
  };

  const handleNewJob = () => {
    // In a real app, this would navigate to a job creation form
    alert('Opening new job form...');
  };

  return (
    <div className="bg-base-100 ounded-lg shadow-md ">
      <div className='mx-auto mt-4 max-w-6xl px-4 sm:px-6 lg:px-4'>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your job posts.</p>
          </div>
          <button
            onClick={handleNewJob}
            className="btn btn-primary mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            List a New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active jobs section */}
          <div className="stats shadow bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="stat">
              <div className="stat-figure text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-title text-gray-600">Active Jobs</div>
              <div className="stat-value text-blue-700">{stats.activeJobs}</div>
              <div className="stat-desc text-blue-600">Currently listed positions</div>
            </div>
          </div>

          {/* Pending Jobs Card */}
          <div className="stats shadow bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
            <div className="stat">
              <div className="stat-figure text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-title text-gray-600">In Review</div>
              <div className="stat-value text-amber-700">{stats.pendingJobs}</div>
              <div className="stat-desc text-amber-600">Pending approval</div>
            </div>
          </div>

          {/* Total Applicants Card */}
          <div className="stats shadow bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="stat">
              <div className="stat-figure text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="stat-title text-gray-600">Total Applicants</div>
              <div className="stat-value text-green-700">{stats.totalApplicants}</div>
              <div className="stat-desc text-green-600">Across all positions</div>
            </div>
          </div>

          {/* New Applicants Card */}
          <div className="stats shadow bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="stat">
              <div className="stat-figure text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="stat-title text-gray-600">New Applicants</div>
              <div className="stat-value text-purple-700">+{stats.newApplicants}</div>
              <div className="stat-desc text-purple-600">Since yesterday</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-outline justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Review Applications
            </button>
            <button className="btn btn-outline justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Job Posts
            </button>
            <button className="btn btn-outline justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Reports
            </button>
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software Developer Intern</td>
                  <td>5 new applications</td>
                  <td>Today, 10:30 AM</td>
                  <td><div className="badge badge-success badge-sm">Active</div></td>
                </tr>
                <tr>
                  <td>Research Assistant - Biology</td>
                  <td>Position approved</td>
                  <td>Yesterday, 3:45 PM</td>
                  <td><div className="badge badge-primary badge-sm">Live</div></td>
                </tr>
                <tr>
                  <td>Campus Tour Guide</td>
                  <td>Application deadline passed</td>
                  <td>Oct 20, 2023</td>
                  <td><div className="badge badge-warning badge-sm">Closed</div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-ghost btn-sm">View All Activity</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HM_HeroDash