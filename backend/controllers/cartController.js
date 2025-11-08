import userModel from "../models/userModel.js"

//add products to user cart
const addToCart =async (req,res)=>{
    try {
        const {itemId} = req.body
        const {userId} = req.body

        const userData = await userModel.findById(userId)
        console.log(userId)
        let cartData = await userData.cartData || {};
        
        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId]= 1;
        }

        await userModel.findByIdAndUpdate(userId , {cartData: cartData || {} }, { new: true });

        res.json({success:true , message:'Added to cart'})

    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
        
    }

}

//update user cart
const updateCart =async (req,res)=>{
    
    try {
        const {itemId , quantity} = req.body
        const {userId} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId]= quantity;

        await userModel.findByIdAndUpdate(userId , {cartData: cartData || {} }, { new: true });

        res.json({success:true , message:'cart updated'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}

//get user cart data
const getUserCart =async (req,res)=>{

    try {
        const {userId} = req.body
        console.log(userId)
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({success:true , cartData})

    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
    
}

export{addToCart, updateCart, getUserCart}