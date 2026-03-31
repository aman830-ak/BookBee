import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase.js'; 

import HeroSection from '../components/HeroSection';
import TrailerSection from '../components/TrailersSection';
import FeaturedSection from '../components/FeaturedSection'; 

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data, error: sbError } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });

        if (sbError) throw sbError;
        setMovies(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie =>
      movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movies, searchQuery]);

  // LOGIC: Grab the 5 newest movies to power the Auto-Carousel
  const heroCarouselMovies = movies.slice(0, 5);

  if (loading) {
    return (
      <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-white font-bold tracking-widest uppercase">Loading QuickShow</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-gray-400">
        Error loading database: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-red-600/30">
      
      {/* 1. HERO: Now receives an array of movies to cycle through */}
      <HeroSection movies={heroCarouselMovies} />

      <FeaturedSection 
        movies={filteredMovies} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        totalCount={movies.length} 
      />

      <TrailerSection movies={movies} />

      <footer className="py-10 text-center text-gray-600 text-sm border-t border-gray-900">
        © 2026 QuickShow — Built with Supabase
      </footer>
    </div>
  );
};

export default Home;