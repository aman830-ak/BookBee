import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Film, Ticket, PlusCircle, List, 
  Loader2, Rocket, Mail, Users, Camera, TrendingUp, IndianRupee, Clapperboard, TicketPercent,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "../../lib/supabase";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMovies: 0, totalBookings: 0, totalRevenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moviesRes, bookingsRes] = await Promise.all([
          supabase.from('movies').select('id', { count: 'exact' }),
          supabase.from('bookings').select('total_price, created_at')
        ]);

        const bookingsData = bookingsRes.data || [];
        const revenue = bookingsData.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);

        setStats({
          totalMovies: moviesRes.count || 0,
          totalBookings: bookingsData.length,
          totalRevenue: revenue
        });

        const last7Days = bookingsData.reduce((acc, booking) => {
          if (booking.created_at) {
            const date = new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            acc[date] = (acc[date] || 0) + (Number(booking.total_price) || 0);
          }
          return acc;
        }, {});

        const formattedData = Object.keys(last7Days).map(date => ({
          name: date,
          revenue: last7Days[date]
        })).slice(-7);

        setChartData(formattedData.length > 0 ? formattedData : [{ name: 'Today', revenue: 0 }]);
      } catch (error) {
        console.error("Dashboard error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const adminActions = [
    { title: 'Add Movie', icon: <PlusCircle />, path: '/admin/add-shows', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Movies', icon: <List />, path: '/admin/list-shows', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Bookings', icon: <Ticket />, path: '/admin/list-bookings', color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Layout', icon: <Film />, path: '/admin/layout', color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Releases', icon: <Rocket />, path: '/admin/manage-releases', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Inbox', icon: <Mail />, path: '/admin/inbox', color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { title: 'Subscribers', icon: <Users />, path: '/admin/newsletter', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Scanner', icon: <Camera />, path: '/admin/verify', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Promos', icon: <TicketPercent />, path: '/admin/promos', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111114] border border-gray-800 p-4 rounded-2xl shadow-2xl">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
          <p className="text-red-500 font-black text-xl flex items-center gap-1">
            <IndianRupee size={16} />{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                <LayoutDashboard className="text-red-600 w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Command Center</h1>
            </div>
            <p className="text-gray-500 font-medium italic tracking-wide ml-1">Live metrics and management for BookBee.</p>
          </div>
          <Link to="/" className="px-6 py-3 bg-[#111114] border border-gray-800 hover:border-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all w-max">
            Exit to Site
          </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Loading Telemetry...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* SECTION 1: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#111114] to-[#0a0a0c] p-8 rounded-[2rem] border border-gray-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Clapperboard size={100} /></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Active Shows</p>
                <h2 className="text-5xl font-black tracking-tighter relative z-10">{stats.totalMovies}</h2>
              </div>
              
              <div className="bg-gradient-to-br from-[#111114] to-[#0a0a0c] p-8 rounded-[2rem] border border-gray-800 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Ticket size={100} /></div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Tickets Sold</p>
                <h2 className="text-5xl font-black tracking-tighter relative z-10">{stats.totalBookings}</h2>
              </div>
              
              <div className="bg-gradient-to-br from-red-600/10 to-[#111114] p-8 rounded-[2rem] border border-red-500/20 shadow-[0_10px_40px_rgba(220,38,38,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-red-500 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500"><TrendingUp size={100} /></div>
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Total Revenue</p>
                <h2 className="text-red-500 text-5xl font-black italic relative z-10 tracking-tighter flex items-center gap-1">
                  <IndianRupee size={36} className="text-red-600/50" />{stats.totalRevenue}
                </h2>
              </div>
            </div>

            {/* SECTION 2: Quick Actions (Full Width Grid) */}
            <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-xl font-black uppercase italic tracking-tighter mb-1">System Modules</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">Manage your cinema operations</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {adminActions.map((action, index) => (
                  <Link 
                    key={index} 
                    to={action.path}
                    className="group bg-[#09090b] hover:bg-gray-900 border border-gray-800 hover:border-gray-700 p-6 rounded-3xl transition-all active:scale-95 flex flex-col items-center justify-center text-center gap-4"
                  >
                    <div className={`${action.bg} ${action.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {React.cloneElement(action.icon, { size: 26 })}
                    </div>
                    <p className="font-bold text-[10px] tracking-widest uppercase text-gray-400 group-hover:text-white transition-colors">{action.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* SECTION 3: Revenue Chart (Full Width at Bottom) */}
            <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Gross Revenue Analytics</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Last 7 Days Performance</p>
                </div>
              </div>
              
              {/* Increased height since it spans the full width now */}
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} opacity={0.5} />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} dy={10} fontFamily="monospace" />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} fontFamily="monospace" />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={4} fillOpacity={1} fill="url(#redGradient)" activeDot={{ r: 6, fill: '#dc2626', stroke: '#09090b', strokeWidth: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;