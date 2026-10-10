const fs = require('fs');

// 1. Update CartPage to append &track=true
let cartPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', 'utf8');
cartPage = cartPage.replace(
  /\?order_id=' \+ \(order\.orderId \|\| order\.id\)/g,
  "?order_id=' + (order.orderId || order.id) + '&track=true'"
);
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CartPage.jsx', cartPage);

// 2. Update OrderSuccessPage to handle track=true
let successPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', 'utf8');

successPage = successPage.replace(
  /if \(urlOrderId\) \{/g,
  `if (urlOrderId) {
      const isTrackingOnly = urlParams.get('track') === 'true';
      if (isTrackingOnly) {
        setPaymentStatus('success');
        setIsCashfreeCallback(false);
        // Only fetch order data
        fetch(API_BASE_URL + '/orders/' + urlOrderId, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.order) {
              const order = { ...data.order };
              if (typeof order.items === 'string') { try { order.items = JSON.parse(order.items); } catch(e){} }
              if (typeof order.customer === 'string') { try { order.customer = JSON.parse(order.customer); } catch(e){} }
              order.orderId = order.id || urlOrderId;
              setOrderData(order);
            }
          });
        return;
      }`
);

// Fix the UI so it doesn't say "Payment Successful!" if track=true
successPage = successPage.replace(
  /<h1 className="text-3xl font-black font-serif text-\[#000000\]">Payment Successful!<\/h1>\s*<p className="text-\[#8C7A6B\]">Your order has been placed successfully\.<\/p>/g,
  `{new URLSearchParams(window.location.search).get('track') === 'true' ? (
          <>
            <h1 className="text-3xl font-black font-serif text-[#000000]">Order Tracking</h1>
            <p className="text-[#8C7A6B]">View your order status below.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black font-serif text-[#000000]">Payment Successful!</h1>
            <p className="text-[#8C7A6B]">Your order has been placed successfully.</p>
          </>
        )}`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', successPage);

console.log('Fixed tracking UI separation');
