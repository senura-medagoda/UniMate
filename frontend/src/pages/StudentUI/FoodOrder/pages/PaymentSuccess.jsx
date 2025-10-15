import React, { useEffect } from 'react';
import { AppContextProvider, useAppContext } from '../components/context/context';
import FoodNavbar from '../components/navbar/FoodNavbar';
import Footer from '../components/Footer';

const PaymentSuccessContent = () => {
  const { navigate, user } = useAppContext();

  useEffect(() => {
    const finalize = async () => {
      try {
        console.log('=== PAYMENT SUCCESS PAGE START ===');
        console.log('PaymentSuccess: Component mounted, starting payment finalization');
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        
        console.log('PaymentSuccess: Current URL:', window.location.href);
        console.log('PaymentSuccess: URL params:', Object.fromEntries(params.entries()));
        
        if (!sessionId) {
          console.error('ERROR: No session_id found in URL');
          alert('No session ID found. Please try again.');
          return;
        }

        // Get the student token from localStorage
        const studentToken = localStorage.getItem('studentToken');
        
        if (!studentToken) {
          console.error('ERROR: No student token found in localStorage');
          alert('Authentication error. Please login again.');
          return;
        }

        // Try to get payload from sessionStorage
        let payload = {};
        try {
          const storedPayload = sessionStorage.getItem('lastOrderPayload');
          if (storedPayload) {
            payload = JSON.parse(storedPayload);
            console.log('PaymentSuccess: Retrieved payload from sessionStorage:', payload);
          }
        } catch (e) {
          console.log('PaymentSuccess: Could not parse sessionStorage payload:', e);
        }
        
        console.log('PaymentSuccess: sessionId =', sessionId);
        console.log('PaymentSuccess: payload =', payload);
        console.log('PaymentSuccess: sessionStorage keys =', Object.keys(sessionStorage));
        
        // Prepare the request data - ensure all required fields are included
        const requestData = {
          sessionId,
          foodItems: payload.foodItems || [],
          totalAmount: payload.totalAmount || 0,
          address: payload.address || '',
          clientOrderKey: payload.clientOrderKey || null
        };

        console.log('PaymentSuccess: Making API call to confirm order');
        console.log('PaymentSuccess: Request data:', requestData);
        
        // Try the Stripe confirmation (now more robust)
        try {
          const response = await fetch('http://localhost:5001/api/orders/stripe/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${studentToken}`,
            },
            body: JSON.stringify(requestData),
          });

          console.log('PaymentSuccess: API response status:', response.status);
          const data = await response.json();
          console.log('PaymentSuccess: API response data:', data);
          
          if (data.success) {
            console.log('=== ORDER CONFIRMED SUCCESSFULLY ===');
            console.log('Order details:', data.order);
            
            // Clear cart and session data
            sessionStorage.removeItem('lastOrderPayload');
            try { 
              localStorage.removeItem('marketplaceCart'); 
              localStorage.removeItem('cartItems');
            } catch {}
            
            // Don't auto-redirect, let user choose
            return;
          } else {
            console.error('Stripe confirmation failed:', data.message);
            // Try fallback method
            await tryFallbackMethod();
          }
        } catch (stripeError) {
          console.error('Stripe confirmation failed with error:', stripeError);
          // Try fallback method
          await tryFallbackMethod();
        }
        
        // Fallback method function
        async function tryFallbackMethod() {
          console.log('Trying fallback method...');
          try {
            const fallbackData = {
              foodItems: payload.foodItems || [],
              totalAmount: payload.totalAmount || 0,
              address: payload.address || '',
              clientOrderKey: payload.clientOrderKey || null
            };
            
            console.log('Trying fallback with data:', fallbackData);
            
            const fallbackResponse = await fetch('http://localhost:5001/api/orders/stripe/fallback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`,
              },
              body: JSON.stringify(fallbackData),
            });

            console.log('Fallback response status:', fallbackResponse.status);
            const fallbackResult = await fallbackResponse.json();
            console.log('Fallback response data:', fallbackResult);
            
            if (fallbackResult.success) {
              console.log('=== FALLBACK ORDER CREATED SUCCESSFULLY ===');
              console.log('Order details:', fallbackResult.order);
              
              // Clear cart and session data
              sessionStorage.removeItem('lastOrderPayload');
              try { 
                localStorage.removeItem('marketplaceCart'); 
                localStorage.removeItem('cartItems');
              } catch {}
              
              // Don't auto-redirect, let user choose
              return;
            } else {
              console.error('Fallback also failed:', fallbackResult.message);
              alert(`Failed to create order: ${fallbackResult.message}`);
            }
          } catch (fallbackError) {
            console.error('Fallback method also failed:', fallbackError);
            alert('Failed to create order. Please contact support.');
          }
        }
      } catch (e) {
        console.error('=== PAYMENT SUCCESS ERROR ===');
        console.error('finalize payment error', e);
        alert('An error occurred while confirming your order. Please check your orders page.');
      }
    };
    finalize();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <FoodNavbar />
      <div className="pt-24 pb-10 max-w-lg mx-auto px-6 text-center">
        {/* Animated Success Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{backgroundColor: '#fc944c'}}>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-bounce">
              <svg 
                className="w-8 h-8 animate-ping" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{color: '#fc944c'}}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          {/* Ripple Effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full animate-ping opacity-20" style={{backgroundColor: '#fc944c'}}></div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full animate-ping opacity-10" style={{backgroundColor: '#fc944c', animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Success Message */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold mb-3 text-gray-800">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">Your order has been confirmed and will be processed shortly.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up">
          <button
            onClick={() => navigate('/student/my-orders')}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View My Orders
          </button>
          
          <button
            onClick={() => navigate('/food')}
            className="w-full bg-white text-orange-500 py-3 px-6 rounded-lg font-semibold border-2 border-orange-500 hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> You can track your order status in "My Orders" section
          </p>
        </div>
      </div>
      <Footer />
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

const PaymentSuccess = ({ user, setUser }) => (
  <AppContextProvider user={user} setUser={setUser}>
    <PaymentSuccessContent />
  </AppContextProvider>
);

export default PaymentSuccess;


