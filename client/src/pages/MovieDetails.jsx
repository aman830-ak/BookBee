import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Ticket, Star, Clock, Calendar, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase.js'; 
import MovieReviews from '../components/MovieReviews.jsx';

const MovieDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSingleMovie = async () => {
      setIsLoading(true);
      window.scrollTo(0, 0); 
      
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single(); 

        if (error) throw error;
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error.message);
        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white gap-6">
      <h2 className="text-3xl font-bold italic uppercase tracking-widest">Movie not found! 🎬</h2>
      <button onClick={() => navigate('/')} className="text-red-500 hover:underline font-bold uppercase tracking-widest">Return to Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-20 selection:bg-red-600/30">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-10 left-6 md:left-12 z-50 p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-red-600 transition-all cursor-pointer group shadow-xl"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Backdrop Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-950">
        <img 
          src={movie.backdrop_path} 
          alt="Backdrop" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
      </div>

      {/* Main Container Wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10 -mt-40 md:-mt-64">
        
        {/* Movie Info Grid (Poster + Details) */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-end mb-16">
          
          {/* Poster */}
          <div className="w-56 md:w-80 flex-shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-gray-900 group">
            <img 
              src={movie.poster_path} 
              alt={movie.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Info Area */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic leading-none">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 text-gray-300 text-sm md:text-lg font-semibold mb-8">
              <span className="flex items-center gap-2"><Star className="w-5 h-5 text-red-600 fill-red-600" /> {movie.vote_average || "8.2"}</span>
              <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-500" /> {movie.release_date || "2026"}</span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-gray-500" /> {movie.duration || "2h 15m"}</span>
              <span className="px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full text-xs text-red-500 font-black uppercase tracking-widest">
                {movie.genre || "Action"}
              </span>
            </div>

            <p className="text-gray-400 max-w-3xl leading-relaxed mb-10 text-base md:text-xl font-medium italic">
              "{movie.overview}"
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <button 
                onClick={() => navigate(`/movies/${movie.id}/today`)} 
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-tighter transition-all duration-300 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] active:scale-95 cursor-pointer"
              >
                <Ticket className="w-6 h-6" />
                Book Tickets
              </button>

              <button 
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`, '_blank')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black uppercase tracking-tighter transition-all duration-300 hover:bg-white hover:text-black active:scale-95 cursor-pointer"
              >
                <Play className="w-6 h-6" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------- */}
        {/* NEW REVIEWS COMPONENT INJECTED HERE         */}
        {/* ------------------------------------------- */}
        <MovieReviews movieId={movie.id} />
        
      </div>
    </div>
  );
};

export default MovieDetails;