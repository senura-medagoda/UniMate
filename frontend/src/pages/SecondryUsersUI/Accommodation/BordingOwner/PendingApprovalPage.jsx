import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerAuth } from '../../../../context/ownerAuthContext';
import axios from 'axios';

const PendingApprovalPage = () => {
  const { owner, logout } = useOwnerAuth();
  const navigate = useNavigate();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [ownerStatus, setOwnerStatus] = useState('pending');

  // Check owner status periodically
  useEffect(() => {
    const checkStatus = async () => {
      if (!owner?.ownerId) {
        // If no owner data, try to get it from localStorage or redirect to login
        const savedOwner = localStorage.getItem("owner");
        if (savedOwner) {
          try {
            const parsedOwner = JSON.parse(savedOwner);
            if (parsedOwner.ownerId) {
              // Owner data exists, use it
              setOwnerStatus(parsedOwner.status || 'pending');
              setCheckingStatus(false);
              return;
            }
          } catch (error) {
            console.error('Error parsing saved owner data:', error);
          }
        }
        
        // No valid owner data found, redirect to login
        console.log('No owner data found, redirecting to login');
        navigate('/owner/login');
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:5001/api/owner/status/${owner.ownerId}`);
        const status = response.data.status;
        setOwnerStatus(status);
        
        if (status === 'active') {
          // Redirect to dashboard if active
          navigate('/owner/dashboard');
        }
      } catch (error) {
        console.error('Error checking status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, [owner?.ownerId, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/owner/login');
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Checking your account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Boarding Owner Portal</h1>
                <p className="text-sm text-gray-600">Account Status</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-8">
            {ownerStatus === 'pending' && (
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {ownerStatus === 'inactive' && (
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
            )}
            {ownerStatus === 'removed' && (
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          {ownerStatus === 'pending' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Account Pending Approval ⏳
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Hello <span className="font-semibold text-orange-600">{owner?.fullName}</span>!
              </p>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Your boarding owner account is currently under review by our admin team. 
                You'll be able to access all features once your account is approved.
              </p>
            </>
          )}

          {ownerStatus === 'inactive' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Account Deactivated ⚠️
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Hello <span className="font-semibold text-orange-600">{owner?.fullName}</span>!
              </p>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Your boarding owner account has been deactivated by the admin team. 
                Please contact the admin to reactivate your account and restore access to your dashboard.
              </p>
            </>
          )}

          {ownerStatus === 'removed' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Account Access Denied ❌
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Hello <span className="font-semibold text-red-600">{owner?.fullName}</span>!
              </p>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Your boarding owner account has been removed by the admin team. 
                Please contact support if you believe this is an error.
              </p>
            </>
          )}

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {ownerStatus === 'pending' && (
              <>
                <div className="bg-blue-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">What happens next?</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Admin team reviews your application</li>
                    <li>• This page will automatically redirect you</li>
                    <li>• You can check back anytime</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Once approved, you can:</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Create and manage boarding listings</li>
                    <li>• Upload multiple property images</li>
                    <li>• Handle booking requests</li>
                    <li>• Access your dashboard</li>
                  </ul>
                </div>
              </>
            )}

            {ownerStatus === 'inactive' && (
              <>
                <div className="bg-orange-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Account Deactivated</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Your account was deactivated by admin</li>
                    <li>• You cannot access your dashboard</li>
                    <li>• Contact admin to reactivate</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">How to Reactivate</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Contact admin via email or phone</li>
                    <li>• Explain your situation</li>
                    <li>• Wait for admin to reactivate</li>
                  </ul>
                </div>
              </>
            )}

            {ownerStatus === 'removed' && (
              <>
                <div className="bg-red-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Account Removed</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Your account was permanently removed</li>
                    <li>• All your data has been deleted</li>
                    <li>• Contact support if this is an error</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                  </div>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Contact support team</li>
                    <li>• Provide your account details</li>
                    <li>• Request account restoration</li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about your account status, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@unimate.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>077 4545 600</span>
              </div>
            </div>
          </div>

          {/* Auto-refresh indicator */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                ownerStatus === 'pending' ? 'bg-green-500' : 
                ownerStatus === 'inactive' ? 'bg-orange-500' : 
                'bg-red-500'
              }`}></div>
              <span>
                {ownerStatus === 'pending' && 'Auto-checking for updates every 30 seconds'}
                {ownerStatus === 'inactive' && 'Checking for reactivation every 30 seconds'}
                {ownerStatus === 'removed' && 'Account status monitoring'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
