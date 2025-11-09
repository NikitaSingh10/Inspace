import mongoose from "mongoose";

let cachedConnection = null;

const connectDb = async () => {
    // Return cached connection if available (for serverless functions)
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        mongoose.connection.on('connected', () => {
            console.log("DB connected")
        })

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            cachedConnection = null;
        })

        mongoose.connection.on('disconnected', () => {
            console.log("DB disconnected");
            cachedConnection = null;
        })

        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        })

        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        cachedConnection = null;
        throw error;
    }
}

export default connectDb;