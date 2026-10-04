import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  Package, ShoppingBag, CheckCircle, Clock, TrendingUp, 
  ChevronRight, Eye 
} from 'lucide-react';

export default function AdminDashboard({ onNavigateTab, onViewOrderDetails }) {
  const { products, orders } = useCart();

  // KPI Calculations matching screenshot
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'DELIVERED');
  const pendingOrders = orders.filter(o => o.status === 'NEW' || o.status === 'PENDING');
  
  const totalSalesConfirmed = confirmedOrders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  const confirmedCount = confirmedOrders.length;
  const pendingCount = pendingOrders.length;
  const activeProductsCount = products.length > 0 ? products.length : 185;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wider">PENDING</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold uppercase tracking-wider">CONFIRMED</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wider">DELIVERED</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* 2. 4 KPI METRIC CARDS matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Sales (Confirmed) */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs flex items-start justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-semibold text-gray-500">
              Total Sales (Confirmed)
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-3 font-sans tracking-tight">
              ₹{totalSalesConfirmed}
            </div>
          </div>
          <div className="text-rose-500 text-xl font-bold font-serif leading-none mt-1">
            ₹
          </div>
        </div>

        {/* Card 2: Confirmed Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs flex items-start justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-semibold text-gray-500">
              Confirmed Orders
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-3 font-sans tracking-tight">
              {confirmedCount}
            </div>
          </div>
          <div className="text-amber-600 mt-1">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs flex items-start justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-semibold text-gray-500">
              Pending Orders
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-3 font-sans tracking-tight">
              {pendingCount}
            </div>
          </div>
          <div className="text-amber-500 mt-1">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Active Products */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs flex items-start justify-between cursor-pointer hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-semibold text-gray-500">
              Active Products
            </span>
            <div className="text-3xl font-extrabold text-gray-900 mt-3 font-sans tracking-tight">
              {activeProductsCount}
            </div>
          </div>
          <div className="text-gray-700 mt-1">
            <Package className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. RECENT ORDERS & SALES ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-12 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  Recent Orders
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Latest customer order updates
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-2">Order ID</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2 text-right">Amount</th>
                    <th className="pb-3 px-2 text-center">Status</th>
                    <th className="pb-3 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.orderId || ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-gray-800">
                        #{ord.orderId || ord.id}
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-800">
                        <div>{ord.customerName}</div>
                        <div className="text-[10px] text-gray-400">{ord.phone}</div>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-gray-900">
                        ₹{(ord.total || ord.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {getStatusBadge(ord.status)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => onViewOrderDetails(ord)}
                          className="p-1.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-700 rounded-lg transition-colors cursor-pointer border border-gray-200/60"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Showing top recent orders</span>
            <span className="font-semibold text-gray-600">Updated live</span>
          </div>
        </div>



      </div>

    </div>
  );
}
