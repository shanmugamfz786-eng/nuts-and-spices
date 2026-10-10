const fs = require('fs');
let file = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/services/cloudDb.js', 'utf8');
file = file.replace(/https:\/\/nuts-spices-backend\.onrender\.com/g, 'https://nuts-and-spices.onrender.com');
fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/services/cloudDb.js', file);
console.log('Fixed onrender url in cloudDb.js');
