import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from '../components/context/context.jsx';
import MainBanner from '../components/MainBanner.jsx';
import FoodNavbar from '../components/navbar/FoodNavbar.jsx';
import Categories from '../components/Categories.jsx';
import Feedback from '../components/Feedback.jsx';
import Vendors from '../components/Vendors.jsx';
import Plate from '../components/Plate.jsx';
import IconBar from '../components/iconbar.jsx';
import Footer from '../components/Footer.jsx';
import Shops from '../components/Shops.jsx';

const Home = () => {
  return (
    <AppContextProvider>
      <div>
        <FoodNavbar />
        <MainBanner />
        <Categories />
        <Shops />
        <Feedback />
        <Plate />
        <Vendors />
        <IconBar />
        <Footer />
        
        {/* Place the Toaster inside the AppContextProvider */}
        <Toaster />
      </div>
    </AppContextProvider>
  );
};

export default Home;
