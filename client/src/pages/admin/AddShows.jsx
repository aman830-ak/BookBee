import React, { useState } from 'react';
import { 
  Film, ImageIcon, Calendar, Clock, Tag, FileText, Send, 
  PlusCircle, Trash2, IndianRupee, PlayCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase'; // Corrected path

const AddShows = () => {
  const initialFormState = {
    title: '',
    overview: '',
    poster_path: '',
    backdrop_path: '',
    trailer_url: '', // New field
    genre: '',
    duration: '',
    release_date: '',
    ticketPrice: '' 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('movies')
        .insert([
          {
            title: formData.title,
            overview: formData.overview,
            poster_path: formData.poster_path,
            backdrop_path: formData.backdrop_path,
            trailer_url: formData.trailer_url, // Save the trailer link
            genre: formData.genre,
            duration: parseInt(formData.duration), 
            release_date: formData.release_date,
            ticket_price: parseFloat(formData.ticketPrice),
            vote_average: 8.0 
          }
        ]);

      if (error) throw error;

      toast.success("Movie added with Trailer! 🍿");
      setFormData(initialFormState); 
      
    } catch (error) {
      toast.error(error.message || "Failed to add movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
          <PlusCircle className="text-red-600" /> Add New Movie
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#111114] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Film size={14} /> Movie Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <div className="flex flex-col gap-2"><label className="text-xs font-black text-gray-500 uppercase tracking-widest"><Tag size={14} /> Genre</label>
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <div className="flex flex-col gap-2"><label className="text-xs font-black text-gray-500 uppercase tracking-widest"><Clock size={14} /> Duration</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 text-red-500">
              <PlayCircle size={14} /> YouTube Trailer URL
            </label>
            <input 
              type="text" name="trailer_url" value={formData.trailer_url} onChange={handleChange} required
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-[#09090b] border-2 border-red-600/20 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600 placeholder:text-gray-800"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2"><label className="text-xs font-black text-gray-500 uppercase tracking-widest">Poster URL</label>
            <input type="text" name="poster_path" value={formData.poster_path} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2"><label className="text-xs font-black text-gray-500 uppercase tracking-widest">Backdrop URL</label>
            <input type="text" name="backdrop_path" value={formData.backdrop_path} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Overview</label>
            <textarea name="overview" value={formData.overview} onChange={handleChange} required rows="3" className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600 resize-none"></textarea>
          </div>

          <div className="flex flex-col gap-2"><label className="text-xs font-black text-gray-500 uppercase tracking-widest">Release Date</label>
            <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <div className="flex flex-col gap-2"><label className="text-xs font-black text-gray-500 uppercase tracking-widest">Price</label>
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} required className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-600" />
          </div>

          <button type="submit" disabled={loading} className="md:col-span-2 py-5 mt-4 rounded-2xl font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 transition-all">
            {loading ? "Publishing..." : "Publish Movie"}
          </button>
        </form>

        <div className="hidden lg:block sticky top-24">
           {/* Preview Card (Optional) */}
           <div className="p-6 bg-[#111114] border border-gray-800 rounded-[2.5rem] text-center italic text-gray-600 text-xs">
              Preview will appear here
           </div>
        </div>
      </div>
    </div>
  );
};

export default AddShows;