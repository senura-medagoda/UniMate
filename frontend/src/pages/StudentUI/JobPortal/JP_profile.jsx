import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroProfile from './JP_components/JP_HeroProfile'

function JP_profile({ user, setUser }) {
  return (
    <div className="min-h-screen">
        <JP_Nav user={user} setUser={setUser}/>
        <JP_HeroProfile user={user}/>
    </div>
  )
}

export default JP_profile