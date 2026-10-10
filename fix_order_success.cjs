const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', 'utf8');

if (!content.includes('import { API_BASE_URL }')) {
  content = content.replace(`import { STORE_WHATSAPP_NUMBER } from '../data/products';`, `import { STORE_WHATSAPP_NUMBER } from '../data/products';\nimport { API_BASE_URL } from '../api/index';`);
}

content = content.replace(`const { lastOrder, getWhatsAppUrl, navigate, storeSettings } = useCart();`, `const { lastOrder, getWhatsAppUrl, navigate, storeSettings, clearCart } = useCart();`);

content = content.replace(`fetch('/api/payment/verify', {`, `fetch(API_BASE_URL + '/payment/verify', {`);

content = content.replace(`setPaymentStatus('success');`, `setPaymentStatus('success');\n          clearCart();`);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/OrderSuccessPage.jsx', content);
console.log('Fixed OrderSuccessPage');
