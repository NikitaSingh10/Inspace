import React, { useState } from "react";
import axios from "axios";
import Rating from "../components/Rating";

const ProductDetails = ({ product, token }) => {

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {

    try {

      await axios.post(
        `http://localhost:4000/api/product/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      alert("Review Submitted");

      setRating(0);
      setComment("");

    } catch (error) {

      console.log(error);

      alert("Error submitting review");
    }
  };

  return (

    <div>
  
      <h3 className="mt-10 text-xl font-semibold">
        Write a Review
      </h3>
  
      <Rating
        rating={rating}
        setRating={setRating}
      />
  
      <textarea
        placeholder="Write your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="4"
        className="border p-2 w-full mt-3"
      />
  
      <button
        onClick={submitReview}
        className="bg-black text-white px-5 py-2 mt-3"
      >
        Submit Review
      </button>
  
      <h3 className="mt-8 text-xl font-semibold">
        Customer Reviews
      </h3>
  
      {product?.reviews?.length > 0 ? (
  
        product.reviews.map((review) => (
  
          <div
            key={review._id}
            className="border-b py-4"
          >
  
            <p className="font-bold">
              {review.name}
            </p>
  
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
  
            <p>{review.comment}</p>
  
          </div>
  
        ))
  
      ) : (
  
        <p>No reviews yet</p>
  
      )}
  
    </div>
  );
};

export default ProductDetails;