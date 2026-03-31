import React from 'react';

const MovieCardSkeleton = () => {
  return (
    // The main container matches the size and background of the real card, plus animate-pulse
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl animate-pulse w-66'>
      
      {/* 1. The Poster Image Placeholder */}
      <div className="rounded-lg h-52 w-full bg-gray-700"></div>

      {/* 2. The Title Placeholder (slightly shorter than full width) */}
      <div className='h-5 bg-gray-700 rounded-md w-3/4 mt-4'></div>

      {/* 3. The Details/Year Placeholder (two lines to simulate the text) */}
      <div className='h-3 bg-gray-700 rounded-md w-full mt-3'></div>
      <div className='h-3 bg-gray-700 rounded-md w-4/5 mt-2'></div>

      {/* 4. The Bottom Row (Button and Rating Placeholders) */}
      <div className='flex items-center justify-between mt-5 pb-3'> 
        {/* Button Skeleton */}
        <div className='h-8 w-24 bg-gray-700 rounded-full'></div>
        
        {/* Rating Skeleton */}
        <div className='h-4 w-10 bg-gray-700 rounded-md'></div>
      </div>

    </div>
  );
};

export default MovieCardSkeleton;