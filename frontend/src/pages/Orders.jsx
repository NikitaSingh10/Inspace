import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import TrackOrder from '../components/TrackOrder';

const Orders = () => {

  const{orders, currency, token, getUserOrders} = useContext(ShopContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if(token) {
      getUserOrders(token);
    }
  }, [token, getUserOrders]);

  // Refresh orders periodically (every 30 seconds) to get updated status
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      getUserOrders(token);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [token, getUserOrders]);

  // Update selectedOrder when orders are refreshed and it's still open
  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const updatedOrder = orders.find(o => o._id === selectedOrder._id);
      if (updatedOrder && updatedOrder.status !== selectedOrder.status) {
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders, selectedOrder]);

  const handleTrackOrder = async (order) => {
    // Refresh orders before showing track order to ensure latest status
    if (token) {
      setIsRefreshing(true);
      try {
        const updatedOrders = await getUserOrders(token);
        const updatedOrder = updatedOrders?.find(o => o._id === order._id) || order;
        setSelectedOrder(updatedOrder);
      } catch (error) {
        console.error(error)
        setSelectedOrder(order);
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setSelectedOrder(order);
    }
  };

  const handleCloseTrackOrder = () => {
    setSelectedOrder(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Placed':
        return 'bg-blue-500';
      case 'Processing':
        return 'bg-yellow-500';
      case 'Shipped':
        return 'bg-purple-500';
      case 'Delivered':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orders.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500 text-lg'>No orders found</p>
            <p className='text-gray-400 text-sm mt-2'>Your orders will appear here once you place them</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order._id || index} className='py-6 border-t border-b text-gray-700 mb-4'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <p className='text-sm text-gray-500'>Order #{order._id?.slice(-8) || 'N/A'}</p>
                  <p className='text-sm text-gray-400'>Date: {formatDate(order.date)}</p>
                  <p className='text-sm text-gray-400'>Payment: {order.paymentMethod} {order.payment ? '(Paid)' : '(Pending)'}</p>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-semibold'>{currency}{order.amount}</p>
                  <div className='flex items-center gap-2 mt-1'>
                    <p className={`min-w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></p>
                    <p className='text-sm md:text-base'>{order.status}</p>
                  </div>
                </div>
              </div>
              
              <div className='space-y-3'>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg'>
                    <img className='w-16 sm:w-20 h-16 sm:h-20 object-cover rounded' src={item.image?.[0] || '/placeholder.jpg'} alt={item.name} />
                    <div className='flex-1'>
                      <p className='sm:text-base font-medium'>{item.name}</p>
                      <div className='flex items-center gap-3 mt-1 text-sm text-gray-600'>
                        <p>{currency}{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Total: {currency}{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className='mt-4 pt-4 border-t'>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-sm font-medium'>Delivery Address:</p>
                    <p className='text-sm text-gray-600'>
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {order.address.country}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTrackOrder(order)}
                    disabled={isRefreshing}
                    className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isRefreshing ? 'Refreshing...' : 'Track Order'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Track Order Modal */}
      {selectedOrder && (
        <TrackOrder 
          order={selectedOrder} 
          onClose={handleCloseTrackOrder}
        />
      )}

    </div>
  )
}

export default Orders