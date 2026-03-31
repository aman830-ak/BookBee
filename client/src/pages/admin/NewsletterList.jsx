import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Trash2, Loader2, ChevronLeft, Download, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const NewsletterList = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm("Remove this email from the newsletter list?")) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      toast.success("Subscriber removed.");
    } catch (error) {
      toast.error("Failed to remove subscriber.");
    }
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID", "Email", "Date Subscribed"].join(",") + "\n"
      + subscribers.map(s => `${s.id},${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookbee_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="w-12 h-12 text-red-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-3 bg-[#111114] border border-gray-800 rounded-full hover:bg-gray-900 transition-colors"><ChevronLeft size={24} /></button>
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Subscribers</h1>
              <p className="text-gray-500 font-medium italic">Manage your {subscribers.length} newsletter fans</p>
            </div>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input 
            type="text" 
            placeholder="Search emails..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111114] border border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* List */}
        <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                  <td className="px-8 py-5 font-bold text-sm text-gray-300 group-hover:text-white transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-red-600" />
                      {sub.email}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-gray-500 font-medium italic">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => deleteSubscriber(sub.id)}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSubscribers.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-600 font-bold italic">No subscribers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterList;