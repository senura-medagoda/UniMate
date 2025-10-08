import React from 'react'

function JP_HeroProfile({ user }) {
  return (
    <div>
      <h1>Job Portal Profile</h1>
      <p>Welcome, {user?.name || user?.fname || user?.email || 'Student'}!</p>
    </div>
  )
}

export default JP_HeroProfile