import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '@clerk/clerk-react';
import { Star, MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MovieReviews = ({ movieId }) => {
  const { user, isSignedIn } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return toast.error("Please login to leave a review!");
    if (newRating === 0) return toast.error("Please select a star rating!");
    if (!newComment.trim()) return toast.error("Please write a comment!");

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          movie_id: movieId,
          user_id: user.id,
          user_name: user.fullName || user.username || 'Anonymous User',
          rating: newRating,
          comment: newComment.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      setReviews([data, ...reviews]); // Add new review to the top of the list
      setNewRating(0);
      setNewComment('');
      toast.success("Review posted successfully! 🎉");
    } catch (error) {
      toast.error(error.message || "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
    <div className="mt-16 pt-16 border-t border-gray-800/50">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <MessageSquare className="text-red-600" size={28} /> Audience Reviews
          </h2>
          <p className="text-gray-500 font-medium italic mt-1">What people are saying about this movie</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-[#111114] border border-gray-800 px-6 py-4 rounded-2xl">
            <div className="text-4xl font-black text-white">{averageRating}</div>
            <div className="flex flex-col">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill={star <= Math.round(averageRating) ? "currentColor" : "none"} className={star <= Math.round(averageRating) ? "text-yellow-500" : "text-gray-700"} />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Based on {reviews.length} reviews</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: Write a Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#111114] border border-gray-800 rounded-[2rem] p-8 sticky top-28">
            <h3 className="text-lg font-black uppercase italic tracking-wider mb-6">Write a Review</h3>
            
            {!isSignedIn ? (
              <div className="text-center py-8 bg-[#09090b] rounded-2xl border border-gray-800">
                <p className="text-gray-500 text-sm font-bold mb-4">You must be logged in to share your thoughts.</p>
                {/* Assuming you have a way to trigger login, or just let them use the navbar */}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-6">
                
                {/* Interactive Star Rating */}
                <div>
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          size={28} 
                          fill={(hoverRating || newRating) >= star ? "#eab308" : "none"} 
                          className={`${(hoverRating || newRating) >= star ? "text-yellow-500" : "text-gray-700"} transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">Your Thoughts</label>
                  <textarea 
                    rows="4"
                    placeholder="Did you love it? Hate it? Tell us why..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-[#09090b] border border-gray-800 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:border-red-500 outline-none resize-none transition-all"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-95"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Post Review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT: Reviews List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {reviews.length === 0 ? (
            <div className="text-center py-20 bg-[#111114]/50 border border-gray-800 border-dashed rounded-[2rem]">
              <MessageSquare size={48} className="text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 font-bold italic">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-[#111114] border border-gray-800 rounded-[2rem] p-6 md:p-8 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-white capitalize">{review.user_name}</h4>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} className={star <= review.rating ? "text-yellow-500" : "text-gray-800"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default MovieReviews;