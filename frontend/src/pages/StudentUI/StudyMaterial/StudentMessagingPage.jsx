// SM - Student Messaging Page
import React from 'react';
import { FaEnvelope, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import StudentMessaging from './components/StudentMessaging.jsx';

const StudentMessagingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaEnvelope className="mr-3 text-orange-500" />
                  Contact Admin
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Send messages to administrators and get help with your queries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <StudentMessaging user={user} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="mr-2 text-orange-500" />
                  Quick Info
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Response Time:</strong> Usually within 24 hours
                  </p>
                  <p>
                    <strong>Priority Levels:</strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>• <span className="text-red-600">Urgent:</span> Critical issues</li>
                    <li>• <span className="text-orange-600">High:</span> Important matters</li>
                    <li>• <span className="text-blue-600">Normal:</span> General queries</li>
                    <li>• <span className="text-gray-600">Low:</span> Minor questions</li>
                  </ul>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Message Guidelines
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Be clear and specific in your subject line</p>
                  <p>• Provide relevant details in your message</p>
                  <p>• Use appropriate priority levels</p>
                  <p>• Be respectful and professional</p>
                  <p>• Include your contact information if needed</p>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Other Contact Methods
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Email:</strong> admin@unimate.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +94 11 234 5678
                  </p>
                  <p>
                    <strong>Office Hours:</strong> Mon-Fri, 9AM-5PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMessagingPage;
