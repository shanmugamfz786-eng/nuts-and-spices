import fs from 'fs';
import { CATEGORIES, PRODUCTS, STORE_WHATSAPP_NUMBER, CATALOG_VERSION } from './src/data/products.js';

const newProductsData = `
VIRAL PRODUCT
1.VEG CHIPS 100gr 120, 1/4..250/-, 1/2..500/-,1kg 950/-
2.FRUITS CHIPS 100gr 160/-, 250gr 360/-, 1/2 720/-, 1kg 1350/-
3.MILK KEFIR GRAINS 15gr to 18gr 550/-
4.KUMBUCHA SCOOPY 1pices 400/- 
5.pshylium husk @ isabgol 100gr 150/-, 1/4.. 375/-
6.Pathimugam 1/4... 140/-,1/2.. 280/-, 1kg 500/-

NUTS
1.CALIFORNIA REGULAR  ALMOND 100gr 120, 1/4..300, 1/2.. 600/-,, 1KG 1200/-
2.CALIFORNIA MINI BOLD  ALMOND 1/4.. 330, 1/2.. 650/-, 1KG 1300/-
3.CALIFORNIA BOLD  ALMOND 1/4.. 350, 1/2..700,, 1KG 1380/-
4.CASHEW 320 SIZE 100Gr 100/-, 1/4... 240/-, 1/2.. 480/-, 1kg 940/-
5.KASHMIR WALNUT 1/4kg..280, 1/2.. 560/-,  1kg 1100/-
6.KASHMIR WALNUT PREMIUM 1/4..350/-, 1/2.. 700/-, 1kg 1350/-
7.HAZALNUT 100gr 300/-, 1/4.. 750/-, 1/2.. 1500/-, 1kg 2950/-
8.BRAZIL NUT 100gr 350/-, 1/4..875/-, 1/2..1750/-
9.ROASTED PISTA 1/4..470, 1/2.. 940/-
10.GREEN PISTA 100gr  300/-, 1/4.. 750/-, 1/2.. 1500/-
11.BLACK RAISIN SEED 1/4.. 145, 1/2.. 290/-
12.AFGHAN FIG 1/4.. 240/-, 1/2..480/-
13.IRAN FIG 400gr 260/-
14.KIWI 100gr 75, 1/4..180/-, 1/2.. 350,
15.STRABERRY 100gr 85/-,1/4..210, 1/2.. 400
16.CRANBERRY 100gr 85/-, 1/4.. 210, 1/2..400/-
17.CHERRY 100gr 85/-, 1/4.. 210, 1/2..400/-
18.BLUBERRY100gr 160/-, 1/4.. 400,, 1/2..780/-
19.MANGO 100gr 85/-, 1/4.. 210, 1/2..400/-
21.DRY AMLA 100gr 40/-, 1/4.. 100, 1/2..190/-
21.DRY. APRICOT..NO STOCK

DATES
1.AJWA - 1/2..330/-, 1KG 640/-
2.SAFAVI KALIMA - 1/2..290/-, 1KG 560/-
3.KALUTTU - 1/2..220/-, 1KG 440/-
4.MASAFATI - 1/2..220/-, 1KG 440/-
5.BROWN DATES SEED - 1/2..100/-, 1KG 200/-
6.BROWN DATES SEEDLESS - 1/2..145/-, 1KG 290/-
YELLOW DRY DATES 1/2..160/-, 1KG 320/-

MALT & BEVERAGES
1.BIOTIN DRINK 200gr 280/-
2.SPROUTED RAGI MALT 250gr 170/-
3.BLACK URID KALI KANJI 250gr 150/-
4.HEALTH MIX POWDER 1/2..140, 1kg 280/-
5.CHOCO COCOZHI 
6.REDMUSHROOM BLACK COFFEE 20SACHET. 825/-
7.RED MUSHROOM TEA 1/4.. 490/-
8.KUMBUCHA 285ML 140/-
9.MILK KEFIR GRAINS 550/-
14.BADHAM PISIN 100gr 55/-, 1/4. 135/-, 1/2... 270/-
15.AGAR AGAR 10gr 25/-, 50gr 120

SEEDS ITEMS
1.CHIA  100gr 55/-, 1/4.. 130, 1/2..250
2.PUPMKIN. 100gr 70/-, 1/4.. 175, 1/2..340
3.WATERMELON 100gr 90/-, 1/4.. 225,  1/2.440,
4.FALX 100gr 30/-, 1/4.. 75, 1/2..140
5.COCUMER, 100gr 90/-, 1/4.. 225, 1/2..440
6.SABJA. 100gr 45/-, 1/4.. 100 1/2..190
7.FRIED PEANUT 1/4.. 55/-, 1/4..110, 1/2.. 210
8.SALIYA 100gr 40/-, 1/4..100/-, 1/2.. 190/-

HONEY
1.FOREST HONEY 1/4.. 220/-, 1250gr 740/-
2.MOUNTAIN HONEY 1/2.. 450/-
3.HONEY AMLA 350gr 185/-
4.HONEY NUTS MIXED 1/4..160/-, 1/2.. 300/-
 
RICE & MILLET
1.KARUPPU KAHUNI 1/2. 75/-, 140/-
2.MAPPILAI SAMBA 1/2. 70/-, 140/-
3.KAATTUYANA 1/2. 80/-, 150/-
4.POONGAR 1/2. 80/-, 150/-
5.KARUNKURUVAI 1/2. 80/-, 150/-
6.KULLAKAR 1/2. 80/-, 150/-
7.KUTHIRAIVAALI 1/4.. 45/-, 1/2.90/-, 1kg 170/-
8.THINAI 1/4.. 40/-, 1/2.80/-, 1kg 150
9.VARAHU 1/4.. 45/-, 1/2.90/-, 1kg 170
10.SAAMAI 1/4.. 50/-, 1/2.100/-, 1kg 190
11.BLACK URID 1/4.. 45/-, 1/2.85/-, 1kg 160
12.RAAGI 1/4.. 20/-, 1/2.40/-, 1kg 75

MASALA
1.PEPPER 100gr 90/-, 1/4..225/-, 1/2..250/-, 1kg 880/-
2.JEERAGAM 100gr 40/-, 1/4..100/-, 1/2..200/-, 1kg 380/-
3.SOMBU 100gr 40/-, 1/4..100/-, 1/2..200/-, 1kg 380/-
4.KADUGU 100gr 20/-, 1/4..50/-, 1/2..100/-, 1kg 190/-
5.VENTHAYAM 100gr 20/-, 1/4..50/-, 1/2..100/-, 1kg 190/-
6.SADHA PATTAI 100gr 60/-, 1/4./-150/-, 1/2..300/-, 1kg 590/-
7.SRILANKA PATTAI 50gr 100/-, 1/4..500/-, 1/2.1000/-, 1kg 1980/-
8.CLOVE 50gr 65/-, 1/4..325/-, 1/2.650/-, 1kg 1280/-
9.STAR ANISE 50gr 55/-, 1/4..275/-, 1/2.550/-, 1kg 1080
10.OOMAM 50gr 30/-, 1/4..150/-, 1/2.300/-, 1kg.. 580
11.SATHKUPPAI 50gr 30/-, 1/4..150/-, 1/2.300/-, 1kg 580
12.KARUNJEERAGAM 50gr 30/-, 1/4..150/-, 1/2.300/-, 1kg 580
13.BRINJI LEAF 50gr 15/-, 1/4.75/-, 1/2.150/-, 1kg 280

SOUP
Each 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-
1.MUTAVATTUKAL
2.MUTAKATTRAAN
3.VALLARAI
4.THUTHUVALAI
5.MURUNGAI ILAI 
6.AAVAARAM POO

WEIGHT LOSS PRODUCT
1.Karuppu kahuni kanchi 250gr 120/-
2.milk kefir grains (15gr to 18gr) 600/-
3.kumbucha Scoopy 400/-
4.Redmushroom Black Coffee ( 20 sachet ) 830/-
`;

const lines = newProductsData.split('\n');
let currentCategory = '';
let currentCategoryName = '';
const parsedProducts = [];

const catMap = {
  'VIRAL PRODUCT': 'viral-product',
  'NUTS': 'nuts-dry-fruits',
  'DATES': 'dates',
  'MALT & BEVERAGES': 'malt-beverages',
  'SEEDS ITEMS': 'seeds-items',
  'HONEY': 'honey',
  'RICE & MILLET': 'rice-millet',
  'MASALA': 'masala',
  'SOUP': 'soup',
  'WEIGHT LOSS PRODUCT': 'viral-product' // assuming weight loss falls under viral or herbals, let's use viral-product or herbals
};

const defaultSoupWeights = [
    { label: '50g', price: 50, originalPrice: 60 },
    { label: '250g', price: 250, originalPrice: 300 },
    { label: '500g', price: 500, originalPrice: 600 },
    { label: '1kg', price: 980, originalPrice: 1200 }
];

lines.forEach(line => {
  line = line.trim();
  if (!line) return;
  if (catMap[line]) {
    currentCategoryName = line;
    currentCategory = catMap[line];
    return;
  }
  
  if (line.match(/^Each 50gr 50rs/i)) return; // skip soup header
  if (line.includes('NO STOCK')) return; // skip no stock
  
  // Example: 1.VEG CHIPS 100gr 120, 1/4..250/-, 1/2..500/-,1kg 950/-
  // Or: YELLOW DRY DATES 1/2..160/-, 1KG 320/-
  // Or: 1.MUTAVATTUKAL (soup)
  let namePart = line;
  let weightsPart = '';
  
  const match = line.match(/^(\d+\.)?\s*([A-Za-z\s&@\(\)\[\]\-]+)(.*)$/);
  if (match) {
    namePart = match[2].trim();
    weightsPart = match[3].trim();
  }
  
  let weights = [];
  let basePrice = 0;
  
  if (currentCategoryName === 'SOUP') {
      weights = defaultSoupWeights;
      basePrice = 50;
  } else if (!weightsPart) {
      // Just name, no weights. E.g. CHOCO COCOZHI
      basePrice = 100;
  } else {
      const parts = weightsPart.split(/[,]/).filter(p => p.trim() && !p.match(/^-$/));
      parts.forEach(p => {
          let str = p.replace(/-/g, '').trim();
          // Extract weight and price
          const wpMatch = str.match(/(100gr|100Gr|15gr to 18gr|200gr|250gr|350gr|400gr|1250gr|50gr|10gr|285ML|20SACHET|1pices|1\/4kg|1\/4|1\/2|1kg|1KG|1Kg)\.*\s*(\d+)/i);
          if (wpMatch) {
              let wLabel = wpMatch[1].toLowerCase().replace('gr', 'g').replace('1/4kg', '250g').replace('1/4', '250g').replace('1/2', '500g').replace('1kg', '1kg');
              let wPrice = parseInt(wpMatch[2]);
              weights.push({ label: wLabel, price: wPrice, originalPrice: Math.round(wPrice * 1.2) });
              if (basePrice === 0) basePrice = wPrice;
          } else {
              // Try to find just price if label is missing but implied
              const priceMatch = str.match(/(\d+)$/);
              if (priceMatch) {
                  let wPrice = parseInt(priceMatch[1]);
                  if (basePrice === 0) basePrice = wPrice;
                  // If it's something like "550", we just add it as default
                  if (weights.length === 0) {
                      weights.push({ label: '1 Box', price: wPrice, originalPrice: Math.round(wPrice * 1.2) });
                  }
              }
          }
      });
  }
  
  if (weights.length === 0 && basePrice > 0) {
      weights.push({ label: 'Standard', price: basePrice, originalPrice: Math.round(basePrice * 1.2) });
  } else if (weights.length === 0) {
      weights.push({ label: '250g', price: 250, originalPrice: 300 });
      basePrice = 250;
  }
  
  parsedProducts.push({
      name: namePart.toUpperCase(),
      category: currentCategory,
      categoryName: currentCategoryName,
      weights,
      price: basePrice
  });
});

const existingNames = new Set(PRODUCTS.map(p => p.name.toUpperCase().trim()));

const finalProductsToAdd = parsedProducts.filter(p => !existingNames.has(p.name));

console.log('Adding ' + finalProductsToAdd.length + ' new products.');

let productsJsContent = fs.readFileSync('./src/data/products.js', 'utf8');

const fullProductsToAdd = finalProductsToAdd.map((p, idx) => {
    let id = p.category.substring(0, 3) + '-' + Date.now() + '-' + idx;
    let cleanName = p.name.replace(/[\(\)\[\]\-]+$/, '').trim(); // clean up trailing parens
    return {
        id: id,
        name: cleanName,
        category: p.category,
        categoryName: p.categoryName,
        badge: "New Arrival",
        rating: 4.5,
        reviews: 12,
        weights: p.weights,
        description: "Premium quality " + cleanName.toLowerCase() + " sourced organically.",
        origin: "India",
        shelfLife: "6 Months",
        price: p.price,
        status: "Active",
        active: true,
        discountPercent: 15,
        discount: "15% OFF",
        stock: 50,
        ingredients: "100% Natural",
        storage: "Cool dry place",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
    };
});

fs.writeFileSync('./productsToAdd.json', JSON.stringify(fullProductsToAdd, null, 2));
