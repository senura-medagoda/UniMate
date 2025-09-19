import React from 'react';
import { Link } from 'react-router-dom';
import uniLogo from '../../../StudentUI/Accommodation/assets/unimatelogo.png';

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={uniLogo} alt="UniMate" className="h-14 w-auto" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/admin/accommodation"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Accommodation
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;








