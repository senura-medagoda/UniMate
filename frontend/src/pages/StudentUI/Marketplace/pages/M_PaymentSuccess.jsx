import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import { ShopContext } from '../context/M_ShopContext';

const M_PaymentSuccess = ({ user, setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const { clearCart } = useContext(ShopContext);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/M_placeorder');
      return;
    }

    // Confirm the payment and create order
    confirmPayment(sessionId);
  }, [searchParams, navigate]);

  const confirmPayment = async (sessionId) => {
    try {
      setLoading(true);
      const studentToken = localStorage.getItem('studentToken');
      
      if (!studentToken) {
        navigate('/M_placeorder');
        return;
      }

      // Get the order data from localStorage (stored before redirecting to Stripe)
      const orderData = JSON.parse(localStorage.getItem('stripeOrderData') || '{}');
      
      if (!orderData.userId || !orderData.items || !orderData.amount) {
        console.log('Missing order data:', orderData);
        navigate('/M_placeorder');
        return;
      }

      const response = await axios.post('http://localhost:5001/api/order/M_stripe-confirm', {
        sessionId,
        ...orderData
      }, { headers: { token: studentToken } });

      if (response.data.success) {
        setOrderData(response.data.order);
        
        // Check if this is a duplicate order
        if (response.data.message === 'Order already exists') {
          toast.info('Order already confirmed! Redirecting to your orders...');
        } else {
          toast.success('Payment successful! Your order has been placed.');
        }
        
        // Clear cart and order data
        clearCart(); // This clears both context and localStorage
        localStorage.removeItem('stripeOrderData');
        
        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate('/M_orders');
        }, 3000);
      } else {
        navigate('/M_placeorder');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      navigate('/M_placeorder');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='mr-10 ml-10'>
        <MarketPlace_Navbar user={user} setUser={setUser} />
        <div className='min-h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/30 to-yellow-50/30 mt-20 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
            <p className='text-gray-600'>Confirming your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar user={user} setUser={setUser} />
      <div className='min-h-screen bg-gradient-to-br from-amber-50/30 via-orange-50/30 to-yellow-50/30 mt-20'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
            {/* Success Icon */}
            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg className='w-10 h-10 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>Payment Successful!</h1>
            <p className='text-lg text-gray-600 mb-8'>
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>

            {/* Order Details */}
            {orderData && (
              <div className='bg-gray-50 rounded-xl p-6 mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Order Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-left'>
                  <div>
                    <p className='text-sm text-gray-600'>Order ID</p>
                    <p className='font-medium text-gray-900'>{orderData._id}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Total Amount</p>
                    <p className='font-medium text-gray-900'>${orderData.amount}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Payment Method</p>
                    <p className='font-medium text-gray-900'>{orderData.paymentMethod}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Status</p>
                    <p className='font-medium text-green-600'>{orderData.status || 'Confirmed'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() => navigate('/M_orders')}
                className='bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200'
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/M_cart')}
                className='bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200'
              >
                Continue Shopping
              </button>
            </div>

            {/* Auto Redirect Notice */}
            <p className='text-sm text-gray-500 mt-6'>
              You will be automatically redirected to your orders page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M_PaymentSuccess;
