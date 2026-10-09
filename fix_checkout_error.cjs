const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', 'utf8');

const target = `    } catch (err) {
      console.error('Payment initialization error', err);
      alert('Error initiating payment. Please try again.');
      setIsProcessingPayment(false);
    }`;

const replacement = `    } catch (err) {
      console.error('Payment initialization error', err);
      alert('Error initiating payment: ' + err.message);
      setIsProcessingPayment(false);
    }`;

content = content.replace(target, replacement);

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/pages/CheckoutPage.jsx', content);
console.log('Fixed CheckoutPage.jsx error alert');
