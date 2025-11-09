import {v2 as cloudinary} from "cloudinary"

let cloudinaryConfigured = false;

const connectCloudinary = async () => {
    if (cloudinaryConfigured) {
        return;
    }

    cloudinary.config({
        cloud_name : process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })

    cloudinaryConfigured = true;
}

export default connectCloudinary;