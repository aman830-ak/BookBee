import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // 1. Import Supabase
import { Heart, Trash2, Ticket, Film, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Favorite = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFavorites();
  }, []);

  // 2. Fetch Favorites from Supabase with Movie Details
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          movie:movies(*) 
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error("Error fetching favorites:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Remove from Favorites in Database
  const removeFavorite = async (favId, e) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favId);

      if (error) throw error;
      
      setFavorites(favorites.filter(item => item.id !== favId));
      toast.success("Removed from watchlist");
    } catch (err) {
      toast.error("Failed to remove movie");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs italic">Syncing Watchlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24">
      
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
          <Heart className="w-7 h-7 text-red-600 fill-red-600" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">My Favorites</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Movies you've saved for the big screen</p>
        </div>
      </div>

      {/* Main Content Area */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {favorites.map((item) => {
            const movie = item.movie;
            if (!movie) return null;

            return (
              <div 
                key={item.id} 
                className="group bg-[#111114] border border-gray-800 rounded-[2rem] overflow-hidden hover:border-gray-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col cursor-pointer"
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                {/* Poster Image */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Remove Button Overlay */}
                  <button 
                    onClick={(e) => removeFavorite(item.id, e)}
                    className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl p-2.5 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-300 active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-md font-black italic uppercase tracking-tight text-white mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-6">
                      {movie.release_date?.split('-')[0]} • {movie.genre}
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/movies/${movie.id}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 group-hover:bg-red-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all duration-500"
                  >
                    <Ticket className="w-4 h-4" /> Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#111114]/50 border-2 border-dashed border-gray-800 rounded-[3rem]">
          <div className="w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-800 shadow-2xl">
            <Film className="w-10 h-10 text-gray-800" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-600 max-w-xs mb-10 font-medium italic">
            You haven't saved any movies yet. Explore our collection and add some!
          </p>
          <button 
            onClick={() => navigate('/movies')}
            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
          >
            Explore Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorite;