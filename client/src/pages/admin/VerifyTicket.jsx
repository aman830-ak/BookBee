import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, XCircle, ChevronLeft, Camera, 
  Loader2, Ticket, User, Armchair, Film 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const VerifyTicket = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // 1. Initialize the scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(result) {
      scanner.clear(); // Stop scanning once we find a code
      handleVerification(result);
    }

    function onScanError(err) {
      // We ignore errors here because the scanner throws errors constantly 
      // when it doesn't see a QR code in the frame.
    }

    return () => scanner.clear();
  }, []);

  const handleVerification = async (qrValue) => {
    // QR format: BOOKBEE-VERIFY-123
    const ticketId = qrValue.split('-').pop();
    
    setIsValidating(true);
    setScanResult(qrValue);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, movie:movies(*)')
        .eq('id', ticketId)
        .single();

      if (error || !data) {
        toast.error("Invalid Ticket! ❌");
        setBookingDetails(null);
      } else {
        toast.success("Ticket Verified! ✅");
        setBookingDetails(data);
      }
    } catch (err) {
      toast.error("Verification system error.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/admin')} className="p-3 bg-[#111114] border border-gray-800 rounded-full hover:bg-gray-900 transition-colors"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Verifier</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Scan QR codes to validate entries</p>
          </div>
        </div>

        {/* Scanner Viewport */}
        {!bookingDetails && !isValidating && (
          <div className="bg-[#111114] border-2 border-dashed border-gray-800 rounded-[3rem] p-10 flex flex-col items-center text-center">
             <div id="reader" className="w-full max-w-sm rounded-3xl overflow-hidden border-4 border-gray-800 mb-8"></div>
             <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                <Camera size={16} className="text-red-600 animate-pulse" />
                Position QR Code within the frame
             </div>
          </div>
        )}

        {/* Loading State */}
        {isValidating && (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Checking database...</p>
          </div>
        )}

        {/* Verification Result Card */}
        {bookingDetails && (
          <div className="animate-in fade-in zoom-in duration-300">
             <div className="bg-green-500/10 border-2 border-green-500/50 rounded-[3rem] p-10 text-center relative overflow-hidden">
                <div className="absolute top-4 right-8 text-green-500/20"><CheckCircle size={120} /></div>
                
                <h2 className="text-3xl font-black italic uppercase text-green-500 mb-8 tracking-tighter">Access Granted</h2>
                
                <div className="space-y-6 text-left relative z-10">
                   <div className="flex items-center gap-4 bg-black/40 p-5 rounded-2xl border border-white/5">
                      <Film className="text-green-500" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase">Movie</p>
                        <p className="font-bold text-white">{bookingDetails.movie?.title}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                        <Armchair className="text-green-500 mb-2" />
                        <p className="text-[10px] text-gray-500 font-black uppercase">Seats</p>
                        <p className="font-bold text-white">{bookingDetails.seats?.join(', ')}</p>
                      </div>
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                        <User className="text-green-500 mb-2" />
                        <p className="text-[10px] text-gray-500 font-black uppercase">Booking ID</p>
                        <p className="font-bold text-white"># {bookingDetails.id}</p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => { setBookingDetails(null); window.location.reload(); }}
                  className="mt-10 w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-green-900/20"
                >
                  Scan Next Ticket
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyTicket;