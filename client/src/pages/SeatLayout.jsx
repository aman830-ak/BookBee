import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MonitorPlay, Info, CheckCircle2, XCircle } from 'lucide-react';

const SeatLayout = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // To know which movie they are booking

  // 1. State for selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 2. Mock Seat Data (You will eventually fetch this from your database)
  // We'll create 3 pricing tiers: VIP, Premium, and Standard
  const rows = [
    { id: 'H', tier: 'VIP', price: 400, seats: 12 },
    { id: 'G', tier: 'VIP', price: 400, seats: 12 },
    { id: 'F', tier: 'Premium', price: 250, seats: 14 },
    { id: 'E', tier: 'Premium', price: 250, seats: 14 },
    { id: 'D', tier: 'Premium', price: 250, seats: 14 },
    { id: 'C', tier: 'Standard', price: 150, seats: 16 },
    { id: 'B', tier: 'Standard', price: 150, seats: 16 },
    { id: 'A', tier: 'Standard', price: 150, seats: 16 },
  ];

  // Randomly mock some "sold" seats for realism
  const soldSeats = ['H4', 'H5', 'F7', 'F8', 'F9', 'C2', 'C3', 'A10', 'A11', 'A12'];

  // 3. Handle Seat Click Logic
  const handleSeatClick = (seatId, price) => {
    if (soldSeats.includes(seatId)) return; // Can't click sold seats

    if (selectedSeats.find(s => s.id === seatId)) {
      // Deselect if already selected
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      // Select seat (limit to max 8 tickets for example)
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, { id: seatId, price }]);
      } else {
        alert("You can only select up to 8 seats at a time.");
      }
    }
  };

  // Calculate Total Price
  const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-40 px-6 md:px-16">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">Select Your Seats</h1>
          <p className="text-gray-400 mt-1">Captain America: Civil War • Today, 7:30 PM</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-6 bg-gray-900/50 px-6 py-3 rounded-full border border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-t-md rounded-b-sm border border-gray-600"></div>
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            <span className="text-sm text-gray-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-t-md rounded-b-sm bg-gray-800 flex items-center justify-center"><XCircle size={12} className="text-gray-600"/></div>
            <span className="text-sm text-gray-400">Sold</span>
          </div>
        </div>
      </div>

      {/* Seat Map Container (Scrollable on mobile) */}
      <div className="max-w-5xl mx-auto overflow-x-auto no-scrollbar pb-10 cursor-default">
        <div className="min-w-[700px] flex flex-col items-center gap-6">
          
          {/* Cinema Screen Effect */}
          <div className="w-full flex flex-col items-center mb-10">
            <div className="w-3/4 h-12 border-t-4 border-red-500 rounded-[100%] blur-[2px] opacity-60 absolute -mt-4"></div>
            <div className="w-3/4 h-12 border-t-2 border-red-400 rounded-[100%] shadow-[0_-15px_40px_rgba(239,68,68,0.3)] flex items-start justify-center pt-2 relative z-10 bg-gradient-to-b from-white/5 to-transparent">
              <span className="text-gray-400 tracking-[0.3em] text-sm uppercase flex items-center gap-2">
                 Screen This Way
              </span>
            </div>
          </div>

          {/* Render Rows */}
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-center gap-4 md:gap-8 w-full">
              
              {/* Row Label Left */}
              <div className="w-6 text-center text-gray-500 font-bold">{row.id}</div>
              
              {/* Seats */}
              <div className="flex gap-2">
                {Array.from({ length: row.seats }).map((_, index) => {
                  const seatNumber = index + 1;
                  const seatId = `${row.id}${seatNumber}`;
                  const isSold = soldSeats.includes(seatId);
                  const isSelected = selectedSeats.find(s => s.id === seatId);

                  // Create a gap in the middle to simulate an aisle
                  const isAisle = seatNumber === Math.floor(row.seats / 2);

                  return (
                    <React.Fragment key={seatId}>
                      <button
                        onClick={() => handleSeatClick(seatId, row.price)}
                        disabled={isSold}
                        className={`
                          w-7 h-8 md:w-9 md:h-10 rounded-t-lg rounded-b-sm transition-all duration-200 flex items-center justify-center text-xs font-medium
                          ${isSold 
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                            : isSelected 
                              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.8)] -translate-y-1' 
                              : 'border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 hover:-translate-y-1 cursor-pointer'}
                        `}
                      >
                        {isSelected ? <CheckCircle2 size={16} /> : seatNumber}
                      </button>
                      
                      {/* Render the aisle gap */}
                      {isAisle && <div className="w-6 md:w-10"></div>}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <div className="w-6 text-center text-gray-500 font-bold">{row.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar (Checkout) */}
      <div className={`fixed bottom-0 left-0 w-full bg-[#09090b]/90 backdrop-blur-md border-t border-gray-800 transform transition-transform duration-300 z-50 ${selectedSeats.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Selected Info */}
          <div className="flex items-center gap-6 w-full sm:w-auto">
            <div>
              <p className="text-gray-400 text-sm">Selected Seats</p>
              <p className="text-white font-semibold text-lg">{selectedSeats.map(s => s.id).join(', ')}</p>
            </div>
            <div className="h-10 w-px bg-gray-700 hidden sm:block"></div>
            <div>
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-white font-bold text-2xl">₹{totalPrice}</p>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={() => navigate('/payment')} // Route this to your payment/success page later
            className="w-full sm:w-auto px-10 py-3.5 bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] text-white rounded-full font-bold text-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            Pay Now <MonitorPlay size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default SeatLayout;