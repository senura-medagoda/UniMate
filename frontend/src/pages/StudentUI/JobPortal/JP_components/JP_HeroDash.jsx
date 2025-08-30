import React from 'react'

const JP_HeroDash = () => {
  return (
    <div className="hero bg-base-200 py-12">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold">Find Your Perfect Student Job</h1>
          <p className="py-6">
            Unimate's Job Portal connects students with on-campus employment opportunities, 
            internships, and local part-time jobs. Build your career while balancing your studies.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="btn btn-primary">
              <i className="fas fa-search mr-2"></i>
              Browse Jobs
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-question-circle mr-2"></i>
              Application Tips
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="stats shadow flex flex-col md:flex-row mt-8">
            <div className="stat">
              <div className="stat-figure text-primary">
                <i className="fas fa-briefcase text-3xl"></i>
              </div>
              <div className="stat-title">Available Jobs</div>
              <div className="stat-value text-primary">256</div>
              <div className="stat-desc">Updated today</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <i className="fas fa-building text-3xl"></i>
              </div>
              <div className="stat-title">Employers</div>
              <div className="stat-value text-secondary">42</div>
              <div className="stat-desc">On campus</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-accent">
                <i className="fas fa-users text-3xl"></i>
              </div>
              <div className="stat-title">Active Students</div>
              <div className="stat-value text-accent">1,234</div>
              <div className="stat-desc">Seeking jobs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JP_HeroDash