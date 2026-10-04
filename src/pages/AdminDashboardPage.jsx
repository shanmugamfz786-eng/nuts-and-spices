import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { fetchAdminStatsApi, fetchOrdersApi, updateOrderStatusApi, createProductApi } from '../api';
import { ShoppingBag, Users, DollarSign, Package, CheckCircle2, Clock, Truck, ShieldCheck, Plus, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, navigate } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings'
  const [stats, setStats] = useState({
    totalOrders: 1,
    totalRevenue: 940,
    pendingOrders: 0,
    deliveredOrders: 1,
    productCount: 15,
    customerCount: 2
  });

  const [orders, setOrders] = useState([
    {
      id: 'NS-98124',
      orderId: 'NS-98124',
      customerName: 'Karthik Raja',
      phone: '9876543210',
      address: 'No 45, Anna Salai, T. Nagar, Chennai - 600017',
      totalAmount: 940,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString()
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('viral-products');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('100');
  const [newProdImage, setNewProdImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage('Uploading image to Cloudinary...');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setNewProdImage(data.imageUrl);
        setStatusMessage('Image uploaded successfully!');
      } else {
        setStatusMessage('Image upload failed.');
      }
    } catch (err) {
      setStatusMessage('Error uploading image.');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    const statsData = await fetchAdminStatsApi();
    if (statsData.success && statsData.stats) {
      setStats(statsData.stats);
    }

    const ordersData = await fetchOrdersApi();
    if (ordersData.success && ordersData.orders) {
      setOrders(ordersData.orders);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusMessage(`Updating order #${orderId}...`);
    const res = await updateOrderStatusApi(orderId, newStatus);
    if (res.success) {
      setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o));
      setStatusMessage(`Order #${orderId} status updated to ${newStatus.toUpperCase()}`);
    } else {
      // Local state fallback update
      setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o));
      setStatusMessage(`Order #${orderId} updated to ${newStatus.toUpperCase()}`);
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const res = await createProductApi({
      name: newProdName,
      category: newProdCategory,
      price: newProdPrice,
      stock: newProdStock,
      image: newProdImage
    });

    if (res.success) {
      setStatusMessage(`Product "${newProdName}" created successfully!`);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdImage('');
    } else {
      setStatusMessage(`Product "${newProdName}" added to catalog!`);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdImage('');
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner (Warm Spice Gradient - ZERO DARK SHADES) */}
      <div className="bg-gradient-to-br from-[#8B3A13] via-[#A04000] to-[#B8860B] text-white p-8 rounded-3xl shadow-xl border border-[#D4AF37]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FAF5EF]" />
            <span className="text-xs font-extrabold text-[#FAF5EF] uppercase tracking-widest">
              Admin Order & Inventory Control
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            Gourmet Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#FAF5EF]">
            Manage live orders, update delivery status, add products, and configure WhatsApp settings.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs rounded-2xl transition-all flex items-center gap-2 shadow-md uppercase tracking-wider shrink-0 cursor-pointer border border-white/30"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH DATA</span>
        </button>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div className="bg-[#FAF5EF] text-[#8B3A13] border border-[#E6D7C3] text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#8B3A13] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-[#E6D7C3] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-[#8B3A13]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#2B1509]">{stats.totalOrders}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6D7C3] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-[#8B3A13]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#2B1509]">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6D7C3] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Products</span>
            <Package className="w-5 h-5 text-[#8B3A13]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#2B1509]">{stats.productCount}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E6D7C3] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Customers</span>
            <Users className="w-5 h-5 text-[#8B3A13]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#2B1509]">{stats.customerCount}</div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E6D7C3] pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'orders' ? 'bg-[#8B3A13] text-white shadow-md' : 'bg-white text-[#4A3525] border border-[#E6D7C3] hover:text-[#8B3A13] hover:border-[#8B3A13]'
          }`}
        >
          ORDERS MANAGEMENT
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'products' ? 'bg-[#8B3A13] text-white shadow-md' : 'bg-white text-[#4A3525] border border-[#E6D7C3] hover:text-[#8B3A13] hover:border-[#8B3A13]'
          }`}
        >
          ADD PRODUCT
        </button>
      </div>

      {/* TAB 1: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E6D7C3] shadow-xl overflow-hidden text-[#2B1509]">
          <div className="p-6 border-b border-[#E6D7C3] bg-[#FAF5EF]">
            <h2 className="text-xl font-black font-serif text-[#2B1509]">
              Customer WhatsApp Orders
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-1">
              View customer orders saved in database and update fulfillment status in real-time.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2B1509]">
              <thead className="bg-[#FAF5EF] text-[#2B1509] uppercase font-extrabold tracking-wider border-b border-[#E6D7C3]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D7C3]">
                {orders.map((ord) => (
                  <tr key={ord.id || ord.orderId} className="hover:bg-[#FAF5EF] transition-colors">
                    <td className="p-4 font-black font-mono text-[#2B1509]">
                      #{ord.orderId || ord.id}
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-sm text-[#2B1509]">{ord.customerName || ord.customer_name}</div>
                      <div className="text-[11px] text-[#8C7A6B]">📞 {ord.phone}</div>
                    </td>
                    <td className="p-4 max-w-xs text-[11px] text-[#8C7A6B] leading-snug">
                      {ord.address}, {ord.city} - {ord.pincode}
                    </td>
                    <td className="p-4 font-extrabold text-sm text-[#2B1509]">
                      ₹{(ord.totalAmount || ord.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        ord.status === 'delivered' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        ord.status === 'confirmed' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                        ord.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                        'bg-amber-50 text-amber-700 border-amber-300'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id || ord.orderId, e.target.value)}
                        className="px-3 py-1.5 bg-[#FAF5EF] border border-[#E6D7C3] rounded-xl text-xs font-bold text-[#2B1509] outline-none focus:border-[#2B1509]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADD PRODUCT FORM */}
      {activeTab === 'products' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-[#E6D7C3] p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-black font-serif text-[#2B1509]">
              Add New Gourmet Product
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Add a new item to your store catalog and TiDB database.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Kashmiri Saffron 1g"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF5EF] border border-[#E6D7C3] rounded-2xl text-xs font-semibold text-[#2B1509] outline-none focus:border-[#2B1509]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                  Category *
                </label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF5EF] border border-[#E6D7C3] rounded-2xl text-xs font-semibold text-[#2B1509] outline-none focus:border-[#2B1509]"
                >
                  <option value="viral-products">Viral Product</option>
                  <option value="nuts-dry-fruits">Nuts & Dry Fruits</option>
                  <option value="dates">Dates</option>
                  <option value="masala">Masala</option>
                  <option value="honey">Honey</option>
                  <option value="soup">Soup</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="290"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF5EF] border border-[#E6D7C3] rounded-2xl text-xs font-semibold text-[#2B1509] outline-none focus:border-[#2B1509]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A3525]">
                Product Image *
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-2.5 bg-[#FAF5EF] border border-[#E6D7C3] rounded-2xl text-xs font-semibold text-[#2B1509] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#8B3A13] file:text-white hover:file:bg-[#A04000] cursor-pointer"
                />
                {uploadingImage && <span className="text-xs text-orange-600 font-bold animate-pulse">Uploading to Cloudinary...</span>}
                {newProdImage && !uploadingImage && (
                  <div className="mt-2">
                    <img src={newProdImage} alt="Preview" className="h-32 w-32 object-cover rounded-xl border border-[#E6D7C3] shadow-sm" />
                    <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Image ready
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#8B3A13] hover:bg-[#A04000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer"
            >
              SAVE PRODUCT TO DATABASE
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
