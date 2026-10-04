const fs = require('fs');

const rawText = `
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
1.MUTAVATTUKAL 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-
2.MUTAKATTRAAN 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-
3.VALLARAI 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-
4.THUTHUVALAI 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-
5.MURUNGAI ILAI 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-
6.AAVAARAM POO 50gr 50rs, 1/4.. 250/-, 1/2.. 500/-, 1kg 980/-

WEIGHT LOSS PRODUCT
1.Karuppu kahuni kanchi 250gr 120/-
2.milk kefir grains (15gr to 18gr) 600/-
3.kumbucha Scoopy 400/-
4.Redmushroom Black Coffee ( 20 sachet ) 830/-
`;

let currentCategory = '';
const parsedItems = [];

rawText.split('\n').forEach(line => {
  line = line.trim();
  if (!line) return;
  if (!line.includes('.') && !line.includes('/') && line.length < 30) {
    currentCategory = line;
    return;
  }
  
  // Custom parsing rules to fix duplicate weights
  let name = line.replace(/^\d+\.?\s*/, '');
  let priceStr = name.split(/(?=\b\d+(?:gr|kg|ml|pices|sachet|g)\b|\b1\/\d+)/i)[1] || name.split(/(?=\b\d+(?:rs|-)\b)/i)[1];
  
  if (!priceStr) {
     if (name.includes(' - ')) {
         priceStr = name.substring(name.indexOf(' - ') + 3);
         name = name.substring(0, name.indexOf(' - ')).trim();
     } else if (name.match(/\d+/)) {
         const m = name.match(/(\d+.*)$/);
         if (m) { priceStr = m[1]; name = name.replace(m[1], ''); }
     }
  } else {
     name = name.substring(0, name.indexOf(priceStr)).trim();
  }

  if (line.includes('YELLOW DRY DATES')) {
     name = 'YELLOW DRY DATES';
     priceStr = line.replace('YELLOW DRY DATES', '');
  } else if (line.includes('Karuppu kahuni kanchi')) {
     name = 'KARUPPU KAHUNI KANJI';
  } else if (line.includes('Redmushroom Black Coffee')) {
     name = 'BLACK COFFEE';
  }

  name = name.replace(/[-:]/g, '').trim();

  const weights = [];
  if (priceStr) {
     // match parts like "100gr 120" or "1/4.. 250/-" or "1KG 950/-" or "1/2 720" or "500gr 250"
     let parts = priceStr.split(',');
     if (parts.length === 1 && !priceStr.includes('gr') && !priceStr.includes('/')) {
        parts = priceStr.split(' ');
     }
     if (priceStr.includes('1/2. 75/-, 140/-')) {
        parts = ['1/2. 75/-', '1kg 140/-'];
     } else if (priceStr.includes('1/2. 70/-, 140/-')) {
        parts = ['1/2. 70/-', '1kg 140/-'];
     } else if (priceStr.includes('1/2. 80/-, 150/-')) {
        parts = ['1/2. 80/-', '1kg 150/-'];
     }

     parts.forEach((p, idx) => {
        let text = p.trim();
        let w = '', pr = 0;
        
        if (text.includes('10gr')) w = '10g';
        else if (text.includes('15gr to 18gr')) w = '15g-18g';
        else if (text.includes('20 sachet') || text.includes('20SACHET')) w = '20 Sachet';
        else if (text.includes('50gr')) w = '50g';
        else if (text.includes('100gr') || text.includes('100Gr') || text.includes('100g')) w = '100g';
        else if (text.includes('1/4') || text.includes('250gr')) w = '250g';
        else if (text.includes('350gr')) w = '350g';
        else if (text.includes('400gr')) w = '400g';
        else if (text.includes('1/2') || text.includes('500gr')) w = '500g';
        else if (text.includes('1250gr')) w = '1250g';
        else if (text.includes('1kg') || text.includes('1KG') || text.includes('1kg')) w = '1kg';
        else if (text.includes('285ML')) w = '285ml';
        else if (text.includes('1pices')) w = '1 Piece';
        else if (idx === parts.length - 1 && parts.length > 1 && !w) w = '1kg'; // fallback for the last one like ",140/-"

        const numMatch = text.replace(/1\/[24]/, '').replace(/1250gr/, '').match(/(\d+)/g);
        let prices = numMatch ? numMatch.map(Number).filter(n => n >= 15 && n !== 100 && n !== 250 && n !== 500 && n !== 1000) : [];
        if (text.includes('1/4..250/-')) prices = [250];
        if (text.includes('1/2..250/-')) prices = [250];
        if (text.includes('250gr 250')) prices = [250];
        if (text.includes('250gr 120')) prices = [120];

        if (prices.length > 0) {
           pr = prices[prices.length - 1]; // usually the last number is the price
        } else if (text.match(/\d+rs/)) {
           pr = parseInt(text.match(/(\d+)rs/)[1]);
        }
        
        // Final overrides based on manual review
        if (name.includes('PEANUT') && text.includes('1/4.. 55/-')) w = '100g';
        if (name.includes('CHIA') && text.includes('100gr 55/-')) { w = '100g'; pr = 55; }
        if (name.includes('CHIA') && text.includes('1/4.. 130')) { w = '250g'; pr = 130; }
        if (name.includes('CHIA') && text.includes('1/2..250')) { w = '500g'; pr = 250; }
        
        if (name.includes('PEPPER') && text.includes('100gr 90/-')) { w = '100g'; pr = 90; }
        if (name.includes('PEPPER') && text.includes('1/4..225/-')) { w = '250g'; pr = 225; }
        if (name.includes('PEPPER') && text.includes('1/2..250/-')) { w = '500g'; pr = 250; }
        if (name.includes('PEPPER') && text.includes('1kg 880/-')) { w = '1kg'; pr = 880; }
        
        if (name.includes('VEG CHIPS') && text.includes('1/4..250/-')) { w = '250g'; pr = 250; }

        if (!w && !pr && text.match(/^\d+$/)) {
             w = 'Pack'; pr = parseInt(text);
        }
        if (!w && pr) w = 'Pack';

        if (w && pr) {
           weights.push({ label: w, price: pr });
        }
     });
  }

  // Deduplicate weights by label
  const uniqueWeightsMap = new Map();
  weights.forEach(w => uniqueWeightsMap.set(w.label, w));
  const uniqueWeights = Array.from(uniqueWeightsMap.values());

  if (name.trim()) {
      parsedItems.push({ name: name.trim(), category: currentCategory, weights: uniqueWeights });
  }
});

const nameMappings = {
  'VEG CHIPS': 'VEG CHIPS',
  'FRUITS CHIPS': 'FRUITS CHIPS',
  'MILK KEFIR GRAINS': 'KEFIR GRAINS',
  'KUMBUCHA SCOOPY': 'KUMBUCHA SCOOPY',
  'pshylium husk @ isabgol': 'pshylium husk isabgol',
  'Pathimugam': 'Pathimugam',
  'CALIFORNIA REGULAR ALMOND': 'CALIFORNIA ALMOND',
  'CALIFORNIA MINI BOLD ALMOND': 'CALIFORNIA MINI BOLD ALMOND',
  'CALIFORNIA BOLD ALMOND': 'CALIFORNIA BOLD ALMOND',
  'CASHEW 320 SIZE': 'CASHEW NUTS',
  'KASHMIR WALNUT': 'WALNUT',
  'KASHMIR WALNUT PREMIUM': 'KASHMIR WALNUT PREMIUM',
  'HAZALNUT': 'HAZELNUT',
  'BRAZIL NUT': 'BRAZIL NUT',
  'ROASTED PISTA': 'ROASTED PISTA',
  'GREEN PISTA': 'GREEN PISTA',
  'BLACK RAISIN SEED': 'BLACK RAISIN',
  'AFGHAN FIG': 'AFGHAN FIG',
  'IRAN FIG': 'IRAN FIG',
  'KIWI': 'DRY KIWI',
  'STRABERRY': 'DRY STRAWBERRY',
  'CRANBERRY': 'DRY CRANBERRY',
  'CHERRY': 'DRY CHERRY',
  'BLUBERRY': 'DRY BLUEBERRY',
  'MANGO': 'DRY MANGO',
  'DRY AMLA': 'DRY AMLA',
  'AJWA': 'AJWA DATES',
  'SAFAVI KALIMA': 'SAFAWI DATES',
  'KALUTTU': 'KALUTTU DATES',
  'MASAFATI': 'MASAFATI DATES',
  'BROWN DATES SEED': 'BROWN DATES (SEED)',
  'BROWN DATES SEEDLESS': 'BROWN DATES (SEEDLESS)',
  'YELLOW DRY DATES': 'YELLOW DRY DATES',
  'BIOTIN DRINK': 'BIOTIN DRINK',
  'SPROUTED RAGI MALT': 'RAGI MALT',
  'BLACK URID KALI KANJI': 'BLACK URID KALI',
  'HEALTH MIX POWDER': 'HEALTH MIX',
  'CHOCO COCOZHI': 'CHOCO COCOZHI',
  'BLACK COFFEE': 'BLACK COFFEE',
  'RED MUSHROOM TEA': 'MUSHROOM TEA',
  'KUMBUCHA': 'KUMBUCHA',
  'BADHAM PISIN': 'BADAM PISIN',
  'AGAR AGAR': 'AGAR AGAR',
  'CHIA': 'CHIA',
  'PUPMKIN.': 'PUMPKIN SEED',
  'WATERMELON': 'WATERMELON SEED',
  'FALX': 'FLAX SEED',
  'COCUMER,': 'CUCUMBER SEED',
  'SABJA.': 'SABJA SEED',
  'FRIED PEANUT': 'PEANUT',
  'SALIYA': 'SALIYA',
  'FOREST HONEY': 'FOREST HONEY',
  'MOUNTAIN HONEY': 'MOUNTAIN HONEY',
  'HONEY AMLA': 'HONEY AMLA',
  'HONEY NUTS MIXED': 'HONEY NUTS',
  'KARUPPU KAHUNI': 'KARUPPU KAVUNI',
  'MAPPILAI SAMBA': 'MAPPILAI SAMBA',
  'KAATTUYANA': 'KATTUYAKANAM',
  'POONGAR': 'POONGAR RICE',
  'KARUNKURUVAI': 'KARUNKURUVAI',
  'KULLAKAR': 'KULLAKAR',
  'KUTHIRAIVAALI': 'KUTHIRAIVALI',
  'THINAI': 'THINAI',
  'VARAHU': 'VARAGU',
  'SAAMAI': 'SAAMAI',
  'BLACK URID': 'BLACK URAD DAL',
  'RAAGI': 'RAGI',
  'PEPPER': 'PEPPER SEED',
  'JEERAGAM': 'CUMIN',
  'SOMBU': 'FENNEL',
  'KADUGU': 'MUSTARD',
  'VENTHAYAM': 'FENUGREEK',
  'SADHA PATTAI': 'CINNAMON',
  'SRILANKA PATTAI': 'SRILANKA PATTAI',
  'CLOVE': 'CLOVE',
  'STAR ANISE': 'STAR ANISE',
  'OOMAM': 'OMAM',
  'SATHKUPPAI': 'SATHAKUPPAI',
  'KARUNJEERAGAM': 'KARUNJEERAGAM',
  'BRINJI LEAF': 'BAY LEAF',
  'MUTAVATTUKAL': 'MUTAVATTUKAL SOUP',
  'MUTAKATTRAAN': 'MUTAKATTRAAN SOUP',
  'VALLARAI': 'VALLARAI SOUP',
  'THUTHUVALAI': 'THUTHUVALAI SOUP',
  'MURUNGAI ILAI': 'MURUNGAI SOUP',
  'AAVAARAM POO': 'AAVAARAM POO SOUP',
  'KARUPPU KAHUNI KANJI': 'KARUPPU KAHUNI KANJI'
};

const productsJsPath = 'src/data/products.js';
let productsContent = fs.readFileSync(productsJsPath, 'utf8');
const match = productsContent.match(/export const PRODUCTS = (\[.*\]);/s);
const prods = JSON.parse(match[1]);

let updatedCount = 0;
parsedItems.forEach(item => {
  let mappedName = nameMappings[item.name] || item.name;
  let prod = prods.find(p => p.name.toLowerCase() === mappedName.toLowerCase());
  
  if (prod) {
    if (item.weights.length > 0) {
      prod.weights = item.weights.map(w => ({
         label: w.label,
         price: w.price,
         originalPrice: w.price // NO 10% FAKE DISCOUNT! User wants EXACTLY what they gave!
      }));
      prod.price = prod.weights[0].price;
      
      // Update category if it's WEIGHT LOSS PRODUCT
      if (item.category === 'WEIGHT LOSS PRODUCT') {
          prod.category = 'weight-loss'; // Assign a new category
          prod.categoryName = 'Weight Loss Product';
      }
      
      updatedCount++;
    }
  } else {
    // Product not found in our DB, add it
    if (item.weights.length > 0 || item.name.includes('CHOCO COCOZHI')) {
        let catId = item.category === 'WEIGHT LOSS PRODUCT' ? 'weight-loss' : 'general';
        let newProd = {
           id: 'prod-' + Date.now() + '-' + Math.floor(Math.random()*1000),
           name: item.name,
           category: catId,
           categoryName: item.category,
           description: item.name,
           image: '',
           discountPercent: 0,
           weights: item.weights.length > 0 ? item.weights.map(w => ({
              label: w.label,
              price: w.price,
              originalPrice: w.price
           })) : [{ label: 'Standard', price: 250, originalPrice: 250 }],
           price: item.weights.length > 0 ? item.weights[0].price : 250,
           stock: 50,
           status: 'Active'
         };
         prods.unshift(newProd);
         updatedCount++;
    }
  }
});

productsContent = productsContent.replace(/export const PRODUCTS = (\[.*\]);/s, 'export const PRODUCTS = ' + JSON.stringify(prods, null, 2) + ';');
fs.writeFileSync(productsJsPath, productsContent, 'utf8');
console.log('Updated ' + updatedCount + ' products to EXACTLY match user provided weights/prices without fake discounts.');
