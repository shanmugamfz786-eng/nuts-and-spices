// NUTS & SPICES - REAL-TIME CLOUD DB PERSISTENCE MODULE
// Connects to TiDB Cloud & Vercel API for instant cross-device live synchronization
import { PRODUCTS } from '../data/products.js';

const seedProductImageMap = new Map(PRODUCTS.map(p => [p.id, p.image]));

import { API_BASE_URL } from '../api/index.js';

function getEndpoints() {
  const endpoints = [];
  endpoints.push(`${API_BASE_URL}/catalog`);

  // If testing on localhost, also push to live production server so changes show on https://nuts-spices-e-commerce.vercel.app/
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    endpoints.push('https://nuts-and-spices.onrender.com/api/catalog'); // Updated to Render
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
      if (data && (Array.isArray(data.products) || Array.isArray(data.categories))) {
        // Hydrate product images if stripped for bandwidth optimization
        const hydratedProducts = Array.isArray(data.products)
          ? data.products.map(p => ({
              ...p,
              image: p.image || seedProductImageMap.get(p.id) || ''
            }))
          : null;

        return { 
          products: Array.isArray(hydratedProducts) ? hydratedProducts : null, 
          categories: Array.isArray(data.categories) ? data.categories : null,
          updatedAt: data.updatedAt
        };
      }
    }
  } catch (err) {
    console.warn('fetchCloudCatalog note:', err.message);
  }

  return null;
}

export async function saveCloudCatalog(products, categories) {
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

    const payload = JSON.stringify({
      products: optimizedProducts,
      categories,
      updatedAt: new Date().toISOString()
    });

    const endpoints = getEndpoints();
    const savePromises = endpoints.map(url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
