import React from 'react';

const TrackOrder = ({ order, onClose }) => {
  const statusSteps = [
    { value: 'Order Placed', label: 'Order Placed' },
    { value: 'Packing', label: 'Packing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Out for Delivery', label: 'Out for Delivery' },
    { value: 'Delivered', label: 'Delivered' }
  ];

  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(step => step.value === order.status);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStatusColor = (stepIndex) => {
    if (stepIndex < currentStepIndex) {
      return 'bg-green-500'; // Completed
    } else if (stepIndex === currentStepIndex) {
      return 'bg-blue-500'; // Current
    } else {
      return 'bg-gray-300'; // Pending
    }
  };

  const getStatusIcon = (stepIndex) => {
    if (stepIndex < currentStepIndex) {
      return (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (stepIndex === currentStepIndex) {
      return (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Track Order #{order._id?.slice(-8) || 'N/A'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-lg font-medium mb-3">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">{new Date(order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className="font-medium">{order.payment ? 'Paid' : 'Pending'}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium">₹{order.amount}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Order Status</h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* Status steps */}
              <div className="space-y-6">
                {statusSteps.map((step, index) => (
                  <div key={step.value} className="relative flex items-start">
                    {/* Status circle */}
                    <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor(index)} transition-all duration-300`}>
                      {getStatusIcon(index)}
                    </div>
                    
                    {/* Status label */}
                    <div className="ml-4 flex-1 pt-2">
                      <p className={`font-medium ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {index === currentStepIndex && (
                        <p className="text-sm text-blue-600 mt-1">Current Status</p>
                      )}
                      {index < currentStepIndex && (
                        <p className="text-sm text-green-600 mt-1">Completed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-lg font-medium mb-3">Delivery Address</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
              <p>{order.address.country}</p>
              <p className="mt-2">Phone: {order.address.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img 
                    className="w-16 h-16 object-cover rounded" 
                    src={item.image?.[0] || '/placeholder.jpg'} 
                    alt={item.name} 
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <p>₹{item.price}</p>
                      <p>× {item.quantity}</p>
                      <p className="font-medium">Total: ₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

