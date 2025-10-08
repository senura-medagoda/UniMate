import React from 'react';
import SA_Nav from './SA_Components/SA_Nav.jsx';
import SA_HeroProfile from './SA_Components/SA_HeroProfile.jsx';
import SA_Footer from './SA_Components/SA_Footer.jsx';

const SA_Profile = () => {
  return (
    <div className='min-h-screen'>
        <SA_Nav/>
        <SA_HeroProfile/>
        <SA_Footer/>
    </div>
  );
};

export default SA_Profile;