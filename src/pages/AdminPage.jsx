import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

// Admin Views
import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminOrders from '../components/admin/AdminOrders';
import AdminCustomers from '../components/admin/AdminCustomers';
import AdminOffers from '../components/admin/AdminOffers';
import AdminReviews from '../components/admin/AdminReviews';
import AdminSettings from '../components/admin/AdminSettings';
import AdminFeaturedProducts from '../components/admin/AdminFeaturedProducts';
import AdminBestSellingProducts from '../components/admin/AdminBestSellingProducts';

import { 
  LayoutDashboard, Package, Layers, ShoppingBag, 
  Users, Image as ImageIcon, FileText, Settings, LogOut, Store, Menu, X, Star, Award
} from 'lucide-react';

export default function AdminPage() {
  const { 
    isAdminLoggedIn, 
    logoutAdmin, 
    navigate, 
    orders, 
    reviews, 
    adminTab, 
    setAdminTab 
  } = useCart();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  React.useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('home');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) {
    return null;
  }

  const newOrdersCount = orders.filter(o => o.status === 'NEW' || o.status === 'PENDING').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: newOrdersCount > 0 ? newOrdersCount : null },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'bestselling', label: 'Best Selling', icon: Award },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavigateTab = (tabId) => {
    setAdminTab(tabId);
    setIsMobileSidebarOpen(false);
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
    <div className="h-screen w-full bg-[#F8FAFC] text-gray-800 flex font-sans overflow-hidden">
      
      {/* 1. FIXED NON-SCROLLING LEFT SIDEBAR (Warm Bright Gourmet Theme - ZERO DARK SHADES) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#F9FAFB] text-[#000000] border-r border-[#E5E7EB] flex flex-col justify-between shrink-0 h-screen overflow-hidden
        transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        transition-transform duration-300 ease-in-out shadow-xl select-none
      `}>
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Brand Logo */}
          <div className="p-6 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.jpg" 
                alt="Haji Nuts & Spices Logo" 
                className="w-10 h-10 object-contain rounded-full shadow-sm"
              />
              <div className="flex flex-col text-left">
                <span className="text-xl font-black tracking-wider text-[#000000] font-serif uppercase leading-none">
                  HAJI
                </span>
                <span className="text-[10px] font-extrabold text-[#000000] tracking-widest uppercase font-serif inline-block mt-0.5">
                  NUTS & SPICES
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-[#8C7A6B] hover:text-[#000000] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Fits screen without scrolling) */}
          <nav className="px-3 py-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigateTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#25D366] text-white shadow-md'
                      : 'text-[#6B513E] hover:text-[#000000] hover:bg-[#E5E7EB]/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#8C7A6B]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#25D366] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Pill Button */}
        <div className="p-4 border-t border-[#E5E7EB] shrink-0">
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#25D366] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#3D2314]/30 backdrop-blur-xs z-30 lg:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. RIGHT MAIN CONTENT CANVAS (INDEPENDENT SCROLL) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-white h-16 border-b border-gray-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-xs sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-gray-800">
              Welcome, Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-extrabold rounded-full border border-amber-200 transition-all cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8">
          {renderAdminTabContent()}
        </main>

      </div>

    </div>
  );
}


