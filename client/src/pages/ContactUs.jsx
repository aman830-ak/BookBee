import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase.js';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    } catch (error) {
      console.error("Contact error:", error.message);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Get in <span className="text-red-600">Touch</span>
          </h1>
          <p className="text-gray-400 font-medium italic max-w-2xl mx-auto">
            Have a question about your booking, a theater, or just want to say hi? We'd love to hear from you. Fill out the form below and our support team will respond shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Side: Contact Info Cards */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="bg-[#111114] border border-gray-800 p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/50 transition-colors group cursor-default shadow-xl">
              <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-1 tracking-wide">Email Us</h3>
              <p className="text-gray-400 text-sm font-medium">support@bookbee.com</p>
            </div>

            <div className="bg-[#111114] border border-gray-800 p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/50 transition-colors group cursor-default shadow-xl">
              <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-1 tracking-wide">Call Us</h3>
              <p className="text-gray-400 text-sm font-medium">+91 1800-BOOK-BEE</p>
              <p className="text-gray-500 text-xs mt-1">Mon-Sun: 9 AM - 10 PM</p>
            </div>

            <div className="bg-[#111114] border border-gray-800 p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/50 transition-colors group cursor-default shadow-xl">
              <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="text-red-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-1 tracking-wide">Headquarters</h3>
              <p className="text-gray-400 text-sm font-medium">123 Cinema Boulevard,<br/>Mumbai, India 400001</p>
            </div>
          </div>

          {/* Right Side: The Form */}
          <div className="bg-[#111114] border border-gray-800 p-8 md:p-12 rounded-[2.5rem] lg:col-span-2 shadow-2xl">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Send className="text-red-600" /> Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors placeholder:text-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Ticket Cancellation Request"
                  className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors placeholder:text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 pl-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="How can we help you today?"
                  className="bg-[#09090b] border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors placeholder:text-gray-700 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;