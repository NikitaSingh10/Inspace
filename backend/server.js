import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import connectDb from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import aiRouter from './routes/aiRouter.js'
import subscribeRoute from "./routes/subscribeRoute.js";

// app config
dotenv.config();
const app = express()
const port = process.env.PORT || 4000
connectDb()
connectCloudinary()


// Middlewares (higher limit for AI image upload – base64 can be large)
app.use(express.json({ limit: '15mb' }))

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

app.use(cors(corsOptions))

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart' ,cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/ai', aiRouter)
app.use("/api/subscribe", subscribeRoute);


app.get('/',(req, res)=>{
    res.send("API Workinng")
})

// Export app for Vercel serverless functions
export default app

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
    app.listen(port, '0.0.0.0' ,()=>console.log('Server started on PORT: ' + port))
}