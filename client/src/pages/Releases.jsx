import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Make sure this path is correct
import { CalendarDays, Bell, PlayCircle, Star, Loader2 } from 'lucide-react';

const Releases = () => {
  const navigate = useNavigate();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      // Fetching from the RELEASES table we created
      const { data, error } = await supabase
        .from('releases')
        .select(`
          *,
          movie:movies(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReleases(data || []);
    } catch (err) {
      console.error("Database fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Premieres...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24">
      
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
          <CalendarDays className="w-7 h-7 text-red-600" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">New & Upcoming</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Hand-picked by Admin</p>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {releases.length > 0 ? releases.map((item) => {
          const movie = item.movie;
          if (!movie) return null;

          return (
            <div 
              key={item.id} 
              className="group relative flex flex-col md:flex-row bg-[#111114] border border-gray-800 rounded-[2.5rem] overflow-hidden hover:border-gray-600 transition-all duration-700 shadow-2xl cursor-pointer"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <div className="w-full md:w-1/2 lg:w-3/5 h-72 md:h-auto relative overflow-hidden bg-gray-900">
                <img src={movie.backdrop_path} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#09090b] via-transparent to-transparent opacity-90"></div>
                
                <div className={`absolute top-8 left-8 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full ${
                    item.release_type === "Now Showing" ? "bg-red-600" : "bg-blue-600"
                }`}>
                  {item.release_type}
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-[#09090b] md:bg-transparent">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-6 group-hover:text-red-500 transition-colors">
                  {movie.title}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-10 line-clamp-3 text-sm italic">"{movie.overview}"</p>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  <PlayCircle className="w-5 h-5" /> {item.release_type === "Now Showing" ? "Book Tickets" : "Watch Trailer"}
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="py-24 text-center bg-[#111114] border border-gray-800 border-dashed rounded-[3rem]">
            <p className="text-gray-600 font-black uppercase tracking-[0.2em] italic">The release list is empty. Add movies in the Admin Panel!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Releases;