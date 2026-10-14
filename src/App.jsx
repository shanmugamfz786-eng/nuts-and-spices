import React, { lazy, Suspense } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';

// Core pages (loaded immediately for snappy UX)
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

// Lazy-loaded pages (code split for reduced initial bundle)
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const BulkOrdersPage = lazy(() => import('./pages/BulkOrdersPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnsRefundsPage = lazy(() => import('./pages/ReturnsRefundsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ComboDealsPage = lazy(() => import('./pages/ComboDealsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import AuthModal from './components/AuthModal';
import MobileBottomNav from './components/MobileBottomNav';

function PageLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="w-12 h-12 border-3 border-amber-600/20 border-t-amber-600 rounded-full animate-spin mb-4" />
      <span className="text-xs font-bold text-slate-500 tracking-wider uppercase font-serif">
        Haji Nuts & Spices
      </span>
    </div>
  );
}

function MainContent() {
  const cartContext = useCart() || {};
  const activePage = cartContext.activePage || 'home';

  // If in Admin Panel mode, render standalone AdminPage layout
  if (activePage === 'admin') {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <AdminPage />
      </Suspense>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'category':
        return <CategoryPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'order-details':
      case 'order-track':
      case 'order-tracking':
        return <OrderDetailsPage />;
      case 'offers':
        return <OffersPage />;
      case 'about':
        return <AboutUsPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'bulk-orders':
        return <BulkOrdersPage />;
      case 'contact':
        return <ContactPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'returns-refunds':
        return <ReturnsRefundsPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'terms-conditions':
        return <TermsAndConditionsPage />;
      case 'faqs':
        return <FaqPage />;
      case 'login':
      case 'profile':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'combo-deals':
        return <ComboDealsPage />;
      case 'home':
        return <HomePage />;
      default:
        // Exclude empty route explicitly returning Home (just in case)
        if (!activePage || activePage === '') return <HomePage />;
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full max-w-full">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>
      <SearchModal />
      <AuthModal />
      {activePage === 'home' && <Footer />}
      <MobileBottomNav />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
              🌿
            </div>
            <h2 className="text-xl font-black font-serif text-slate-900">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We encountered an unexpected display glitch. Please reload the page or return to the homepage.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-red-50 text-red-700 text-left rounded-xl text-[11px] font-mono overflow-auto max-h-24 border border-red-200">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </ErrorBoundary>
  );
}
