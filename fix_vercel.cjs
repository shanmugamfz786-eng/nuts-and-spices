const fs = require('fs');
const vercel = {
  "version": 2,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
};
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/vercel.json', JSON.stringify(vercel, null, 2));
console.log('Fixed vercel.json');
