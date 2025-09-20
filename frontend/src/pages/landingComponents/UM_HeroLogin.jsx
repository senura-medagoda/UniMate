// src/pages/landingComponents/UM_HeroLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UM_HeroLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-300 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-3xl w-full text-center"
      >
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">
          Welcome to Uni Mate Login Hub
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          Choose your role below to login into the system. Each login provides
          access to specific services and dashboards tailored to your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login-std")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg"
          >
            Student Login
          </motion.button>

          {/* Food Providers Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/food-login")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg"
          >
            Food Provider Login
          </motion.button>

          {/* Property Owners Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/owner-login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg"
          >
            Property Owner Login
          </motion.button>

          {/* Hiring Managers Login */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/hm-login")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg"
          >
            Hiring Manager Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UM_HeroLogin;
