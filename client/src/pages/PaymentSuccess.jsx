import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, Home, Calendar, Clock, MapPin, Ticket } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  // Simulate payment processing time
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        {/* Glowing Spinner */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold tracking-wide animate-pulse">Processing Payment...</h2>
        <p className="text-gray-500 mt-2">Please do not close this window</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-20 px-6 flex flex-col items-center justify-center">
      
      {/* Success Header */}
      <div className="flex flex-col items-center text-center mb-10 animate-fade-in-down">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400">Your tickets have been sent to your email.</p>
      </div>

      {/* Digital Ticket Card */}
      <div className="w-full max-w-md bg-gray-900 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.15)] border border-gray-800 overflow-hidden animate-fade-in-up relative">
        
        {/* Ticket Header (Movie Info) */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">BookBee Exclusive</p>
              <h2 className="text-2xl font-bold leading-tight">Captain America: Civil War</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Date</p>
                <p className="font-medium text-sm">Today, 24 Feb 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Time</p>
                <p className="font-medium text-sm">07:30 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Cinema</p>
                <p className="font-medium text-sm">PVR IMAX, City Center</p>
              </div>
            </div>
          </div>
        </div>

        {/* Perforated Line Divider */}
        <div className="relative h-8 bg-gray-900 flex items-center justify-between px-[-10px] overflow-hidden">
          {/* Left Cutout */}
          <div className="w-8 h-8 bg-[#09090b] rounded-full absolute -left-4 border-r border-gray-800"></div>
          {/* Dashed Line */}
          <div className="w-full h-px border-t-2 border-dashed border-gray-700 mx-4"></div>
          {/* Right Cutout */}
          <div className="w-8 h-8 bg-[#09090b] rounded-full absolute -right-4 border-l border-gray-800"></div>
        </div>

        {/* Ticket Footer (Seat Info & Barcode) */}
        <div className="p-6 md:p-8 pt-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Seats</p>
              <p className="text-xl font-bold text-white">F7, F8 (Premium)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase mb-1">Total Paid</p>
              <p className="text-xl font-bold text-white">₹500</p>
            </div>
          </div>

          {/* Fake Barcode */}
          <div className="w-full flex flex-col items-center justify-center opacity-80">
            {/* Using a repeating linear gradient to simulate a barcode */}
            <div className="w-full h-16 bg-[repeating-linear-gradient(90deg,#fff_0,#fff_2px,transparent_2px,transparent_4px,#fff_4px,#fff_5px,transparent_5px,transparent_8px,#fff_8px,#fff_12px,transparent_12px,transparent_14px)] rounded-sm"></div>
            <p className="text-gray-500 text-xs tracking-[0.3em] mt-2 font-mono">BK-982749103</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-in-up">
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-800 text-white rounded-full font-medium transition-all duration-200 hover:bg-gray-700 active:scale-95">
          <Download className="w-5 h-5" />
          Download Ticket
        </button>
        <button 
          onClick={() => navigate('/payment-success')} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 text-white rounded-full font-medium transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>

    </div>
  );
};

export default PaymentSuccess;