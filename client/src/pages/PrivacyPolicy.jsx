import React, { useEffect } from 'react';
import { ShieldCheck, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 1,
      icon: <Eye className="w-6 h-6 text-red-500" />,
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us when you create an account, such as your name, email address, and profile details (managed securely via Clerk). We also collect data related to your movie bookings, favorite movies, and support inquiries stored in our secure database."
    },
    {
      id: 2,
      icon: <Database className="w-6 h-6 text-red-500" />,
      title: "2. How We Use Your Data",
      content: "Your data is used to process ticket bookings, manage your watchlist, and provide customer support. We may also use your email to send newsletter updates if you have opted in. We do not sell your personal data to third parties for marketing purposes."
    },
    {
      id: 3,
      icon: <Lock className="w-6 h-6 text-red-500" />,
      title: "3. Data Security",
      content: "We use industry-standard encryption and secure cloud providers (Supabase & Clerk) to protect your information. While we strive to use commercially acceptable means to protect your personal data, remember that no method of transmission over the Internet is 100% secure."
    },
    {
      id: 4,
      icon: <Globe className="w-6 h-6 text-red-500" />,
      title: "4. Cookies & Tracking",
      content: "BookBee uses essential cookies to keep you logged in and remember your preferences. We do not use invasive tracking cookies. You can instruct your browser to refuse all cookies, but some parts of our service may not function properly without them."
    },
    {
      id: 5,
      icon: <UserCheck className="w-6 h-6 text-red-500" />,
      title: "5. Your Privacy Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You can manage your profile through the account settings or contact our support team to request a permanent deletion of your booking history and account data."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <ShieldCheck className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Privacy <span className="text-red-600">Policy</span>
          </h1>
          <p className="text-gray-400 font-medium italic max-w-lg mx-auto mb-4">
            Your privacy is our priority. Learn how we handle and protect your personal information.
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Effective Date: March 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-6 mb-16">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="group bg-[#111114] border border-gray-800 rounded-[2rem] p-8 md:p-10 hover:border-red-500/30 transition-all duration-500 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed font-medium text-sm md:text-base pl-2 md:pl-16">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="bg-[#111114] border border-gray-800 rounded-[2.5rem] p-10 text-center">
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-3">Privacy Concerns?</h3>
          <p className="text-gray-400 font-medium italic mb-6">
            If you have any questions about how we treat your data, please contact our privacy officer.
          </p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95"
          >
            Contact Privacy Team
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;