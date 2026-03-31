import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Armchair, Gem, IndianRupee, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from "../../lib/supabase";

const Layout = () => {
  const [config, setConfig] = useState({
    rowCount: 6,
    seatsPerRow: 8,
    basePrice: 200,
    reclinerRows: ['F'],
    premiumRows: ['D', 'E'],
    budgetRows: ['A'],
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 2. Fetch the current settings from Supabase
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const { data, error } = await supabase
          .from('theater_settings')
          .select('*')
          .single(); // Grab the single configuration row

        if (error) throw error;

        if (data) {
          // Map the database snake_case columns to our local state
          setConfig({
            rowCount: data.row_count || 6,
            seatsPerRow: data.seats_per_row || 8,
            basePrice: data.base_price || 200,
            reclinerRows: data.recliner_rows || [],
            premiumRows: data.premium_rows || [],
            budgetRows: data.budget_rows || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error.message);
        toast.error("Could not load theater layout.");
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, []);

  // 3. Save updates back to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('theater_settings')
        .update({
          row_count: config.rowCount,
          seats_per_row: config.seatsPerRow,
          base_price: config.basePrice,
          // Ensure we don't save empty strings if the user clears the box
          recliner_rows: config.reclinerRows.filter(Boolean),
          premium_rows: config.premiumRows.filter(Boolean),
          budget_rows: config.budgetRows.filter(Boolean),
        })
        .eq('id', 1); // We update the row with ID 1 (our master config row)

      if (error) throw error;
      
      toast.success("Theater layout and pricing updated! 🏟️");
    } catch (error) {
      console.error("Save error:", error.message);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const getRowCategory = (rowLetter) => {
    if (config.reclinerRows.includes(rowLetter)) return { label: 'Recliner', color: 'bg-yellow-500', icon: <Gem size={8} /> };
    if (config.premiumRows.includes(rowLetter)) return { label: 'Premium', color: 'bg-blue-500', icon: <Armchair size={8} /> };
    if (config.budgetRows.includes(rowLetter)) return { label: 'Budget', color: 'bg-orange-500', icon: <Armchair size={8} /> };
    return { label: 'Standard', color: 'bg-gray-600', icon: <Armchair size={8} /> };
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#09090b]">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="text-gray-500 font-bold tracking-widest uppercase text-sm animate-pulse">Syncing theater layout...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
            <Settings className="text-red-600" /> Cinema Management
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Configure dimensions, seat tiers, and dynamic pricing.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-white transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.3)] active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dimensions Card */}
          <div className="bg-[#111114] p-8 rounded-[2.5rem] border border-gray-800 shadow-xl">
            <h3 className="text-white font-black uppercase tracking-widest mb-8 flex items-center gap-2">
              Theater Dimensions
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  <span>Rows</span>
                  <span className="text-white bg-gray-900 px-3 py-1 rounded-md border border-gray-800">{config.rowCount}</span>
                </div>
                <input 
                  type="range" min="1" max="15" 
                  value={config.rowCount} 
                  onChange={(e) => setConfig({...config, rowCount: parseInt(e.target.value)})}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-gray-900 rounded-lg appearance-none"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  <span>Seats Per Row</span>
                  <span className="text-white bg-gray-900 px-3 py-1 rounded-md border border-gray-800">{config.seatsPerRow}</span>
                </div>
                <input 
                  type="range" min="4" max="15" 
                  value={config.seatsPerRow} 
                  onChange={(e) => setConfig({...config, seatsPerRow: parseInt(e.target.value)})}
                  className="w-full accent-red-600 cursor-pointer h-2 bg-gray-900 rounded-lg appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing Tiers Card */}
          <div className="bg-[#111114] p-8 rounded-[2.5rem] border border-gray-800 shadow-xl space-y-8">
            <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
              <IndianRupee size={20} className="text-red-500" /> Seating Tiers
            </h3>
            
            <div className="space-y-6">
              <div className="bg-[#09090b] p-5 rounded-2xl border border-gray-800">
                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">Base Ticket Price (Standard)</label>
                <div className="flex items-center gap-2 text-3xl font-black text-white italic">
                   ₹<input 
                    type="number" 
                    value={config.basePrice}
                    onChange={(e) => setConfig({...config, basePrice: parseInt(e.target.value)})}
                    className="bg-transparent outline-none w-24 text-red-500"
                   />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">Recliner Rows (e.g. F, G)</label>
                <input 
                  type="text" 
                  value={config.reclinerRows.join(', ')}
                  onChange={(e) => setConfig({...config, reclinerRows: e.target.value.split(',').map(s => s.trim().toUpperCase())})}
                  className="w-full bg-[#09090b] border border-gray-800 rounded-xl p-4 text-white font-bold focus:border-yellow-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-700"
                  placeholder="F, G"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">Premium Rows (e.g. D, E)</label>
                <input 
                  type="text" 
                  value={config.premiumRows.join(', ')}
                  onChange={(e) => setConfig({...config, premiumRows: e.target.value.split(',').map(s => s.trim().toUpperCase())})}
                  className="w-full bg-[#09090b] border border-gray-800 rounded-xl p-4 text-white font-bold focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-700"
                  placeholder="D, E"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block tracking-widest">Budget Rows (e.g. A)</label>
                <input 
                  type="text" 
                  value={config.budgetRows.join(', ')}
                  onChange={(e) => setConfig({...config, budgetRows: e.target.value.split(',').map(s => s.trim().toUpperCase())})}
                  className="w-full bg-[#09090b] border border-gray-800 rounded-xl p-4 text-white font-bold focus:border-orange-500 outline-none transition-all placeholder:font-normal placeholder:text-gray-700"
                  placeholder="A"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Map Preview */}
        <div className="lg:col-span-7 flex flex-col items-center bg-[#111114]/50 p-10 rounded-[3rem] border border-gray-800 shadow-inner overflow-x-auto relative">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-12">Live Map Preview</p>
          
          <div className="w-full max-w-md h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full mb-16 relative shadow-[0_0_20px_rgba(220,38,38,0.5)]">
             <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cinema Screen</span>
          </div>

          <div className="flex flex-col gap-4">
            {[...Array(config.rowCount)].map((_, r) => {
              const rowLetter = String.fromCharCode(65 + r);
              const tier = getRowCategory(rowLetter);
              
              return (
                <div key={r} className="flex items-center gap-6">
                  <span className="w-6 text-center text-[11px] font-black text-gray-600 bg-gray-900 rounded-md py-1">{rowLetter}</span>
                  <div className="flex gap-3">
                    {[...Array(config.seatsPerRow)].map((_, s) => (
                      <div 
                        key={s} 
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-lg border border-black/20 flex items-center justify-center text-white/40 shadow-sm transition-all duration-500 ${tier.color} hover:brightness-125 hover:-translate-y-1`}
                        title={`${rowLetter}${s + 1} - ${tier.label}`}
                      >
                        {tier.icon}
                      </div>
                    ))}
                  </div>
                  <span className="w-6 text-center text-[11px] font-black text-gray-600 bg-gray-900 rounded-md py-1">{rowLetter}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-20 w-full pt-8 border-t border-gray-800/50">
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Recliner
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Premium
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <div className="w-3 h-3 bg-gray-600 rounded-sm"></div> Standard
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div> Budget
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;