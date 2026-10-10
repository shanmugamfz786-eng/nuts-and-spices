const fs = require('fs');
let checkoutPage = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

checkoutPage = checkoutPage.replace(
  /export default function CheckoutPage\(\) \{\s*React\.useEffect\(\(\) => \{ if \(\!user\) navigate\('cart'\); \}, \[user\]\);\s*const \{ cart, cartTotal, createNewOrder, clearCart, navigate, user \} = useCart\(\);/g,
  `export default function CheckoutPage() {\n  const { cart, cartTotal, createNewOrder, clearCart, navigate, user } = useCart();\n  React.useEffect(() => { if (!user) navigate('cart'); }, [user, navigate]);`
);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', checkoutPage);
console.log('Fixed hook order');
