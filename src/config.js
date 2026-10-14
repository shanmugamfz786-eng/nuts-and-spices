/**
 * Centralized Frontend Application Configuration
 * Provides environment variable fallbacks and API endpoint resolution
 */

export const CONFIG = {
  // Base URL for backend REST API. Falls back to environment variable, then Render deployment if in production
  API_BASE_URL: (() => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl) {
      return envUrl.replace(/\/api\/?$/, '');
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return 'https://nuts-and-spices-dqzp.onrender.com';
    }
    return '';
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
