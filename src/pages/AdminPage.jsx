import React, { useState, lazy, Suspense } from 'react';
import { useCart } from '../context/CartContext';

// Admin Views (lazy loaded to prevent monolithic bundle)
import AdminLogin from '../components/admin/AdminLogin';
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../components/admin/AdminProducts'));
const AdminCategories = lazy(() => import('../components/admin/AdminCategories'));
const AdminOrders = lazy(() => import('../components/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('../components/admin/AdminCustomers'));
const AdminOffers = lazy(() => import('../components/admin/AdminOffers'));
const AdminReviews = lazy(() => import('../components/admin/AdminReviews'));
const AdminSettings = lazy(() => import('../components/admin/AdminSettings'));
const AdminFeaturedProducts = lazy(() => import('../components/admin/AdminFeaturedProducts'));
const AdminBestSellingProducts = lazy(() => import('../components/admin/AdminBestSellingProducts'));
const AdminCombos = lazy(() => import('../components/admin/AdminCombos'));

import { 
  LayoutDashboard, Package, Layers, ShoppingBag, 
  Users, Image as ImageIcon, FileText, Settings, LogOut, Store, Menu, X, Star, Award,
  Search, ArrowUpRight, Plus, RefreshCw, Gift
} from 'lucide-react';

export default function AdminPage() {
  const { 
    isAdminLoggedIn, 
    logoutAdmin, 
    navigate, 
    orders, 
    products,
    adminTab, 
    setAdminTab,
    refreshOrders
  } = useCart();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  // Count pending/new orders safely
  const pendingOrdersCount = (orders || []).filter(o => {
    const s = (o.status || '').toLowerCase();
    return s === 'pending' || s === 'new';
  }).length;

  const lowStockCount = (products || []).filter(p => (p.stock !== undefined && p.stock <= 10)).length;

  // Grouped Navigation Structure
  const navSections = [
    {
      group: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Consignment Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null, badgeColor: 'bg-amber-500' },
        { id: 'customers', label: 'Patron Customers', icon: Users }
      ]
    },
    {
      group: 'CATALOG & INVENTORY',
      items: [
        { id: 'products', label: 'Products & Stock', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeColor: 'bg-rose-500' },
        { id: 'categories', label: 'Product Categories', icon: Layers },
        { id: 'featured', label: 'Featured Showcase', icon: Star },
        { id: 'bestselling', label: 'Top Bestsellers', icon: Award }
      ]
    },
    {
      group: 'MARKETING & CONTENT',
      items: [
        { id: 'combos', label: 'Special Combo Deals', icon: Gift, badge: 'HOT', badgeColor: 'bg-amber-500' },
        { id: 'banners', label: 'Promo Banners & Offers', icon: ImageIcon },
        { id: 'blogs', label: 'Patron Reviews & Blogs', icon: FileText }
      ]
    },
    {
      group: 'SYSTEM CONTROL',
      items: [
        { id: 'settings', label: 'Store & ERP Settings', icon: Settings }
      ]
    }
  ];

  const handleNavigateTab = (tabId) => {
    setAdminTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  const handleManualSync = async () => {
    setIsRefreshing(true);
    if (refreshOrders) {
      await refreshOrders();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const renderAdminTabContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return (
          <AdminDashboard 
            onNavigateTab={handleNavigateTab} 
            onViewOrderDetails={(ord) => {
              setSelectedOrderForDetails(ord);
              setAdminTab('orders');
            }} 
          />
        );
      case 'customers':
        return (
          <AdminCustomers 
            onViewOrderDetails={(ord) => {
              setSelectedOrderForDetails(ord);
              setAdminTab('orders');
            }}
          />
        );
      case 'orders':
        return (
          <AdminOrders 
            selectedOrder={selectedOrderForDetails} 
            setSelectedOrder={setSelectedOrderForDetails} 
          />
        );
      case 'categories':
        return <AdminCategories />;
      case 'products':
        return <AdminProducts />;
      case 'featured':
        return <AdminFeaturedProducts />;
      case 'bestselling':
        return <AdminBestSellingProducts />;
      case 'combos':
        return <AdminCombos />;
      case 'banners':
        return <AdminOffers />;
      case 'blogs':
        return <AdminReviews />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard onNavigateTab={handleNavigateTab} onViewOrderDetails={setSelectedOrderForDetails} />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#F3F4F6] text-gray-900 flex font-sans overflow-hidden">
      
      {/* 1. ULTRA-PROFESSIONAL ENTERPRISE SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0F172A] text-white flex flex-col justify-between shrink-0 h-screen overflow-hidden
        transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        transition-transform duration-300 ease-in-out shadow-2xl select-none border-r border-slate-800
      `}>
        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/logo.jpg" 
                  alt="Haji Nuts & Spices Logo" 
                  className="w-10 h-10 object-contain rounded-xl shadow-md border border-slate-700 bg-white"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black tracking-wider text-white font-serif uppercase leading-tight flex items-center gap-1.5">
                  <span>HAJI GOURMET</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
                  ENTERPRISE ERP 2.0
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Telemetry Pill */}
          <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TiDB Cloud Active</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">CHENNAI DC</span>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="px-3 py-4 space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  {section.group}
                </span>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigateTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#128C7E] text-white shadow-md shadow-[#128C7E]/25 font-black ring-1 ring-emerald-400/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono text-white ${item.badgeColor || 'bg-slate-700'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 shrink-0">
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700/50 hover:border-rose-500/30 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. RIGHT MAIN CONTENT CANVAS (INDEPENDENT SCROLL) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Executive Header Bar */}
        <header className="bg-white h-16 border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs sticky top-0 z-20">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="text-gray-400">Portal</span>
              <span>/</span>
              <span className="text-black font-extrabold capitalize">{adminTab.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center relative w-72 max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search catalog, order #, patron..."
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#128C7E] rounded-xl pl-9 pr-3 py-1.5 text-xs text-black placeholder-gray-400 outline-none transition-colors"
            />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Storefront External Link Button */}
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Storefront</span>
              <ArrowUpRight className="w-3 h-3 text-amber-700" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 bg-[#F8FAFC]">
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-[#128C7E] animate-spin" />
            </div>
          }>
            {renderAdminTabContent()}
          </Suspense>
        </main>

      </div>

    </div>
  );
}
