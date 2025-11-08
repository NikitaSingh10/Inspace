import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePublishableKey } from '../config';

// Stripe Checkout Form Component
const StripeCheckoutForm = ({ orderData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { backendUrl, token } = useContext(ShopContext);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      console.log('Stripe or elements not loaded');
      return;
    }

    setIsProcessing(true);
    console.log('Starting payment confirmation...');

    try {
      // Confirm payment with Stripe - NO REDIRECT
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required', // Don't redirect, handle everything in the same page
      });

      console.log('Payment confirmation result:', { error, paymentIntent });

      if (error) {
        console.error('Payment error:', error);
        onError(error.message);
        setIsProcessing(false);
        return;
      }

      // Check if payment succeeded
      if (!paymentIntent) {
        console.error('No payment intent returned');
        onError('Payment failed - no payment intent');
        setIsProcessing(false);
        return;
      }

      console.log('Payment intent status:', paymentIntent.status);

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded! PaymentIntent ID:', paymentIntent.id);
        console.log('Now creating order in database...');
        
        // Place order with payment intent ID
        const orderResponse = await axios.post(
          backendUrl + '/api/order/stripe',
          {
            ...orderData,
            paymentIntentId: paymentIntent.id
          },
          { headers: { token } }
        );

        console.log('Order response:', orderResponse.data);

        if (orderResponse.data.success) {
          console.log('Order created successfully!');
          onSuccess();
        } else {
          console.error('Order creation failed:', orderResponse.data.message);
          onError(orderResponse.data.message || 'Failed to place order');
        }
      } else if (paymentIntent.status === 'requires_action') {
        console.log('Payment requires additional action');
        onError('Payment requires additional verification. Please try again.');
        setIsProcessing(false);
      } else {
        console.log('Payment status:', paymentIntent.status);
        onError(`Payment ${paymentIntent.status}. Please try again.`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error in payment flow:', error);
      console.error('Error details:', error.response?.data);
      onError(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4 border p-4 rounded bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Enter Card Details</h3>
      <PaymentElement />
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={handlePayment}
          disabled={!stripe || !elements || isProcessing}
          className={`flex-1 px-8 py-3 text-sm ${
            !stripe || !elements || isProcessing
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isProcessing ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  
  // Debug: Check if we have authentication
  React.useEffect(() => {
    console.log('PlaceOrder mounted - Token exists:', !!token);
    console.log('Cart items:', Object.keys(cartItems).length);
    console.log('Products loaded:', products?.length);
  }, [token, cartItems, products]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const prepareOrderData = () => {
    let orderItems = []
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        const itemInfo = structuredClone(products.find(product => product._id === items));
        if (itemInfo) {
          itemInfo.quantity = cartItems[items];
          orderItems.push(itemInfo);
        }
      }
    }
    
    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee
    }
    
    console.log('Prepared order data:', {
      itemCount: orderItems.length,
      amount: orderData.amount,
      address: orderData.address
    });
    
    return orderData;
  }

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (Object.keys(cartItems).length === 0 || Object.values(cartItems).every(qty => qty === 0)) {
      toast.error('Your cart is empty. Please add items before placing an order.');
      return false;
    }

    return true;
  }

  const handlePlaceOrder = async () => {
    // If Stripe form is showing, don't process
    if (showStripeForm) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const orderData = prepareOrderData();
      console.log('Order data prepared:', orderData);

      if (method === 'cod') {
        console.log('Processing COD order...');
        console.log('Token exists:', !!token);
        console.log('Backend URL:', backendUrl);
        console.log('Order data being sent:', orderData);
        
        // Cash on Delivery - direct order placement
        const response = await axios.post(
          backendUrl + '/api/order/place', 
          orderData, 
          { headers: { token } }
        );
        
        console.log('COD Response:', response.data);
        
        if (response.data.success) {
          setCartItems({})
          toast.success('Order placed successfully!');
          navigate('/orders')
        } else {
          toast.error(response.data.message || 'Failed to place order')
        }
        
      } else if (method === 'card') {
        console.log('Initializing card payment...');
        console.log('Token exists:', !!token);
        console.log('Stripe publishable key exists:', !!stripePublishableKey);
        
        // Card Payment - initialize Stripe
        if (!stripePublishableKey) {
          toast.error('Card payment is not configured. Please use Cash on Delivery.');
          setIsLoading(false);
          return;
        }
        
        try {
          console.log('Creating payment intent with data:', orderData);
          
          const intentResponse = await axios.post(
            backendUrl + '/api/order/stripe/create-intent',
            orderData,
            { headers: { token } }
          );

          console.log('Payment intent response:', intentResponse.data);

          if (intentResponse.data.success) {
            setStripeClientSecret(intentResponse.data.clientSecret);
            setShowStripeForm(true);
            toast.info('Please enter your card details below');
          } else {
            toast.error(intentResponse.data.message || 'Failed to initialize payment');
          }
        } catch (error) {
          console.error('Error creating payment intent:', error);
          toast.error(error.response?.data?.message || 'Failed to initialize card payment. Please try again.');
        }
      }

    } catch (error) {
      console.error('Error in order submission:', error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleStripeSuccess = () => {
    console.log('Stripe payment successful, clearing cart...');
    setCartItems({});
    setShowStripeForm(false);
    setStripeClientSecret(null);
    // Navigate to success page with payment info
    navigate('/payment-success', { 
      state: { 
        paymentMethod: 'Card',
        message: 'Your payment was successful!' 
      } 
    });
  }

  const handleStripeError = (errorMessage) => {
    console.error('Stripe error:', errorMessage);
    toast.error(errorMessage);
    setShowStripeForm(false);
    setStripeClientSecret(null);
  }

  const handleStripeCancel = () => {
    console.log('Payment cancelled by user');
    setShowStripeForm(false);
    setStripeClientSecret(null);
    toast.info('Payment cancelled');
  }

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/*------------left side----------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="tel" placeholder='Phone no.' />
      </div>

      {/*-----------right side---------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/*------Payment Method selection----------- */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            
            {/* Card Payment Option */}
            <div
              onClick={() => {
                if (!showStripeForm) {
                  setMethod('card');
                  setStripeClientSecret(null);
                }
              }}
              className={`flex items-center gap-3 border p-2 px-3 ${!showStripeForm ? 'cursor-pointer hover:border-gray-400' : 'opacity-50 cursor-not-allowed'}`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'card' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CARD PAYMENT</p>
            </div>

            {/* Cash on Delivery Option */}
            <div
              onClick={() => {
                if (!showStripeForm) {
                  setMethod('cod');
                  setStripeClientSecret(null);
                }
              }}
              className={`flex items-center gap-3 border p-2 px-3 ${!showStripeForm ? 'cursor-pointer hover:border-gray-400' : 'opacity-50 cursor-not-allowed'}`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>

          </div>

          {/* Stripe Payment Form */}
          {showStripeForm && method === 'card' && stripePublishableKey && stripeClientSecret && (
            <div className='mt-6'>
              <Elements
                stripe={loadStripe(stripePublishableKey)}
                options={{
                  clientSecret: stripeClientSecret,
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <StripeCheckoutForm
                  orderData={prepareOrderData()}
                  onSuccess={handleStripeSuccess}
                  onError={handleStripeError}
                />
              </Elements>
              <button
                type="button"
                onClick={handleStripeCancel}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                ← Cancel and choose different payment method
              </button>
            </div>
          )}

          {/* Place Order Button - only show when Stripe form is NOT showing */}
          {!showStripeForm && (
            <div className='w-full text-end mt-8'>
              <button
                type='button'
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className={`px-16 py-3 text-sm ${
                  isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isLoading 
                  ? 'PROCESSING...' 
                  : method === 'card' 
                    ? 'PROCEED TO PAYMENT' 
                    : 'PLACE ORDER'
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder