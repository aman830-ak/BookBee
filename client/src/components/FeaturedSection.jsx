import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

// We now accept 'movies' and 'isLoading' as props from Home.jsx
const FeaturedSection = ({ movies, isLoading, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  // If there's a search query, show all matches. 
  // If not, just show the first 4 for the "Featured" look.
  const displayMovies = searchQuery 
    ? movies 
    : movies.slice(0, 4);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
      
      <div className='relative flex flex-col md:flex-row items-center justify-between pt-20 pb-10 gap-4'>
        <BlurCircle top='0' right='-80px' className='z-10' />
        
        <div>
          <p className='text-gray-300 font-medium text-lg uppercase tracking-widest italic'>
            Now Showing
          </p>
          {searchQuery && (
            <span className='text-xs text-red-500'>Showing results for "{searchQuery}"</span>
          )}
        </div>

        {/* View All Button */}
        <button 
          onClick={() => navigate('/movies')} 
          className='group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition cursor-pointer'
        >
          View All 
          <ArrowRight className='group-hover:translate-x-1 transition w-4 h-4'/>
        </button>
      </div>
      
      <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
        {isLoading ? (
          // Show skeletons while Supabase is loading
          Array.from({ length: 4 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))
        ) : (
          // Map through movies. Note: using 'show.id' instead of 'show._id'
          displayMovies.length > 0 ? (
            displayMovies.map((show) => (
              <MovieCard key={show.id} movie={show}/> 
            ))
          ) : (
            <div className="w-full py-20 text-center border border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-500 italic">No movies found matching your search...</p>
            </div>
          )
        )}
      </div>

      {/* Only show the "Show More" button if we aren't searching and have many movies */}
      {!searchQuery && movies.length > 4 && (
        <div className='flex justify-center mt-20'>
          <button 
            onClick={() => { navigate('/movies'); window.scrollTo(0,0); }}
            className='px-10 py-3 text-sm bg-red-600 hover:bg-red-700 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95 transition-all duration-200 rounded-md font-medium text-white cursor-pointer'
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedSection;