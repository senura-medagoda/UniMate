import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroJobs from './JP_components/JP_HeroJobs'

const JP_jobs = ({ user, setUser }) => {
  return (
    <div className="min-h-screen">
        <JP_Nav user={user} setUser={setUser}/>
        <JP_HeroJobs user={user}/>
    </div>
  )
}

export default JP_jobs