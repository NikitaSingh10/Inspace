import React from 'react'
import { Link } from 'react-router-dom'

const AIRoomBanner = () => {
  return (
    <Link to="/ai-room" className="block border border-gray-400 hover:opacity-95 transition-opacity">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-12">
          <div className="text-[#414141]">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]" />
              <p className="font-medium text-sm md:text-base">AI ROOM</p>
            </div>
            <h2 className="prata-regular text-3xl sm:py-3 lg:text-4xl leading-relaxed">
              Get Smart Suggestions
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-semibold text-sm md:text-base">TRY NOW</p>
              <p className="w-8 md:w-11 h-[1px] bg-[#414141]" />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 bg-[#fafafa] border-t sm:border-t-0 sm:border-l border-gray-200 flex items-center justify-center py-8 sm:py-0 min-h-[120px] sm:min-h-0">
          <p className="text-xs sm:text-sm text-gray-500 max-w-[280px] text-center sm:text-left">
            Upload a photo of your room and get furniture suggestions that complement your space.
          </p>
        </div>
      </div>
    </Link>
  )
}

export default AIRoomBanner
