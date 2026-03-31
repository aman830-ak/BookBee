import React, { useEffect } from 'react';
import { FileText, Shield, Ticket, CreditCard, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => {
  // Always scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const termsData = [
    {
      id: 1,
      icon: <Ticket className="w-6 h-6 text-red-500" />,
      title: "1. Ticket Bookings & Entry",
      content: "All ticket bookings are subject to seat availability. A valid digital or printed ticket must be presented at the cinema entrance. The cinema management reserves the right to request valid ID proof for age-restricted movies (e.g., 'A' rated films). Failure to provide ID may result in denied entry without a refund."
    },
    {
      id: 2,
      icon: <CreditCard className="w-6 h-6 text-red-500" />,
      title: "2. Pricing, Taxes & Fees",
      content: "All prices are listed in INR (₹) and are inclusive of applicable taxes unless stated otherwise. An internet handling fee (convenience fee) is applied to all online bookings. This convenience fee is strictly non-refundable under any circumstances."
    },
    {
      id: 3,
      icon: <Shield className="w-6 h-6 text-red-500" />,
      title: "3. Cancellations & Refunds",
      content: "Users may cancel their tickets up to 2 hours prior to the scheduled showtime. A standard 20% cancellation fee will be deducted from the refund amount. No cancellations or refunds are permitted within 2 hours of the showtime. Refunds will be credited back to the original payment method within 3-5 business days."
    },
    {
      id: 4,
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "4. Cinema Code of Conduct",
      content: "Outside food and beverages are strictly prohibited inside the theater premises. The cinema reserves the right to refuse admission or eject any patron whose conduct is deemed disorderly, disruptive, or a threat to the safety of others, without any refund."
    },
    {
      id: 5,
      icon: <Scale className="w-6 h-6 text-red-500" />,
      title: "5. Modifications to Service",
      content: "BookBee reserves the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the service."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Terms of <span className="text-red-600">Service</span>
          </h1>
          <p className="text-gray-400 font-medium italic max-w-lg mx-auto mb-4">
            Please read these terms carefully before using our ticketing platform.
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Last Updated: March 2026
          </p>
        </div>

        {/* Terms Content Cards */}
        <div className="space-y-6 mb-16">
          {termsData.map((term) => (
            <div 
              key={term.id} 
              className="bg-[#111114] border border-gray-800 rounded-[2rem] p-8 md:p-10 hover:border-gray-700 transition-colors duration-300 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                  {term.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white">
                  {term.title}
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed font-medium text-sm md:text-base pl-2 md:pl-16">
                {term.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-gradient-to-br from-[#111114] to-[#0a0a0c] border border-gray-800 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-3">Questions about our terms?</h3>
          <p className="text-gray-400 font-medium italic mb-6">
            If you have any questions or concerns regarding these terms, please reach out to our legal team.
          </p>
          <a 
            href="/contact" 
            className="inline-block px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Contact Legal
          </a>
        </div>

      </div>
    </div>
  );
};

export default Terms;