import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, STORE_WHATSAPP_NUMBER, CATALOG_VERSION } from '../data/products';
export const isProductActive = (p) => p && p.active !== false && p.status !== 'Inactive';
import { fetchCloudCatalog, saveCloudCatalog } from '../services/cloudDb';
import { createProduct as createProductApi, updateProduct as updateProductApi, deleteProduct as deleteProductApi } from '../api/productApi';
import { createCategory as createCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from '../api/categoryApi';
import { API_BASE_URL, fetchAdminStateApi, syncAdminStateApi } from '../api/index.js';
import { 
  INITIAL_STORE_SETTINGS, 
  INITIAL_ORDERS, 
  INITIAL_OFFERS, 
  INITIAL_REVIEWS 
} from '../data/mockAdminData';

const CartContext = createContext();

const seedProductImageMap = new Map(PRODUCTS.map(p => [p.id, p.image]));



export const CartProvider = ({ children }) => {
  // 1. STORE & APPLICATION SETTINGS (Admin Configurable)
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_store_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // Helper to ensure every product has valid fields & weights array
  const sanitizeProductList = (list) => {
    if (!Array.isArray(list)) return PRODUCTS;
    return list.map(p => {
      if (!p || typeof p !== 'object') return null;
      const basePrice = Number(p.price) || 350;
      const defaultWeights = [
        { label: '250g', price: basePrice, originalPrice: Math.round(basePrice * 1.2) },
        { label: '500g', price: Math.round(basePrice * 1.8), originalPrice: Math.round(basePrice * 2.1) }
      ];
      const validWeights = Array.isArray(p.weights) && p.weights.length > 0 
        ? p.weights.map(w => ({
            label: w?.label || '250g',
            price: Number(w?.price) || basePrice,
            originalPrice: Number(w?.originalPrice) || Math.round((Number(w?.price) || basePrice) * 1.2)
          }))
        : defaultWeights;

      const activeState = isProductActive(p);

      return {
        ...p,
        id: p.id || `prod-${Math.random()}`,
        name: p.name || 'Gourmet Item',
        category: p.category || 'nuts-dry-fruits',
        categoryName: p.categoryName || 'NUTS & DRY FRUITS',
        image: p.image || seedProductImageMap.get(p.id) || 'https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800',
        price: basePrice,
        weights: validWeights,
        status: activeState ? 'Active' : 'Inactive',
        active: activeState
      };
    }).filter(Boolean);
  };

  // Auto-sync catalog version to clear old stale localStorage cache on returning devices
  try {
    const savedVersion = localStorage.getItem('nuts_spices_catalog_version');
    if (savedVersion !== CATALOG_VERSION + '_featured') {
      localStorage.removeItem('nuts_spices_products');
      localStorage.removeItem('nuts_spices_categories');
      localStorage.setItem('nuts_spices_catalog_version', CATALOG_VERSION + '_featured');
    }
  } catch {}

  // 2. PRODUCTS STATE (Admin Editable & Persisted in localStorage)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return sanitizeProductList(parsed);
        }
      }
    } catch {}
    return PRODUCTS;
  });

  // 3. CATEGORIES STATE (Admin Editable & Persisted in localStorage)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(c => ({
            ...c,
            isPremium: c.isPremium !== undefined ? c.isPremium : (c.id !== 'all')
          }));
        }
      }
    } catch {}
    const defaultCats = CATEGORIES.map(c => ({
      ...c,
      isPremium: c.isPremium !== undefined ? c.isPremium : (c.id !== 'all')
    }));
    
    if (!defaultCats.find(c => c.id === 'featured-today')) {
      defaultCats.splice(1, 0, {
        id: "featured-today",
        name: "Featured Today",
        icon: "⭐",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
        isPremium: true
      });
    }
    
    return defaultCats;
  });

  // 4. ORDERS STATE (Admin & Customer Live Sync)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // 5. OFFERS STATE (Admin Editable)
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_offers');
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  // 6. REVIEWS STATE (Admin Editable)
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // 7. CART & WISHLIST STATE
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 8. NAVIGATION & ROUTING STATE
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/admin')) {
        return 'admin';
      }
      if (path.length > 1) {
        return path.substring(1);
      }
    }
    return 'home';
  });

  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard | products | categories | orders | customers | offers | reviews | settings
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Sync initial URL pathname and handle browser back/forward buttons
  useEffect(() => {
    const syncRouteFromPath = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/admin')) {
        setActivePage('admin');
      } else if (path === '/' || path === '') {
        setActivePage('home');
      } else {
        setActivePage(path.substring(1));
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, []);

  // 9. AUTHENTICATION (USER & ADMIN)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('nuts_spices_admin_logged');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Clear admin session on startup so /admin always requires Login first
  useEffect(() => {
    localStorage.removeItem('nuts_spices_admin_logged');
  }, []);

  // Persist States safely without crashing on QuotaExceeded Error
  useEffect(() => {
    try { localStorage.setItem('nuts_spices_store_settings', JSON.stringify(storeSettings)); } catch (err) { console.warn('localStorage error:', err); }
  }, [storeSettings]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_products', JSON.stringify(products)); } catch (err) { console.warn('localStorage error:', err); }
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_categories', JSON.stringify(categories)); } catch (err) { console.warn('localStorage error:', err); }
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_orders', JSON.stringify(orders)); } catch (err) { console.warn('localStorage error:', err); }
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_offers', JSON.stringify(offers)); } catch (err) { console.warn('localStorage error:', err); }
  }, [offers]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_reviews', JSON.stringify(reviews)); } catch (err) { console.warn('localStorage error:', err); }
  }, [reviews]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_cart', JSON.stringify(cart)); } catch (err) { console.warn('localStorage error:', err); }
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_wishlist', JSON.stringify(wishlist)); } catch (err) { console.warn('localStorage error:', err); }
  }, [wishlist]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_registered_users', JSON.stringify(registeredUsers)); } catch (err) { console.warn('localStorage error:', err); }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('nuts_spices_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('nuts_spices_user');
      }
    } catch (err) { console.warn('localStorage error:', err); }
  }, [user]);

  useEffect(() => {
    try { localStorage.setItem('nuts_spices_admin_logged', JSON.stringify(isAdminLoggedIn)); } catch (err) { console.warn('localStorage error:', err); }
  }, [isAdminLoggedIn]);

  // Realtime multi-tab localStorage state synchronizer
  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'nuts_spices_products' && e.newValue) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        } else if (e.key === 'nuts_spices_categories' && e.newValue) {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
        } else if (e.key === 'nuts_spices_orders' && e.newValue) {
          setOrders(JSON.parse(e.newValue));
        } else if (e.key === 'nuts_spices_offers' && e.newValue) {
          setOffers(JSON.parse(e.newValue));
        } else if (e.key === 'nuts_spices_reviews' && e.newValue) {
          setReviews(JSON.parse(e.newValue));
        } else if (e.key === 'nuts_spices_store_settings' && e.newValue) {
          setStoreSettings(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Error syncing storage across tabs:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Realtime Cloud Catalog Sync for ALL devices (Phones, Laptops, Browsers)
  useEffect(() => {
    let isMounted = true;
    const loadCloudData = async () => {
      try {
        const cloudData = await fetchCloudCatalog();
        if (cloudData && isMounted) {
          if (Array.isArray(cloudData.products)) {
            const sanitized = sanitizeProductList(cloudData.products);
            setProducts(sanitized);
            try { localStorage.setItem('nuts_spices_products', JSON.stringify(sanitized)); } catch {}
          }
          if (Array.isArray(cloudData.categories)) {
            setCategories(cloudData.categories);
            try { localStorage.setItem('nuts_spices_categories', JSON.stringify(cloudData.categories)); } catch {}
          }
        }
      } catch (err) {
        console.warn('Cloud catalog fetch error:', err);
      }
    };

    loadCloudData();
    const interval = setInterval(loadCloudData, 2000);
    window.addEventListener('focus', loadCloudData);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', loadCloudData);
    };
  }, []);

  
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const res = await fetchAdminStateApi();
        if (res && res.success && res.data) {
          if (res.data.orders && res.data.orders.length > 0) {
              setOrders(prev => {
                const combined = [...prev, ...res.data.orders];
                const unique = [];
                const seen = new Set();
                for (let o of combined) {
                  const id = o.orderId || o.id;
                  if (!seen.has(id)) {
                    seen.add(id);
                    unique.push(o);
                  }
                }
                return unique;
              });
            }
          if (res.data.offers && res.data.offers.length > 0) setOffers(res.data.offers);
          if (res.data.reviews && res.data.reviews.length > 0) setReviews(res.data.reviews);
          if (res.data.storeSettings) setStoreSettings(res.data.storeSettings);
          if (res.data.registeredUsers && res.data.registeredUsers.length > 0) setRegisteredUsers(res.data.registeredUsers);
        }
      } catch(err) {}
    };
    loadAdmin();
  }, []);

  // Helper to reset store state to default seed data
  const resetStoreToDefault = () => {
    setProducts(PRODUCTS);
    setCategories(CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setOffers(INITIAL_OFFERS);
    setReviews(INITIAL_REVIEWS);
    setStoreSettings(INITIAL_STORE_SETTINGS);

    localStorage.setItem('nuts_spices_products', JSON.stringify(PRODUCTS));
    localStorage.setItem('nuts_spices_categories', JSON.stringify(CATEGORIES));
    localStorage.setItem('nuts_spices_orders', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('nuts_spices_offers', JSON.stringify(INITIAL_OFFERS));
    localStorage.setItem('nuts_spices_reviews', JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem('nuts_spices_store_settings', JSON.stringify(INITIAL_STORE_SETTINGS));
  };

  
  const syncAdminStateToCloud = async (newStates = {}) => {
    try {
      const payload = {
        orders: newStates.orders || orders,
        offers: newStates.offers || offers,
        reviews: newStates.reviews || reviews,
        storeSettings: newStates.storeSettings || storeSettings,
        registeredUsers: newStates.registeredUsers || registeredUsers
      };
      await syncAdminStateApi(payload);
    } catch(err) {}
  };

// USER AUTH HANDLERS
  const registerUser = async (userData) => {
    try {
      const { register } = await import('../api/authApi.js');
      const res = await register(userData);
      if (res && res.success) {
        localStorage.setItem('nuts_spices_auth_token', res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
      return res;
    } catch (err) {
      return { success: false, message: 'Registration failed due to network error.' };
    }
  };

  const updateUserProfile = async (newName) => {
    try {
      const token = localStorage.getItem('nuts_spices_auth_token');
      if (!token) return { success: false, message: 'Not authenticated' };

      const res = await fetch((import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '') + '/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        if (data.token) {
          localStorage.setItem('nuts_spices_auth_token', data.token);
        }
      }
      return data;
    } catch (err) {
      // Fallback for local update if API fails
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    }
  };

  const loginUser = (loginData) => {
    const identifier = (loginData.identifier || loginData.phone || loginData.email || '').trim().toLowerCase();
    
    // Bypass for WhatsApp quick login or mock logins where name is explicitly provided
    if (loginData.name && !loginData.password) {
      setUser(loginData);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    const foundUser = registeredUsers.find(u => 
      (u.phone && u.phone.toLowerCase() === identifier) ||
      (u.email && u.email.toLowerCase() === identifier)
    );

    if (foundUser) {
      if (foundUser.password !== loginData.password) {
        return { success: false, message: 'Incorrect password.' };
      }
      setUser({
        name: foundUser.name,
        phone: foundUser.phone,
        email: foundUser.email
      });
      setIsAuthModalOpen(false);
      return { success: true };
    } else {
      return { success: false, message: 'User not found. Please register first.' };
    }
  };

  const logoutUser = () => {
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // ADMIN AUTH HANDLERS
  const loginAdmin = (emailInput, passwordInput) => {
    const email = (emailInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();

    if (email === 'admin702@admin.com' && password === 'yorrnutsandspices') {
      setIsAdminLoggedIn(true);
      return { success: true };
    }

    return { success: false, message: 'Invalid Admin Email or Password' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  // NAVIGATION & ROUTING
  const navigate = (page, params = {}) => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
    if (params.product) {
      setSelectedProduct(params.product);
    }
    if (params.adminTab) {
      setAdminTab(params.adminTab);
    }
    setActivePage(page);

    // Update browser URL bar
    if (typeof window !== 'undefined') {
      if (page === 'admin') {
        window.history.pushState({}, '', '/admin');
      } else if (page === 'home') {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `/${page}`);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CART HANDLERS
  const addToCart = (product, weightObj, quantity = 1) => {
    const weightLabel = weightObj ? weightObj.label : (product.weights && product.weights[0] ? product.weights[0].label : 'Standard');
    const itemPrice = weightObj ? weightObj.price : (product.weights && product.weights[0] ? product.weights[0].price : product.price || 100);
    const cartItemId = `${product.id}-${weightLabel}-${itemPrice}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            image: product.image,
            categoryName: product.categoryName || 'General',
            weight: weightLabel,
            price: itemPrice,
            quantity
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 0;
  const grandTotal = cartTotal;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // WHATSAPP GENERATION USING DYNAMIC STORE SETTINGS
  const activeWhatsAppNumber = storeSettings.whatsappNumber || STORE_WHATSAPP_NUMBER;

  const generateWhatsAppMessage = (orderDetails) => {
    const { customer, items, total, orderId } = orderDetails;
    
    let msg = `🛒 *${storeSettings.storeName || 'NUTS & SPICES'} - NEW ORDER*\n`;
    msg += `🆔 *Order ID:* #${orderId}\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Customer:* ${customer.name}\n`;
    msg += `📞 *Phone:* ${customer.phone}\n`;
    msg += `📍 *Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n`;
    if (customer.notes) {
      msg += `📝 *Notes:* ${customer.notes}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `📦 *Items Ordered:*\n`;

    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      msg += `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${lineTotal}\n`;
    });

    msg += `------------------------------------\n`;
    msg += `💰 *Total Amount:* ₹${total.toLocaleString('en-IN')}\n`;
    msg += `------------------------------------\n`;
    msg += `Thank you! Please confirm order & delivery timeline.`;

    return encodeURIComponent(msg);
  };

  const getWhatsAppUrl = (orderDetails) => {
    const encodedText = generateWhatsAppMessage(orderDetails);
    return `https://wa.me/${activeWhatsAppNumber}?text=${encodedText}`;
  };

  // AUTOMATIC REALTIME CLOUD & GIT SYNC HANDLER
  const syncCatalogToGit = async (customProducts, customCategories) => {
    const prods = customProducts || products;
    const cats = customCategories || categories;
    
    // Save to Realtime Cloud Storage (TiDB & Vercel API) for immediate sync across all devices
    await saveCloudCatalog(prods, cats);

    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      try {
        const res = await fetch(API_BASE_URL + '/admin/sync-git', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: prods, categories: cats })
        });
        const data = await res.json();
        return data;
      } catch (err) {}
    }

    return { success: true, message: 'Synced across all devices!' };
  };

  // ADMIN - PRODUCT CRUD
  const addProduct = (newProductData) => {
    const newId = `prod-${Date.now()}`;
    const productToAdd = {
      id: newId,
      badge: newProductData.badge || 'New',
      rating: 5.0,
      reviews: 0,
      status: 'Active',
      active: true,
      ...newProductData
    };
    setProducts(prev => {
      const updated = [productToAdd, ...prev];
      syncAdminStateToCloud({ products: updated });
      syncCatalogToGit(updated, categories);
      return updated;
    });
    createProductApi(productToAdd).catch(() => {});
    return productToAdd;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p);
      syncAdminStateToCloud({ products: updated });
      syncCatalogToGit(updated, categories);
      return updated;
    });
    updateProductApi(productId, updatedFields).catch(() => {});
  };

  const deleteProduct = (productId) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      syncAdminStateToCloud({ products: updated });
      syncCatalogToGit(updated, categories);
      return updated;
    });
    deleteProductApi(productId).catch(() => {});
  };

  const toggleProductStatus = (productId) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          const currentlyActive = isProductActive(p);
          const newStatus = currentlyActive ? 'Inactive' : 'Active';
          const updatedP = { ...p, status: newStatus, active: newStatus === 'Active' };
          updateProductApi(productId, updatedP).catch(() => {});
          return updatedP;
        }
        return p;
      });
      syncCatalogToGit(updated, categories);
      return updated;
    });
  };

  // ADMIN - CATEGORIES CRUD
  const addCategory = (categoryData) => {
    const newId = categoryData.id || `cat-${Date.now()}`;
    const newCategory = { id: newId, ...categoryData };
    setCategories(prev => {
      const updated = [...prev, newCategory];
      syncCatalogToGit(products, updated);
      return updated;
    });
    createCategoryApi(newCategory).catch(() => {});
  };

  const updateCategory = (categoryId, updatedFields) => {
    setCategories(prev => {
      const updated = prev.map(c => c.id === categoryId ? { ...c, ...updatedFields } : c);
      syncCatalogToGit(products, updated);
      return updated;
    });
    updateCategoryApi(categoryId, updatedFields).catch(() => {});
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== categoryId);
      syncCatalogToGit(products, updated);
      return updated;
    });
    deleteCategoryApi(categoryId).catch(() => {});
  };

  const toggleCategoryPremium = (categoryId) => {
    setCategories(prev => {
      const updated = prev.map(c => {
        if (c.id === categoryId) {
          const newStatus = !c.isPremium;
          updateCategoryApi(categoryId, { isPremium: newStatus }).catch(() => {});
          return { ...c, isPremium: newStatus };
        }
        return c;
      });
      syncCatalogToGit(products, updated);
      return updated;
    });
  };

  // ADMIN - ORDERS CRUD & CUSTOMER CHECKOUT CREATION
  const createNewOrder = (orderDetails) => {
    const newOrderObj = {
      orderId: orderDetails.orderId || `NS${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderDetails.customer.name,
      phone: orderDetails.customer.phone,
      email: orderDetails.customer.email || `${orderDetails.customer.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: orderDetails.customer.address,
      city: orderDetails.customer.city || 'Chennai',
      pincode: orderDetails.customer.pincode || '600001',
      date: new Date().toISOString().split('T')[0],
      status: 'NEW',
      total: orderDetails.total,
      items: orderDetails.items,
      notes: orderDetails.customer.notes || '',
      customer: orderDetails.customer,
      timestamp: orderDetails.timestamp || new Date().toLocaleString()
    };
    setOrders(prev => { const upd = [newOrderObj, ...prev]; syncAdminStateToCloud({ orders: upd }); return upd; });
    setLastOrder(newOrderObj);
    return newOrderObj;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => { const upd = prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o); syncAdminStateToCloud({ orders: upd }); return upd; });
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => { const upd = prev.filter(o => o.orderId !== orderId); syncAdminStateToCloud({ orders: upd }); return upd; });
  };

  // ADMIN - OFFERS CRUD
  const addOffer = (offerData) => {
    const newOffer = {
      id: `off-${Date.now()}`,
      status: 'ACTIVE',
      ...offerData
    };
    setOffers(prev => { const upd = [newOffer, ...prev]; syncAdminStateToCloud({ offers: upd }); return upd; });
  };

  const updateOffer = (offerId, updatedFields) => {
    setOffers(prev => { const upd = prev.map(off => off.id === offerId ? { ...off, ...updatedFields } : off); syncAdminStateToCloud({ offers: upd }); return upd; });
  };

  const deleteOffer = (offerId) => {
    setOffers(prev => { const upd = prev.filter(off => off.id !== offerId); syncAdminStateToCloud({ offers: upd }); return upd; });
  };

  // ADMIN - REVIEWS CRUD
  const addReview = (reviewData) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      name: reviewData.name || reviewData.customerName || 'Happy Customer',
      customerName: reviewData.name || reviewData.customerName || 'Happy Customer',
      quote: reviewData.quote || reviewData.comment || 'Wonderful quality and taste!',
      comment: reviewData.quote || reviewData.comment || 'Wonderful quality and taste!',
      rating: Number(reviewData.rating) || 5,
      tag: reviewData.tag || 'Verified Customer',
      date: new Date().toISOString().split('T')[0],
      status: 'APPROVED',
      productName: reviewData.productName || 'Store Experience',
      productId: reviewData.productId || ''
    };
    setReviews(prev => { const upd = [newRev, ...prev]; syncAdminStateToCloud({ reviews: upd }); return upd; });
    return newRev;
  };

  const updateReviewStatus = (reviewId, newStatus) => {
    setReviews(prev => { const upd = prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r); syncAdminStateToCloud({ reviews: upd }); return upd; });
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => { const upd = prev.filter(r => r.id !== reviewId); syncAdminStateToCloud({ reviews: upd }); return upd; });
  };

  // ADMIN - CUSTOMER DELETE
  const deleteCustomer = (customer) => {
    if (!customer) return;
    const phone = (customer.phone || '').trim();
    const email = (customer.email || '').trim().toLowerCase();
    const name = (customer.name || '').trim().toLowerCase();

    let updatedOrders = [];
    let updatedUsers = [];

    setOrders(prev => {
      updatedOrders = prev.filter(o => {
        const oPhone = (o.phone || '').trim();
        const oName = (o.customerName || '').trim().toLowerCase();
        const matchPhone = phone && phone !== 'n/a' && oPhone === phone;
        const matchName = name && oName === name;
        return !(matchPhone || matchName);
      });
      return updatedOrders;
    });

    setRegisteredUsers(prev => {
      updatedUsers = prev.filter(u => {
        const uPhone = (u.phone || '').trim();
        const uEmail = (u.email || '').trim().toLowerCase();
        const uName = (u.name || '').trim().toLowerCase();
        const matchPhone = phone && phone !== 'n/a' && uPhone === phone;
        const matchEmail = email && uEmail && uEmail === email;
        const matchName = name && uName === name;
        return !(matchPhone || matchEmail || matchName);
      });
      return updatedUsers;
    });

    // Sync deletion to cloud database
    setTimeout(() => {
      syncAdminStateToCloud({ orders: updatedOrders, registeredUsers: updatedUsers });
    }, 100);
  };

  // ADMIN - SETTINGS UPDATE
  const updateStoreSettings = (newSettings) => {
    setStoreSettings(prev => { const upd = { ...prev, ...newSettings }; syncAdminStateToCloud({ storeSettings: upd }); return upd; });
  };

  return (
    <CartContext.Provider
      value={{
        // Store config
        storeSettings,
        updateStoreSettings,
        activeWhatsAppNumber,

        // Data lists
        products,
        categories,
        orders,
        offers,
        reviews,

        // Cart & Wishlist
        cart,
        wishlist,
        cartTotal,
        deliveryCharge,
        grandTotal,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        generateWhatsAppMessage,
        getWhatsAppUrl,

        // Navigation
        activePage,
        adminTab,
        setAdminTab,
        selectedCategory,
        selectedProduct,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        lastOrder,
        setLastOrder,
        navigate,

        // User Auth
        user,
        registeredUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        openAuthModal,

        // Admin Auth
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,

        // Admin Product Actions
        syncCatalogToGit,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,

        // Admin Category Actions
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryPremium,

        // Admin Order Actions
        createNewOrder,
        updateOrderStatus,
        deleteOrder,

        // Admin Offer Actions
        addOffer,
        updateOffer,
        deleteOffer,

        // Admin Review Actions
        addReview,
        updateReviewStatus,
        deleteReview,

        // Admin Customer Actions
        deleteCustomer,

        // Reset Store Helper
        resetStoreToDefault
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context || {};
};
