import { StarIcon, Calendar, Clock } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from '../lib/timeFormat';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Helper to handle navigation to the UUID-based route
  const handleDetailsNavigation = () => {
    navigate(`/movies/${movie.id}`); // Changed from _id to id
    window.scrollTo(0, 0);
  };

  return (
    <div className='group flex flex-col justify-between p-3 bg-[#111114] border border-gray-900 rounded-2xl hover:border-red-600/50 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 w-64'>
      
      {/* Poster Image Container */}
      <div 
        className="overflow-hidden rounded-xl h-80 w-full cursor-pointer bg-gray-950 relative" 
        onClick={handleDetailsNavigation}
      >
        <img 
          src={movie.poster_path} 
          alt={movie.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop"; 
          }}
          className='h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110'
        />
        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Movie Info */}
      <div className="px-1">
        <p className='font-bold mt-4 truncate text-white text-lg tracking-tight group-hover:text-red-500 transition-colors'>
          {movie.title}
        </p>

        <div className='flex items-center gap-3 text-[11px] text-gray-500 mt-2 uppercase tracking-widest font-semibold'>
          <span className="flex items-center gap-1">
             {movie.release_date ? new Date(movie.release_date).getFullYear() : "2026"}
          </span>
          <span>•</span>
          <span className="text-gray-400">
            {/* Handle both string genres and array genres from Supabase */}
            {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre || "Action"}
          </span>
        </div>
      </div>

      {/* Footer / Action Section */}
      <div className='flex items-center justify-between mt-6 pb-2'> 
        <button 
          onClick={handleDetailsNavigation}
          className='px-5 py-2.5 text-[10px] uppercase tracking-tighter bg-red-600 hover:bg-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all duration-200 rounded-lg font-black text-white cursor-pointer'
        >
          Book Now
        </button>
        
        <div className='flex items-center gap-1 text-sm text-gray-400'>
            <StarIcon className='w-3.5 h-3.5 text-yellow-500 fill-yellow-500' />
            <span className="text-white font-medium">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "8.5"}
            </span>
        </div>
      </div>

    </div>
  );
};

export default MovieCard;