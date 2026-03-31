import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
// 1. Import your Supabase client
import { supabase } from '../lib/supabase.js'; 

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Use the Supabase client instead of fetch
    const fetchMovies = async () => {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('title', { ascending: true }); // Alphabetical order is better for a list page

        if (error) throw error;
        setMovies(data || []);
      } catch (err) {
        console.error("Error loading movies:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center text-red-600 gap-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="text-gray-400 animate-pulse tracking-widest uppercase text-xs">Syncing Library...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] pt-32 px-6 md:px-24 text-white">
      {/* Search Header */}
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h1 className="text-5xl font-black uppercase mb-8 italic tracking-tighter">
          Find Your <span className="text-red-600">Movie</span>
        </h1>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type movie name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-3xl py-6 pl-16 pr-6 text-white outline-none focus:border-red-500/50 transition-all text-xl backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Results Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-20">
          {filteredMovies.map(movie => (
            /* 3. Updated Link and Key to use movie.id */
            <Link to={`/movies/${movie.id}`} key={movie.id} className="group">
              <div className="aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-gray-800 group-hover:border-red-600/50 transition-all duration-500 relative">
                <img 
                  src={movie.poster_path} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={movie.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                   <span className="text-xs font-bold uppercase tracking-widest text-red-500">View Details</span>
                </div>
              </div>
              <h3 className="mt-6 font-bold text-center group-hover:text-red-500 transition-colors uppercase tracking-wide">
                {movie.title}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 italic">No movies found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default Movies;