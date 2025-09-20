import React from 'react'
import { useState } from 'react'

function HM_HeroApplicants() {
    const [selectedJob, setSelectedJob] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [jobs] = useState([
    { id: 'all', title: 'All Positions' },
    { id: 1, title: 'Software Developer Intern', department: 'Computer Science' },
    { id: 2, title: 'Research Assistant - Biology', department: 'Biology Department' },
    { id: 3, title: 'Campus Tour Guide', department: 'Admissions Office' }
  ]);

  const [applicants] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Software Developer Intern',
      status: 'new',
      appliedDate: '2023-10-20',
      resume: 'sarah_johnson_resume.pdf',
      coverLetter: true,
      skills: ['JavaScript', 'React', 'Python'],
      match: 92,
      notes: 'Strong portfolio, previous internship experience'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Software Developer Intern',
      status: 'reviewed',
      appliedDate: '2023-10-19',
      resume: 'michael_chen_resume.pdf',
      coverLetter: true,
      skills: ['Java', 'Spring Boot', 'SQL'],
      match: 87,
      notes: 'Good academic record, needs technical interview'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      position: 'Research Assistant - Biology',
      status: 'interview',
      appliedDate: '2023-10-18',
      resume: 'emma_rodriguez_resume.pdf',
      coverLetter: false,
      skills: ['Lab Techniques', 'Data Analysis', 'PCR'],
      match: 95,
      notes: 'Perfect match, has previous research experience'
    },
    {
      id: 4,
      name: 'James Wilson',
      position: 'Campus Tour Guide',
      status: 'rejected',
      appliedDate: '2023-10-17',
      resume: 'james_wilson_resume.pdf',
      coverLetter: true,
      skills: ['Public Speaking', 'Communication', 'Leadership'],
      match: 78,
      notes: 'Limited availability during required hours'
    },
    {
      id: 5,
      name: 'Olivia Martinez',
      position: 'Software Developer Intern',
      status: 'new',
      appliedDate: '2023-10-16',
      resume: 'olivia_martinez_resume.pdf',
      coverLetter: true,
      skills: ['C++', 'Algorithms', 'Data Structures'],
      match: 84,
      notes: 'Strong problem-solving skills, coding competition winner'
    },
    {
      id: 6,
      name: 'David Kim',
      position: 'Research Assistant - Biology',
      status: 'offer',
      appliedDate: '2023-10-15',
      resume: 'david_kim_resume.pdf',
      coverLetter: true,
      skills: ['Microbiology', 'Cell Culture', 'Statistics'],
      match: 91,
      notes: 'Offer sent, waiting for response'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New', color: 'badge-info' },
    { value: 'reviewed', label: 'Reviewed', color: 'badge-primary' },
    { value: 'interview', label: 'Interview', color: 'badge-warning' },
    { value: 'offer', label: 'Offer', color: 'badge-success' },
    { value: 'rejected', label: 'Rejected', color: 'badge-error' }
  ];

  const getStatusBadge = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return <span className={`badge badge-sm ${statusObj?.color || 'badge-info'}`}>{statusObj?.label}</span>;
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesJob = selectedJob === 'all' || applicant.position === jobs.find(j => j.id === selectedJob)?.title;
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const statusCounts = {
    new: applicants.filter(a => a.status === 'new').length,
    reviewed: applicants.filter(a => a.status === 'reviewed').length,
    interview: applicants.filter(a => a.status === 'interview').length,
    offer: applicants.filter(a => a.status === 'offer').length,
    rejected: applicants.filter(a => a.status === 'rejected').length
  };

  return (

    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Applicant Management</h1>
            <p className="text-gray-600 mt-2">Review and manage applicants for your positions</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-sm text-gray-600 mr-2">Total Applicants:</span>
            <span className="text-lg font-semibold text-primary">{applicants.length}</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-base-100 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Filter by Position</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Filter by Status</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Search Applicants</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Name, position, or skills..." 
                  className="input input-bordered w-full pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statusOptions.filter(opt => opt.value !== 'all').map(option => (
            <div key={option.value} className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-title">{option.label}</div>
                <div className="stat-value">{statusCounts[option.value]}</div>
                <div className="stat-desc">Applicants</div>
              </div>
            </div>
          ))}
        </div>

        {/* Applicants List */}
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {filteredApplicants.length} Applicant{filteredApplicants.length !== 1 ? 's' : ''} Found
          </h2>
          
          {filteredApplicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Skills</th>
                    <th>Match</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map(applicant => (
                    <tr key={applicant.id}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                              <span>{applicant.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{applicant.name}</div>
                            <div className="text-sm text-gray-500">
                              Applied: {applicant.appliedDate}
                              {applicant.coverLetter && (
                                <span className="ml-2 text-primary">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Cover Letter
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{applicant.position}</td>
                      <td>{getStatusBadge(applicant.status)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="badge badge-outline badge-sm">{skill}</span>
                          ))}
                          {applicant.skills.length > 3 && (
                            <span className="badge badge-ghost badge-sm">+{applicant.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="radial-progress bg-base-200 border-4 border-base-200" style={{"--value": applicant.match, "--size": "3rem"}}>
                            <span className="text-xs font-bold">{applicant.match}%</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button className="btn btn-primary btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Contact
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700">No applicants found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default HM_HeroApplicants