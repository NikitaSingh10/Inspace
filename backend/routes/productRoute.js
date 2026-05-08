import express from 'express';
import {addProduct, listProduct, removeProduct, singleProduct, updateProduct, getColorTags, addReview} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post('/add' , adminAuth ,upload.fields([{name:'image1', maxCount:1},{name:'image2', maxCount:1}, {name:'image3', maxCount:1},{name:'image4', maxCount:1},{name:"modelFile", maxCount: 1}]),addProduct);
productRouter.post('/remove' , adminAuth,removeProduct);
productRouter.post('/update', adminAuth, updateProduct);
productRouter.post('/single' , singleProduct);
productRouter.get('/list' , listProduct);
productRouter.get('/color-tags', getColorTags);
productRouter.post("/:id/reviews",authUser, addReview);

export default productRouter;