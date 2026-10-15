import React from 'react';
import { LayoutDashboard, ShoppingBag, Package, Gift, Menu } from 'lucide-react';

export default function AdminMobileBottomNav({
  activeTab,
  onSelectTab,
  onOpenMenu,
  pendingOrdersCount = 0,
  lowStockCount = 0
}) {
  const isDashboardActive = activeTab === 'dashboard';
  const isOrdersActive = activeTab === 'orders';
  const isProductsActive = activeTab === 'products';
  const isCombosActive = activeTab === 'combos';

  return (
    <nav 
      aria-label="Admin Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] py-1.5 px-2 select-none"
    >
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* 1. DASHBOARD */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 ${
            isDashboardActive ? 'text-[#075E54] font-black' : 'text-gray-500 hover:text-[#075E54]'
          }`}
        >
          <div className="relative">
            {isDashboardActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#075E54] rounded-full" />
            )}
            <LayoutDashboard className={`w-5 h-5 ${isDashboardActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
            Dashboard
          </span>
        </button>

        {/* 2. ORDERS */}
        <button
          type="button"
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer active:scale-95 ${
            isOrdersActive ? 'text-[#075E54] font-black' : 'text-gray-500 hover:text-[#075E54]'
          }`}
        >
          <div className="relative">
            {isOrdersActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#075E54] rounded-full" />
            )}
            <ShoppingBag className={`w-5 h-5 ${isOrdersActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse">
                {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
            Orders
          </span>
        </button>

        {/* 3. PRODUCTS */}
        <button
          type="button"
          onClick={() => onSelectTab('products')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer active:scale-95 ${
            isProductsActive ? 'text-[#075E54] font-black' : 'text-gray-500 hover:text-[#075E54]'
          }`}
        >
          <div className="relative">
            {isProductsActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#075E54] rounded-full" />
            )}
            <Package className={`w-5 h-5 ${isProductsActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {lowStockCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                !
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
            Stock
          </span>
        </button>

        {/* 4. COMBOS */}
        <button
          type="button"
          onClick={() => onSelectTab('combos')}
          className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer active:scale-95 ${
            isCombosActive ? 'text-[#075E54] font-black' : 'text-gray-500 hover:text-[#075E54]'
          }`}
        >
          <div className="relative">
            {isCombosActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#075E54] rounded-full" />
            )}
            <Gift className={`w-5 h-5 ${isCombosActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
            Combos
          </span>
        </button>

        {/* 5. MORE / SIDEBAR DRAWER MENU */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-gray-600 hover:text-[#075E54] transition-all cursor-pointer active:scale-95"
        >
          <div className="relative">
            <Menu className="w-5 h-5 stroke-2" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
            More
          </span>
        </button>

      </div>
    </nav>
  );
}
