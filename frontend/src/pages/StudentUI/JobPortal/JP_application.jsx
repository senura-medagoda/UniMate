import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroApplications from './JP_components/JP_HeroApplications'

const JP_application = ({ user, setUser }) => {
  return (
    <div className="min-h-screen">
        <JP_Nav user={user} setUser={setUser}/>
        <JP_HeroApplications user={user}/>
    </div>
  )
}

export default JP_application