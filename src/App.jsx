import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OffersPage from './pages/OffersPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import HelpCenterPage from './pages/HelpCenterPage';
import BulkOrdersPage from './pages/BulkOrdersPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import FaqPage from './pages/FaqPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ComboDealsPage from './pages/ComboDealsPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthModal from './components/AuthModal';

import MobileBottomNav from './components/MobileBottomNav';

function MainContent() {
  const cartContext = useCart() || {};
  const activePage = cartContext.activePage || 'home';

  // If in Admin Panel mode, render standalone AdminPage layout
  if (activePage === 'admin') {
    return <AdminPage />;
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
        {renderPage()}
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
