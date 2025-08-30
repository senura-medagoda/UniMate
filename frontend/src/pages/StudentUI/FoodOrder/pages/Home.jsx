import React from 'react'
import MainBanner from '../components/MainBanner'
import FoodNavbar from '../components/navbar/FoodNavbar'
import Categories from '../components/Categories'
import Feedback from '../components/Feedback'
import Vendors from '../components/Vendors'
import Plate from '../components/Plate'
import IconBar from '../components/iconbar'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className=''>
        <FoodNavbar/>
      <MainBanner/>
      <Categories/>
      <Feedback/>
      <Plate/>
      <Vendors/>
      <IconBar/>
      <Footer/>
    </div>
  )
}

export default Home
