import React from 'react'
import SA_Nav from './SA_Components/SA_Nav.jsx'
import SA_Footer from './SA_Components/SA_Footer.jsx'
import SA_HeroAdmin from './SA_Components/SA_HeroAdmin.jsx'

const SA_AdminsPage = ({ user, setUser }) => {
  return (
    <div className='min-h-screen'>
      <SA_Nav user={user} setUser={setUser}/>
      <SA_HeroAdmin user={user}/>
      <SA_Footer/>
    </div>
  )
}

export default SA_AdminsPage