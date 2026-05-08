import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    price: {type:Number, required:true},
    image: {type:Array, required:true},
    category: {type:String, required:true},
    subcategory: {type:String, required:true},
    bestseller:{type:Boolean},
    date:{type:Number, required:true},
    modelUrl: { type: String, default: "" },
    colorTags: { type: [String], default: [] },

        reviews: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user",
            },
      
            name: String,
      
            rating: Number,
      
            comment: String,
          },
        ],
      
        numReviews: {
          type: Number,
          default: 0,
        },
      
        rating: {
          type: Number,
          default: 0,
        },
      
      });


const productModel =mongoose.models.product || mongoose.model("product", productSchema)

export default productModel