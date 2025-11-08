import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethod, message } = location.state || { 
    paymentMethod: 'Card', 
    message: 'Order placed successfully!' 
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4 py-10'>
      <div className='max-w-md w-full'>
        {/* Success Icon */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
            <svg 
              className='w-12 h-12 text-green-600' 
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24'
            >
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={2} 
                d='M5 13l4 4L19 7' 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-3'>
            Payment Successful!
          </h1>
          <p className='text-gray-600 mb-2'>
            {message}
          </p>
          <p className='text-sm text-gray-500'>
            Payment Method: <span className='font-medium text-gray-700'>{paymentMethod}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6'>
          <div className='flex items-start mb-4'>
            <svg 
              className='w-5 h-5 text-green-600 mt-0.5 mr-3' 
              fill='currentColor' 
              viewBox='0 0 20 20'
            >
              <path 
                fillRule='evenodd' 
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' 
                clipRule='evenodd' 
              />
            </svg>
            <div>
              <h3 className='font-semibold text-gray-800 mb-1'>
                Order Confirmed
              </h3>
              <p className='text-sm text-gray-600'>
                Your order has been received and is being processed. You will receive a confirmation email shortly.
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <svg 
              className='w-5 h-5 text-blue-600 mt-0.5 mr-3' 
              fill='currentColor' 
              viewBox='0 0 20 20'
            >
              <path 
                d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' 
              />
              <path 
                d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' 
              />
            </svg>
            <div>
              <h3 className='font-semibold text-gray-800 mb-1'>
                Track Your Order
              </h3>
              <p className='text-sm text-gray-600'>
                You can track your order status from the Orders page.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <button
            onClick={() => navigate('/orders')}
            className='w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors font-medium'
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/collection')}
            className='w-full bg-white text-gray-700 py-3 px-6 rounded border border-gray-300 hover:bg-gray-50 transition-colors font-medium'
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;