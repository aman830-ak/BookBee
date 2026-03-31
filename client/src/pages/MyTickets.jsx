import React, { useState, useEffect } from 'react';
import { 
  Ticket, Calendar, Clock, MapPin, Download, 
  XCircle, Loader2, AlertCircle, IndianRupee, Armchair, Coffee 
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase.js';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';

const CANCEL_FEE_PERCENT = 20;

const MyTickets = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTickets = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, movie:movies(*)') 
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTickets(data || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
        toast.error("Could not load your tickets.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [isLoaded, isSignedIn, user?.id]);

  const handleSaveTicket = async (ticketId, movieTitle) => {
    const ticketElement = document.getElementById(`ticket-${ticketId}`);
    if (!ticketElement) return;
    const loadingToast = toast.loading("Generating high-res ticket...");

    try {
      const dataUrl = await toPng(ticketElement, {
        backgroundColor: '#111114', 
        pixelRatio: 3, 
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `BookBee-${movieTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      toast.success("Ticket saved to gallery!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to save ticket.", { id: loadingToast });
    }
  };

  const handleCancelConfirm = async () => {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', selectedBooking.id); 
      if (error) throw error;
      toast.success("Refund initiated! 💸");
      setTickets(tickets.filter(t => t.id !== selectedBooking.id)); 
      setSelectedBooking(null); 
    } catch (error) {
      toast.error("Cancellation failed.");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="text-red-600 animate-spin w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20"><Ticket className="w-7 h-7 text-red-600" /></div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">My Tickets</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Your digital pass to the big screen</p>
          </div>
        </div>

        {tickets.length === 0 ? (
           <div className="text-center py-24 bg-[#111114]/50 rounded-[3rem] border border-gray-800 border-dashed">
             <Ticket className="w-12 h-12 text-gray-800 mx-auto mb-4" />
             <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">No active passes</h2>
           </div>
        ) : (
          <div className="flex flex-col gap-8">
            {tickets.map((ticket) => (
              <div 
                id={`ticket-${ticket.id}`} 
                key={ticket.id} 
                className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:border-gray-600 transition-all duration-500 shadow-2xl group"
              >
                {/* Movie Poster */}
                <div className="w-full md:w-36 lg:w-48 aspect-[2/3] flex-shrink-0 rounded-[1.5rem] overflow-hidden shadow-2xl border border-gray-800">
                  <img src={ticket.movie?.poster_path} alt="" crossOrigin="anonymous" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-500 transition-colors">{ticket.movie?.title}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">Confirmed</span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest"># {ticket.id}</span>
                      </div>
                    </div>

                    {/* QR CODE SECTION */}
                    <div className="hidden sm:block p-3 bg-white rounded-2xl border-4 border-white shadow-xl">
                      <QRCodeCanvas 
                        value={`BOOKBEE-VERIFY-${ticket.id}`} 
                        size={80} 
                        level={"H"} 
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">
                    <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-red-600" /><span>{new Date(ticket.created_at).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-red-600" /><span>Showtime Confirmed</span></div>
                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-red-600" /><span>Premium Hall</span></div>
                    <div className="flex items-center gap-3"><Armchair className="w-4 h-4 text-red-600" /><span>Seats: <strong className="text-white ml-1">{ticket.seats?.join(', ')}</strong></span></div>
                  </div>

                  {/* NEW FOOD & BEVERAGE DISPLAY */}
                  {ticket.food_beverages && (
                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                      <div className="flex items-start gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Coffee className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>Add-ons: <strong className="text-white ml-1 lowercase capitalize leading-relaxed">{ticket.food_beverages}</strong></span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-gray-800/50 gap-6">
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total Paid</p>
                      <p className="text-3xl font-black italic text-white flex items-center gap-1"><IndianRupee size={24} className="text-gray-500" />{ticket.total_price}</p>
                    </div>
                    
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button onClick={() => setSelectedBooking(ticket)} className="flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-800 flex"><XCircle className="w-4 h-4" /> Cancel</button>
                      <button onClick={() => handleSaveTicket(ticket.id, ticket.movie?.title)} className="flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] flex"><Download className="w-4 h-4" /> Save</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CANCELLATION MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#111114] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-6"><AlertCircle size={32} /><h3 className="text-2xl font-black italic uppercase tracking-tighter">Cancel Ticket?</h3></div>
            <p className="text-gray-400 text-sm mb-8 font-medium italic leading-relaxed">Are you sure? You'll receive a refund of <span className="text-green-500 font-bold">₹{selectedBooking.total_price * (1 - CANCEL_FEE_PERCENT / 100)}</span> after the cancellation fee.</p>
            <div className="flex gap-4">
              <button onClick={() => setSelectedBooking(null)} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase text-gray-400 bg-gray-900 hover:bg-gray-800 transition-all">Go Back</button>
              <button onClick={handleCancelConfirm} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;