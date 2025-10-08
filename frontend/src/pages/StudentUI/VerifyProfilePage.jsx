import React from 'react'
import STD_Nav from './DashComponents/STD_Nav.jsx'
import STD_Footer from './DashComponents/STD_Footer.jsx'
import STD_HeroVerify from './DashComponents/STD_HeroVerify.jsx'

const VerifyProfilePage = ({ user, setUser }) => {
  return (
    <div className='min-h-screen'>
      <STD_Nav user={user} setUser={setUser}/>
      <STD_HeroVerify user={user} setUser={setUser}/>
      <STD_Footer/>
     </div>
  )
}

export default VerifyProfilePage