import React, { useState } from 'react';
import { useCart, isProductActive } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart, Check, MessageSquare } from 'lucide-react';

export default function ProductDetailsPage() {
  const { selectedProduct, products, addToCart, wishlist, toggleWishlist, navigate, reviews = [], addReview, user } = useCart();
  
  const activeProds = (products || []).filter(isProductActive);
  const product = (selectedProduct && isProductActive(selectedProduct))
    ? selectedProduct 
    : (activeProds[0] || PRODUCTS[0]);
  
  const defaultWeight = { label: '250g', price: Number(product?.price) || 290, originalPrice: Math.round((Number(product?.price) || 290) * 1.2) };
  const safeWeights = (Array.isArray(product?.weights) && product.weights.length > 0) ? product.weights : [defaultWeight];

  const [selectedWeight, setSelectedWeight] = useState(safeWeights[0] || defaultWeight);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter reviews matching current product or store
  const matchingReviews = reviews.filter(r => {
    if (r.status && r.status === 'HIDDEN') return false;
    if (r.productId && product?.id) return r.productId === product.id;
    if (r.productName && product?.name) return r.productName.toLowerCase().includes(product.name.toLowerCase()) || product.name.toLowerCase().includes(r.productName.toLowerCase());
    return true;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      customerName: reviewerName,
      name: reviewerName,
      comment: reviewComment,
      quote: reviewComment,
      rating: reviewRating,
      productId: product?.id || '',
      productName: product?.name || 'Gourmet Selection',
      tag: 'Verified Purchase'
    });

    setReviewSuccess(true);
    setReviewComment('');
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  React.useEffect(() => {
    if (product) {
      const weights = (Array.isArray(product?.weights) && product.weights.length > 0) ? product.weights : [defaultWeight];
      setSelectedWeight(weights[0] || defaultWeight);
      setQuantity(1);
    }
  }, [product?.id]);

  const activeWeight = selectedWeight || safeWeights[0] || defaultWeight;
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const handleAddToCart = () => {
    addToCart(product, activeWeight, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickCheckout = () => {
    addToCart(product, activeWeight, quantity);
    navigate('cart');
  };

  const curPrice = Number(activeWeight?.price) || Number(product?.price) || 290;
  const origPrice = Number(activeWeight?.originalPrice) || ((product?.discountPercent > 0) ? Math.round(curPrice / ((100 - product.discountPercent) / 100)) : curPrice);
  const totalPrice = curPrice * quantity;
  const originalTotalPrice = origPrice * quantity;

  return (
    <div className="bg-[#FAF7F2]/40 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#128C7E] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shop</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Top Badges Stack matching cards */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.badge && (
                <span className="bg-[#128C7E] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-md font-serif">
                  {product.badge}
                </span>
              )}
              {((origPrice > curPrice) || (product?.discountPercent > 0)) && (
                <span className="bg-[#B91C1C] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-md w-fit">
                  {product?.discountPercent || Math.round(((origPrice - curPrice) / origPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-colors ${
                isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-[#8C7A6B] hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200/80 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Origin</span>
              <span className="text-xs font-black text-gray-900">{product.origin || 'India'}</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200/80 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Shelf Life</span>
              <span className="text-xs font-black text-gray-900">{product.shelfLife || '6 Months'}</span>
            </div>
            <div className="bg-[#FAF7F2] p-3 rounded-xl border border-gray-200/80 text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Purity</span>
              <span className="text-xs font-black text-[#128C7E]">100% Pure</span>
            </div>
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#128C7E] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-500">({product.reviews} customer reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-950">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Select Weight */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-black block">
                Select Package Weight:
              </span>
              <div className="flex flex-wrap gap-2">
                {safeWeights.map((w, i) => {
                  const isSelected = activeWeight === w;
                  return (
                    <button
                      key={product.id + '-' + w.label + '-' + i}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-sm'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-[#128C7E] hover:bg-emerald-50/40'
                      }`}
                    >
                      <span>{w.label}</span>
                      <span className={`ml-1.5 font-normal text-[11px] ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                        ₹{w.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-black block">
                Quantity:
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white font-bold text-base text-gray-800 hover:bg-gray-100 transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white font-bold text-base text-gray-800 hover:bg-gray-100 transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500 font-medium">In stock & ready to ship</span>
              </div>
            </div>

            {/* Dynamic Total Price Container */}
            <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">Total Amount:</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#000000] font-serif">
                    ₹{totalPrice.toLocaleString('en-IN')}.00
                  </span>
                  {originalTotalPrice > totalPrice && (
                    <span className="text-xs text-gray-400 line-through font-sans">
                      ₹{originalTotalPrice.toLocaleString('en-IN')}.00
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#128C7E] bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                Free Express Delivery Eligible
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-95 ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white hover:bg-emerald-50 text-[#128C7E] border-2 border-[#128C7E]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#128C7E]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleQuickCheckout}
                className="py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider bg-[#128C7E] hover:bg-[#0e7064] text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Proceed to Checkout →</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* CUSTOMER REVIEWS & RATING SECTION */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-10 shadow-lg space-y-8">
        
        {/* Header & Rating Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Verified Patron Ratings</span>
            </div>
            <h2 className="text-2xl font-black font-serif text-black">
              Customer Reviews ({matchingReviews.length})
            </h2>
            <p className="text-xs text-gray-500">
              Real feedback from customers who purchased {product.name}.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#128C7E] border border-emerald-200/80 text-xs font-black uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Write Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-amber-200/80 space-y-4 animate-in fade-in duration-300">
            <h3 className="font-serif font-black text-base text-black">Share Your Gourmet Experience</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-600 ml-2">
                  {reviewRating === 5 ? 'Excellent 5/5' : `${reviewRating} / 5`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Ramesh K."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-[#128C7E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Review Comment</label>
                <input
                  type="text"
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the freshness, aroma, or packaging..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-[#128C7E]"
                />
              </div>
            </div>

            {reviewSuccess && (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your review has been submitted and posted successfully.</span>
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#128C7E] hover:bg-[#0e7064] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow cursor-pointer active:scale-95"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {matchingReviews.length === 0 ? (
            <div className="text-center py-10 bg-[#FAF7F2] rounded-2xl border border-gray-200/80 space-y-2">
              <div className="text-3xl">⭐</div>
              <p className="text-sm font-bold text-gray-800">Be the first to review this product!</p>
              <p className="text-xs text-gray-500">Order today and share your authentic feedback with our community.</p>
            </div>
          ) : (
            matchingReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#FAF7F2]/50 border border-[#E5E7EB] hover:border-gray-300 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {(rev.customerName || rev.name || 'C')[0]}
                    </div>
                    <div>
                      <span className="font-bold text-black text-xs block">
                        {rev.customerName || rev.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {rev.date || 'Verified Buyer'}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (Number(rev.rating) || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed pt-1">
                  "{rev.comment || rev.quote}"
                </p>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Purchase</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
    </div>
  );
}
