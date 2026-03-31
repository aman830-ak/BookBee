import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react'; 
import marvelLogo from '../assets/marvelLogo.svg';
import { useNavigate } from 'react-router-dom';

// 1. Accept the 'movies' array passed from Home.jsx
const HeroSection = ({ movies }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // 2. Safety check: Don't render if the database hasn't loaded any movies yet
    if (!movies || movies.length === 0) return null;

    // 3. The Engine: Changes the movie every 5 seconds based on the actual array length
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === movies.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); 

        return () => clearInterval(timer);
    }, [movies.length]);

    // Grab the current movie data based on the timer index
    const movie = movies[currentIndex];

    return (
        <div className='relative flex flex-col items-start justify-center gap-4 px-6
                        md:px-16 lg:px-36 min-h-screen text-white overflow-hidden'>
            
            {/* 4. Dynamic Background Images mapped to real Supabase data */}
            {movies.map((show, index) => (
                <img
                    key={show.id} // Changed to Supabase 'id'
                    src={show.backdrop_path}
                    alt={show.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
                    }`}
                />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-0"></div>

            <div className="relative z-10 flex flex-col items-start justify-center gap-4 mt-20">
                
                <img src={marvelLogo} alt="Marvel Logo" className='max-h-11 lg:h-11' />

                <h1 className='text-5xl md:text-[70px] md:leading-[72px] font-semibold max-w-[800px] drop-shadow-lg transition-all duration-500'>
                    {movie.title}
                </h1>

                <div className='flex items-center gap-4 text-gray-300 flex-wrap font-medium tracking-wide'>
                    {/* Updated to Supabase 'genre' string format */}
                    <span className="text-red-500 font-bold uppercase tracking-widest text-xs">{movie.genre}</span>

                    <div className='flex items-center gap-1.5'>
                        <CalendarIcon className='w-4 h-4' /> 
                        {/* Safely split the date if it exists */}
                        {movie.release_date ? movie.release_date.split('-')[0] : 'TBA'}
                    </div>

                    <div className='flex items-center gap-1.5'>
                        {/* Updated to Supabase 'duration' */}
                        <ClockIcon className='w-4 h-4' /> 
                        {movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'TBA'}
                    </div>
                </div>

                <p className='max-w-md text-gray-300 line-clamp-3 drop-shadow-md text-sm leading-relaxed mt-2'>
                    {movie.overview}
                </p>

                <button 
                    // Make the button navigate to this specific movie's booking page!
                    onClick={() => navigate(`/movies/${movie.id}`)} 
                    className='flex items-center gap-2 px-8 py-3.5 mt-4 text-sm bg-red-600 transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95 rounded-full font-bold tracking-widest uppercase cursor-pointer'
                >
                    Book Tickets Now
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default HeroSection;