import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroProfile from './JP_components/JP_HeroProfile'

function JP_profile() {
  return (
    <div className="min-h-screen">
        <JP_Nav/>
        <JP_HeroProfile/>
    </div>
  )
}

export default JP_profile