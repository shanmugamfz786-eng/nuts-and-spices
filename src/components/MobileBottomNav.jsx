import React from 'react';
import { useCart } from '../context/CartContext';
import { Home, LayoutGrid, ShoppingBag, Headphones, User } from 'lucide-react';

export default function MobileBottomNav() {
  const { activePage, navigate, cartItemCount, user, activeWhatsAppNumber } = useCart();

  // Don't show bottom bar in admin mode
  if (activePage === 'admin') return null;

  const isHomeActive = activePage === 'home';
  const isShopActive = activePage === 'shop' || activePage === 'categories' || activePage === 'category';
  const isCartActive = activePage === 'cart';
  const isSupportActive = activePage === 'contact';
  const isProfileActive = activePage === 'login' || activePage === 'register' || activePage === 'profile';

  const handleSupportClick = () => {
    const defaultMsg = encodeURIComponent("Hello! I have a inquiry about NUTS & SPICES products.");
    const waUrl = `https://wa.me/${activeWhatsAppNumber || '919876543210'}?text=${defaultMsg}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1.5 px-3">
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* 1. HOME */}
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            isHomeActive ? 'text-[#000000] font-black' : 'text-[#8C7A6B] hover:text-[#000000]'
          }`}
        >
          <div className="relative">
            {isHomeActive && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#000000] rounded-full" />
            )}
            <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1 font-serif">
            HOME
          </span>
        </button>

        {/* 2. SHOP */}
        <button
          onClick={() => navigate('shop', { category: 'all' })}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            isShopActive ? 'text-[#000000] font-black' : 'text-[#8C7A6B] hover:text-[#000000]'
          }`}
        >
          <div className="relative">
            {isShopActive && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#000000] rounded-full" />
            )}
            <LayoutGrid className={`w-5 h-5 ${isShopActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1 font-serif">
            SHOP
          </span>
        </button>

        {/* 3. CART */}
        <button
          onClick={() => navigate('cart')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer ${
            isCartActive ? 'text-[#000000] font-black' : 'text-[#8C7A6B] hover:text-[#000000]'
          }`}
        >
          <div className="relative">
            {isCartActive && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#000000] rounded-full" />
            )}
            <ShoppingBag className={`w-5 h-5 ${isCartActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#000000] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1 font-serif">
            CART
          </span>
        </button>

        {/* 4. SUPPORT */}
        <button
          onClick={handleSupportClick}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            isSupportActive ? 'text-[#000000] font-black' : 'text-[#8C7A6B] hover:text-[#000000]'
          }`}
        >
          <div className="relative">
            {isSupportActive && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#000000] rounded-full" />
            )}
            <Headphones className={`w-5 h-5 ${isSupportActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1 font-serif">
            SUPPORT
          </span>
        </button>

        {/* 5. PROFILE */}
        <button
          onClick={() => navigate(user ? 'profile' : 'login')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
            isProfileActive ? 'text-[#000000] font-black' : 'text-[#8C7A6B] hover:text-[#000000]'
          }`}
        >
          <div className="relative">
            {isProfileActive && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#000000] rounded-full" />
            )}
            <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1 font-serif">
            {user ? 'ACCOUNT' : 'PROFILE'}
          </span>
        </button>

      </div>
    </div>
  );
}
