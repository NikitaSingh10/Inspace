import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from '../config/mongodb.js'
import connectCloudinary from '../config/cloudinary.js'
import userRouter from '../routes/userRoute.js'
import productRouter from '../routes/productRoute.js'
import cartRouter from '../routes/cartRoute.js'
import orderRouter from '../routes/orderRoute.js'

// app config
const app = express()

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, check against allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['*']; // Allow all in development
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middlewares
app.use(express.json())
app.use(cors(corsOptions))

// Initialize database connections (with error handling for serverless)
let dbConnected = false;
let cloudinaryConnected = false;

const initializeConnections = async () => {
  try {
    if (!dbConnected) {
      await connectDb();
      dbConnected = true;
    }
    if (!cloudinaryConnected) {
      await connectCloudinary();
      cloudinaryConnected = true;
    }
  } catch (error) {
    console.error('Connection error:', error);
    // Don't throw - allow app to continue (connections will retry)
  }
};

// Initialize connections on first request
app.use(async (req, res, next) => {
  await initializeConnections();
  next();
});

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

// Export the Express app as a serverless function
export default app

