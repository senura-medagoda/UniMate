import React from 'react'
import STD_Nav from './DashComponents/STD_Nav'
import STD_HeroProfile from './DashComponents/STD_HeroProfile'
import STD_Footer from './DashComponents/STD_Footer'

const StdProfile = ({ user, setUser }) => {
  return (
     <div className='min-h-screen'>
      <STD_Nav user={user} setUser={setUser}/>
      <STD_HeroProfile user={user}/>
      <STD_Footer/>
     </div>
  )
}

export default StdProfile