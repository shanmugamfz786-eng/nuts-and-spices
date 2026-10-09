import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { User, Quote, Star, MessageSquarePlus, Send, CheckCircle2, ThumbsUp } from 'lucide-react';

const SEED_TESTIMONIALS = [
  {
    id: 'rev-seed-1',
    rating: 5,
    quote: '"Super tasty veg chips, fruit chips and cashew nuts. Packaging very fine and fresh!"',
    comment: '"Super tasty veg chips, fruit chips and cashew nuts. Packaging very fine and fresh!"',
    name: 'Anitha Ganesh',
    tag: 'Premium Buyer',
    status: 'APPROVED',
    date: '2026-09-20'
  },
  {
    id: 'rev-seed-2',
    rating: 5,
    quote: '"We order Nuts and quality is superb.. we ordered from Ramanathapuram, Thondi. On time delivery!"',
    comment: '"We order Nuts and quality is superb.. we ordered from Ramanathapuram, Thondi. On time delivery!"',
    name: 'Jamruth Banu',
    tag: 'Premium Buyer',
    status: 'APPROVED',
    date: '2026-09-19'
  },
  {
    id: 'rev-seed-3',
    rating: 5,
    quote: '"Packing pakka and dates n\' chips were very tasty. So I gave 5 stars!"',
    comment: '"Packing pakka and dates n\' chips were very tasty. So I gave 5 stars!"',
    name: 'Manju Gobi',
    tag: 'Premium Buyer',
    status: 'APPROVED',
    date: '2026-09-18'
  },
  {
    id: 'rev-seed-4',
    rating: 5,
    quote: '"All the items I received were excellent. The vegetable chips were crunchy and flavorful, and the prunes were fresh and soft. Packaging was neat and delivery was on time. Very satisfied with the quality. THANK YOU!"',
    comment: '"All the items I received were excellent. The vegetable chips were crunchy and flavorful, and the prunes were fresh and soft. Packaging was neat and delivery was on time. Very satisfied with the quality. THANK YOU!"',
    name: 'Prashanth Mani',
    tag: 'Premium Buyer',
    status: 'APPROVED',
    date: '2026-09-17'
  }
];

export default function TestimonialsSection() {
  const { reviews, addReview, user } = useCart();

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Combine user-submitted reviews with default testimonials
  const allReviews = useMemo(() => {
    const list = [];
    const seenQuotes = new Set();

    // 1. Newly posted & context reviews first
    if (Array.isArray(reviews)) {
      reviews.forEach(r => {
        const text = (r.quote || r.comment || '').trim();
        const status = (r.status || 'APPROVED').toUpperCase();
        if (text && status !== 'REJECTED' && !seenQuotes.has(text.toLowerCase())) {
          list.push({
            id: r.id || `rev-${Math.random()}`,
            rating: Number(r.rating) || 5,
            quote: text.startsWith('"') ? text : `"${text}"`,
            name: r.name || r.customerName || 'Verified Buyer',
            tag: r.tag || 'Verified Customer',
            date: r.date || 'Recent'
          });
          seenQuotes.add(text.toLowerCase());
        }
      });
    }

    // 2. Add seed testimonials if not already in list
    SEED_TESTIMONIALS.forEach(s => {
      const text = s.quote.trim();
      if (!seenQuotes.has(text.toLowerCase())) {
        list.push(s);
        seenQuotes.add(text.toLowerCase());
      }
    });

    return list;
  }, [reviews]);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const finalName = customerName.trim() || user?.name || 'Customer';

    if (addReview) {
      addReview({
        name: finalName,
        customerName: finalName,
        quote: comment.trim(),
        comment: comment.trim(),
        rating,
        tag: 'Verified Buyer',
        status: 'APPROVED',
        productName: 'Website Experience & Delivery',
        date: new Date().toISOString().split('T')[0]
      });
    }

    setSubmitted(true);
    setComment('');
    if (!user) setCustomerName('');

    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
    }, 2500);
  };

  return (
    <section id="testimonials-section" className="py-16 bg-[#F9FAFB]/60 border-t border-[#E5E7EB]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER & BADGE (VOICES OF TRUST) */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#25D366] text-white text-[11px] sm:text-xs font-black tracking-widest uppercase rounded-full shadow-xs">
              <Quote className="w-3.5 h-3.5 text-white" />
              <span>VOICES OF TRUST</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-[#000000] tracking-tight">
            Our Happy Harvest Tribe
          </h2>

          <p className="text-xs sm:text-base font-serif italic text-[#000000] leading-relaxed">
            Real experiences from our community of organic lovers across the country.
          </p>

          {/* Button to toggle feedback submission form */}
          <div className="pt-2">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4 text-white" />
              <span>{isFormOpen ? 'Close Feedback Form' : 'Write Feedback / Review'}</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK SUBMISSION ACCORDION FORM */}
        {isFormOpen && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xl animate-fadeIn">
            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#000000] mx-auto animate-bounce" />
                <h3 className="text-xl font-bold font-serif text-[#000000]">
                  Thank you for your feedback!
                </h3>
                <p className="text-sm text-gray-600">
                  Unga review ippo "Voices of Trust" section-la live-ah add aagiduchu! 🎉
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-bold font-serif text-[#000000] flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-[#000000]" />
                    <span>Share Your Experience</span>
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">Public Feedback</span>
                </div>

                {/* Rating Stars Picker */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        title={`${star} Star`}
                      >
                        <span className={`${
                          (hoverRating || rating) >= star ? 'text-[#000000]' : 'text-gray-300'
                        }`}>
                          ★
                        </span>
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-gray-500 ml-2">
                      {rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name (e.g. Ramesh Kumar)"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#000000] bg-gray-50/50"
                  />
                </div>

                {/* Review Message Textarea */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Feedback / Review:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the product taste, packaging, delivery, or overall store experience?"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#000000] bg-gray-50/50 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#000000] hover:bg-[#000000] text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4 text-[#000000]" />
                    <span>Post My Feedback Live</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* REVIEW CARDS GRID (DYNAMICALLY SHOWS ALL STORE & USER FEEDBACK) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {allReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E5E7EB] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between space-y-6 relative group"
            >
              {/* TOP RATING STARS & GOLD QUOTE SYMBOL */}
              <div className="flex items-center justify-between">
                {/* GOLD STARS */}
                <div className="flex items-center gap-1 text-[#000000] text-sm">
                  {[...Array(Math.min(5, Math.max(1, rev.rating)))].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                {/* LARGE GOLD DOUBLE QUOTE ICON */}
                <div className="text-3xl sm:text-4xl font-serif font-black text-[#000000] leading-none select-none opacity-90 group-hover:scale-110 transition-transform">
                  ”
                </div>
              </div>

              {/* REVIEW TEXT IN ITALIC SERIF FONT */}
              <p className="text-xs sm:text-sm font-serif italic text-[#000000] leading-relaxed flex-1">
                {rev.quote}
              </p>

              {/* USER PROFILE FOOTER */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F9FAFB]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#8C7A6B] shrink-0">
                    <User className="w-4 h-4 text-[#000000]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold font-serif text-[#000000]">
                      {rev.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#000000] font-serif">
                      {rev.tag}
                    </p>
                  </div>
                </div>

                {rev.date && rev.date !== 'Recent' && (
                  <span className="text-[10px] text-gray-400 font-mono">
                    {rev.date}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
