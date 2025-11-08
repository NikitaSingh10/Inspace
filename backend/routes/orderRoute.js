import express from 'express'
import {placeOrder, createStripePaymentIntent, placeOrderStripe, placeOrderrazorpay, allOrders, userOrders, updateStatus} from '../controllers/orderController.js';
import adminAuth  from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//Admin Features
orderRouter.post('/list' ,adminAuth, allOrders)
orderRouter.post('/status' ,adminAuth, updateStatus)

// Payment Feature
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe/create-intent',authUser, createStripePaymentIntent)
orderRouter.post('/stripe',authUser, placeOrderStripe)
orderRouter.post('/razorpay',authUser, placeOrderrazorpay)

//User Feature
orderRouter.post('/userorders', authUser, userOrders )

export default orderRouter



