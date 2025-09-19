import React from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context.jsx';
import MainBanner from '../components/MainBanner.jsx';
import FoodNavbar from '../components/navbar/FoodNavbar.jsx';
import ShopCards from '../components/ShopCards.jsx';
import Feedback from '../components/Feedback.jsx';
import Plate from '../components/Plate.jsx';
import IconBar from '../components/iconbar.jsx';
import Footer from '../components/Footer.jsx';
import Shops from '../components/Shops.jsx';
import Login from '../components/Login.jsx';

const HomeContent = () => {
  const { showUserLogin } = useAppContext();

  return (
    <div>
      <FoodNavbar />
      <MainBanner />
      <ShopCards />
      <Shops />
      <Feedback />
      <Plate />
      <IconBar />
      <Footer />
      
      {showUserLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <Login />
          </div>
        </div>
      )}
    </div>
  );
};

const FD_Home = () => {
  return (
    <AppContextProvider>
      <HomeContent />
    </AppContextProvider>
  );
};

export default FD_Home;
