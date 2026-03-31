import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  TicketPercent, Plus, Trash2, Power, 
  ChevronLeft, Loader2, Tag 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PromoManager = () => {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Promo State
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromos(data || []);
    } catch (error) {
      toast.error("Failed to load promo codes.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return toast.error("Please fill all fields");
    if (newDiscount <= 0 || newDiscount >= 100) return toast.error("Discount must be between 1 and 99");

    setIsAdding(true);
    try {
      const { data, error } = await supabase
        .from('promos')
        .insert([{ 
          code: newCode.toUpperCase().trim(), 
          discount_percent: Number(newDiscount),
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error("This promo code already exists!");
        throw error;
      }

      setPromos([data, ...promos]);
      setNewCode('');
      setNewDiscount('');
      toast.success("Promo code created! 🎉");
    } catch (error) {
      toast.error(error.message || "Failed to create promo");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('promos')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setPromos(promos.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
      toast.success(currentStatus ? "Promo deactivated" : "Promo activated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deletePromo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return;
    
    try {
      const { error } = await supabase.from('promos').delete().eq('id', id);
      if (error) throw error;
      
      setPromos(promos.filter(p => p.id !== id));
      toast.success("Promo code deleted");
    } catch (error) {
      toast.error("Failed to delete promo");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="w-12 h-12 text-red-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate('/admin')} className="p-3 bg-[#111114] border border-gray-800 rounded-full hover:bg-gray-900 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Promo Manager</h1>
            <p className="text-gray-500 font-medium italic">Create and manage discount codes</p>
          </div>
        </div>

        {/* Add New Promo Form */}
        <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-8 mb-10 shadow-2xl">
          <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
            <Tag className="text-red-500" /> Create New Code
          </h2>
          <form onSubmit={handleAddPromo} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="e.g. WEEKEND50" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="w-full bg-[#09090b] border border-gray-800 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none uppercase font-bold tracking-widest transition-all"
                maxLength={15}
              />
            </div>
            <div className="w-full md:w-48 relative">
              <input 
                type="number" 
                placeholder="Discount %" 
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                className="w-full bg-[#09090b] border border-gray-800 rounded-2xl p-4 pr-12 text-white placeholder-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none font-bold transition-all"
                min="1" max="99"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-black">%</span>
            </div>
            <button 
              type="submit" 
              disabled={isAdding}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95"
            >
              {isAdding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
              Generate
            </button>
          </form>
        </div>

        {/* Promo Codes List */}
        <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Code</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Discount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                  <td className="px-8 py-5">
                    <span className="bg-gray-900 text-white border border-gray-700 px-3 py-1.5 rounded-lg font-black tracking-widest uppercase text-sm">
                      {promo.code}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-red-500 font-black text-lg italic">
                    {promo.discount_percent}%
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      promo.is_active 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-gray-800 text-gray-500 border-gray-700'
                    }`}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => toggleStatus(promo.id, promo.is_active)}
                      className={`p-2 rounded-xl transition-all ${
                        promo.is_active ? 'text-orange-500 hover:bg-orange-500/10' : 'text-green-500 hover:bg-green-500/10'
                      }`}
                      title={promo.is_active ? "Deactivate" : "Activate"}
                    >
                      <Power size={18} />
                    </button>
                    <button 
                      onClick={() => deletePromo(promo.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {promos.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <TicketPercent size={48} className="text-gray-800 mb-4" />
              <p className="text-gray-500 font-bold italic">No promo codes active.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PromoManager;