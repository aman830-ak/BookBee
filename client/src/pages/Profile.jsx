import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Ticket, IndianRupee, 
  LogOut, Loader2, ChevronLeft, Film 
} from 'lucide-react';

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ totalTickets: 0, totalSpent: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate('/');
      return;
    }

    const fetchUserStats = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('total_price')
          .eq('user_id', user.id);

        if (error) throw error;

        const totalSpent = data.reduce((sum, booking) => sum + booking.total_price, 0);
        
        setStats({
          totalTickets: data.length,
          totalSpent: totalSpent
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [isLoaded, isSignedIn, user, navigate]);

  const handleLogout = () => {
    signOut(() => navigate('/'));
  };

  if (!isLoaded || isLoading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="text-red-600 animate-spin w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="p-3 bg-[#111114] border border-gray-800 rounded-full hover:bg-gray-900 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">My Profile</h1>
            <p className="text-gray-500 font-medium italic">Manage your account and cinematic journey</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: User Info Card */}
          <div className="md:col-span-1 bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl h-fit">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 mb-6 shadow-xl">
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-1">{user.fullName || "Cinephile"}</h2>
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">
              <Mail size={14} /> {user.primaryEmailAddress?.emailAddress}
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* RIGHT: Stats & Links */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Stats Bento Box */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#111114] to-[#0a0a0c] p-8 rounded-[2rem] border border-gray-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Ticket size={80} /></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Movies Attended</p>
                <h2 className="text-5xl font-black tracking-tighter relative z-10">{stats.totalTickets}</h2>
              </div>

              <div className="bg-gradient-to-br from-[#111114] to-[#0a0a0c] p-8 rounded-[2rem] border border-gray-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><IndianRupee size={80} /></div>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Total Spent</p>
                <h2 className="text-red-500 text-4xl font-black italic relative z-10 tracking-tighter flex items-center">
                  <IndianRupee size={28} className="text-red-600/50 mr-1" />{stats.totalSpent}
                </h2>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl">
               <h3 className="text-lg font-black uppercase italic tracking-wider mb-6">Account Settings</h3>
               
               <div className="flex flex-col gap-4">
                 <button onClick={() => navigate('/my-tickets')} className="flex items-center justify-between p-5 rounded-2xl bg-[#09090b] border border-gray-800 hover:border-red-500/50 hover:bg-red-500/5 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform"><Film size={20} /></div>
                     <span className="font-bold text-sm tracking-widest uppercase text-gray-300 group-hover:text-white transition-colors">Booking History</span>
                   </div>
                   <ChevronLeft size={20} className="text-gray-600 rotate-180 group-hover:text-red-500 transition-colors" />
                 </button>

                 <button onClick={() => alert("Check your Clerk Dashboard to manage standard profile settings!")} className="flex items-center justify-between p-5 rounded-2xl bg-[#09090b] border border-gray-800 hover:border-gray-600 transition-all group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform"><User size={20} /></div>
                     <span className="font-bold text-sm tracking-widest uppercase text-gray-300 group-hover:text-white transition-colors">Edit Personal Details</span>
                   </div>
                   <ChevronLeft size={20} className="text-gray-600 rotate-180 group-hover:text-white transition-colors" />
                 </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;