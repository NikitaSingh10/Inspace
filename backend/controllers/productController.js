import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'
import userModel from "../models/userModel.js";
import path from "path";
import { CANONICAL_COLORS } from '../utils/colorTags.js';

function parseColorTags(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean).map((c) => String(c).trim().toLowerCase());
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.filter(Boolean).map((c) => String(c).trim().toLowerCase()) : [];
        } catch {
            return value.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);
        }
    }
    return [];
}

//Funtion for adding product
const addProduct = async (req,res) => {
    try {
        
        const {name, description, price, category, subcategory, bestseller, colorTags} = req.body;

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        

        const images =[image1,image2, image3 , image4].filter((item)=>item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) =>{

                let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
                return result.secure_url

            })
        )

        let modelUrl = "";
        if (req.files.modelFile) {
            const originalName = req.files.modelFile[0].originalname;  // e.g. "vase.glb"
            const fileName = path.parse(originalName).name;            // e.g. "vase"

            const result = await cloudinary.uploader.upload(req.files.modelFile[0].path, {
             resource_type: "auto",
             public_id: `models/${fileName}.glb`,   // 🔥 forces .glb extension in URL
             format: "glb"
         });

         modelUrl = result.secure_url;
        }   

        const tags = parseColorTags(colorTags);
        const productData ={
            name, 
            description,
            category,
            price:Number(price),
            subcategory,
            bestseller:bestseller === 'true' ? true : false,
            image:imagesUrl,
            modelUrl: modelUrl,
            date: Date.now(),
            colorTags: tags
        }

        const product= new productModel(productData);
        await product.save()

        res.json({success:true, message:"product added"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }


}

//Funtion for listing product
const listProduct = async (req,res) => {

    try {
        console.log("called list");
        
        const products = await productModel.find({});
        res.json({success: true, products})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
    
}

//Funtion for removing product
const removeProduct = async (req,res) => {

    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json ({success:true, message:'product removed'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
    
}

//Funtion for single product info
const singleProduct = async (req,res) => {

    try {
  
      const { productId } = req.body;
  
      const product = await productModel.findById(productId);
  
      res.json({
        success: true,
        product
      });
  
    } catch (error) {
  
      console.log(error);
  
      res.json({
        success: false,
        message: error.message
      });
  
    }
  }

const updateProduct = async (req, res) => {
    try {
        const { productId, colorTags, name, description, price, category, subcategory, bestseller } = req.body;
        if (!productId) return res.json({ success: false, message: 'productId required' });
        const update = {};
        if (colorTags !== undefined) update.colorTags = parseColorTags(colorTags);
        if (name !== undefined) update.name = name;
        if (description !== undefined) update.description = description;
        if (price !== undefined) update.price = Number(price);
        if (category !== undefined) update.category = category;
        if (subcategory !== undefined) update.subcategory = subcategory;
        if (bestseller !== undefined) update.bestseller = bestseller === 'true' || bestseller === true;
        const product = await productModel.findByIdAndUpdate(productId, { $set: update }, { new: true });
        if (!product) return res.json({ success: false, message: 'Product not found' });
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getColorTags = (_req, res) => {
    res.json({ success: true, colorTags: CANONICAL_COLORS });
};

// review

const addReview = async (req, res) => {

    try {

        const { productId, rating, comment, userId } = req.body;
        const user = await userModel.findById(req.body.userId);
        const product = await productModel.findById(productId);
        console.log(product);
        if (!product) {

            return res.json({
                success: false,
                message: "Product not found",
            });

        }

        const alreadyReviewed = product.reviews.find(
            (r) =>
              r.user &&
              r.user.toString() === req.userId.toString()
          );

        if (alreadyReviewed) {

            return res.json({
                success: false,
                message: "Already reviewed",
            });

        }

        const review = {

            user: user._id,

            name: user.name,

            rating: Number(rating),

            comment,

        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =

            product.reviews.reduce(
                (acc, item) => item.rating + acc,
                0
            ) / product.reviews.length;

        await product.save();

        res.json({
            success: true,
            message: "Review added",
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message,
        });

    }
};

export{addProduct, listProduct, removeProduct, singleProduct, updateProduct, getColorTags, addReview};