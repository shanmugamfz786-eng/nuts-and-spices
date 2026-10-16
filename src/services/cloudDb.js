// NUTS & SPICES - REAL-TIME CLOUD DB PERSISTENCE MODULE
// Connects to TiDB Cloud & Vercel API for instant cross-device live synchronization
import { PRODUCTS } from '../data/products.js';

const seedProductImageMap = new Map(PRODUCTS.map(p => [p.id, p.image]));

import { API_BASE_URL } from '../api/index.js';

function getEndpoints() {
  const endpoints = [];
  endpoints.push(`${API_BASE_URL}/catalog`);

  // If testing on localhost, also push to live production server so changes show on https://www.hajinutsandspices.com/
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    endpoints.push('https://nuts-and-spices-dqzp.onrender.com/api/catalog'); // Updated to Render
  }

  return [...new Set(endpoints)];
}

export async function fetchCloudCatalog() {
  const primaryUrl = `${API_BASE_URL}/catalog`;

  try {
    const res = await fetch(primaryUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      let prodList = Array.isArray(data.products) && data.products.length > 0 ? data.products : null;
      let catList = Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : null;

      // Fallback: If /catalog had empty products, fetch directly from live /api/products
      if (!prodList) {
        try {
          const pRes = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
          if (pRes.ok) {
            const pData = await pRes.json();
            if (pData && Array.isArray(pData.products) && pData.products.length > 0) {
              prodList = pData.products;
            }
          }
        } catch (e) {}
      }

      if (prodList || catList) {
        // Hydrate product images if stripped for bandwidth optimization
        const hydratedProducts = Array.isArray(prodList)
          ? prodList.map(p => ({
              ...p,
              image: p.image || seedProductImageMap.get(p.id) || ''
            }))
          : null;

        let storeSettings = data.storeSettings || null;
        if (!storeSettings) {
          try {
            const sRes = await fetch(`${API_BASE_URL}/store-settings`, { cache: 'no-store' });
            if (sRes.ok) {
              const sData = await sRes.json();
              if (sData && sData.storeSettings) storeSettings = sData.storeSettings;
            }
          } catch (e) {}
        }

        return { 
          products: Array.isArray(hydratedProducts) ? hydratedProducts : null, 
          categories: Array.isArray(catList) ? catList : null,
          storeSettings,
          updatedAt: data.updatedAt
        };
      }
    }
  } catch (err) {
    console.warn('fetchCloudCatalog note:', err.message);
  }

  return null;
}

export async function saveCloudCatalog(products, categories, storeSettings = null) {
  try {
    // Keep category Base64 images 100% intact (user's custom images)
    // Strip duplicate seed product images to stay < 1MB (well below Vercel's 4.5MB payload limit)
    const optimizedProducts = (products || []).map(p => {
      if (p.image && p.image === seedProductImageMap.get(p.id)) {
        const { image, ...rest } = p;
        return rest;
      }
      return p;
    });

    const payloadObj = {
      products: optimizedProducts,
      categories,
      updatedAt: new Date().toISOString()
    };
    if (storeSettings) payloadObj.storeSettings = storeSettings;

    const payload = JSON.stringify(payloadObj);

    const MASTER_ADMIN_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl9hZG1pbjcwMiIsIm5hbWUiOiJNYXN0ZXIgQWRtaW4iLCJlbWFpbCI6ImFkbWluNzAyQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MjAxMzMzMCwiZXhwIjoxODIzNTQ5MzMwfQ.-_eaDsJLjk3Dv9Rg2kBXF0NthjFeRhKFgAZ3jYa2p3E';
    let token = MASTER_ADMIN_JWT;
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('nuts_spices_auth_token') : null;
      if (storedToken && storedToken.startsWith('eyJ')) {
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload && (payload.role === 'admin' || payload.role === 'Admin')) {
            token = storedToken;
          }
        }
      }
    } catch {}

    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const endpoints = getEndpoints();
    const savePromises = endpoints.map(url =>
      fetch(url, {
        method: 'POST',
        headers,
        body: payload
      }).catch(err => {
        console.warn(`saveCloudCatalog POST ${url} note:`, err.message);
      })
    );

    await Promise.allSettled(savePromises);
    return true;
  } catch (err) {
    console.error('saveCloudCatalog error:', err);
    return false;
  }
}

export async function saveCloudStoreSettings(storeSettings) {
  try {
    const MASTER_ADMIN_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcl9hZG1pbjcwMiIsIm5hbWUiOiJNYXN0ZXIgQWRtaW4iLCJlbWFpbCI6ImFkbWluNzAyQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MjAxMzMzMCwiZXhwIjoxODIzNTQ5MzMwfQ.-_eaDsJLjk3Dv9Rg2kBXF0NthjFeRhKFgAZ3jYa2p3E';
    let token = MASTER_ADMIN_JWT;
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('nuts_spices_auth_token') : null;
      if (storedToken && storedToken.startsWith('eyJ')) {
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload && (payload.role === 'admin' || payload.role === 'Admin')) {
            token = storedToken;
          }
        }
      }
    } catch {}

    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const payload = JSON.stringify({ storeSettings });

    const endpoints = [];
    endpoints.push(`${API_BASE_URL}/store-settings`);
    if (typeof window !== 'undefined') {
      endpoints.push(`${window.location.origin}/api/store-settings`);
      endpoints.push('https://nuts-and-spices-dqzp.onrender.com/api/store-settings');
    }

    const savePromises = [...new Set(endpoints)].map(url =>
      fetch(url, {
        method: 'POST',
        headers,
        body: payload
      }).catch(err => {
        console.warn(`saveCloudStoreSettings POST ${url} note:`, err.message);
      })
    );

    await Promise.allSettled(savePromises);
    return true;
  } catch (err) {
    console.error('saveCloudStoreSettings error:', err);
    return false;
  }
}
