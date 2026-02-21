import React, { useState } from "react";
import axios from "axios";

const RoomRecommendation = () => {

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      try {
        const response = await axios.post(
          "http://localhost:4000/api/ai/recommend-room",
          { image: base64 }
        );
       //console.log(response.data);
        if (response.data.success) {
          setRecommendations(response.data.recommendations);
          

        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            AI Room Recommendation
          </h2>
          <p className="text-gray-500 mt-2">
            Upload your room image and get smart furniture suggestions
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />

          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Room Preview"
                className="w-64 h-48 object-cover rounded-lg shadow"
              />
            </div>
          )}

          {loading && (
            <p className="text-blue-600 font-medium">
              Analyzing room...
            </p>
          )}
        </div>

        {/* Recommendation Section */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Recommended For You
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {recommendations.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <h4 className="mt-4 text-lg font-medium text-gray-800">
                    {item.name}
                  </h4>

                  <p className="text-gray-600 mt-1">
                    ₹{item.price}
                  </p>

                  <button
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    onClick={() => window.location.href = `/product/${item._id}`}
                  >
                    View in AR
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoomRecommendation;
