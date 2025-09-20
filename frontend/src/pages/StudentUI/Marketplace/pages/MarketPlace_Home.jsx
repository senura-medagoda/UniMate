import React from 'react'
import M_Hero from '../components/M_Hero'
import M_LatestCollection from '../components/M_LatestCollection'
import M_BestSeller from '../components/M_BestSeller'
import M_OurPolicy from '../components/M_OurPolicy'
import M_NewsletterBox from '../components/M_NewsletterBox'
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'
import M_Footer from '../components/M_Footer'

const MarketPlace_Home = () => {
  return (
    <div>
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
      <M_Hero/>
      <M_LatestCollection/>
      <M_BestSeller/>
      <M_OurPolicy/>
      <M_NewsletterBox/>
     
      </div>
       <M_Footer/>
    </div>
  )
}

export default MarketPlace_Home
