import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios'
import Rating from '../components/Rating'
import { backendUrl } from '../config';

const Product = () => {

const{productId} = useParams();
const{products,currency, addToCart, token} =useContext(ShopContext);
const[productData, setProductData]= useState(false);
const[image , setImage] = useState("");
const navigate = useNavigate();

const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");

const fetchProductData = async () => {

  try {

    const response = await axios.post(
      backendUrl + "/api/product/single",
      {
        productId
      }
    );

    if (response.data.success) {

      setProductData(response.data.product);

      setImage(response.data.product.image[0]);

    }

  } catch (error) {

    console.log(error);

  }
}

const submitReview = async () => {

  try {

    const response = await axios.post(
      backendUrl + `/api/product/${productData._id}/reviews`,
      {
        productId: productData._id,
        rating,
        comment,
      },
      {
        headers: {
          token,
        },
      }
    );

    if (response.data.success) {

      alert("Review Submitted");

      setRating(0);
      setComment("");

      fetchProductData();

    } else {

      alert(response.data.message);

    }

  } catch (error) {

    console.log(error);

    alert("Error submitting review");

  }
};


useEffect(()=>{
  fetchProductData();
},[productId,products])

useEffect(() => {
  // Scroll to top when component mounts
  window.scrollTo(0, 0);
}, []);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
{/*Product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*Product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>

          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item,index)=>(
                <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/*---------Product info-------- */}
        <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.star_icon} alt="" className="w-3" />
              <img src={assets.stardull_icon} alt="" className="w-3" />
              <p className='pl-2'>(122)</p>

            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <button onClick={()=>addToCart(productData._id)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700' >ADD TO CART</button>
              
              {productData.modelUrl && (
              <button onClick={()=>{
                navigate(`/ar-viewer?model=${encodeURIComponent(productData.modelUrl)}&name=${encodeURIComponent(productData.name)}`);
              }} 
              className='bg-black text-white px-10 py-3 text-sm active:bg-gray-700' >VIEW IN AR</button>
            )}
            </div>
            <hr className='mt-8 sm:w-4/5' />
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy return and exchamge policy within 7 days</p>
            </div>
        </div>

      </div>

      

      {/* -------Description and review section-------- */}

      <div className='mt-20'>
          <div className='flex '>
            <b className='border px-5 py-3 text-sm'>Description</b>
          

          </div>
          <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
            <p >An e-commerce website is an online platform for buying and selling products, services, and digital goods.</p>
            <p>E-commerce website typically displays a product catalog, shopping cart, secure checkout, user accounts, and customer service features to facilitate online transactions</p>
          </div>
          {/* REVIEW FORM */}

          <div className='mt-10'>

    <h3 className='text-xl font-semibold mb-3'>
      Write a Review
    </h3>

    <Rating
      rating={rating}
      setRating={setRating}
    />

    <textarea
      placeholder="Write your review"
      value={comment}
      onChange={(e)=>setComment(e.target.value)}
      rows="4"
      className='border p-2 w-full mt-3'
    />

    <button
      onClick={submitReview}
      className='bg-black text-white px-5 py-2 mt-3'
    >
      Submit Review
    </button>

  </div>

  {/* CUSTOMER REVIEWS*/ }

  <div className='mt-10'>

<h3 className='text-xl font-semibold mb-4'> Customer Reviews</h3>

{productData?.reviews?.length > 0 ? (

  productData.reviews.map((review)=>(

    <div
      key={review._id}
      className='border-b py-4'
    >

      <p className='font-bold'>{review.name}</p>

      <div>
        {[1,2,3,4,5].map((star)=>(

          <span
            key={star}
            style={{
              color:
                star <= review.rating
                ? "#ffc107"
                : "#e4e5e9"
            }}
          >
            ★
          </span>

        ))}
      </div>

      <p className='text-gray-600 mt-2'>
        {review.comment}
      </p>

    </div>

  ))

) : (

  <p>No reviews yet</p>

)}

</div>

        </div>
        {/*display related products */}
        
            <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>

    </div>
  ) : <div className='opacity-0'></div>

}

export default Product