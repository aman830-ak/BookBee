import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube'; 
import BlurCircle from './BlurCircle';
import { PlayCircleIcon } from 'lucide-react';

// Improved helper to handle different YouTube link formats
const getYoutubeVideoId = (url) => {
  if (!url) return '';
  // Handles standard v= links and short youtu.be links
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const TrailersSection = ({ movies }) => {
  // 1. Initialize currentTrailer as null until movies load
  const [currentTrailer, setCurrentTrailer] = useState(null);
  
  // 2. Set the first movie as the default trailer once movies are available
  useEffect(() => {
    if (movies && movies.length > 0 && !currentTrailer) {
      setCurrentTrailer(movies[0]);
    }
  }, [movies, currentTrailer]);

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0, // Changed to 0 so it doesn't blast sound immediately on home load
    },
  };

  // Safety: If movies aren't loaded yet, show nothing or a small spacer
  if (!movies || movies.length === 0 || !currentTrailer) return <div className="py-20"></div>;

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-28 pb-20 overflow-hidden relative'>
      <p className='text-gray-300 font-bold uppercase tracking-tighter text-2xl max-w-[960px] mx-auto text-left mb-8 italic'>
        Latest Trailers
      </p>

      <BlurCircle top='-100px' right='-100px' className='z-10 pointer-events-none' />

      {/* Main Video Section */}
      <div className='mx-auto w-full max-w-5xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800/50'>
        {/* We use movie.trailer_url (Assuming you added this column in Supabase) */}
        <YouTube 
          videoId={getYoutubeVideoId(currentTrailer.trailer_url)} 
          opts={opts} 
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" 
        />
      </div>

      {/* Thumbnail Slider */}
      <div 
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-4 md:gap-6 mt-12 max-w-5xl mx-auto pb-6 no-scrollbar snap-x snap-mandatory ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {movies.map((movie) => (
          <div 
            key={movie.id}
            className={`relative group flex-shrink-0 w-64 md:w-80 aspect-video rounded-3xl overflow-hidden snap-start transition-all duration-500 border-2 ${
                currentTrailer.id === movie.id ? 'border-red-600 scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            onClick={() => {
              if (!isDragging) setCurrentTrailer(movie);
            }} 
          >
            <img 
              src={movie.backdrop_path} 
              alt={movie.title} 
              className='w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all duration-700' 
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                <p className="text-white font-black uppercase italic text-[10px] tracking-widest truncate">
                    {movie.title}
                </p>
            </div>

            <PlayCircleIcon 
              strokeWidth={1.5} 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white transition-all duration-500 ${
                currentTrailer.id === movie.id ? 'scale-110 opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
