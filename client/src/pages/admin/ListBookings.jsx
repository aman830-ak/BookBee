import React, { useState, useEffect } from 'react';
import { Ticket, User, IndianRupee, Calendar, Search, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from "../../lib/supabase";

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllBookings = async () => {
    try {
      // 2. Fetch bookings and JOIN the movies table to get the title
      const { data, error } = await supabase
        .from('bookings')
        .select('*, movie:movies(title)') // Alias movies as 'movie' to match your UI code
        .order('created_at', { ascending: false }); // Show newest bookings first

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Fetch error:", error.message);
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // 3. Updated variables to match Supabase snake_case
  const totalRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);

  const filteredBookings = bookings.filter(booking => 
    booking.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500 gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs animate-pulse">Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
            <Ticket className="text-red-600" /> Booking Management
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Monitor all ticket sales and customer activity.</p>
        </div>

        <div className="bg-[#111114] px-8 py-5 rounded-[2rem] shadow-[0_10px_30px_rgba(220,38,38,0.15)] border border-red-600/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent"></div>
          <p className="text-red-500 text-xs uppercase font-black tracking-widest mb-1 relative z-10">Total Revenue</p>
          <h2 className="text-4xl font-black italic text-white flex items-center gap-1 relative z-10">
            <IndianRupee size={28} className="text-red-500" /> {totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Search by Movie or User ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111114] border border-gray-800 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-red-600 transition-all font-medium placeholder:text-gray-600 shadow-xl"
        />
      </div>

      {/* Bookings Table */}
      <div className="bg-[#111114] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-[#09090b] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-8 py-6">Movie & Date</th>
                <th className="px-8 py-6">Customer (Clerk ID)</th>
                <th className="px-8 py-6">Seats</th>
                <th className="px-8 py-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-900/50 transition-colors group"> {/* Changed _id to id */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg tracking-tight">{booking.movie?.title || "Unknown Movie"}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                          {new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} {/* Changed createdAt */}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                      <User size={14} className="text-gray-600" />
                      <span className="truncate max-w-[120px]" title={booking.user_id}>{booking.user_id}</span> {/* Changed userId */}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                      {booking.selected_seats?.map(seat => ( /* Changed seats to selected_seats */
                        <span key={seat} className="text-[10px] bg-[#09090b] text-gray-300 px-3 py-1.5 rounded-md border border-gray-700 font-black tracking-widest">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-white font-black text-xl italic tracking-tighter">₹{booking.total_price}</span> {/* Changed totalPrice */}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center text-gray-600 italic font-medium">
                    No bookings found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListBookings;