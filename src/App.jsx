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
import OffersPage from './pages/OffersPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import HelpCenterPage from './pages/HelpCenterPage';
import BulkOrdersPage from './pages/BulkOrdersPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
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
    <div className="min-h-screen flex flex-col bg-white overflow-x-clip w-full max-w-full">
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

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
