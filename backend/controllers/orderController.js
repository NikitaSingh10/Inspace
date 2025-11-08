import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

//Placing order using COD
const placeOrder = async (req,res) => {
    try {
        // userId is set by authUser middleware
        const {userId, items, amount, address} = req.body

        console.log('COD Order Request:', { userId, items: items?.length, amount, address });

        if (!userId) {
            return res.json({success: false, message: 'User not authenticated'});
        }
        
        if (!items || items.length === 0) {
            return res.json({success: false, message: 'No items in cart'});
        }
        
        if (!address) {
            return res.json({success: false, message: 'Address is required'});
        }

        const orderData = {
            userId,
            items,
            address,
            amount, 
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }
        
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        console.log('COD Order saved:', newOrder._id);

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: 'Order Placed'})
        
    } catch (error) {
        console.error('COD Order Error:', error);
        res.json({success: false, message: error.message})
    }
}

//Create Stripe payment intent
const createStripePaymentIntent = async (req, res) => {
    try {
        console.log('Creating payment intent...');
        
        if (!stripe) {
            console.error('Stripe not configured');
            return res.json({ success: false, message: 'Stripe is not configured on the server' });
        }

        // userId comes from auth middleware (req.body.userId) or from the request
        let userId = req.body.userId;
        if (!userId && req.userId) {
            userId = req.userId;
        }
        
        const { amount, items, address } = req.body;
        
        console.log('Payment Intent Request:', { userId, amount, itemCount: items?.length });

        if (!userId || !amount || !items || !address) {
            return res.json({ success: false, message: 'Missing required fields' });
        }
        
        // Convert amount to paise (Stripe uses smallest currency unit - 1 INR = 100 paise)
        const amountInCents = Math.round(amount * 100);
        
        console.log('Creating Stripe payment intent for amount:', amountInCents);
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId,
                itemCount: items.length.toString(),
            }
        });
        
        console.log('Payment intent created:', paymentIntent.id);
        
        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment Intent Error:', error);
        res.json({ success: false, message: error.message });
    }
}

//Placing order using stripe (confirm payment and create order)
const placeOrderStripe = async (req, res) => {
    try {
        console.log('Stripe Order Request received');
        
        if (!stripe) {
            console.error('Stripe not configured');
            return res.json({ success: false, message: 'Stripe is not configured on the server' });
        }

        // userId comes from auth middleware (req.body.userId) or from the request
        let userId = req.body.userId;
        if (!userId && req.userId) {
            userId = req.userId;
        }
        
        const { items, amount, address, paymentIntentId } = req.body;

        console.log('Stripe Order Data:', { 
            userId, 
            itemCount: items?.length, 
            amount, 
            paymentIntentId,
            hasAddress: !!address 
        });

        if (!userId || !items || !amount || !address || !paymentIntentId) {
            console.error('Missing required fields');
            return res.json({ success: false, message: 'Missing required fields' });
        }

        // Verify payment intent with Stripe
        console.log('Verifying payment intent:', paymentIntentId);
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        console.log('Payment intent status:', paymentIntent.status);
        
        if (paymentIntent.status !== 'succeeded') {
            console.error('Payment not completed:', paymentIntent.status);
            return res.json({ 
                success: false, 
                message: 'Payment not completed. Please try again.' 
            });
        }

        // Create order with payment confirmed
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: true,
            date: Date.now()
        };
        
        console.log('Creating order in database...');
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        console.log('Order saved successfully:', newOrder._id);

        // Clear user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        console.log('Cart cleared for user:', userId);

        res.json({ success: true, message: 'Order placed successfully with Stripe payment' });
    } catch (error) {
        console.error('Stripe Order Error:', error);
        res.json({ success: false, message: error.message });
    }
}

//Placing order using Razorpay
const placeOrderrazorpay = async (req,res) => {
    // Not implemented
}

//All orders data for admin panel
const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({}).sort({date: -1});
        res.json({success: true, orders});
    } catch (error) {
        console.error('Get All Orders Error:', error);
        res.json({success: false, message: error.message});
    }
}

//user data for frontend
const userOrders = async (req,res) => {
    try {
        const {userId} = req.body;
        
        console.log('Fetching orders for user:', userId);
        
        const orders = await orderModel.find({userId}).sort({date: -1});
        
        console.log('Found orders:', orders.length);
        
        res.json({success: true, orders});
        
    } catch (error) {
        console.error('Get User Orders Error:', error);
        res.json({success: false, message: error.message});
    }
}

//update order status from admin panel
const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body;
        
        await orderModel.findByIdAndUpdate(orderId, { status });
        
        res.json({success: true, message: 'Status updated'});
    } catch (error) {
        console.error('Update Status Error:', error);
        res.json({success: false, message: error.message});
    }
}

export {placeOrder, createStripePaymentIntent, placeOrderStripe, placeOrderrazorpay, allOrders, userOrders, updateStatus}