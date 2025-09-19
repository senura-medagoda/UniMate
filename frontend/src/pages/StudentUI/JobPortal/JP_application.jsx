import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroApplications from './JP_components/JP_HeroApplications'

const JP_application = () => {
  return (
    <div className="min-h-screen">
        <JP_Nav/>
        <JP_HeroApplications/>
    </div>
  )
}

export default JP_application