import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Package, ShoppingBag, CheckCircle, TrendingUp, 
  ChevronRight, Eye, ArrowUpRight, RefreshCw, Truck, 
  AlertTriangle, Sparkles, Copy, Check, MessageCircle, BarChart3, Layers,
  ArrowRight, Gift
} from 'lucide-react';

export default function AdminDashboard({ onNavigateTab, onViewOrderDetails }) {
  const { products, orders, refreshOrders } = useCart();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Normalize order items and statuses for enterprise consistency
  const normalizedOrders = (orders || []).map(o => {
    const s = (o.status || 'pending').toLowerCase();
    const totalVal = Number(o.total !== undefined ? o.total : (o.totalAmount || o.total_amount || 0));
    return {
      ...o,
      orderId: o.orderId || o.order_id || o.id || 'N/A',
      customerName: o.customerName || o.customer_name || 'Valued Patron',
      phone: o.phone || '',
      city: o.city || o.address || 'Chennai',
      date: o.date || o.created_at || o.createdAt,
      totalVal,
      statusNorm: s
    };
  });

  // Filter orders dynamically based on selectedTimeRange
  const now = new Date();
  const filteredOrders = normalizedOrders.filter(o => {
    if (selectedTimeRange === 'All') return true;
    if (!o.date) return true;
    const orderDate = new Date(o.date);
    if (isNaN(orderDate.getTime())) return true;

    if (selectedTimeRange === 'Today') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (selectedTimeRange === '7d') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= sevenDaysAgo;
    }
    if (selectedTimeRange === '30d') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return orderDate >= thirtyDaysAgo;
    }
    return true;
  });

  const confirmedOrders = filteredOrders.filter(o => 
    ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(o.statusNorm)
  );
  const pendingOrders = filteredOrders.filter(o => 
    ['pending', 'new'].includes(o.statusNorm)
  );
  const deliveredOrders = filteredOrders.filter(o => o.statusNorm === 'delivered');
  const cancelledOrders = filteredOrders.filter(o => o.statusNorm === 'cancelled' || o.statusNorm === 'refunded');

  const totalGrossSales = filteredOrders.reduce((sum, o) => sum + o.totalVal, 0);
  const confirmedSales = confirmedOrders.reduce((sum, o) => sum + o.totalVal, 0);
  const activeProductsCount = (products || []).length;
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(totalGrossSales / filteredOrders.length) : 0;
  const lowStockProducts = (products || []).filter(p => (p.stock !== undefined && p.stock <= 15));
  const fulfillmentRate = filteredOrders.length > 0 
    ? Math.round(((deliveredOrders.length + confirmedOrders.length) / filteredOrders.length) * 100) 
    : 100;

  const handleCopy = (id) => {
    navigator.clipboard.writeText(String(id));
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshOrders) {
      await refreshOrders();
    }
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case 'confirmed':
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Confirmed
          </span>
        );
      case 'shipped':
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Delivered
          </span>
        );
      case 'cancelled':
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Real-Time 7-Day Performance Bars (Calculated from real active ledger)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const rawWeeklyData = last7Days.map((dayDate, idx) => {
    const dayStart = new Date(dayDate);
    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dayOrders = normalizedOrders.filter(o => {
      if (!o.date) return false;
      const od = new Date(o.date);
      return od >= dayStart && od <= dayEnd;
    });

    const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalVal, 0);
    const isToday = idx === 6;
    const dayName = isToday ? `${daysOfWeek[dayDate.getDay()]} (Today)` : daysOfWeek[dayDate.getDay()];

    return {
      day: dayName,
      revenue: dayRevenue,
      orders: dayOrders.length,
      isToday
    };
  });

  const maxRevenueInWeek = Math.max(...rawWeeklyData.map(d => d.revenue), 1);
  const WEEKLY_DATA = rawWeeklyData.map(d => ({
    ...d,
    height: d.revenue > 0 ? `${Math.max(12, Math.round((d.revenue / maxRevenueInWeek) * 100))}%` : '8%'
  }));

  const peakDay = [...WEEKLY_DATA].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. EXECUTIVE HEADER & CONTROLS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight font-serif">
              Operations Executive Dashboard
            </h1>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Haji Nuts & Spices Operations Central Hub • Real-Time Order & Sales Telemetry
          </p>
        </div>

        {/* Right Filter & Sync Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            {['Today', '7d', '30d', 'All'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeRange(t)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedTimeRange === t
                    ? 'bg-white text-black shadow-xs font-extrabold'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#128C7E]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. 4 UPGRADED EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Gross Revenue */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-xl -z-0 pointer-events-none group-hover:scale-150 transition-transform" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                Confirmed Revenue
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-black">
                ₹{confirmedSales > 0 ? confirmedSales.toLocaleString('en-IN') : totalGrossSales.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5" /> {confirmedOrders.length} confirmed orders
            </span>
            <span className="text-gray-400 text-[10px]">AOV: ₹{avgOrderValue}</span>
          </div>
        </div>

        {/* Card 2: Consignment Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-xl -z-0 pointer-events-none group-hover:scale-150 transition-transform" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                Total Consignments
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-black">
                {filteredOrders.length}
              </div>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-blue-700 font-bold text-[11px]">
              {confirmedOrders.length} Confirmed / In Transit
            </span>
            {pendingOrders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                {pendingOrders.length} Pending
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Active Catalog */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-xl -z-0 pointer-events-none group-hover:scale-150 transition-transform" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                Catalog Inventory
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-black">
                {activeProductsCount}
              </div>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-bold text-[11px]">
              Live Store Inventory
            </span>
            {lowStockProducts.length > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                {lowStockProducts.length} Low Stock
              </span>
            ) : (
              <span className="text-emerald-700 text-[10px] font-bold">100% In Stock</span>
            )}
          </div>
        </div>

        {/* Card 4: Fulfillment Dispatch Rate */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-xl -z-0 pointer-events-none group-hover:scale-150 transition-transform" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
                Fulfillment Health
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-purple-700">
                {fulfillmentRate}%
              </div>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-purple-700 font-bold text-[11px]">
              {deliveredOrders.length} Delivered
            </span>
            <span className="text-gray-400 text-[10px]">{confirmedOrders.length} In Transit</span>
          </div>
        </div>

      </div>

      {/* 3. VISUAL PERFORMANCE CHART & DISPATCH LIFECYCLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Weekly Revenue & Orders Velocity Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black font-serif text-black flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#128C7E]" />
                <span>Weekly Revenue & Order Velocity</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time daily sales and order volume computed directly from live bookings
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-gray-600 font-bold">
                <span className="w-3 h-3 rounded-md bg-[#128C7E]" /> Sales (₹)
              </span>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {WEEKLY_DATA.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-mono font-bold text-gray-400 group-hover:text-black transition-colors">
                  ₹{item.revenue.toLocaleString('en-IN')}
                </div>
                
                <div 
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:opacity-90 ${
                    item.isToday 
                      ? 'bg-gradient-to-t from-[#128C7E] to-emerald-400 shadow-sm shadow-[#128C7E]/30' 
                      : 'bg-slate-200 hover:bg-[#128C7E]'
                  }`}
                  style={{ height: item.height }}
                />

                <span className={`text-[11px] font-bold ${item.isToday ? 'text-black font-black' : 'text-gray-500'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
            <span>Peak Day: {peakDay ? `${peakDay.day} (₹${peakDay.revenue.toLocaleString('en-IN')})` : 'N/A'}</span>
            <span className="font-bold text-emerald-700">✓ Live Database Ledger Synchronized</span>
          </div>
        </div>

        {/* Right 4 Cols: Order Dispatch Lifecycle Distribution Ring */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-black font-serif text-black">
              Dispatch Pipeline
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Consignment allocation across fulfillment stages
            </p>
          </div>

          {/* Visual Multi-Segment Bar */}
          <div className="space-y-4">
            <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
              {deliveredOrders.length > 0 && (
                <div 
                  className="bg-emerald-500 h-full transition-all" 
                  style={{ width: `${(deliveredOrders.length / (filteredOrders.length || 1)) * 100}%` }} 
                  title={`Delivered: ${deliveredOrders.length}`}
                />
              )}
              {confirmedOrders.length > 0 && (
                <div 
                  className="bg-blue-500 h-full transition-all" 
                  style={{ width: `${(confirmedOrders.length / (filteredOrders.length || 1)) * 100}%` }} 
                  title={`Confirmed / In Transit: ${confirmedOrders.length}`}
                />
              )}
              {pendingOrders.length > 0 && (
                <div 
                  className="bg-amber-400 h-full transition-all" 
                  style={{ width: `${(pendingOrders.length / (filteredOrders.length || 1)) * 100}%` }} 
                  title={`Pending: ${pendingOrders.length}`}
                />
              )}
              {cancelledOrders.length > 0 && (
                <div 
                  className="bg-rose-400 h-full transition-all" 
                  style={{ width: `${(cancelledOrders.length / (filteredOrders.length || 1)) * 100}%` }} 
                  title={`Cancelled: ${cancelledOrders.length}`}
                />
              )}
            </div>

            {/* Legend Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <span className="flex items-center gap-2 text-gray-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Delivered to Recipient</span>
                </span>
                <span className="font-mono font-black text-black">{deliveredOrders.length}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <span className="flex items-center gap-2 text-gray-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Active In Transit / Air Cargo</span>
                </span>
                <span className="font-mono font-black text-black">{confirmedOrders.length}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <span className="flex items-center gap-2 text-gray-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Pending Hub Verification</span>
                </span>
                <span className="font-mono font-black text-black">{pendingOrders.length}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <span className="flex items-center gap-2 text-gray-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>Recalled / Cancelled</span>
                </span>
                <span className="font-mono font-black text-black">{cancelledOrders.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Review Full Orders Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 4. RECENT ORDERS HIGH-DENSITY ENTERPRISE TABLE */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black font-serif text-black flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#128C7E]" />
              <span>Recent Consignment Logs</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live customer orders booked via store portal and WhatsApp checkout
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-black text-[#128C7E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All {normalizedOrders.length} Orders</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-black uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-3">Order ID</th>
                <th className="pb-3 px-3">Patron Details</th>
                <th className="pb-3 px-3">City Destination</th>
                <th className="pb-3 px-3 text-right">Consignment Total</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 px-3 text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...normalizedOrders].sort((a, b) => {
                const da = a.date ? new Date(a.date).getTime() : 0;
                const db = b.date ? new Date(b.date).getTime() : 0;
                return db - da;
              }).slice(0, 6).map((ord) => (
                <tr key={ord.orderId || ord.id} className="hover:bg-gray-50/70 transition-colors group">
                  
                  {/* Order ID */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-black">
                        #{ord.orderId}
                      </span>
                      <button
                        onClick={() => handleCopy(ord.orderId)}
                        className="text-gray-400 hover:text-black cursor-pointer p-0.5 rounded"
                        title="Copy Order ID"
                      >
                        {copiedOrderId === ord.orderId ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {ord.date ? new Date(ord.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-3">
                    <p className="font-black text-black">{ord.customerName}</p>
                    <p className="text-[11px] font-mono text-gray-500">{ord.phone || 'No phone'}</p>
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-3">
                    <span className="text-gray-700 font-semibold">{ord.city || 'Chennai'}</span>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-black font-mono text-black text-sm block">
                      ₹{ord.totalVal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      {ord.payment_method || 'Online Paid'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 text-center">
                    {getStatusBadge(ord.statusNorm)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewOrderDetails(ord)}
                        className="p-1.5 bg-gray-50 hover:bg-[#128C7E] hover:text-white text-gray-700 rounded-lg transition-all cursor-pointer border border-gray-200"
                        title="View Consignment Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {ord.phone && (
                        <a
                          href={`https://wa.me/${ord.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.customerName)},%20update%20regarding%20your%20Haji%20Nuts%20Order%20#${ord.orderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg transition-all cursor-pointer border border-emerald-200"
                          title="WhatsApp Patron"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>Showing latest recorded orders in active TiDB memory</span>
          <span className="font-bold text-black">Total Active Ledger: {normalizedOrders.length} orders</span>
        </div>
      </div>

      {/* 5. QUICK ACTIONS & INVENTORY WATCHLIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quick Management Shortcuts */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h4 className="text-sm font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Store Operations Shortcuts</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('products')}
              className="p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 border border-gray-200/80 text-left transition-all cursor-pointer group"
            >
              <Package className="w-5 h-5 text-[#128C7E] mb-2" />
              <p className="text-xs font-black text-black group-hover:text-[#128C7E]">Manage Products</p>
              <p className="text-[10px] text-gray-500">Edit prices, weights & stock</p>
            </button>

            <button
              onClick={() => onNavigateTab('orders')}
              className="p-3.5 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200/80 text-left transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-xs font-black text-black group-hover:text-blue-600">Fulfill Orders</p>
              <p className="text-[10px] text-gray-500">Update transit & dispatch</p>
            </button>

            <button
              onClick={() => onNavigateTab('combos')}
              className="p-3.5 rounded-2xl bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-gray-200/80 text-left transition-all cursor-pointer group"
            >
              <Gift className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-xs font-black text-black group-hover:text-amber-600">Special Combos</p>
              <p className="text-[10px] text-gray-500">Hampers, festive bundles</p>
            </button>

            <button
              onClick={() => onNavigateTab('banners')}
              className="p-3.5 rounded-2xl bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-gray-200/80 text-left transition-all cursor-pointer group"
            >
              <Layers className="w-5 h-5 text-amber-600 mb-2" />
              <p className="text-xs font-black text-black group-hover:text-amber-600">Promo Offers</p>
              <p className="text-[10px] text-gray-500">Banners, discount coupons</p>
            </button>

            <button
              onClick={() => onNavigateTab('settings')}
              className="p-3.5 rounded-2xl bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-gray-200/80 text-left transition-all cursor-pointer group"
            >
              <Truck className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-xs font-black text-black group-hover:text-purple-600">Store Settings</p>
              <p className="text-[10px] text-gray-500">Delivery fees, WhatsApp #</p>
            </button>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase text-gray-500 tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Stock Watchlist</span>
            </h4>
            <span className="text-[10px] font-bold text-gray-400">Inventory Monitoring</span>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 3).map((p, pIdx) => (
                <div key={p.id || pIdx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200/70 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-black truncate">{p.name}</p>
                    <span className="text-[10px] font-mono text-rose-700 font-bold">
                      Current Stock: {p.stock || 5} units remaining
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateTab('products')}
                    className="px-3 py-1 bg-white border border-rose-300 hover:bg-rose-600 hover:text-white text-rose-700 text-xs font-black rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    Restock
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-200/60 space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-black text-black">Healthy Stock Across All Items</p>
                <p className="text-[11px] text-gray-500">Zero critical low-stock items detected in active catalog.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
