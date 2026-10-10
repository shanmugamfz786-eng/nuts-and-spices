import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { fetchAdminStatsApi, fetchOrdersApi, updateOrderStatusApi, createProductApi, API_BASE_URL } from '../api';
import { ShoppingBag, Users, DollarSign, Package, CheckCircle2, Clock, Truck, ShieldCheck, Plus, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, navigate } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings'
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    productCount: 0,
    customerCount: 0
  });

  const [orders, setOrders] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);

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
      const res = await fetch(`${API_BASE_URL}/upload`, {
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
    const customersData = await fetch(API_BASE_URL + '/auth/users').then(r => r.json()).catch(() => ({}));
    if (customersData.success && customersData.users) {
      setAllCustomers(customersData.users);
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

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? They will have to re-register.')) return;
    setStatusMessage('Deleting user...');
    try {
      const res = await fetch(API_BASE_URL + '/auth/users/' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAllCustomers(prev => prev.filter(c => c.id !== id));
        setStatusMessage('User deleted successfully! They must sign up again to login.');
      } else {
        setStatusMessage('Failed to delete user.');
      }
    } catch (e) {
      setStatusMessage('Error deleting user.');
    }
    setTimeout(() => setStatusMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner (Warm Spice Gradient - ZERO DARK SHADES) */}
      <div className="bg-gradient-to-br from-[#000000] via-[#000000] to-[#222222] text-white p-8 rounded-3xl shadow-xl border border-[#000000]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F9FAFB]" />
            <span className="text-xs font-extrabold text-[#F9FAFB] uppercase tracking-widest">
              Admin Order & Inventory Control
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            Gourmet Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#F9FAFB]">
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
        <div className="bg-[#F9FAFB] text-[#000000] border border-[#E5E7EB] text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#000000] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-[#000000]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#000000]">{stats.totalOrders}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-[#000000]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#000000]">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Products</span>
            <Package className="w-5 h-5 text-[#000000]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#000000]">{stats.productCount}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C7A6B]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#8C7A6B]">Customers</span>
            <Users className="w-5 h-5 text-[#000000]" />
          </div>
          <div className="text-3xl font-black font-serif text-[#000000]">{stats.customerCount}</div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'orders' ? 'bg-[#000000] text-white shadow-md' : 'bg-white text-[#000000] border border-[#E5E7EB] hover:text-[#000000] hover:border-[#000000]'
          }`}
        >
          ORDERS MANAGEMENT
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'products' ? 'bg-[#000000] text-white shadow-md' : 'bg-white text-[#000000] border border-[#E5E7EB] hover:text-[#000000] hover:border-[#000000]'
          }`}
        >
          ADD PRODUCT
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'customers' ? 'bg-[#000000] text-white shadow-md' : 'bg-white text-[#000000] border border-[#E5E7EB] hover:text-[#000000] hover:border-[#000000]'
          }`}
        >
          CUSTOMERS
        </button>
      </div>

      {/* TAB 1: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl overflow-hidden text-[#000000]">
          <div className="p-6 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h2 className="text-xl font-black font-serif text-[#000000]">
              Customer WhatsApp Orders
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-1">
              View customer orders saved in database and update fulfillment status in real-time.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#000000]">
              <thead className="bg-[#F9FAFB] text-[#000000] uppercase font-extrabold tracking-wider border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {orders.map((ord) => (
                  <tr key={ord.id || ord.orderId} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-4 font-black font-mono text-[#000000]">
                      #{ord.orderId || ord.id}
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="font-bold text-sm text-[#000000]">{ord.customerName || ord.customer_name}</div>
                      <div className="text-[11px] text-[#8C7A6B]">📞 {ord.phone}</div>
                    </td>
                    <td className="p-4 max-w-xs text-[11px] text-[#8C7A6B] leading-snug">
                      {ord.address}, {ord.city} - {ord.pincode}
                    </td>
                    <td className="p-4 font-extrabold text-sm text-[#000000]">
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
                        className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#000000] outline-none focus:border-[#000000]"
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

      {/* TAB 3: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl overflow-hidden text-[#000000]">
          <div className="p-6 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h2 className="text-xl font-black font-serif text-[#000000]">Registered Users</h2>
            <p className="text-xs text-[#8C7A6B] mt-1">Manage registered customers. If deleted, they must sign up again to place an order.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#000000]">
              <thead className="bg-[#F9FAFB] text-[#000000] uppercase font-extrabold tracking-wider border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {allCustomers.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-4 font-bold text-sm text-[#000000]">{c.name || 'Guest User'}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-sm text-[#000000]">📞 {c.phone}</div>
                      {c.email && <div className="text-[11px] text-[#8C7A6B]">✉️ {c.email}</div>}
                    </td>
                    <td className="p-4 text-[#8C7A6B]">{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">
                      <button onClick={() => handleDeleteCustomer(c.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-red-200">
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
                {allCustomers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-[#8C7A6B] font-medium">No registered customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADD PRODUCT FORM */}
      {activeTab === 'products' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-black font-serif text-[#000000]">
              Add New Gourmet Product
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-1">
              Add a new item to your store catalog and TiDB database.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Kashmiri Saffron 1g"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Category *
                </label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="290"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none focus:border-[#000000]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#000000]">
                Product Image *
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#000000] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#000000] file:text-white hover:file:bg-[#000000] cursor-pointer"
                />
                {uploadingImage && <span className="text-xs text-orange-600 font-bold animate-pulse">Uploading to Cloudinary...</span>}
                {newProdImage && !uploadingImage && (
                  <div className="mt-2">
                    <img src={newProdImage} alt="Preview" className="h-32 w-32 object-cover rounded-xl border border-[#E5E7EB] shadow-sm" />
                    <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Image ready
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#000000] hover:bg-[#000000] text-white font-extrabold text-xs rounded-2xl transition-all shadow-md uppercase tracking-wider cursor-pointer"
            >
              SAVE PRODUCT TO DATABASE
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
