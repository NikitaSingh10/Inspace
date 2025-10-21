import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'
import path from "path";

//Funtion for adding product
const addProduct = async (req,res) => {
    try {
        
        const {name, description, price, category, subcategory, bestseller} = req.body;

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

        const productData ={
            name, 
            description,
            category,
            price:Number(price),
            subcategory,
            bestseller:bestseller === 'true' ? true : false,
            image:imagesUrl,
            modelUrl: modelUrl,
            date: Date.now()
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
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

    
}

export{addProduct, listProduct, removeProduct, singleProduct};