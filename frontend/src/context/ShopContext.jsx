import { createContext, useEffect, useState } from "react";
import React from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


export const ShopContext = createContext();

const ShopContextProvider= (props) =>{

    const currency ='₹';
    const delivery_fee = 40;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch] = useState('');
    const[showSearch , setShowSearch] = useState(false);
    const[cartItems, setCartItems]= useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();


    console.log('Backend URL:', backendUrl);

    const viewinAr= async () => {
        

        const handleClick= () => {
            navigate("/product");
        };
    }

    const addToCart= async (itemId) =>{

        let cartData= structuredClone(cartItems);
        
        if(cartData[itemId]){
            
                cartData[itemId] += 1;
        }
        else{
            cartData[itemId]= 1;
        }

        console.log(cartItems);
        console.log(cartData);
        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/add',{itemId},{headers:{token}})

            } catch (error) {

                console.log(error);
                toast.error(error.message)
                
            }
        }

    }

    const getCartCount= () => {
        let totalCount =0;
        for (const items in cartItems) {
             totalCount += cartItems[items];
                    }  
                    return totalCount;
            }
           
    const updateQuantity = async (itemId, quantity) =>{
        let cartData= structuredClone(cartItems);

        cartData[itemId] = quantity;

        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl + '/api/cart/update', {itemId, quantity}, {headers:{token}})
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }  
       
    const getCartAmount = () =>{
        let totalAmount=0;

        for(const items in cartItems){
            let itemInfo= products.find((product)=>product._id === items);
                    if(itemInfo){
                        totalAmount+= itemInfo.price * cartItems[items]
                    } 
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        console.log("called getProductsData");
        
        try {
            const response = await axios.get(backendUrl + '/api/product/list' )
            if(response.data.success){
                setProducts(response.data.products)
            }else{
                toast.error(response.data.message)
                
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message);            
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get' , {}, {headers:{token}})
            if(response.data.success){
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getProductsData();
    },[])
   
    useEffect(() => {
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
            
        }
    },[])

    const value ={
        products,currency,delivery_fee,search,setSearch,
        showSearch,setShowSearch,cartItems , addToCart , getCartCount,
        updateQuantity, getCartAmount, navigate, backendUrl,setToken,token,
        setCartItems, viewinAr

    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;