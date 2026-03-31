import React, { useState, useEffect } from 'react';
import { Rocket, Trash2, PlusCircle, Loader2, Film, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const ManageReleases = () => {
  const [movies, setMovies] = useState([]); // All movies in library
  const [releases, setReleases] = useState([]); // Current releases
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [releaseType, setReleaseType] = useState("Now Showing");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all movies for the dropdown
      const { data: allMovies } = await supabase.from('movies').select('id, title');
      
      // Fetch current releases and JOIN with movie details
      const { data: currentReleases, error } = await supabase
        .from('releases')
        .select('*, movie:movies(title, poster_path, genre)');

      if (error) throw error;
      setMovies(allMovies || []);
      setReleases(currentReleases || []);
    } catch (error) {
      toast.error("Failed to load release data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddRelease = async (e) => {
    e.preventDefault();
    if (!selectedMovieId) return toast.error("Please select a movie.");
    
    setAdding(true);
    try {
      const { error } = await supabase
        .from('releases')
        .insert([{ movie_id: selectedMovieId, release_type: releaseType }]);

      if (error) throw error;
      
      toast.success("Movie added to Releases! 🚀");
      setSelectedMovieId("");
      fetchData(); // Refresh list
    } catch (error) {
      toast.error("Movie is already in releases!");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveRelease = async (id) => {
    try {
      const { error } = await supabase.from('releases').delete().eq('id', id);
      if (error) throw error;
      setReleases(releases.filter(r => r.id !== id));
      toast.success("Removed from releases.");
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="font-black uppercase tracking-widest text-xs">Syncing Release Schedules...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
          <Rocket className="text-red-600" /> Release Manager
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">Promote movies from your library to the 'Now Showing' section.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Add Release Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddRelease} className="bg-[#111114] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl sticky top-24">
            <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <PlusCircle size={18} className="text-red-600" /> Add to Section
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Movie</label>
                <select 
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="bg-[#09090b] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-red-600"
                >
                  <option value="">-- Choose Movie --</option>
                  {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Section Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Now Showing", "Coming Soon"].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setReleaseType(type)}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                        releaseType === type ? 'bg-red-600 border-red-600 text-white' : 'border-gray-800 text-gray-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={adding}
                className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {adding ? "Deploying..." : "Add to Releases"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Current Releases List */}
        <div className="lg:col-span-2">
          <div className="bg-[#111114] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-[#09090b] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6">Currently Released</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {releases.length > 0 ? releases.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-900/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={item.movie?.poster_path} className="w-10 h-14 rounded-lg object-cover border border-gray-800" />
                        <div>
                          <p className="font-bold text-white text-md tracking-tight">{item.movie?.title}</p>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.movie?.genre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        item.release_type === "Now Showing" ? "bg-green-600/10 text-green-500" : "bg-blue-600/10 text-blue-500"
                      }`}>
                        {item.release_type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleRemoveRelease(item.id)}
                        className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-20 text-center text-gray-600 italic font-medium">No movies in current release schedule.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageReleases;