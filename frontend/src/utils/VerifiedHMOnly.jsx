import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHMAuth } from '@/context/HMAuthContext';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';

const VerifiedHMOnly = ({ children }) => {
  const { hm } = useHMAuth();
  const navigate = useNavigate();

  // If hiring manager is not verified, show verification required message
  if (hm && hm.status !== 'Verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Required
          </h2>
          
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">
              Current Status: <span className="font-semibold">{hm.status}</span>
            </span>
          </div>
          
          <p className="text-gray-600 mb-6">
            Only verified hiring managers can create new job listings. 
            Please contact the administrator to get your account verified.
          </p>
          
          <button
            onClick={() => navigate('/hmdash')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If verified, render the children
  return children;
};

export default VerifiedHMOnly;
