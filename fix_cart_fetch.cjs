const fs = require('fs');
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');

const newLogic = `
  const [realOrders, setRealOrders] = React.useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        let fetchedOrders = [];
        const token = localStorage.getItem('token');
        
        // 1. Fetch Auth Orders
        if (user && token) {
          const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders/my-orders', {
            headers: { 'Authorization': \`Bearer \${token}\` }
          });
          const data = await res.json();
          if (data.success && data.orders) {
            fetchedOrders = [...data.orders];
          }
        }

        // 2. Fetch Guest Orders
        const guestOrderIds = JSON.parse(localStorage.getItem('guest_orders') || '[]');
        if (guestOrderIds.length > 0) {
          const guestPromises = guestOrderIds.map(id => 
            fetch(import.meta.env.VITE_API_URL + '/api/orders/' + id).then(r => r.json())
          );
          const guestResults = await Promise.all(guestPromises);
          guestResults.forEach(data => {
            if (data.success && data.order) {
              // Avoid duplicates if auth user also has this order
              if (!fetchedOrders.find(o => o.id === data.order.id || o.orderId === data.order.orderId)) {
                fetchedOrders.push(data.order);
              }
            }
          });
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

  // Fallback to context filter while loading
  const guestOrderIds = JSON.parse(localStorage.getItem('guest_orders') || '[]');
  const myOrders = realOrders.length > 0 ? realOrders : (orders || []).filter(o => {
    const oPhone = o.phone || (o.customer && o.customer.phone);
    const oEmail = o.email || (o.customer && o.customer.email);
    const isOwner = user ? ((user.phone && oPhone === user.phone) || (user.email && oEmail === user.email)) : false;
    const isGuestOwner = guestOrderIds.includes(o.orderId || o.id);
    return isOwner || isGuestOwner;
  }).sort((a, b) => {
      const da = a.timestamp || a.created_at ? new Date(a.timestamp || a.created_at).getTime() : 0;
      const db = b.timestamp || b.created_at ? new Date(b.timestamp || b.created_at).getTime() : 0;
      return db - da;
  });
`;

cartPage = cartPage.replace(/const guestOrderIds = JSON\.parse\(localStorage\.getItem\('guest_orders'\) \|\| '\[\]'\);\s*const myOrders = \(orders \|\| \[\]\)\.filter\([\s\S]*?return db - da;\s*}\);/g, newLogic);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);
console.log('Fixed CartPage fetch');
