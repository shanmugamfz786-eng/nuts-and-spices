const fs = require('fs');
let content = fs.readFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', 'utf8');

content = content.replace(
  /fetch\(\(\(import\.meta\.env\.VITE_API_BASE_URL \|\| ''\)\.replace\(\/\\\\\/api\\\\\/\\?\$\/, ''\) \|\| ''\) \+ '\/api\//g,
  `fetch(API_BASE_URL + '/`
);

content = content.replace(
  /fetch\('\/api\//g,
  `fetch(API_BASE_URL + '/`
);

if (!content.includes('import { API_BASE_URL }')) {
  content = content.replace(
    `import { fetchAdminStateApi, syncAdminStateApi } from '../api/index.js';`,
    `import { API_BASE_URL, fetchAdminStateApi, syncAdminStateApi } from '../api/index.js';`
  );
}

fs.writeFileSync('e:/NUTS-SPICES-E-Commerce-main/src/context/CartContext.jsx', content);
console.log('Cleaned up fetch in CartContext');
