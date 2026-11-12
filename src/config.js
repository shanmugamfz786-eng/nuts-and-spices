/**
 * Centralized Frontend Application Configuration
 * Provides environment variable fallbacks and API endpoint resolution
 */

export const CONFIG = {
  // Base URL for backend REST API. Falls back to environment variable, then Render deployment if in production
  API_BASE_URL: (() => {
    // When running locally on localhost or 127.0.0.1, always use local backend / Vite proxy
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        return '';
      }
    }
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.replace(/\/api\/?$/, '');
    }
    return 'https://nuts-and-spices-dqzp.onrender.com';
  })(),

  // Cashfree Environment Mode ('SANDBOX' or 'PRODUCTION')
  CASHFREE_MODE: import.meta.env.VITE_CASHFREE_MODE || 'SANDBOX',

  // Store Contact & Support
  STORE_NAME: 'Haji Nuts & Spices',
  SUPPORT_PHONE: '919876543210',
  SUPPORT_EMAIL: 'support@hajinutsandspices.com',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_CURRENCY_SYMBOL: '₹'
};

export default CONFIG;
