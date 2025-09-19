import React from 'react'
import { useState } from 'react'

function HM_HeroNewjob() {

    const [formData, setFormData] = useState({
    title: '',
    department: '',
    jobType: '',
    location: '',
    pay: '',
    applicationDeadline: '',
    description: '',
    requirements: '',
    responsibilities: '',
    qualifications: '',
    benefits: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to your backend
    console.log('Form submitted:', formData);
    alert('Job position created successfully!');
    // Reset form or redirect to jobs list
  };

  const handleBack = () => {
    // In a real app, this would navigate back
    console.log('Going back to jobs list');
    // navigation.goBack() or similar
  }

  return (
     <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="btn btn-ghost btn-sm mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Create New Job Position</h1>
        </div>

        <div className="bg-base-100 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Job Title*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., Software Developer Intern"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Department*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., Computer Science Department"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Job Type*</span>
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="On-Campus">On-Campus</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Work-Study">Work-Study</option>
                    <option value="Research">Research</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., Main Campus, Science Building"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Compensation*</span>
                  </label>
                  <input
                    type="text"
                    name="pay"
                    value={formData.pay}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="e.g., $15/hr, Stipend + Housing, Course Credit"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Application Deadline*</span>
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Job Description Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Job Description</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position Overview*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="Describe the role, its purpose, and how it contributes to your department..."
                  required
                />
              </div>
            </div>

            {/* Responsibilities Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Key Responsibilities</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">What will the student be doing?*</span>
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-32"
                  placeholder="List the main tasks and responsibilities... (one per line)"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Enter each responsibility on a new line</span>
                </label>
              </div>
            </div>

            {/* Qualifications Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Qualifications & Requirements</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Required Skills & Qualifications*</span>
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-32"
                  placeholder="List the required skills, courses, experience... (one per line)"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Enter each qualification on a new line</span>
                </label>
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Benefits & Perks</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">What does this position offer?</span>
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered h-24"
                  placeholder="List any benefits, learning opportunities, or perks... (one per line)"
                />
                <label className="label">
                  <span className="label-text-alt">Enter each benefit on a new line</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-outline md:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary md:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create Job Position
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-800">Tips for creating effective job postings:</h3>
              <ul className="text-blue-700 text-sm mt-1 list-disc list-inside">
                <li>Be specific about required skills and qualifications</li>
                <li>Highlight what makes this position valuable for students</li>
                <li>Include information about flexible scheduling if available</li>
                <li>Specify any required commitment hours per week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HM_HeroNewjob