import fs from 'fs';
import { CATEGORIES, PRODUCTS, STORE_WHATSAPP_NUMBER, CATALOG_VERSION } from './src/data/products.js';

const parsedData = fs.readFileSync('./parsed.json', 'utf8');
const parsed = JSON.parse(parsedData);

const parsedMap = new Map();
parsed.forEach(p => {
    let cleanName = p.name.replace(/[\(\)\[\]\-]+$/, '').trim();
    parsedMap.set(cleanName, p);
});

let updatedCount = 0;
PRODUCTS.forEach(prod => {
    let cleanName = prod.name.toUpperCase().trim();
    if (parsedMap.has(cleanName)) {
        let newInfo = parsedMap.get(cleanName);
        prod.weights = newInfo.weights;
        prod.price = newInfo.price;
        updatedCount++;
    }
});

console.log('Updated ' + updatedCount + ' existing products.');

const newContent = "export const STORE_WHATSAPP_NUMBER = '" + STORE_WHATSAPP_NUMBER + "';\n" +
"export const CATALOG_VERSION = '" + CATALOG_VERSION + "';\n\n" +
"export const CATEGORIES = " + JSON.stringify(CATEGORIES, null, 2) + ";\n\n" +
"export const PRODUCTS = " + JSON.stringify(PRODUCTS, null, 2) + ";\n";

fs.writeFileSync('./src/data/products.js', newContent);

// Sync to DB
import('./server/index.js').then(app => {
    app.syncServerCatalog(PRODUCTS, CATEGORIES).then(() => {
        console.log('Synced to DB successfully!');
        process.exit(0);
    });
});
