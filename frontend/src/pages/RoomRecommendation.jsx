import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backendUrl } from "../config";
import Title from "../components/Title";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const RoomRecommendation = () => {
  const {
    currency,
    roomRecommendations,
    setRoomRecommendations,
    roomPreviewUrl,
    setRoomPreviewUrl,
  } = useContext(ShopContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (roomRecommendations?.length > 0) setRecommendations(roomRecommendations);
    if (roomPreviewUrl) setPreview(roomPreviewUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore from context only on mount
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setRoomPreviewUrl(url);
    setSelectedFile(file);
    setRecommendations([]);
    setRoomRecommendations([]);
    setError(null);
  };

  const handleSend = async () => {
    if (!selectedFile) {
      setError("Please upload a room image first.");
      return;
    }
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result || "").split(",")[1];
      if (!base64) {
        setError("Could not read image.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(
          backendUrl + "/api/ai/recommend-room",
          { image: base64 }
        );
        if (response.data.success) {
          const list = response.data.recommendations || [];
          setRecommendations(list);
          setRoomRecommendations(list);
        } else {
          setError(response.data.message || "Could not get suggestions.");
        }
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Request failed. Try a smaller image.";
        setError(msg);
        setRecommendations([]);
        setRoomRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto pt-10 pb-16 px-4 sm:px-6">
        {/* Section header – matches Home / LatestCollection + Hero serif */}
        <div className="text-center py-8">
          <Title text1={"AI"} text2={"ROOM RECOMMENDATION"} />
          <h1 className="prata-regular text-2xl sm:text-3xl lg:text-4xl text-[#414141] mt-2">
            Get Smart Suggestions
          </h1>
          <p className="w-full max-w-xl mx-auto text-xs sm:text-sm md:text-base text-gray-600 mt-3">
            Upload your room image and get smart furniture suggestions tailored to your space.
          </p>
        </div>

        {/* Upload section – clean border, no gray box */}
        <div className="border border-gray-400 py-12 px-6 sm:py-16 sm:px-10 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <div
            onClick={handleUploadClick}
            className="inline-flex flex-col sm:flex-row items-center gap-2 cursor-pointer text-[#414141] hover:opacity-80 transition-opacity"
          >
            <p className="font-semibold text-sm md:text-base">UPLOAD IMAGE</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141] flex-shrink-0" />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Choose a photo of your room, then click Send to get suggestions
          </p>

          {preview && (
            <div className="flex flex-col items-center mt-8">
              <img
                src={preview}
                alt="Room preview"
                className="max-w-full max-h-72 object-cover border border-gray-200"
              />
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={loading}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-sm md:text-base text-[#414141] border border-[#414141] px-6 py-3 hover:bg-[#414141] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing…" : "Send"}
                </button>
              )}
              {!selectedFile && recommendations.length > 0 && (
                <p className="mt-4 text-sm text-gray-500">
                  Upload a new image above to get new suggestions.
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Recommendations – same pattern as LatestCollection */}
        {recommendations.length > 0 && (
          <div className="mt-10 border-t border-gray-200 pt-10">
            <div className="text-center mb-6">
              <Title text1={"RECOMMENDED"} text2={"FOR YOU"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
              {recommendations.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="text-gray-700 cursor-pointer group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover group-hover:scale-110 transition ease-in-out"
                    />
                  </div>
                  <p className="pt-3 pb-1 text-sm">{item.name}</p>
                  <p className="text-sm font-medium">
                    {currency}
                    {item.price}
                  </p>
                  <span className="inline-flex items-center gap-2 mt-2 text-xs font-semibold text-[#414141]">
                    VIEW IN AR
                    <span className="w-6 h-[1px] bg-[#414141]" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomRecommendation;
