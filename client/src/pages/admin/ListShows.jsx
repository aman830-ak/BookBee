import React, { useState, useEffect } from 'react';
import { Film, Trash2, ExternalLink, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { supabase } from "../../lib/supabase";

const ListShows = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMovies = async () => {
    try {
      // 2. Fetch movies directly from Supabase, newest first
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error("Fetch error:", error.message);
      toast.error("Failed to load movies from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to completely remove "${title}"?`)) return;

    try {
      // 3. Delete the movie using its UUID
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`${title} removed.`);
      // Remove the movie from the local state so the UI updates instantly
      setMovies(movies.filter(movie => movie.id !== id)); // Changed _id to id
      
    } catch (error) {
      console.error("Delete error:", error.message);
      // Helpful error message in case they try to delete a movie that already has bookings
      toast.error("Could not delete. Movie might have active bookings!"); 
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs animate-pulse">Fetching Movie Library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
            <Film className="text-red-600" /> Movie Library
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Manage all movies currently active on BookBee.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111114] border border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-red-600 w-full md:w-80 transition-all font-medium placeholder:text-gray-600 shadow-xl"
          />
        </div>
      </div>

      <div className="bg-[#111114] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-[#09090b] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-8 py-6">Movie</th>
                <th className="px-8 py-6 hidden lg:table-cell">Genre</th>
                <th className="px-8 py-6 hidden md:table-cell">Duration</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
                <tr key={movie.id} className="group hover:bg-gray-900/50 transition-colors"> {/* Changed _id to id */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <img 
                        src={movie.poster_path} 
                        alt={movie.title} 
                        className="w-14 h-20 rounded-xl object-cover bg-gray-900 border border-gray-800 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <p className="font-bold text-white text-lg tracking-tight">{movie.title}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 md:hidden">{movie.genre}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 hidden lg:table-cell">
                    <span className="text-[10px] text-gray-300 bg-[#09090b] px-3 py-1.5 rounded-md border border-gray-800 font-black tracking-widest uppercase">
                      {movie.genre || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-5 hidden md:table-cell text-gray-400 text-sm font-medium">
                    {movie.duration ? `${movie.duration} mins` : "TBA"}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        to={`/movies/${movie.id}`}  /* Changed _id to id */
                        className="p-3 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                        title="View on site"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(movie.id, movie.title)} /* Changed _id to id */
                        className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Delete Movie"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center text-gray-600 italic font-medium">
                    No movies found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Link 
          to="/admin/add-shows" 
          className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm py-4 px-10 rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
        >
          + Add Another Movie
        </Link>
      </div>
    </div>
  );
};

export default ListShows;