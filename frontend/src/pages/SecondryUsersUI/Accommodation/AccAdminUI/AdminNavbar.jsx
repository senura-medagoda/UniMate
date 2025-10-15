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
              <img src={uniLogo} alt="UniMate" className="h-7 w-auto" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
