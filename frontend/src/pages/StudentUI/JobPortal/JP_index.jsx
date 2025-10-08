import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroDash from './JP_components/JP_HeroDash'
import JP_Footer from './JP_components/JP_Footer'


const JP_index = ({ user, setUser }) => {
  return (
    <div className="min-h-screen">
        <JP_Nav user={user} setUser={setUser}/>
        <JP_HeroDash user={user}/>
        <JP_Footer/>
    </div>
  )
}

export default JP_index