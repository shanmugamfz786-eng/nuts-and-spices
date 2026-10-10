const fs = require('fs');

// 1. Update CartPage.jsx
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');

// Require login on "Proceed to Checkout"
cartPage = cartPage.replace(
  /const \{ cart, removeFromCart, updateQuantity, clearCart, cartTotal, navigate, user, orders \} = useCart\(\);/g,
  `const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, navigate, user, orders, setIsAuthModalOpen } = useCart();`
);

cartPage = cartPage.replace(
  /onClick=\{[^\}]*\s*navigate\('checkout'\)\s*\}/g,
  `onClick={() => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      navigate('checkout');
    }
  }}`
);

// Remove guest orders fetch logic
const newFetchLogic = `
  const [realOrders, setRealOrders] = React.useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        let fetchedOrders = [];
        const token = localStorage.getItem('token');
        
        if (user && token) {
          const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders/my-orders', {
            headers: { 'Authorization': \`Bearer \${token}\` }
          });
          const data = await res.json();
          if (data.success && data.orders) {
            fetchedOrders = [...data.orders];
          }
        }
        setRealOrders(fetchedOrders.sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const myOrders = realOrders.length > 0 ? realOrders : (orders || []).filter(o => {
    const oPhone = o.phone || (o.customer && o.customer.phone);
    const oEmail = o.email || (o.customer && o.customer.email);
    const isOwner = user ? ((user.phone && oPhone === user.phone) || (user.email && oEmail === user.email)) : false;
    return isOwner;
  }).sort((a, b) => {
      const da = a.timestamp || a.created_at ? new Date(a.timestamp || a.created_at).getTime() : 0;
      const db = b.timestamp || b.created_at ? new Date(b.timestamp || b.created_at).getTime() : 0;
      return db - da;
  });
`;

cartPage = cartPage.replace(/const \[realOrders, setRealOrders\] = React\.useState\(\[\]\);[\s\S]*?return db - da;\s*}\);/g, newFetchLogic);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);

// 2. Update CheckoutPage.jsx
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

// Remove guest_orders push
checkoutPage = checkoutPage.replace(
  /const guestOrders = JSON\.parse\(localStorage\.getItem\('guest_orders'\) \|\| '\[\]'\);\s*if \(\!guestOrders\.includes\(backendOrderId\)\) \{\s*guestOrders\.push\(backendOrderId\);\s*localStorage\.setItem\('guest_orders', JSON\.stringify\(guestOrders\)\);\s*\}/g,
  ''
);

// Redirect to home/cart if not logged in
checkoutPage = checkoutPage.replace(
  /export default function CheckoutPage\(\) \{/g,
  `export default function CheckoutPage() {\n  React.useEffect(() => { if (!user) navigate('cart'); }, [user]);`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);

console.log('Fixed auth requirement');
