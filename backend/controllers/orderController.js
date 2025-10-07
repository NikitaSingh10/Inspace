import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
//Placing order using COD
const placeOrder = async (req,res) => {
    try {
        const {userId, items, amount, address} = req.body

        const orderData ={
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

        await userModel.findById(userId,{cartData:{}})

        res,json({success: true , messahe:'Order Placed'})

        
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
        
        
    }
}

//Placing order using stripe
const placeOrderStripe = async (req,res) => {
    
}

//Placing order using Razorpay
const placeOrderrazorpay = async (req,res) => {
    
}

//All orders data for admin panel
const allOrders = async (req,res) => {
    
}

//user data for frontend
const userOrders = async (req,res) => {
    
}

//update order status froom admin panel
const updateStatus = async (req,res) => {
    
}

export {placeOrder, placeOrderStripe, placeOrderrazorpay, allOrders, userOrders, updateStatus}
