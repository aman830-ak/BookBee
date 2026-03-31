import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  MonitorPlay, 
  Popcorn, 
  Ticket, 
  Video, 
  ChevronDown, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { supabase } from '../lib/supabase'; // 1. Import Supabase

const Theaters = () => {
  const navigate = useNavigate();
  
  // 2. State Management
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Ghaziabad");
  const [activeShowtimes, setActiveShowtimes] = useState(null);

  // Find this line inside your Theaters component:
const cities = [
  "Ghaziabad", 
  "Noida", 
  "Delhi", 
  "Gurugram", 
  "Lucknow", 
  "Muzaffarpur", 
  "Kanpur", 
  "Jamshedpur", 
  "Haridwar", 
  "Dehradun", 
  "Rishikesh", 
  "Agra", 
  "Jaipur"
];
  // Always scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 3. Fetch Local Theaters from Supabase
  useEffect(() => {
    const fetchTheaters = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('theaters')
          .select('*')
          .eq('city', selectedCity)
          .order('distance_km', { ascending: true });

        if (error) throw error;
        setTheaters(data || []);
      } catch (error) {
        console.error("Database error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24">
      
      {/* Header Section with City Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600/10 rounded-3xl flex items-center justify-center border border-red-500/20 flex-shrink-0">
            <MapPin className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Our Theaters</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Find the best cinematic experiences in {selectedCity}</p>
          </div>
        </div>

        {/* 4. Sleek City Selector Dropdown */}
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="appearance-none bg-[#111114] border border-gray-800 pl-11 pr-12 py-3 rounded-2xl text-sm font-bold outline-none focus:border-red-600 transition-all cursor-pointer shadow-xl hover:bg-gray-900"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}, UP</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-gray-600 font-black uppercase tracking-widest text-xs">Scanning local screens...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {theaters.length > 0 ? theaters.map((theater) => (
            <div 
              key={theater.id} 
              className="group bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-gray-600 transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              <div>
                {/* Theater Name & Distance */}
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h2 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">
                    {theater.name}
                  </h2>
                  <span className="px-4 py-1.5 bg-black border border-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                    {theater.distance_km} km away
                  </span>
                </div>

                {/* Clickable Address (Google Maps) */}
                <div 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater.name + ' ' + theater.address)}`, '_blank')}
                  className="flex items-center gap-2 text-gray-500 text-sm mb-8 cursor-pointer hover:text-red-500 transition-colors w-max group/map"
                  title="View on Google Maps"
                >
                  <MapPin className="w-4 h-4 text-red-600" />
                  <p className="underline decoration-gray-800 underline-offset-8 font-medium italic group-hover/map:decoration-red-500">{theater.address}</p>
                  <ExternalLink size={12} className="opacity-0 group-hover/map:opacity-100 transition-opacity" />
                </div>

                {/* Dynamic Amenities Tags */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {theater.amenities?.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="flex items-center gap-2 px-4 py-2 bg-[#09090b] border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400"
                    >
                      {amenity.includes("IMAX") || amenity.includes("Projection") ? <Video className="w-3 h-3 text-red-600" /> : null}
                      {amenity.includes("Dining") || amenity.includes("Snack") || amenity.includes("Food") ? <Popcorn className="w-3 h-3 text-yellow-500" /> : null}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-gray-800/50">
                <button 
                  onClick={() => navigate('/movies')}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"
                >
                  <Ticket className="w-4 h-4" /> Book Tickets Here
                </button>
                
                <button 
                  onClick={() => setActiveShowtimes(activeShowtimes === theater.id ? null : theater.id)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
                    activeShowtimes === theater.id 
                    ? 'bg-gray-800 border-gray-500 text-white' 
                    : 'bg-transparent border-gray-800 hover:bg-gray-800 text-gray-400'
                  }`}
                >
                  <MonitorPlay className="w-4 h-4" /> 
                  {activeShowtimes === theater.id ? 'Hide Times' : 'Showtimes'}
                </button>
              </div>

              {/* 5. Expanding Showtimes Panel */}
              {activeShowtimes === theater.id && (
                <div className="mt-8 pt-8 border-t border-gray-800/30 animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Today's Available Slots</h3>
                  <div className="flex flex-wrap gap-3">
                    {['10:30 AM', '01:15 PM', '04:45 PM', '08:00 PM', '11:00 PM'].map((time, index) => (
                      <button 
                        key={index}
                        onClick={() => navigate('/movies')}
                        className="px-5 py-3 bg-[#09090b] border border-gray-800 hover:border-red-600 hover:text-red-500 text-xs font-bold text-gray-400 rounded-xl transition-all active:scale-90"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )) : (
            <div className="col-span-full py-24 bg-[#111114]/50 rounded-[3rem] border border-gray-800 border-dashed text-center">
               <p className="text-gray-600 font-bold uppercase tracking-widest italic">No screens found in {selectedCity}. Try Noida or Delhi!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Theaters;