import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItems from './ProductItems';

const BestSeller = () => {

const {products}= useContext(ShopContext);
const [bestSeller, setBestSeller]= useState([]);

useEffect(()=>{
    const bestProduct = products.filter((item)=>(item.bestseller));
    setBestSeller(bestProduct.slice(0,5))
},[products])

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={'SELLER'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            The Best Seller section highlights the most popular and frequently purchased products on the platform. It serves as a curated showcase of high-demand interior décor items, helping users quickly discover trusted and trending pieces for their spaces.
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {bestSeller.map((item,index)=>(
                <ProductItems key={index} id={item._id} name={item.name} image={item.image} price={item.price} />

            ))}

        </div>
    </div>
  )
}

export default BestSeller