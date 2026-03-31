import React, { useState, useEffect } from 'react';
import { Search, Ticket, CreditCard, User, HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqData = [
  {
    id: 1,
    category: 'Bookings',
    question: 'How do I cancel my movie ticket?',
    answer: 'You can cancel your ticket by going to "My Tickets" in your profile. Click the "Cancel" button next to your active booking. Please note that a 20% cancellation fee applies, and cancellations must be made at least 2 hours before showtime.'
  },
  {
    id: 2,
    category: 'Bookings',
    question: 'Do I need to print my ticket?',
    answer: 'No! BookBee is completely paperless. Simply show your digital ticket or booking QR code on your phone at the cinema entrance.'
  },
  {
    id: 3,
    category: 'Payments',
    question: 'What is your refund policy?',
    answer: 'Refunds are automatically processed to your original payment method upon cancellation. It typically takes 3-5 business days for the funds to reflect in your account.'
  },
  {
    id: 4,
    category: 'Payments',
    question: 'How do I apply a promo code?',
    answer: 'During the checkout process, right before you click "Confirm & Pay", you will see a box labeled "Promo Code". Enter your code there and click "Apply" to see your discounted total.'
  },
  {
    id: 5,
    category: 'Account',
    question: 'How do I change my account details?',
    answer: 'Since we use secure authentication, you can manage your email, password, and profile picture directly through your account settings panel accessed via the profile icon in the top right.'
  },
  {
    id: 6,
    category: 'General',
    question: 'How are the theater seats priced?',
    answer: 'Seat pricing varies by tier. Standard seats are the base price, Premium seats are slightly higher for better viewing angles, and Recliners offer the ultimate luxury experience at a premium rate.'
  }
];

const categories = ['All', 'Bookings', 'Payments', 'Account', 'General'];

const HelpCenter = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter FAQs based on search and category
  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-28 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <HelpCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            How can we <span className="text-red-600">help?</span>
          </h1>
          <p className="text-gray-400 font-medium italic max-w-lg mx-auto">
            Search our knowledge base or browse categories below to find answers to your questions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search for answers (e.g., 'refunds', 'cancel')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111114] border border-gray-800 text-white pl-14 pr-6 py-5 rounded-[2rem] focus:outline-none focus:border-red-600 transition-colors shadow-2xl placeholder:text-gray-600 font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeCategory === category 
                ? 'bg-red-600 text-white shadow-[0_5px_15px_rgba(220,38,38,0.3)]' 
                : 'bg-[#111114] text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-20">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`bg-[#111114] border rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedId === faq.id ? 'border-red-500/50 shadow-lg' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-lg pr-8">{faq.question}</span>
                  {expandedId === faq.id ? (
                    <ChevronUp className="text-red-500 flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                  )}
                </button>
                
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out ${
                    expandedId === faq.id ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="w-full h-px bg-gray-800/60 mb-4"></div>
                  <p className="text-gray-400 leading-relaxed font-medium text-sm">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#111114]/50 border border-gray-800 border-dashed rounded-[2rem]">
              <p className="text-gray-500 font-bold italic">No answers found for "{searchQuery}".</p>
            </div>
          )}
        </div>

        {/* Still Need Help CTA */}
        <div className="bg-gradient-to-br from-[#111114] to-[#0a0a0c] border border-gray-800 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
          
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800 group-hover:scale-110 transition-transform duration-500">
            <MessageSquare className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>
          
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-3">Still need assistance?</h2>
          <p className="text-gray-400 font-medium italic mb-8 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is always ready to help you out.
          </p>
          
          <button 
            onClick={() => navigate('/contact')}
            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95"
          >
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;