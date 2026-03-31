import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MailOpen, Trash2, CheckCircle, Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Inbox = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load inbox.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state so UI reflects the change instantly
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
      toast.success("Message marked as read!");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== id));
      toast.success("Message deleted.");
    } catch (error) {
      toast.error("Failed to delete message.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => navigate('/admin')}
            className="p-3 bg-[#111114] border border-gray-800 rounded-full hover:bg-gray-900 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Mail className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Support Inbox</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Manage customer messages and feedback</p>
          </div>
        </div>

        {/* Message List */}
        {messages.length === 0 ? (
          <div className="py-24 text-center bg-[#111114]/50 border-2 border-dashed border-gray-800 rounded-[3rem]">
            <MailOpen className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Inbox Empty</h2>
            <p className="text-gray-600 font-medium italic">You are all caught up! No new messages.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {messages.map((msg) => {
              const isUnread = msg.status === 'unread';
              
              return (
                <div 
                  key={msg.id} 
                  className={`bg-[#111114] border rounded-[2rem] p-6 md:p-8 transition-all duration-300 relative overflow-hidden ${
                    isUnread ? 'border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'border-gray-800'
                  }`}
                >
                  {/* Unread Indicator Line */}
                  {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>}

                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {msg.subject}
                          {isUnread && <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">New</span>}
                        </h3>
                      </div>
                      
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">
                        From: <span className="text-gray-300">{msg.name}</span> &lt;{msg.email}&gt; • {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="bg-[#09090b] border border-gray-800 rounded-2xl p-5">
                        <p className="text-gray-300 leading-relaxed font-medium text-sm whitespace-pre-wrap">
                          "{msg.message}"
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-3 justify-end lg:justify-start lg:w-40 border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-6">
                      {isUnread && (
                        <button 
                          onClick={() => markAsRead(msg.id)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-green-600/20 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-800 hover:border-green-500 transition-all"
                        >
                          <CheckCircle size={14} /> Mark Read
                        </button>
                      )}
                      
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-red-600 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-800 hover:border-red-500 transition-all"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                      
                      <a 
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(220,38,38,0.2)] transition-all active:scale-95"
                      >
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;