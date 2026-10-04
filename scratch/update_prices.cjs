const fs = require('fs');
const path = require('path');

const userText = `
VIRAL PRODUCT
1.VEG CHIPS 100gr 120, 1/4..250/-, 1/2..500/-,1kg 950/-
2.FRUITS CHIPS 100gr 160/-, 250gr 360/-, 1/2 720/-, 1kg 1350/-
3.MILK KEFIR GRAINS 15gr to 18gr 550/-
4.KUMBUCHA SCOOPY 1pices 400/- 
5.pshylium husk @ isabgol 100gr 150/-, 1/4.. 375/-
6.Pathimugam 1/4... 140/-,1/2.. 280/-, 1kg 500/-

NUTS
1.CALIFORNIA REGULAR  ALMOND 100gr 120, 1/4..300, 1/2.. 600/-,, 1KG 1200/-
2.1.CALIFORNIA MINI BOLD  ALMOND 1/4.. 330, 1/2.. 650/-, 1KG 1300/-
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

function parseUserList(text) {
  const lines = text.split('\n');
  const items = [];
  let currentCategory = '';
  let soupPrices = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.match(/^[A-Z &]+$/)) {
      currentCategory = line;
      continue;
    }
    if (line.startsWith('Each 50gr 50rs')) {
      soupPrices = [
        { label: '50g', price: 50 },
        { label: '250g', price: 250 },
        { label: '500g', price: 500 },
        { label: '1kg', price: 980 }
      ];
      continue;
    }

    const match = line.match(/^(?:[\d\.]+\s*)?(.*)$/);
    if (match) {
      const rawText = match[1].trim();
      // separate product name and price string
      // usually prices start with numbers or something like 100gr, 1/4
      let namePart = '';
      let pricePart = '';
      
      const firstDigitIdx = rawText.search(/\b(\d+gr|1\/\d|1KG|400gr|200gr|285ML|20sachet|\d+sachet|\d+pices|\d+kg|\d+rs|\d+\/-)/i);
      
      if (currentCategory === 'SOUP') {
         items.push({ name: rawText, category: currentCategory, weights: soupPrices });
         continue;
      }

      if (firstDigitIdx !== -1) {
        namePart = rawText.slice(0, firstDigitIdx).trim();
        pricePart = rawText.slice(firstDigitIdx).trim();
      } else {
        // Just look for the first number followed by space or gr or kg
        const fallbackIdx = rawText.search(/\s\d/);
        if (fallbackIdx !== -1) {
          namePart = rawText.slice(0, fallbackIdx).trim();
          pricePart = rawText.slice(fallbackIdx).trim();
        } else {
          namePart = rawText;
        }
      }

      namePart = namePart.replace(/[-@\.]/g, ' ').trim().replace(/\s+/g, ' ');

      if (namePart === 'DRY APRICOT NO STOCK') continue;

      let weights = [];
      if (pricePart) {
        const parts = pricePart.split(',');
        parts.forEach(p => {
          let w = p.trim();
          if (!w) return;
          // extract label and price
          // Example: 100gr 120, 1/4..250/-, 1/2..500/-, 1kg 950/-
          let label = '';
          let price = 0;
          
          if (w.includes('100gr')) label = '100g';
          else if (w.includes('250gr')) label = '250g';
          else if (w.includes('400gr')) label = '400g';
          else if (w.includes('200gr')) label = '200g';
          else if (w.includes('350gr')) label = '350g';
          else if (w.includes('1250gr')) label = '1250g';
          else if (w.includes('50gr')) label = '50g';
          else if (w.includes('10gr')) label = '10g';
          else if (w.includes('15gr to 18gr')) label = '15g-18g';
          else if (w.includes('1/4') || w.includes('250')) label = '250g';
          else if (w.includes('1/2')) label = '500g';
          else if (w.toLowerCase().includes('1kg')) label = '1kg';
          else if (w.toLowerCase().includes('285ml')) label = '285ml';
          else if (w.toLowerCase().includes('sachet')) label = w.match(/\d+\s*sachet/i) ? w.match(/\d+\s*sachet/i)[0] : 'Pack';
          else if (w.toLowerCase().includes('pices')) label = '1 Piece';
          else if (w.includes('120/-') && namePart.includes('Karuppu kahuni kanchi')) label = '250g'; // specific fixes
          else if (w.match(/^\d+\/-$/)) label = 'Pack';
          else label = 'Pack';
          
          const priceMatch = w.match(/(\d+)(?:\/-|\s*$)/);
          if (priceMatch) {
            price = parseInt(priceMatch[1], 10);
          } else {
             const nums = w.match(/\d+/g);
             if (nums && nums.length > 0) {
               price = parseInt(nums[nums.length-1], 10);
             }
          }
          if (price > 0 && label) {
            weights.push({ label, price });
          }
        });
      }
      
      // Some entries like "6.REDMUSHROOM BLACK COFFEE 20SACHET. 825/-"
      if (weights.length === 0 && pricePart) {
         let p = pricePart.match(/(\d+)/g);
         if (p) weights.push({ label: 'Pack', price: parseInt(p[p.length-1], 10) });
      }

      items.push({ name: namePart, category: currentCategory, weights });
    }
  }
  return items;
}

const parsedItems = parseUserList(userText);
// console.log(JSON.stringify(parsedItems, null, 2));

const productsFilePath = path.join(__dirname, '../src/data/products.js');
let fileContent = fs.readFileSync(productsFilePath, 'utf8');

const match = fileContent.match(/export const PRODUCTS = (\[.*\]);/s);
if (!match) throw new Error("Could not find PRODUCTS");
let prods = JSON.parse(match[1]);

// Map parsed names to existing product names
const nameMappings = {
  'MILK KEFIR GRAINS': 'KEFIR GRAINS',
  'CALIFORNIA REGULAR ALMOND': 'CALIFORNIA ALMOND',
  'HAZALNUT': 'HAZELNUT',
  'STRABERRY': 'STRAWBERRY',
  'BLUBERRY': 'BLUEBERRY',
  'AJWA': 'AJWA - SOUDIA',
  'AJWA SOUDIA': 'AJWA - SOUDIA',
  'SAFAVI KALIMA': 'SAFAVI KALIMA - SOUDIA',
  'KALUTTU': 'KALUTTU - IRAN',
  'MASAFATI': 'MASAFATI - IRAN',
  'BROWN DATES SEED': 'BROWN DATES SEED - IRAQ',
  'BROWN DATES SEEDLESS': 'BROWN DATES, SEEDLESS - IRAQ',
  'HEALTH MIX POWDER': 'HEALTH MIX',
  'REDMUSHROOM BLACK COFFEE': 'RED MUSHROOM COFFEE',
  'BADHAM PISIN': 'BADAM PISIN',
  'PUPMKIN': 'PUMPKIN',
  'FALX': 'FLAX',
  'COCUMER': 'CUCUMBER',
  'FRIED PEANUT': 'PEANUT',
  'CASHEW 320 SIZE': 'CASHEW 320',
  'KARUPPU KAHUNI': 'KARUPPU KAVUNI',
  'KAATTUYANA': 'KAATTUYANAM',
  'VARAHU': 'VARAGU',
  'PEPPER': 'PEPPER SEED',
  'milk kefir grains': 'kefir',
  'kumbucha Scoopy': 'kumbucha or Scoopy',
  'Redmushroom Black Coffee': 'Redmushroom Black Coffee'
};

// 4 New products to add
const newProductsToAdd = [
  { name: 'pshylium husk isabgol', categoryStr: 'VIRAL PRODUCT' },
  { name: 'Pathimugam', categoryStr: 'VIRAL PRODUCT' },
  { name: 'CALIFORNIA MINI BOLD ALMOND', categoryStr: 'NUTS' },
  { name: 'CALIFORNIA BOLD ALMOND', categoryStr: 'NUTS' }
];

let updatedCount = 0;
parsedItems.forEach(item => {
  let mappedName = nameMappings[item.name] || item.name;
  
  // Find in existing
  let prod = prods.find(p => p.name.toLowerCase() === mappedName.toLowerCase());
  
  if (prod && item.weights.length > 0) {
    prod.weights = item.weights.map(w => ({
       label: w.label,
       price: w.price,
       originalPrice: Math.round(w.price * 1.1) // 10% fake discount just to keep UI working
    }));
    prod.price = prod.weights[0].price; // update base price
    updatedCount++;
  } else if (!prod) {
    // maybe it's one of the 4 new ones
    if (newProductsToAdd.find(n => n.name === item.name)) {
       let catId = item.category === 'NUTS' ? 'nuts-dry-fruits' : 'viral-product'; // just guess
       let newProd = {
         id: 'prod-' + Date.now() + '-' + Math.floor(Math.random()*1000),
         name: item.name,
         category: catId,
         description: item.name,
         image: '',
         discountPercent: 0,
         weights: item.weights.map(w => ({
            label: w.label,
            price: w.price,
            originalPrice: w.price
         })),
         price: item.weights.length > 0 ? item.weights[0].price : 0,
         stock: 50,
         status: 'Active'
       };
       prods.unshift(newProd);
       updatedCount++;
    }
  }
});

fileContent = fileContent.replace(/export const PRODUCTS = (\[.*\]);/s, "export const PRODUCTS = " + JSON.stringify(prods, null, 2) + ";");
fs.writeFileSync(productsFilePath, fileContent, 'utf8');

console.log("Updates applied:", updatedCount);
