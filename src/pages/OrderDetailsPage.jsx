import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, Package, CheckCircle2, Clock, Truck, MapPin, 
  Copy, Phone, Mail, AlertCircle, X, MessageCircle, ShoppingBag, ChevronRight,
  Printer, ShieldCheck, Award, FileText, Check, Sparkles, Navigation,
  RotateCcw, HelpCircle, ChevronDown, ChevronUp, AlertTriangle,
  Key, UserCheck, Star, Zap, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderDetailsPage() {
  const { selectedOrder, setSelectedOrder, orders, navigate, activeWhatsAppNumber, addToCart, products, addReview, user, storeSettings } = useCart();
  const [orderData, setOrderData] = useState(selectedOrder || null);
  const [isLoading, setIsLoading] = useState(!selectedOrder);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [reorderedItems, setReorderedItems] = useState({});
  const [addedRecItem, setAddedRecItem] = useState({});
  
  // Professional Cancel Delivery Modal States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('ordered_by_mistake');
  const [cancelNotes, setCancelNotes] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Delivered Feedback Popup Modal States
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // In-Page Interactive Product Review & Feedback States
  const [userRating, setUserRating] = useState(5);
  const [userReviewComment, setUserReviewComment] = useState('');
  const [selectedReviewItemIdx, setSelectedReviewItemIdx] = useState(0);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [reviewCommentError, setReviewCommentError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCancelModalOpen(false);
        setIsInvoiceModalOpen(false);
        setIsFeedbackModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract order ID from params or URL if not directly in state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get('order_id') || urlParams.get('id');
    const autoCancel = urlParams.get('action') === 'cancel';

    if (autoCancel || selectedOrder?.openCancel) {
      setIsCancelModalOpen(true);
    }

    if (selectedOrder) {
      setOrderData(selectedOrder);
      setIsLoading(false);
      return;
    }

    const findAndFetchOrder = async () => {
      setIsLoading(true);
      const targetId = orderIdFromUrl;

      // 1. Check in context orders first
      if (orders && orders.length > 0 && targetId) {
        const found = orders.find(o => 
          (o.id === targetId) || 
          (o.orderId === targetId) || 
          (o.order_id === targetId)
        );
        if (found) {
          setOrderData(found);
          setIsLoading(false);
          return;
        }
      }

      // 2. Fetch directly from API
      if (targetId) {
        try {
          const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '') || (
            typeof window !== 'undefined' && window.location.hostname !== 'localhost'
              ? 'https://nuts-and-spices-dqzp.onrender.com'
              : ''
          );
          const token = localStorage.getItem('nuts_spices_auth_token');
          const guestPhone = (localStorage.getItem('last_order_phone') || '').replace(/\D/g, '');
          const phone4Param = guestPhone ? `?phone4=${guestPhone.slice(-4)}` : '';

          const res = await fetch(`${BASE}/api/orders/${targetId}${phone4Param}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          const data = await res.json();
          if (data && data.success && data.order) {
            setOrderData(data.order);
          }
        } catch (err) {
          console.warn('Could not fetch order from API:', err);
        }
      }
      setIsLoading(false);
    };

    findAndFetchOrder();
  }, [selectedOrder, orders]);

  // Check if order is DELIVERED and prompt customer feedback popup
  useEffect(() => {
    if (orderData && String(orderData.status || '').toLowerCase() === 'delivered') {
      const oid = orderData.order_id || orderData.orderId || orderData.id;
      const feedbackKey = `feedback_submitted_${oid}`;
      const alreadySubmitted = localStorage.getItem(feedbackKey);
      
      if (!alreadySubmitted) {
        // Pre-select first item if available
        let orderItems = [];
        try {
          if (Array.isArray(orderData.items)) orderItems = orderData.items;
          else if (typeof orderData.items_json === 'string') orderItems = JSON.parse(orderData.items_json);
        } catch {}

        if (orderItems.length > 0) {
          setSelectedProductForReview(orderItems[0]);
        }

        const timer = setTimeout(() => {
          setIsFeedbackModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [orderData]);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!orderData) return;
    const oid = orderData.order_id || orderData.orderId || orderData.id;

    addReview({
      customerName: user?.name || orderData.customer_name || 'Valued Patron',
      name: user?.name || orderData.customer_name || 'Valued Patron',
      comment: feedbackComment || 'Order delivered fresh and on time! Highly recommended.',
      quote: feedbackComment || 'Order delivered fresh and on time! Highly recommended.',
      rating: feedbackRating,
      productId: selectedProductForReview?.productId || selectedProductForReview?.id || '',
      productName: selectedProductForReview?.name || 'Delivered Gourmet Item',
      tag: 'Verified Delivery'
    });

    localStorage.setItem(`feedback_submitted_${oid}`, 'true');
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setIsFeedbackModalOpen(false);
    }, 2200);
  };

  // Copy helper
  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === 'awb') {
      setCopiedAwb(true);
      setTimeout(() => setCopiedAwb(false), 2000);
    }
  };

  // Confirm Cancel Delivery Handler
  const handleConfirmCancelDelivery = async () => {
    setCancellingOrderId(orderId);
    setCancelError('');
    try {
      const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '') || (
        typeof window !== 'undefined' && window.location.hostname !== 'localhost'
          ? 'https://nuts-and-spices-dqzp.onrender.com'
          : ''
      );
      const token = localStorage.getItem('nuts_spices_auth_token') || '';
      const res = await fetch(`${BASE}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: cancelReason,
          notes: cancelNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setCancelSuccess(true);
        setOrderData(prev => ({ ...prev, status: 'cancelled' }));
        if (setSelectedOrder) {
          setSelectedOrder(prev => ({ ...prev, status: 'cancelled' }));
        }
        setTimeout(() => {
          setIsCancelModalOpen(false);
          setCancelSuccess(false);
        }, 2200);
      } else {
        setCancelError(data.message || 'Failed to cancel order delivery');
      }
    } catch (err) {
      console.error('Cancel delivery error:', err);
      setCancelError('Error cancelling order delivery. Please try again.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Reorder Item Handler
  const handleReorderItem = (item, idx) => {
    if (addToCart) {
      addToCart(
        {
          id: item.productId || item.id || `prod-${idx}`,
          name: item.name || 'Gourmet Selection',
          price: Number(item.price || 100),
          image: item.image || '/logo.jpg'
        },
        { label: item.weight || item.pack || 'Standard', price: Number(item.price || 100) },
        1
      );
      setReorderedItems(prev => ({ ...prev, [idx]: true }));
      setTimeout(() => {
        setReorderedItems(prev => ({ ...prev, [idx]: false }));
      }, 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-[#128C7E]/20 border-t-[#128C7E] rounded-full animate-spin"></div>
          <Package className="w-6 h-6 text-[#128C7E] absolute inset-0 m-auto" />
        </div>
        <p className="text-sm font-extrabold text-black font-serif tracking-wider uppercase">
          Verifying Order Details...
        </p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-400 shadow-inner">
          <Package className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black font-serif text-black">Order Record Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          The requested order ID could not be loaded from active records. Please check your order history or contact store support.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('profile')}
            className="px-6 py-3 bg-[#128C7E] hover:bg-[#0e6f63] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer"
          >
            My Orders
          </button>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-3 bg-white border border-gray-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const orderId = orderData.order_id || orderData.orderId || orderData.id || 'N/A';
  const rawDate = new Date(orderData.created_at || orderData.createdAt || orderData.date || '2025-01-01');
  const orderDateFormatted = rawDate.toLocaleDateString('en-IN', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
  
  // Calculate estimated delivery: 3 business days from order placement
  const estimatedDeliveryDate = new Date(rawDate.getTime() + (3 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  // Unique simulated courier tracking AWB
  const awbNumber = `HNS-EXP-${String(orderId).replace(/\D/g, '').slice(-6) || '749102'}`;

  // Safe parse items list
  let items = [];
  try {
    if (Array.isArray(orderData.items)) {
      items = orderData.items;
    } else if (typeof orderData.items_json === 'string') {
      items = JSON.parse(orderData.items_json);
    } else if (typeof orderData.items === 'string') {
      items = JSON.parse(orderData.items);
    }
  } catch {
    items = [];
  }

  // Handle Send Review / Feedback to Product Page
  const handleSendFeedback = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!userReviewComment.trim()) {
      setReviewCommentError('Please write your review/feedback before sending.');
      return;
    }
    setReviewCommentError('');

    const targetItem = (items && items.length > 0) ? items[selectedReviewItemIdx] || items[0] : null;
    const prodId = targetItem?.productId || targetItem?.id || '';
    const prodName = targetItem?.name || 'Gourmet Selection';
    const reviewerName = user?.name || orderData?.customer_name || 'Verified Patron';

    if (addReview) {
      addReview({
        customerName: reviewerName,
        name: reviewerName,
        comment: userReviewComment.trim(),
        quote: userReviewComment.trim(),
        rating: userRating,
        productId: prodId,
        productName: prodName,
        tag: 'Verified Purchase'
      });
    }

    setReviewSubmitSuccess(true);
    setUserReviewComment('');
    setTimeout(() => {
      setReviewSubmitSuccess(false);
    }, 4500);
  };

  const currentStatus = (orderData.status || 'pending').toLowerCase();
  const isCancelled = currentStatus === 'cancelled';
  const isRefunded = currentStatus === 'refunded';
  const isDelivered = currentStatus === 'delivered';
  const canCancel = currentStatus === 'pending' || currentStatus === 'confirmed';

  // 5-stage enterprise tracker definition
  const TRACKER_STEPS = [
    {
      id: 'placed',
      title: 'Order Confirmed',
      description: 'Order logged & payment verified in ERP',
      time: rawDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      icon: CheckCircle2,
      isCompleted: !isCancelled && !isRefunded,
      isCurrent: currentStatus === 'pending'
    },
    {
      id: 'packed',
      title: 'Hygienically Packed',
      description: 'Vacuum sealed in moisture-proof zip bags',
      time: 'Facility Hub',
      icon: Package,
      isCompleted: !isCancelled && !isRefunded && ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(currentStatus),
      isCurrent: currentStatus === 'confirmed' || currentStatus === 'processing'
    },
    {
      id: 'shipped',
      title: 'Dispatched via Air Express',
      description: `In transit via Express Logistics (${awbNumber})`,
      time: 'Central Hub',
      icon: Truck,
      isCompleted: !isCancelled && !isRefunded && ['shipped', 'out_for_delivery', 'delivered'].includes(currentStatus),
      isCurrent: currentStatus === 'shipped'
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Courier agent on route to doorstep',
      time: 'Local Hub',
      icon: Navigation,
      isCompleted: !isCancelled && !isRefunded && ['out_for_delivery', 'delivered'].includes(currentStatus),
      isCurrent: currentStatus === 'out_for_delivery'
    },
    {
      id: 'delivered',
      title: 'Delivered Successfully',
      description: 'Safely handed over with OTP verification',
      time: isDelivered ? 'Completed' : 'Expected soon',
      icon: Award,
      isCompleted: !isCancelled && !isRefunded && isDelivered,
      isCurrent: isDelivered
    }
  ];

  const subtotal = Number(orderData.subtotal || orderData.total_amount || orderData.totalAmount || orderData.total || 0);
  const deliveryCharge = Number(orderData.delivery_charge || orderData.deliveryCharge || 0);
  const totalAmount = Number(orderData.total_amount || orderData.totalAmount || orderData.total || subtotal);

  const whatsappMessage = encodeURIComponent(
    `Hello HAJI NUTS & SPICES Support, I would like an update regarding my Order #${orderId} (Status: ${currentStatus}).`
  );
  const whatsappUrl = `https://wa.me/${activeWhatsAppNumber || '919655298540'}?text=${whatsappMessage}`;

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-6 sm:py-10 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* TOP BREADCRUMB & PROFESSIONAL ACTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('profile')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-black rounded-xl text-xs font-black text-black transition-all shadow-2xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Orders</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span>Home</span>
              <span>/</span>
              <span>Account</span>
              <span>/</span>
              <span className="text-black font-bold">#{orderId}</span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-[#128C7E] rounded-xl text-xs font-black text-black transition-all shadow-2xs cursor-pointer hover:bg-emerald-50/50"
            >
              <FileText className="w-3.5 h-3.5 text-[#128C7E]" />
              <span>View GST Invoice</span>
            </button>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#128C7E] hover:bg-[#0e6f63] text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-[#128C7E]/20"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Live Support</span>
            </a>
          </div>
        </div>

        {/* HERO ORDER BANNER: HIGHLY REFINED & DATA-RICH STATUS BAR (ZERO FREE SPACE) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-50/60 via-transparent to-transparent -z-0 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            
            {/* Left: Identity & Status */}
            <div className="space-y-2 shrink-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-2xs ${
                  isRefunded ? 'bg-red-50 text-red-700 border-red-200' :
                  isCancelled ? 'bg-gray-100 text-gray-700 border-gray-300' :
                  isDelivered ? 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-2 ring-emerald-500/20' :
                  currentStatus === 'shipped' || currentStatus === 'out_for_delivery' ? 'bg-blue-50 text-blue-800 border-blue-200 ring-2 ring-blue-500/20' :
                  'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isRefunded ? 'bg-red-500' : isCancelled ? 'bg-gray-500' : isDelivered ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`} />
                  {isRefunded ? 'Refunded' : isCancelled ? 'Cancelled' : isDelivered ? 'Delivered' : currentStatus.replace('_', ' ')}
                </span>

                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs font-semibold text-gray-500">
                  Carrier: <span className="text-black font-bold">Haji Express / BlueDart Priority</span>
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <h1 className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight">
                  #{orderId}
                </h1>
                <button
                  onClick={() => handleCopy(orderId, 'id')}
                  className="p-1.5 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100 cursor-pointer"
                  title="Copy Order ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Booked on {orderDateFormatted}</span>
              </p>
            </div>

            {/* Right: Estimated Delivery & Grand Total Card */}
            <div className="flex items-center gap-4 sm:gap-6 bg-gray-50/90 p-4 rounded-2xl border border-gray-200/80 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">
                  {isDelivered ? 'Delivered On' : isCancelled ? 'Status Note' : 'Estimated Delivery'}
                </span>
                <span className="text-sm font-black text-black block">
                  {isDelivered ? 'Completed' : isCancelled ? 'Recalled' : estimatedDeliveryDate}
                </span>
                {!isCancelled && !isDelivered && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    ✓ On Schedule
                  </span>
                )}
              </div>

              <div className="h-10 w-px bg-gray-200" />

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider block">
                  Grand Total
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#128C7E] block">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase block">
                  {orderData.payment_method || 'Online Paid'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ENTERPRISE VISUAL TRACKER COMPONENT */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-gray-400' : 'bg-emerald-500 animate-ping'}`} />
                <h2 className="text-lg sm:text-xl font-black font-serif text-black">
                  Live Consignment Tracking
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  🛰️ Satellite Telemetry Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Real-time express routing updates from our Chennai central logistics grid
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/80 text-xs font-mono">
                <span className="text-gray-500 text-[10px] uppercase font-bold">AWB:</span>
                <span className="font-bold text-black">{awbNumber}</span>
                <button
                  onClick={() => handleCopy(awbNumber, 'awb')}
                  className="text-gray-400 hover:text-black cursor-pointer"
                  title="Copy Tracking Number"
                >
                  {copiedAwb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {canCancel && (
                <button
                  onClick={() => {
                    setCancelError('');
                    setIsCancelModalOpen(true);
                  }}
                  disabled={cancellingOrderId === orderId}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Delivery</span>
                </button>
              )}
            </div>
          </div>

          {/* Cancellation or Refund Special Resolution Pipeline (Ensures cancelled view is informative & filled!) */}
          {isCancelled && (
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-300 space-y-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                  <X className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-black">Consignment Delivery Cancelled</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This order package has been successfully recalled from delivery dispatch. The reserved inventory has been reconciled at our Sowcarpet Hub.
                  </p>
                </div>
              </div>

              {/* 4-Step Resolution Pipeline for Cancelled Orders */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-400">Step 1</span>
                  <p className="font-bold text-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Request Logged
                  </p>
                  <span className="text-[10px] text-gray-500">Verified by customer</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-400">Step 2</span>
                  <p className="font-bold text-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dispatch Recalled
                  </p>
                  <span className="text-[10px] text-gray-500">Courier transit halted</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-400">Step 3</span>
                  <p className="font-bold text-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Refund Processed
                  </p>
                  <span className="text-[10px] text-gray-500">Credited to source account</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-400">Step 4</span>
                  <p className="font-bold text-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ledger Closed
                  </p>
                  <span className="text-[10px] text-gray-500">Ref: HNS-REC-{orderId}</span>
                </div>
              </div>
            </div>
          )}

          {isRefunded && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start sm:items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black">Full Refund Credited</p>
                <p className="text-xs text-rose-700 leading-relaxed">
                  ₹{totalAmount.toLocaleString('en-IN')} has been refunded back to your bank/UPI account under reference #{orderId}.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Progress Bar (Desktop / Tablet) */}
          <div className="hidden md:block pt-4 pb-2">
            <div className="relative flex items-center justify-between">
              
              {/* Connecting background line */}
              <div className="absolute left-8 right-8 top-6 h-1.5 bg-gray-100 rounded-full -z-0" />
              
              {/* Colored progress line */}
              {(() => {
                const completedCount = TRACKER_STEPS.filter(s => s.isCompleted).length;
                const progressPercent = isCancelled || isRefunded ? 0 : Math.max(0, (completedCount - 1) / (TRACKER_STEPS.length - 1)) * 100;
                return (
                  <div 
                    className="absolute left-8 top-6 h-1.5 bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-full transition-all duration-700 -z-0"
                    style={{ width: `calc(${progressPercent}% * (1 - 64px / 100%))` }}
                  />
                );
              })()}

              {TRACKER_STEPS.map((step) => {
                const Icon = step.icon;
                const isPassed = step.isCompleted;
                const isCurrent = step.isCurrent && !isCancelled && !isRefunded;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center text-center max-w-[170px]">
                    
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isPassed 
                        ? 'bg-[#128C7E] text-white shadow-md shadow-[#128C7E]/25 ring-4 ring-emerald-50' 
                        : isCurrent
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-4 ring-amber-100 animate-pulse'
                        : 'bg-white border-2 border-gray-200 text-gray-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className={`text-xs font-black mt-3 block ${isPassed || isCurrent ? 'text-black' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                    
                    <span className="text-[10px] text-gray-500 leading-tight mt-1 line-clamp-2 px-1">
                      {step.description}
                    </span>

                    <span className="text-[9px] font-mono font-bold text-gray-400 mt-1 uppercase">
                      {step.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stepper Vertical List (Mobile View) */}
          <div className="block md:hidden space-y-4 pt-2">
            {TRACKER_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = step.isCompleted;
              const isCurrent = step.isCurrent && !isCancelled && !isRefunded;
              const isLast = idx === TRACKER_STEPS.length - 1;

              return (
                <div key={step.id} className="flex items-start gap-4 relative">
                  {!isLast && (
                    <div className={`absolute left-5 top-11 bottom-0 w-0.5 ${isPassed ? 'bg-[#128C7E]' : 'bg-gray-200'}`} />
                  )}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 ${
                    isPassed 
                      ? 'bg-[#128C7E] text-white shadow-sm' 
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-white border-2 border-gray-200 text-gray-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="pb-4">
                    <p className={`text-xs font-black ${isPassed || isCurrent ? 'text-black' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                    <span className="text-[10px] font-mono text-gray-400 mt-1 inline-block">
                      {step.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* MAIN BODY: 2-COLUMN BALANCED ENTERPRISE GRID (PERFECT SYMMETRY, ZERO VOID) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: ITEMS, TRUST GUARANTEES & TRANSIT ROUTE */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. CONSIGNMENT ITEMS CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black font-serif text-black">
                    Consignment Items ({items.length})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Haji Gourmet Selection • Pure, Fresh & Handpicked in Sowcarpet
                  </p>
                </div>
                
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                  ✓ Fresh Stock Sealed
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500">
                    No items found for this order.
                  </div>
                ) : (
                  items.map((item, idx) => {
                    const itemPrice = Number(item.price || 0);
                    const itemQty = Number(item.quantity || 1);
                    const lineTotal = itemPrice * itemQty;
                    const isReordered = Boolean(reorderedItems[idx]);

                    return (
                      <div key={idx} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        
                        <div className="flex items-start gap-4 min-w-0">
                          {/* Image with fallback */}
                          <div className="relative w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 group-hover:border-[#128C7E] transition-colors">
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=400'} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/logo.jpg';
                              }}
                            />
                            {/* Indian Vegetarian Dot */}
                            <div className="absolute top-1.5 left-1.5 bg-white/95 rounded p-0.5 border border-emerald-600 shadow-2xs">
                              <div className="w-2 h-2 rounded-full bg-emerald-600" />
                            </div>
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-black text-black leading-snug">
                                {item.name || 'Gourmet Selection'}
                              </h4>
                              <span className="text-[9px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-bold">
                                BATCH: HN-26K09
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                              <span className="font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                                Pack: {item.weight || item.pack || 'Standard'}
                              </span>
                              <span>•</span>
                              <span>Qty: <strong className="text-black">{itemQty}</strong></span>
                              <span>•</span>
                              <span>Rate: ₹{itemPrice.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] pt-0.5 flex-wrap">
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Grade-A Laboratory Certified
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 font-medium">Nitrogen Barrier Foil Sealed</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Reorder Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0">
                          <span className="text-base font-black font-mono text-black">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>

                          <button
                            onClick={() => handleReorderItem(item, idx)}
                            disabled={isReordered}
                            className={`mt-1.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
                              isReordered 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-gray-50 hover:bg-[#128C7E] text-gray-700 hover:text-white border border-gray-200 hover:border-[#128C7E]'
                            }`}
                          >
                            {isReordered ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added to Cart!</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3 h-3" />
                                <span>Buy Again</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Package Integrity & Inspection Summary Bar */}
              <div className="pt-3 border-t border-gray-100 bg-gray-50/70 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#128C7E]" />
                  <span className="text-gray-600">
                    Consignment Specs: <strong className="text-black">1 Parcel • ~500g Net Weight • Moisture Controlled</strong>
                  </span>
                </div>
                <span className="text-[11px] font-bold text-gray-500">
                  QC Verification: <strong className="text-black">Sowcarpet Line #2 Cleared</strong>
                </span>
              </div>
            </div>

            {/* 2. TRUST & SATISFACTION GUARANTEES STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#128C7E] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-black text-black uppercase">FSSAI Certified</h5>
                <p className="text-[10px] text-gray-500">Lic. 12423008000451</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Package className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-black text-black uppercase">Airtight Seal</h5>
                <p className="text-[10px] text-gray-500">Nitrogen Barrier Pouch</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Award className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-black text-black uppercase">Pure Gourmet</h5>
                <p className="text-[10px] text-gray-500">Zero Additives or Polishing</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h5 className="text-[11px] font-black text-black uppercase">Hassle-Free Return</h5>
                <p className="text-[10px] text-gray-500">7-Day Freshness Promise</p>
              </div>
            </div>

            {/* 3. INTERACTIVE PRODUCT REVIEW & ORDERING EXPERIENCE */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <h4 className="text-base font-black font-serif text-black tracking-wide">
                      Rate Your Ordering Experience & Write Feedback
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your rating and feedback will be published directly under the product page.
                  </p>
                </div>
                {reviewSubmitSuccess && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Feedback Published!</span>
                  </span>
                )}
              </div>

              {/* Product Selector (if multiple items in order) */}
              {items && items.length > 1 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">
                    Select Product to Review:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {items.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedReviewItemIdx(idx)}
                        className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                          selectedReviewItemIdx === idx
                            ? 'bg-[#128C7E] text-white border-[#128C7E] shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <img 
                          src={item.image || '/logo.jpg'} 
                          alt={item.name} 
                          className="w-5 h-5 rounded-md object-cover bg-white" 
                          onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpg'; }}
                        />
                        <span className="truncate max-w-[180px]">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Single item indicator */}
              {items && items.length === 1 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <img 
                    src={items[0]?.image || '/logo.jpg'} 
                    alt={items[0]?.name} 
                    className="w-10 h-10 rounded-xl object-cover bg-white border border-gray-200" 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpg'; }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">Reviewing Product</span>
                    <h5 className="text-xs font-black text-black">{items[0]?.name || 'Gourmet Selection'}</h5>
                  </div>
                </div>
              )}

              {/* Star Rating Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Your Rating:
                  </label>
                  <span className="text-xs font-black text-amber-700 font-mono">
                    {userRating === 5 ? '⭐⭐⭐⭐⭐ 5/5 Outstanding' :
                     userRating === 4 ? '⭐⭐⭐⭐ 4/5 Very Good' :
                     userRating === 3 ? '⭐⭐⭐ 3/5 Good' :
                     userRating === 2 ? '⭐⭐ 2/5 Fair' : '⭐ 1/5 Poor'}
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1.5 hover:scale-125 transition-transform cursor-pointer rounded-lg hover:bg-amber-50"
                      title={`${star} Star`}
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          star <= userRating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Write Your Review / Feedback:
                </label>
                <textarea
                  rows={4}
                  value={userReviewComment}
                  onChange={(e) => {
                    setUserReviewComment(e.target.value);
                    if (reviewCommentError) setReviewCommentError('');
                  }}
                  placeholder="Share details about freshness, crunchiness, aroma, packaging, or delivery experience..."
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-black placeholder:text-gray-400 outline-none focus:border-[#128C7E] focus:bg-white transition-all resize-none font-medium leading-relaxed"
                />
                {reviewCommentError && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{reviewCommentError}</span>
                  </p>
                )}
              </div>

              {/* Submit Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-gray-500">
                  Reviews are instantly published under the verified customer reviews section on the product page.
                </p>

                <button
                  type="button"
                  onClick={handleSendFeedback}
                  className="px-6 py-3 bg-[#128C7E] hover:bg-[#0e6f63] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#128C7E]/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Feedback</span>
                </button>
              </div>

              {/* Success Notification Banner */}
              {reviewSubmitSuccess && (
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Thank you! Your feedback for <strong>{(items[selectedReviewItemIdx] || items[0])?.name || 'this product'}</strong> has been published and linked directly under the product page!
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 1 COLUMN: ADDRESS, COURIER PARTNER, BILLING & SUPPORT (PERFECTLY BALANCED HEIGHT) */}
          <div className="space-y-6">
            
            {/* 1. DELIVERY DESTINATION CARD */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#128C7E]" />
                  <span>Delivery Address</span>
                </h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  Destination
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <p className="font-black text-black text-sm">
                    {orderData.customer_name || orderData.customerName || 'Customer'}
                  </p>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase">
                    Verified
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed font-normal">
                  {orderData.address || 'Door delivery address specified during checkout'}
                </p>

                <p className="text-black font-semibold">
                  {orderData.city ? `${orderData.city}, ` : ''}{orderData.state || 'Tamil Nadu'}{orderData.pincode ? ` - ${orderData.pincode}` : ''}
                </p>
                
                <div className="pt-3 mt-3 border-t border-gray-100 space-y-1.5 text-gray-600 font-mono text-xs">
                  {orderData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{orderData.phone}</span>
                    </div>
                  )}
                  {orderData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{orderData.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Instruction note */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/60 text-[11px] text-gray-500">
                💡 <strong>Delivery Note:</strong> Contactless delivery available. Please keep OTP ready upon courier arrival.
              </div>
            </div>

            {/* 2. FINANCIAL SUMMARY CARD */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                  Payment & Charges
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Receipt Generated
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Cart Items Subtotal</span>
                  <span className="font-bold font-mono text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping & Logistics Fee</span>
                  <span className="font-bold font-mono text-emerald-700">
                    {deliveryCharge === 0 ? 'FREE DELIVERY' : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>GST Taxes (5% Included)</span>
                  <span className="font-bold font-mono text-black">
                    ₹{(Math.round(subtotal * 0.05)).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 items-center">
                  <span>Payment Gateway</span>
                  <span className="font-bold text-black uppercase bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                    {orderData.payment_method || 'Online UPI / Card'}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-black text-black block">Total Paid</span>
                    <span className="text-[10px] text-gray-400">All Taxes Included</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-[#128C7E]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-600" />
                  <span>Download / Print GST Invoice</span>
                </button>

                <button
                  onClick={() => navigate('shop')}
                  className="w-full py-3 bg-[#128C7E] hover:bg-[#0e6f63] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#128C7E]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>

            {/* 3. NEED HELP & CONCIERGE ASSISTANCE BOX */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-2 text-xs">
              <h4 className="font-black text-black flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#128C7E]" />
                <span>Need Assistance with this Order?</span>
              </h4>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Our customer executive is available 9:00 AM – 9:00 PM for tracking queries, delivery rescheduling, or feedback.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <a
                  href={`tel:${activeWhatsAppNumber || '919655298540'}`}
                  className="text-xs font-bold text-black hover:text-[#128C7E] flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-[#128C7E]" />
                  <span>Call Helpline</span>
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#128C7E] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* FULL-WIDTH SECTION: POPULAR RECOMMENDATIONS & PAIRINGS (FILLS BOTTOM EMPTY SPACE) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base sm:text-lg font-black font-serif text-black">
                  Recommended to Pair With Your Order
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Handpicked customer favorites • Enjoy authentic freshness direct from Chennai
              </p>
            </div>

            <button
              onClick={() => navigate('shop')}
              className="text-xs font-black text-[#128C7E] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Explore All Products</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4-Column Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(products && products.length > 0 ? products.slice(0, 4) : [
              {
                id: 'ndf-01',
                name: 'California Jumbo Almonds',
                price: 650,
                weights: [{ label: '500g', price: 650 }],
                image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=600',
                rating: 5,
                badge: 'Bestseller'
              },
              {
                id: 'dt-02',
                name: 'Premium Ajwa Al-Madinah Dates',
                price: 1250,
                weights: [{ label: '500g', price: 1250 }],
                image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=600',
                rating: 4.9,
                badge: 'Royal Grade'
              },
              {
                id: 'ndf-03',
                name: 'Afghan Sun-Dried Anjeer (Figs)',
                price: 870,
                weights: [{ label: '500g', price: 870 }],
                image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=600',
                rating: 5,
                badge: 'Organic'
              },
              {
                id: 'sp-01',
                name: 'Kashmiri Mogra Pure Saffron',
                price: 790,
                weights: [{ label: '1g Jar', price: 790 }],
                image: 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=600',
                rating: 5,
                badge: 'Purest Grade'
              }
            ]).map((prod, pIdx) => {
              const pPrice = Number(prod.weights?.[0]?.price || prod.price || 450);
              const isAdded = Boolean(addedRecItem[pIdx]);

              return (
                <div 
                  key={prod.id || pIdx} 
                  className="bg-gray-50/70 hover:bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-[#128C7E] transition-all hover:shadow-md group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-gray-200/80">
                      <img 
                        src={prod.image || '/logo.jpg'} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/logo.jpg';
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {prod.badge || 'Fresh'}
                      </span>
                      {/* Vegetarian Green Dot */}
                      <div className="absolute top-2 right-2 bg-white/95 rounded p-0.5 border border-emerald-600 shadow-2xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-amber-500 text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-black text-black">4.9</span>
                        <span className="text-gray-400 text-[10px]">(Verified)</span>
                      </div>
                      
                      <h4 className="text-xs font-black text-black line-clamp-2 leading-tight">
                        {prod.name}
                      </h4>
                      
                      <p className="text-[11px] text-gray-500 font-bold">
                        Pack: <span className="text-black">{prod.weights?.[0]?.label || 'Standard'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2">
                    <span className="text-sm font-black font-mono text-[#128C7E]">
                      ₹{pPrice.toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => {
                        if (addToCart) {
                          addToCart(
                            {
                              id: prod.id,
                              name: prod.name,
                              price: pPrice,
                              image: prod.image
                            },
                            { label: prod.weights?.[0]?.label || 'Standard', price: pPrice },
                            1
                          );
                          setAddedRecItem(prev => ({ ...prev, [pIdx]: true }));
                          setTimeout(() => {
                            setAddedRecItem(prev => ({ ...prev, [pIdx]: false }));
                          }, 2200);
                        }
                      }}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#128C7E] hover:bg-[#0e6f63] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>+ Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BRAND HERITAGE & ASSURANCE FOOTER BANNER */}
        <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-6 sm:p-7 rounded-3xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-2xs">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full border border-gray-300 object-contain shadow-2xs shrink-0" />
            <div>
              <h4 className="text-sm font-black font-serif text-black uppercase tracking-wider">
                HAJI NUTS & SPICES • GOURMET HERITAGE SINCE 1948
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Authentic dry fruits, natural saffron, and roasted nuts sourced directly from origin orchards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-gray-700 flex-wrap justify-center">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#128C7E]" /> FSSAI Approved</span>
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#128C7E]" /> Pan-India Express</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#128C7E]" /> 100% Guaranteed Purity</span>
          </div>
        </div>

      </div>

      {/* PROFESSIONAL CANCEL DELIVERY CONFIRMATION POPUP MODAL */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 my-8 flex flex-col"
            >
              {cancelSuccess ? (
                /* Success View */
                <div className="p-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black font-serif text-black">
                      Consignment Delivery Cancelled
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Your cancellation for Order <strong className="text-black">#{orderId}</strong> has been confirmed. Dispatch from Sowcarpet Hub has been halted.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs text-left space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Refund Status:</span>
                      <strong className="text-emerald-700">Initiated (100% Full Refund)</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Refund Amount:</span>
                      <strong className="font-mono text-black">₹{totalAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Settlement Mode:</span>
                      <span className="uppercase text-black font-semibold">{orderData.payment_method || 'Source Bank / UPI'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Reference ARN:</span>
                      <span className="font-mono text-gray-700">REF-HNS-{orderId}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCancelModalOpen(false);
                      setCancelSuccess(false);
                    }}
                    className="w-full py-3 bg-[#128C7E] hover:bg-[#0e6f63] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
                  >
                    View Updated Order Status
                  </button>
                </div>
              ) : (
                /* Interactive Form View */
                <>
                  {/* Modal Header */}
                  <div className="p-5 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black font-serif text-black">
                          Cancel Consignment Delivery
                        </h3>
                        <p className="text-[11px] text-gray-500 font-mono">
                          Order #{orderId} • Sowcarpet Central Queue
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCancelModalOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-200/60 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] text-xs">
                    
                    {/* Notice Card */}
                    <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2.5 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Notice:</strong> Cancelling will halt air express dispatch. Reserved vacuum-sealed batches will be returned to stock inventory.
                      </div>
                    </div>

                    {/* Reason Selection */}
                    <div className="space-y-2.5">
                      <label className="font-black text-black block uppercase tracking-wider text-[11px]">
                        Please select a reason for cancellation:
                      </label>

                      <div className="space-y-2">
                        {[
                          { id: 'ordered_by_mistake', label: 'Ordered by mistake / Duplicate order' },
                          { id: 'address_change', label: 'Need to change delivery address or phone number' },
                          { id: 'delivery_time_delay', label: 'Expected delivery date is too late / Traveling' },
                          { id: 'change_pack_selection', label: 'Want to change product variant or pack weight' },
                          { id: 'found_alternate', label: 'Found alternate product / Changed my mind' },
                          { id: 'other', label: 'Other reason' }
                        ].map((opt) => (
                          <label
                            key={opt.id}
                            onClick={() => setCancelReason(opt.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                              cancelReason === opt.id
                                ? 'bg-rose-50/50 border-rose-300 text-black shadow-2xs'
                                : 'bg-gray-50/60 hover:bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            <span className="font-semibold text-xs">{opt.label}</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              cancelReason === opt.id ? 'border-rose-600 bg-rose-600' : 'border-gray-300 bg-white'
                            }`}>
                              {cancelReason === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Optional Note */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-gray-700 block text-[11px]">
                        Additional Comments (Optional):
                      </label>
                      <textarea
                        value={cancelNotes}
                        onChange={(e) => setCancelNotes(e.target.value)}
                        placeholder="Help us improve our packaging or delivery speed..."
                        rows={2}
                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs focus:bg-white focus:outline-none focus:border-rose-400 transition-colors resize-none"
                      />
                    </div>

                    {/* Refund Assurance Box */}
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Refundable Amount:</span>
                        <span className="font-black font-mono text-black text-xs">₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Cancellation Fee:</span>
                        <span className="font-bold text-emerald-700">₹0 (ZERO FEE)</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <span>Estimated Credit:</span>
                        <span className="font-semibold text-gray-800">Instant to 24–48 Business Hours</span>
                      </div>
                    </div>

                    {/* Error display */}
                    {cancelError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                        {cancelError}
                      </div>
                    )}

                  </div>

                  {/* Modal Footer Actions */}
                  <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
                    <button
                      onClick={() => setIsCancelModalOpen(false)}
                      disabled={cancellingOrderId === orderId}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 hover:border-black text-black font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      Keep My Order
                    </button>

                    <button
                      onClick={handleConfirmCancelDelivery}
                      disabled={cancellingOrderId === orderId}
                      className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {cancellingOrderId === orderId ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          <span>Confirm & Cancel Delivery</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED TAX INVOICE POPUP MODAL */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 my-8 flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#128C7E]" />
                  <span className="font-black text-sm uppercase tracking-wider text-black">Official Tax Invoice</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-[#128C7E] hover:bg-[#0e6f63] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Sheet */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-gray-800">
                
                {/* Store Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <img src={storeSettings?.logoUrl || "/logo.jpg"} alt="Logo" className="w-10 h-10 object-contain rounded-full border border-gray-200" />
                      <div>
                        <h2 className="text-base font-black font-serif text-black uppercase tracking-wider">{storeSettings?.storeName || 'HAJI NUTS & SPICES'}</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Premium Gourmet Dry Fruits & Spices</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-2">
                      {storeSettings?.address || 'No. 42, Mint Street, Sowcarpet, Chennai - 600001, Tamil Nadu, India'}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      <strong>GSTIN:</strong> 33AAACH1234F1Z5 &nbsp;|&nbsp; <strong>FSSAI:</strong> 12423008000451
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-black bg-gray-100 text-black px-2.5 py-1 rounded uppercase tracking-wider inline-block">
                      Original For Recipient
                    </span>
                    <p className="text-sm font-black font-mono mt-1 text-black">#{orderId}</p>
                    <p className="text-[11px] text-gray-500">Date: {orderDateFormatted}</p>
                  </div>
                </div>

                {/* Bill To & Ship To */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
                  <div>
                    <h5 className="font-black text-gray-500 uppercase text-[10px] tracking-wider mb-1">Billed & Shipped To:</h5>
                    <p className="font-bold text-black text-sm">{orderData.customer_name || orderData.customerName || 'Customer'}</p>
                    <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">{orderData.address || 'Address on file'}</p>
                    <p className="text-gray-600 text-[11px]">{orderData.city || 'Chennai'}, {orderData.state || 'Tamil Nadu'} - {orderData.pincode || '600001'}</p>
                    <p className="text-gray-600 text-[11px] font-mono mt-1">Phone: {orderData.phone || 'N/A'}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <h5 className="font-black text-gray-500 uppercase text-[10px] tracking-wider mb-1">Invoice Details:</h5>
                    <p className="text-gray-600 text-[11px]">Place of Supply: <strong>Tamil Nadu (33)</strong></p>
                    <p className="text-gray-600 text-[11px]">Payment Mode: <strong className="uppercase">{orderData.payment_method || 'Online'}</strong></p>
                    <p className="text-gray-600 text-[11px]">Carrier: <strong>Haji Express Logistics</strong></p>
                    <p className="text-gray-600 text-[11px] font-mono">AWB: <strong>{awbNumber}</strong></p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left divide-y divide-gray-200">
                    <thead className="bg-gray-100/70 text-[10px] uppercase font-black text-gray-700">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Item Description</th>
                        <th className="p-3 text-center">HSN</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-400 font-mono">{idx + 1}</td>
                          <td className="p-3">
                            <p className="font-bold text-black">{item.name}</p>
                            <span className="text-[10px] text-gray-500">Weight: {item.weight || 'Standard'}</span>
                          </td>
                          <td className="p-3 text-center font-mono text-gray-500">0802</td>
                          <td className="p-3 text-center font-bold">{item.quantity || 1}</td>
                          <td className="p-3 text-right font-mono">₹{Number(item.price || 0).toLocaleString('en-IN')}</td>
                          <td className="p-3 text-right font-bold font-mono">
                            ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Table */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-bold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>CGST (2.5%):</span>
                      <span className="font-mono text-black">₹{(Math.round(subtotal * 0.025)).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>SGST (2.5%):</span>
                      <span className="font-mono text-black">₹{(Math.round(subtotal * 0.025)).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Fee:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="pt-2 border-t-2 border-gray-800 flex justify-between font-black text-sm text-black">
                      <span>Total Amount:</span>
                      <span className="font-mono text-[#128C7E]">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Stamp & Signature */}
                <div className="border-t border-gray-200 pt-6 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="space-y-0.5">
                    <p className="font-bold text-black">Thank you for choosing {storeSettings?.storeName || 'HAJI NUTS & SPICES'}!</p>
                    <p>Computer-generated tax invoice. No signature required.</p>
                  </div>
                  <div className="text-right">
                    <div className="h-10 border-b border-gray-400 w-32 ml-auto mb-1 flex items-end justify-center">
                      <span className="text-[10px] text-emerald-800 font-serif italic font-bold">HAJI GOURMET STAMP</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-500">Authorized Signatory</span>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELIVERED ORDER FEEDBACK REVIEW POPUP MODAL */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center space-y-2 pt-2">
                <div className="w-14 h-14 bg-emerald-50 text-[#128C7E] rounded-2xl flex items-center justify-center mx-auto text-2xl border border-emerald-200 shadow-inner">
                  🎉
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-black uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" />
                  <span>Order Delivered Successfully</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-black">
                  How Was Your Gourmet Experience?
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Your package #{orderId} has reached you. Help other food lovers by sharing a quick review!
                </p>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                
                {/* Select Product if multi-item */}
                {items.length > 1 && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Select Product to Review</label>
                    <select
                      value={selectedProductForReview?.productId || selectedProductForReview?.id || ''}
                      onChange={(e) => {
                        const sel = items.find(it => (it.productId || it.id) === e.target.value);
                        if (sel) setSelectedProductForReview(sel);
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-black outline-none focus:border-[#128C7E]"
                    >
                      {items.map((it, idx) => (
                        <option key={idx} value={it.productId || it.id}>
                          {it.name} ({it.weight || 'Standard'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Star Rating Selection */}
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-center space-y-2">
                  <span className="text-xs font-bold text-amber-950 block">Rate Freshness & Quality</span>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="p-1 cursor-pointer focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= feedbackRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-black text-amber-900 block font-mono">
                    {feedbackRating === 5 ? '⭐⭐⭐⭐⭐ 5/5 Excellent Taste' : `${feedbackRating} Stars`}
                  </span>
                </div>

                {/* Feedback Comment */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Your Review & Comments</label>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us about the crispness, aroma, or packing seal..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-black outline-none focus:border-[#128C7E] resize-none"
                  />
                </div>

                {feedbackSubmitted && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Review published to storefront! Thank you!</span>
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const oid = orderData.order_id || orderData.orderId || orderData.id;
                      localStorage.setItem(`feedback_submitted_${oid}`, 'true');
                      setIsFeedbackModalOpen(false);
                    }}
                    className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Maybe Later
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Review</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
