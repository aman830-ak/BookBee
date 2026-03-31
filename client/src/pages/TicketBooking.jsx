import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase.js'; 
import emailjs from '@emailjs/browser'; 
import { 
  ChevronLeft, Loader2, Armchair, Ticket, X, IndianRupee, Gem, Star,
  Coffee, Pizza, Plus, Minus, ShoppingBag 
} from 'lucide-react';

const SNACK_MENU = [
  { id: 'popcorn_l', name: 'Large Caramel Popcorn', price: 250, icon: <ShoppingBag size={24} /> },
  { id: 'nachos', name: 'Cheese Nachos & Salsa', price: 200, icon: <Pizza size={24} /> },
  { id: 'coke_l', name: 'Fountain Cola (Large)', price: 150, icon: <Coffee size={24} /> }
];

// --- 1. RAZORPAY INJECTION SCRIPT ---
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const TicketBooking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [foodOrder, setFoodOrder] = useState({}); 

  const [isBooking, setIsBooking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [theaterConfig, setTheaterConfig] = useState({ 
    rowCount: 6, seatsPerRow: 8, basePrice: 250,
    reclinerRows: [], premiumRows: [], budgetRows: []
  });

  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0); 
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, configRes, bookingsRes] = await Promise.all([
          supabase.from('movies').select('*').eq('id', id).single(),
          supabase.from('theater_settings').select('*').maybeSingle(),
          supabase.from('bookings').select('seats').eq('movie_id', id)
        ]);

        if (movieRes.error) throw movieRes.error;
        setMovie(movieRes.data);

        if (configRes.data) {
          setTheaterConfig({
            rowCount: configRes.data.row_count || 6,
            seatsPerRow: configRes.data.seats_per_row || 8,
            basePrice: configRes.data.base_price || 250,
            reclinerRows: configRes.data.recliner_rows || [],
            premiumRows: configRes.data.premium_rows || [],
            budgetRows: configRes.data.budget_rows || []
          });
        }

        const allOccupied = bookingsRes.data?.flatMap(b => b.seats) || [];
        setOccupiedSeats(allOccupied);

      } catch (error) {
        toast.error("Failed to load theater data");
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const getSeatInfo = (seatId) => {
    const row = seatId.charAt(0);
    const base = Number(movie?.ticket_price || theaterConfig.basePrice);

    if (theaterConfig.reclinerRows.includes(row)) return { price: base * 2, color: 'bg-yellow-600', icon: <Gem size={14} />, label: 'Recliner' };
    if (theaterConfig.premiumRows.includes(row)) return { price: base + 50, color: 'bg-blue-600', icon: <Star size={14} />, label: 'Premium' };
    if (theaterConfig.budgetRows.includes(row)) return { price: Math.max(base - 50, 100), color: 'bg-orange-600', icon: <Armchair size={14} />, label: 'Budget' };
    return { price: base, color: 'bg-gray-700', icon: <Armchair size={14} />, label: 'Standard' };
  };

  const rows = useMemo(() => Array.from({ length: theaterConfig.rowCount }, (_, i) => String.fromCharCode(65 + i)), [theaterConfig.rowCount]);

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return; 
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]);
  };

  const updateFoodQuantity = (itemId, delta) => {
    setFoodOrder(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const seatTotal = useMemo(() => selectedSeats.reduce((sum, seatId) => sum + getSeatInfo(seatId).price, 0), [selectedSeats, theaterConfig]);
  const foodTotal = useMemo(() => Object.entries(foodOrder).reduce((sum, [itemId, qty]) => {
    const item = SNACK_MENU.find(s => s.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0), [foodOrder]);
  
  const totalPrice = seatTotal + foodTotal;
  const finalPrice = useMemo(() => totalPrice - (totalPrice * discount) / 100, [totalPrice, discount]);

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    const { data } = await supabase.from('promos').select('discount_percent').eq('code', promoInput.toUpperCase()).eq('is_active', true).maybeSingle();
    if (data) {
      setDiscount(data.discount_percent);
      setIsPromoApplied(true);
      toast.success("Promo code applied!");
    } else {
      toast.error("Invalid or expired code");
    }
  };

  const sendConfirmationEmail = (bookingId) => {
    const templateParams = {
      user_name: user.fullName || user.username,
      user_email: user.primaryEmailAddress.emailAddress,
      movie_title: movie.title,
      seats: selectedSeats.join(', '),
      total_price: finalPrice,
      booking_id: bookingId,
    };
    emailjs.send('service_tkm206o', 'template_ovox2d1', templateParams, 'xSVeCp0S-z1rHd4UW')
    .then(() => console.log('Ticket Email Sent!'), (err) => console.error('Email failed...', err));
  };

  // --- 2. SAVE TO DB AFTER PAYMENT IS SUCCESSFUL ---
  const saveBookingToDatabase = async (paymentId) => {
    try {
      const formattedFood = Object.entries(foodOrder).map(([foodId, qty]) => {
        const item = SNACK_MENU.find(s => s.id === foodId);
        return `${qty}x ${item.name}`;
      }).join(', ');

      const { data, error } = await supabase.from('bookings').insert([{
        user_id: user.id,
        movie_id: id,
        seats: selectedSeats,
        total_price: finalPrice,
        food_beverages: formattedFood || null,
      }]).select();

      if (error) throw error;
      
      sendConfirmationEmail(data[0].id);
      toast.success("Payment verified! Booking successful! 🎉", { id: 'booking-toast' });
      navigate('/my-tickets'); 
    } catch (error) {
      toast.error(error.message || "Failed to save booking. Please contact support.");
    } finally {
      setIsBooking(false);
      setShowPreview(false); 
    }
  };

  // --- 3. RAZORPAY GATEWAY LOGIC ---
  const handleFinalBooking = async () => {
    if (!isSignedIn) { 
        toast.error("Please login to book tickets!"); 
        return; 
    }
    
    setIsBooking(true); 

    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error("Payment system failed to load. Check your internet.");
        setIsBooking(false);
        return;
      }

      const options = {
        //Razorpay Test key
        key: "rzp_test_SXs5nV9BiW0a1v", 
        // --------------------------------------------------------

        amount: finalPrice * 100, 
        currency: "INR",
        name: "BookBee Cinemas",
        description: `Tickets for ${movie.title}`,
        prefill: {
          name: user.fullName || "Guest",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#dc2626" 
        },
        handler: async function (response) {
          toast.loading("Payment received! Generating tickets...", { id: 'booking-toast' });
          
          await saveBookingToDatabase(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function () {
            setIsBooking(false);
            toast.error("Payment cancelled.");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error("Failed to initialize payment");
      setIsBooking(false);
    }
  };

  if (!movie) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="text-red-600 animate-spin w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-40 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <div className="text-center">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{movie.title}</h1>
            <p className="text-gray-500 text-sm font-medium">Theater: Main Hall • {movie.genre}</p>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Screen */}
        <div className="w-full max-w-2xl mb-16 flex flex-col items-center">
          <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full shadow-[0_0_25px_rgba(220,38,38,0.8)]"></div>
          <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-[0.5em] font-black">Cinema Screen</p>
        </div>

        {/* Seats Grid */}
        <div className="flex flex-col gap-4 mb-12 overflow-x-auto p-4 w-full cursor-default">
          {rows.map(row => (
            <div key={row} className="flex items-center gap-4 md:gap-8 justify-center min-w-max">
              <span className="w-6 text-center text-gray-700 font-black text-sm">{row}</span>
              <div className="flex gap-2 md:gap-4">
                {Array.from({ length: theaterConfig.seatsPerRow }).map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  const seatTier = getSeatInfo(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={isOccupied}
                      className={`w-8 h-8 md:w-11 md:h-11 rounded-t-2xl rounded-b-md transition-all duration-300 flex items-center justify-center
                        ${isOccupied ? 'bg-gray-950 border border-gray-900 cursor-not-allowed opacity-30' : 
                          isSelected ? 'bg-red-600 scale-110 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 
                          `${seatTier.color} hover:brightness-125 cursor-pointer`}
                      `}
                      title={`${seatId} - ₹${seatTier.price}`}
                    >
                      {isSelected ? <Armchair size={14} /> : isOccupied ? <X size={12} className="text-gray-800" /> : seatTier.icon}
                    </button>
                  );
                })}
              </div>
              <span className="w-6 text-center text-gray-700 font-black text-sm">{row}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 bg-gray-900/50 backdrop-blur-md px-8 py-4 rounded-3xl border border-gray-800 mb-16 max-w-2xl mx-auto cursor-default">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase"><div className="w-3 h-3 bg-yellow-600 rounded-sm"></div> Recliner</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Premium</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase"><div className="w-3 h-3 bg-gray-700 rounded-sm"></div> Standard</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase"><div className="w-3 h-3 bg-orange-600 rounded-sm"></div> Budget</div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase font-black"><div className="w-3 h-3 bg-gray-950 border border-gray-800 rounded-sm"></div> Occupied</div>
        </div>

        {/* FOOD SECTION */}
        {selectedSeats.length > 0 && (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
              <Coffee className="text-red-500" /> Pre-book Snacks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SNACK_MENU.map((snack) => {
                const qty = foodOrder[snack.id] || 0;
                return (
                  <div key={snack.id} className={`bg-[#111114] border ${qty > 0 ? 'border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-gray-800'} rounded-3xl p-5 flex flex-col items-center text-center transition-all`}>
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-gray-400 mb-3 group-hover:text-red-500 transition-colors">{snack.icon}</div>
                    <p className="text-xs font-bold text-gray-300 h-8 flex items-center justify-center">{snack.name}</p>
                    <p className="text-red-500 font-black italic mb-4">₹{snack.price}</p>
                    
                    {qty === 0 ? (
                      <button onClick={() => updateFoodQuantity(snack.id, 1)} className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors">Add</button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-red-600 rounded-xl p-1">
                        <button onClick={() => updateFoodQuantity(snack.id, -1)} className="p-1.5 hover:bg-red-700 rounded-lg"><Minus size={14} /></button>
                        <span className="font-black text-sm">{qty}</span>
                        <button onClick={() => updateFoodQuantity(snack.id, 1)} className="p-1.5 hover:bg-red-700 rounded-lg"><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Fixed Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-[#09090b]/90 backdrop-blur-xl border-t border-gray-800 p-5 md:px-20 flex justify-between items-center z-40">
          <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Total Payload</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">₹{finalPrice}</span>
              {foodTotal > 0 && <span className="text-xs text-red-500 font-bold ml-2">({selectedSeats.length} Seats + Snacks)</span>}
            </div>
          </div>
          <button onClick={() => setShowPreview(true)} className="px-10 py-4 text-white font-black uppercase rounded-2xl bg-red-600 hover:bg-red-500 transition-all active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]">Checkout</button>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#111114] border border-gray-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <button onClick={() => setShowPreview(false)} className="absolute top-6 right-6 p-2 bg-gray-900 rounded-full text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
            <div className="p-8">
              <div className="flex items-center gap-3 text-red-500 mb-8"><Ticket size={28} /><h3 className="text-2xl font-black uppercase tracking-tight">Booking Summary</h3></div>
              
              <div className="bg-[#09090b] rounded-3xl p-6 border border-gray-800 mb-6 space-y-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium italic">Seats Selected ({selectedSeats.length})</span><span className="text-white font-bold tracking-tighter">₹{seatTotal}</span></div>

                {foodTotal > 0 && (
                  <>
                    <div className="h-px bg-gray-800/50 my-2"></div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Concessions</p>
                    {Object.entries(foodOrder).map(([id, qty]) => {
                      const item = SNACK_MENU.find(s => s.id === id);
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <span className="text-gray-400 italic">{qty}x {item.name}</span>
                          <span className="text-gray-300 font-bold tracking-tighter">₹{item.price * qty}</span>
                        </div>
                      );
                    })}
                  </>
                )}

                <div className="h-px bg-gray-800 my-2"></div>

                {!isPromoApplied ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Promo Code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} className="flex-1 bg-gray-950 border border-gray-800 rounded-xl py-2 px-4 text-xs uppercase outline-none focus:border-red-500 transition-all" />
                    <button onClick={handleApplyPromo} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-bold uppercase rounded-xl transition-colors">Apply</button>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm bg-green-500/10 p-3 rounded-xl border border-green-500/20"><span className="text-green-500 font-bold text-[10px] uppercase">Promo Applied! 🎉</span><span className="text-green-500 font-bold">-₹{(totalPrice * discount) / 100}</span></div>
                )}

                <div className="h-px bg-gray-800 my-2"></div>
                <div className="flex justify-between items-center"><span className="text-white text-lg font-black uppercase tracking-tighter">Final Payable</span><span className="text-red-500 text-3xl font-black italic flex items-center gap-1"><IndianRupee size={20} />{finalPrice}</span></div>
              </div>

              <button onClick={handleFinalBooking} disabled={isBooking} className="w-full py-5 rounded-2xl font-black bg-red-600 hover:bg-red-500 text-white flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                {isBooking ? <Loader2 className="animate-spin" /> : "Pay Securely with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketBooking;