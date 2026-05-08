import React from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ rating, setRating }) => {

  return (

    <div className="flex gap-1">

      {[1,2,3,4,5].map((star)=>(

        <FaStar
          key={star}
          size={25}
          style={{
            cursor: "pointer",
            color:
              star <= rating
                ? "#ffc107"
                : "#e4e5e9"
          }}
          onClick={()=>setRating(star)}
        />

      ))}

    </div>
  );
};

export default Rating;