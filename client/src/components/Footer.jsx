import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Facebook, Instagram, Youtube, Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase.js';
import logo from '../assets/bookbee-logo-transparent.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        // Postgres error code 23505 means "Unique Violation" (already exists)
        if (error.code === '23505') {
          toast.error("You are already subscribed! 🎉");
        } else {
          throw error;
        }
      } else {
        toast.success("Thanks for subscribing!");
        setEmail(''); // Clear the input field after success
      }
    } catch (error) {
      console.error("Subscription error:", error.message);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#09090b] border-t border-gray-800 pt-16 pb-8 px-6 md:px-16 lg:px-24 xl:px-44 mt-20">
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
        
        {/* Column 1: Brand & About */}
        <div className="flex flex-col items-start gap-4">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="transition-transform active:scale-95">
        <img src={logo}  alt="BookBee Logo" 
           className="h-70 md:h-16 w-auto mb-1 object-contain object-left scale-200" 
        />
          </Link>
          <p className="-ml-8 text-gray-400  "> 
             Your ultimate destination for booking movie tickets, discovering new releases, and finding the best theaters near you. Experience entertainment like never before.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg mb-2 tracking-wide">Quick Links</h3>
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Home</Link>
          <Link to="/movies" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Movies</Link>
          <Link to="/theaters" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Theaters</Link>
          <Link to="/releases" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">New Releases</Link>
        </div>

        {/* Column 3: Legal & Support */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg mb-2 tracking-wide">Support</h3>
          <Link to="/help" className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Help Center</Link>
          <Link to="/terms" className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Terms of Service</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Privacy Policy</Link>
          <Link to="/contact" className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm w-max">Contact Us</Link>
        </div>

        {/* Column 4: Newsletter & Socials */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg mb-2 tracking-wide">Stay Updated</h3>
          <p className="text-gray-400 text-sm font-medium mb-2">Subscribe to our newsletter for the latest updates.</p>
          
          {/* UPDATED FORM */}
          <form className="flex items-center w-full mb-4" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="bg-[#111114] border border-gray-800 text-white text-sm px-4 py-3 rounded-l-xl w-full focus:outline-none focus:border-red-600 transition-colors placeholder:text-gray-600"
              required
              disabled={isSubscribing}
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="bg-red-600 hover:bg-red-500 active:scale-95 text-white px-5 py-3 rounded-r-xl border border-red-600 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:active:scale-100"
            >
              {isSubscribing ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
            </button>
          </form>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-[#111114] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 hover:-translate-y-1 transition-all duration-300">
              <Facebook size={18} />
            </a>
            
            <a href="#" className="w-10 h-10 rounded-full bg-[#111114] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 hover:-translate-y-1 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a href="#" className="w-10 h-10 rounded-full bg-[#111114] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 hover:-translate-y-1 transition-all duration-300">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#111114] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 hover:-translate-y-1 transition-all duration-300">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/60 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs font-medium tracking-wide">
          &copy; {new Date().getFullYear()} BookBee. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs font-medium flex gap-6">
          <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-white transition-colors">Terms</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;