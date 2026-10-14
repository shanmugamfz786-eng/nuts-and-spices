export const STORE_WHATSAPP_NUMBER = '919876543210';
export const CATALOG_VERSION = 'v8_restored_original_images_2026';

export const CATEGORIES = [
  {
    "id": "all",
    "name": "All Products",
    "icon": "✨",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "viral-product",
    "name": "VIRAL PRODUCT",
    "icon": "🔥",
    "image": "/images/products/product_1.jpg"
  },
  {
    "id": "nuts-dry-fruits",
    "name": "NUTS & DRY FRUITS",
    "icon": "🌰",
    "image": "/images/products/product_2.jpg"
  },
  {
    "id": "dates",
    "name": "DATES",
    "icon": "🌴",
    "image": "/images/products/product_3.jpg"
  },
  {
    "id": "malt-beverages",
    "name": "MALT & BEVERAGES",
    "icon": "☕",
    "image": "/images/products/product_4.jpg"
  },
  {
    "id": "seeds-items",
    "name": "SEEDS ITEMS",
    "icon": "🌱",
    "image": "/images/products/product_5.jpg"
  },
  {
    "id": "honey",
    "name": "HONEY",
    "icon": "🍯",
    "image": "/images/products/product_6.jpg"
  },
  {
    "id": "rice-millet",
    "name": "RICE & MILLET",
    "icon": "🌾",
    "image": "/images/products/product_7.jpg"
  },
  {
    "id": "masala",
    "name": "MASALA",
    "icon": "🌶️",
    "image": "/images/products/product_8.jpg"
  },
  {
    "id": "soup",
    "name": "SOUP",
    "icon": "🥣",
    "image": "/images/products/product_9.jpg"
  },
  {
    "id": "weight-loss",
    "name": "WEIGHT LOSS PRODUCT",
    "icon": "⚖️",
    "image": "/images/products/product_10.jpg"
  },
  {
    "id": "herbals",
    "name": "HERBALS",
    "icon": "🌿",
    "image": "/images/products/product_11.jpg"
  }
];

export const PRODUCTS = [
  {
    "id": "vp-01",
    "name": "VEG CHIPS",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "🔥 Trending",
    "rating": 4.9,
    "reviews": 120,
    "weights": [
      {
        "label": "100g",
        "price": 120,
        "originalPrice": 144
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 950,
        "originalPrice": 1140
      }
    ],
    "description": "Crispy and healthy assorted vegetable chips made with natural oil.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 120,
    "status": "Active",
    "active": true,
    "discountPercent": 18,
    "discount": "18% OFF",
    "stock": 45,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "/images/products/product_12.jpg"
  },
  {
    "id": "vp-02",
    "name": "FRUITS CHIPS",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "🔥 Hot Item",
    "rating": 4.8,
    "reviews": 95,
    "weights": [
      {
        "label": "100g",
        "price": 160,
        "originalPrice": 192
      },
      {
        "label": "250g",
        "price": 360,
        "originalPrice": 432
      },
      {
        "label": "500g",
        "price": 720,
        "originalPrice": 864
      },
      {
        "label": "1kg",
        "price": 1350,
        "originalPrice": 1620
      }
    ],
    "description": "Dehydrated crispy fruit slices rich in natural flavors and vitamins.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 160,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_13.jpg"
  },
  {
    "id": "vp-03",
    "name": "KEFIR GRAINS",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "Probiotic Superfood",
    "rating": 5,
    "reviews": 210,
    "weights": [
      {
        "label": "1 Pack",
        "price": 350,
        "originalPrice": 449
      }
    ],
    "description": "Live active kefir starter grains for homemade probiotic rich kefir drink.",
    "origin": "Natural Culture",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "stock": 45,
    "image": "/images/products/product_14.jpg"
  },
  {
    "id": "vp-04",
    "name": "KUMBUCHA SCOOPY",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "Live Culture",
    "rating": 4.9,
    "reviews": 140,
    "weights": [
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Healthy live Kombucha SCOBY culture with starter tea.",
    "origin": "Natural Ferment",
    "shelfLife": "12 Months",
    "price": 250,
    "status": "Active",
    "active": true,
    "discountPercent": 20,
    "discount": "20% OFF",
    "stock": 45,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "/images/products/product_15.jpg"
  },
  {
    "id": "ndf-01",
    "name": "CALIFORNIA ALMOND",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Premium Grade",
    "rating": 4.9,
    "reviews": 310,
    "weights": [
      {
        "label": "250g",
        "price": 340,
        "originalPrice": 390
      },
      {
        "label": "500g",
        "price": 650,
        "originalPrice": 750
      }
    ],
    "description": "Crunchy California almonds packed with protein and Vitamin E.",
    "origin": "USA",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_16.jpg"
  },
  {
    "id": "ndf-02",
    "name": "MAMURA BADAM",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Exquisite Quality",
    "rating": 5,
    "reviews": 85,
    "weights": [
      {
        "label": "250g",
        "price": 850,
        "originalPrice": 950
      },
      {
        "label": "500g",
        "price": 1650,
        "originalPrice": 1850
      }
    ],
    "description": "Original Mamra Almonds rich in natural oils.",
    "origin": "Afghanistan",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_17.jpg"
  },
  {
    "id": "ndf-03",
    "name": "CASHEW 320",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Best Value",
    "rating": 4.8,
    "reviews": 190,
    "weights": [
      {
        "label": "250g",
        "price": 320,
        "originalPrice": 380
      },
      {
        "label": "500g",
        "price": 620,
        "originalPrice": 720
      }
    ],
    "description": "Grade W320 whole cashews, rich and creamy texture.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_18.jpg"
  },
  {
    "id": "ndf-04",
    "name": "CASHEW 240",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "King Size",
    "rating": 4.9,
    "reviews": 155,
    "weights": [
      {
        "label": "250g",
        "price": 380,
        "originalPrice": 440
      },
      {
        "label": "500g",
        "price": 740,
        "originalPrice": 850
      }
    ],
    "description": "Large size W240 whole jumbo cashews.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_19.jpg"
  },
  {
    "id": "ndf-05",
    "name": "KASHMIR WALNUT",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Brain Food",
    "rating": 4.7,
    "reviews": 112,
    "weights": [
      {
        "label": "250g",
        "price": 280,
        "originalPrice": 336
      },
      {
        "label": "500g",
        "price": 560,
        "originalPrice": 672
      },
      {
        "label": "1kg",
        "price": 1100,
        "originalPrice": 1320
      }
    ],
    "description": "Kashmiri walnut kernels rich in Omega 3 fatty acids.",
    "origin": "Kashmir",
    "shelfLife": "6 Months",
    "price": 280,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_20.jpg"
  },
  {
    "id": "ndf-06",
    "name": "KASHMIR WALNUT PREMIUM",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Snow White Kernels",
    "rating": 5,
    "reviews": 78,
    "weights": [
      {
        "label": "250g",
        "price": 350,
        "originalPrice": 420
      },
      {
        "label": "500g",
        "price": 700,
        "originalPrice": 840
      },
      {
        "label": "1kg",
        "price": 1350,
        "originalPrice": 1620
      }
    ],
    "description": "Handpicked extra light premium Kashmir walnuts.",
    "origin": "Kashmir",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_21.jpg"
  },
  {
    "id": "ndf-07",
    "name": "HAZELNUT",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Exotic Nut",
    "rating": 4.8,
    "reviews": 64,
    "weights": [
      {
        "label": "250g",
        "price": 420,
        "originalPrice": 490
      },
      {
        "label": "500g",
        "price": 800,
        "originalPrice": 950
      }
    ],
    "description": "Whole roasted hazelnuts with crunchy flavor.",
    "origin": "Turkey",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_22.jpg"
  },
  {
    "id": "ndf-08",
    "name": "BRAZIL NUT",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Selenium Rich",
    "rating": 4.9,
    "reviews": 52,
    "weights": [
      {
        "label": "100g",
        "price": 350,
        "originalPrice": 420
      },
      {
        "label": "250g",
        "price": 875,
        "originalPrice": 1050
      },
      {
        "label": "500g",
        "price": 1750,
        "originalPrice": 2100
      }
    ],
    "description": "Raw Brazil nuts packed with essential antioxidants and minerals.",
    "origin": "Brazil",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_23.jpg"
  },
  {
    "id": "ndf-09",
    "name": "ROASTED PISTA",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Salted & Roasted",
    "rating": 4.8,
    "reviews": 210,
    "weights": [
      {
        "label": "250g",
        "price": 470,
        "originalPrice": 564
      },
      {
        "label": "500g",
        "price": 940,
        "originalPrice": 1128
      }
    ],
    "description": "Lightly salted roasted California pistachios in shell.",
    "origin": "USA",
    "shelfLife": "9 Months",
    "price": 470,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_24.jpg"
  },
  {
    "id": "ndf-10",
    "name": "GREEN PISTA",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Raw Kernels",
    "rating": 4.9,
    "reviews": 90,
    "weights": [
      {
        "label": "100g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "250g",
        "price": 750,
        "originalPrice": 900
      },
      {
        "label": "500g",
        "price": 1500,
        "originalPrice": 1800
      }
    ],
    "description": "Cleaned raw green pistachio kernels for baking and snacking.",
    "origin": "Iran",
    "shelfLife": "9 Months",
    "price": 300,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_25.jpg"
  },
  {
    "id": "ndf-11",
    "name": "BLACK RAISIN SEED",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Iron Boost",
    "rating": 4.7,
    "reviews": 130,
    "weights": [
      {
        "label": "250g",
        "price": 145,
        "originalPrice": 174
      },
      {
        "label": "500g",
        "price": 290,
        "originalPrice": 348
      }
    ],
    "description": "Black raisins with seeds, good for hemoglobin and stamina.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 145,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_26.jpg"
  },
  {
    "id": "ndf-12",
    "name": "AFGHAN FIG",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Sun Dried",
    "rating": 4.9,
    "reviews": 140,
    "weights": [
      {
        "label": "250g",
        "price": 240,
        "originalPrice": 288
      },
      {
        "label": "500g",
        "price": 480,
        "originalPrice": 576
      }
    ],
    "description": "Sun dried jumbo Afghan figs (Anjeer).",
    "origin": "Afghanistan",
    "shelfLife": "9 Months",
    "price": 240,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_27.jpg"
  },
  {
    "id": "ndf-13",
    "name": "IRAN FIG",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Natural Sweetness",
    "rating": 4.7,
    "reviews": 80,
    "weights": [
      {
        "label": "400g",
        "price": 260,
        "originalPrice": 312
      }
    ],
    "description": "Soft dried Iranian figs.",
    "origin": "Iran",
    "shelfLife": "9 Months",
    "price": 260,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_28.jpg"
  },
  {
    "id": "ndf-14",
    "name": "KIWI",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Tangy Sweet",
    "rating": 4.6,
    "reviews": 70,
    "weights": [
      {
        "label": "100g",
        "price": 75,
        "originalPrice": 90
      },
      {
        "label": "250g",
        "price": 180,
        "originalPrice": 216
      },
      {
        "label": "500g",
        "price": 350,
        "originalPrice": 420
      }
    ],
    "description": "Dehydrated green Kiwi slices rich in Vitamin C.",
    "origin": "New Zealand",
    "shelfLife": "9 Months",
    "price": 75,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_29.jpg"
  },
  {
    "id": "ndf-15",
    "name": "STRAWBERRY",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Fruity Delight",
    "rating": 4.8,
    "reviews": 90,
    "weights": [
      {
        "label": "250g",
        "price": 290,
        "originalPrice": 350
      },
      {
        "label": "500g",
        "price": 550,
        "originalPrice": 660
      }
    ],
    "description": "Dried whole strawberries loaded with antioxidants.",
    "origin": "India",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_30.jpg"
  },
  {
    "id": "ndf-16",
    "name": "CRANBERRY",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Heart Healthy",
    "rating": 4.9,
    "reviews": 180,
    "weights": [
      {
        "label": "100g",
        "price": 85,
        "originalPrice": 102
      },
      {
        "label": "250g",
        "price": 210,
        "originalPrice": 252
      },
      {
        "label": "500g",
        "price": 400,
        "originalPrice": 480
      }
    ],
    "description": "Sliced dried cranberries with mild sweetness.",
    "origin": "USA",
    "shelfLife": "12 Months",
    "price": 85,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_31.jpg"
  },
  {
    "id": "ndf-17",
    "name": "CHERRY",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Rich Berry",
    "rating": 4.7,
    "reviews": 65,
    "weights": [
      {
        "label": "100g",
        "price": 85,
        "originalPrice": 102
      },
      {
        "label": "250g",
        "price": 210,
        "originalPrice": 252
      },
      {
        "label": "500g",
        "price": 400,
        "originalPrice": 480
      }
    ],
    "description": "Sweetened dried red cherries.",
    "origin": "Turkey",
    "shelfLife": "9 Months",
    "price": 85,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_32.jpg"
  },
  {
    "id": "ndf-18",
    "name": "BLUEBERRY",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Superberry",
    "rating": 5,
    "reviews": 140,
    "weights": [
      {
        "label": "250g",
        "price": 420,
        "originalPrice": 490
      },
      {
        "label": "500g",
        "price": 800,
        "originalPrice": 950
      }
    ],
    "description": "Whole dried wild blueberries.",
    "origin": "Canada",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_33.jpg"
  },
  {
    "id": "ndf-19",
    "name": "MANGO",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Tropical Bite",
    "rating": 4.6,
    "reviews": 85,
    "weights": [
      {
        "label": "100g",
        "price": 85,
        "originalPrice": 102
      },
      {
        "label": "250g",
        "price": 210,
        "originalPrice": 252
      },
      {
        "label": "500g",
        "price": 400,
        "originalPrice": 480
      }
    ],
    "description": "Dehydrated ripe mango slices.",
    "origin": "India",
    "shelfLife": "9 Months",
    "price": 85,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_34.jpg"
  },
  {
    "id": "ndf-20",
    "name": "DRY AMLA",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Immunity Candy",
    "rating": 4.8,
    "reviews": 160,
    "weights": [
      {
        "label": "100g",
        "price": 40,
        "originalPrice": 48
      },
      {
        "label": "250g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "500g",
        "price": 190,
        "originalPrice": 228
      }
    ],
    "description": "Sweetened & salted dried Indian Gooseberry (Amla).",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 40,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_35.jpg"
  },
  {
    "id": "ndf-21",
    "name": "DRY APRICOT",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS & DRY FRUITS",
    "badge": "Fiber Rich",
    "rating": 4.7,
    "reviews": 92,
    "weights": [
      {
        "label": "250g",
        "price": 290,
        "originalPrice": 350
      },
      {
        "label": "500g",
        "price": 550,
        "originalPrice": 660
      }
    ],
    "description": "Natural dried Turkish apricots.",
    "origin": "Turkey",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_36.jpg"
  },
  {
    "id": "dt-01",
    "name": "AJWA - SOUDIA",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Holy Harvest",
    "rating": 5,
    "reviews": 210,
    "weights": [
      {
        "label": "250g",
        "price": 650,
        "originalPrice": 750
      },
      {
        "label": "500g",
        "price": 1250,
        "originalPrice": 1450
      }
    ],
    "description": "Authentic dark Ajwa dates imported from Saudi Arabia.",
    "origin": "Saudi Arabia",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_37.jpg"
  },
  {
    "id": "dt-02",
    "name": "SAFAVI KALIMA - SOUDIA",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Premium Grade",
    "rating": 4.8,
    "reviews": 145,
    "weights": [
      {
        "label": "250g",
        "price": 380,
        "originalPrice": 450
      },
      {
        "label": "500g",
        "price": 740,
        "originalPrice": 880
      }
    ],
    "description": "Rich dark Safawi Kalima dates from Saudi Arabia.",
    "origin": "Saudi Arabia",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_38.jpg"
  },
  {
    "id": "dt-03",
    "name": "KALUTTU - IRAN",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Soft & Sweet",
    "rating": 4.7,
    "reviews": 98,
    "weights": [
      {
        "label": "250g",
        "price": 260,
        "originalPrice": 310
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      }
    ],
    "description": "Naturally soft and delicious Kaluttu dates from Iran.",
    "origin": "Iran",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dt-04",
    "name": "MASAFATI - IRAN",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Best Seller",
    "rating": 4.9,
    "reviews": 180,
    "weights": [
      {
        "label": "500g Box",
        "price": 290,
        "originalPrice": 340
      },
      {
        "label": "1 kg Box",
        "price": 540,
        "originalPrice": 650
      }
    ],
    "description": "Melt-in-mouth soft Mazafati fresh dates imported from Iran.",
    "origin": "Iran",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_39.jpg"
  },
  {
    "id": "dt-05",
    "name": "BROWN DATES SEED - IRAQ",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Natural Choice",
    "rating": 4.6,
    "reviews": 82,
    "weights": [
      {
        "label": "250g",
        "price": 180,
        "originalPrice": 220
      },
      {
        "label": "500g",
        "price": 340,
        "originalPrice": 420
      }
    ],
    "description": "Traditional brown seeded dates from Iraq.",
    "origin": "Iraq",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_40.jpg"
  },
  {
    "id": "dt-06",
    "name": "BROWN DATES",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Everyday Value",
    "rating": 4.5,
    "reviews": 75,
    "weights": [
      {
        "label": "250g",
        "price": 160,
        "originalPrice": 200
      },
      {
        "label": "500g",
        "price": 300,
        "originalPrice": 380
      }
    ],
    "description": "Quality brown dates for daily healthy snacking.",
    "origin": "Middle East",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_41.jpg"
  },
  {
    "id": "dt-07",
    "name": "SEEDLESS - IRAQ",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Convenient Pack",
    "rating": 4.8,
    "reviews": 110,
    "weights": [
      {
        "label": "250g",
        "price": 210,
        "originalPrice": 250
      },
      {
        "label": "500g",
        "price": 400,
        "originalPrice": 480
      }
    ],
    "description": "Pitted seedless brown dates from Iraq.",
    "origin": "Iraq",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_42.jpg"
  },
  {
    "id": "dt-08",
    "name": "YELLOW DRY DATES",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "Dry Chuara",
    "rating": 4.7,
    "reviews": 95,
    "weights": [
      {
        "label": "500g",
        "price": 160,
        "originalPrice": 192
      },
      {
        "label": "1kg",
        "price": 320,
        "originalPrice": 384
      }
    ],
    "description": "Hard yellow dry dates (Chuara) for nutrition.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 160,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_43.jpg"
  },
  {
    "id": "mb-01",
    "name": "BIOTIN DRINK",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Hair & Skin Health",
    "rating": 4.9,
    "reviews": 120,
    "weights": [
      {
        "label": "200g",
        "price": 280,
        "originalPrice": 336
      }
    ],
    "description": "Plant-based biotin health drink mix for strong hair and glowing skin.",
    "origin": "India",
    "shelfLife": "9 Months",
    "price": 280,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_44.jpg"
  },
  {
    "id": "mb-02",
    "name": "SPROUTED RAGI MALT",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Calcium Rich",
    "rating": 4.8,
    "reviews": 210,
    "weights": [
      {
        "label": "250g",
        "price": 170,
        "originalPrice": 204
      }
    ],
    "description": "Traditional sprouted finger millet malt porridge mix.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 170,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_45.jpg"
  },
  {
    "id": "mb-03",
    "name": "BLACK URID KALI KANJI",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Traditional Strength",
    "rating": 4.9,
    "reviews": 165,
    "weights": [
      {
        "label": "250g",
        "price": 150,
        "originalPrice": 180
      }
    ],
    "description": "Nutritious whole black gram (Ulundhu) kali mix.",
    "origin": "Tamil Nadu",
    "shelfLife": "6 Months",
    "price": 150,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_46.jpg"
  },
  {
    "id": "mb-04",
    "name": "HEALTH MIX",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Sathu Maavu",
    "rating": 5,
    "reviews": 320,
    "weights": [
      {
        "label": "500g Pack",
        "price": 280,
        "originalPrice": 340
      },
      {
        "label": "1 kg Pack",
        "price": 540,
        "originalPrice": 650
      }
    ],
    "description": "Multigrain Sathu Maavu blend with nuts and cardamom.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_47.jpg"
  },
  {
    "id": "mb-05",
    "name": "CHOCO COCOZHI",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Kids Favorite",
    "rating": 4.8,
    "reviews": 140,
    "weights": [
      {
        "label": "Standard",
        "price": 100,
        "originalPrice": 120
      }
    ],
    "description": "Delicious cocoa chocolate malt drink for energy.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 100,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_48.jpg"
  },
  {
    "id": "mb-06",
    "name": "RED MUSHROOM COFFEE",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Reishi Blend",
    "rating": 4.9,
    "reviews": 175,
    "weights": [
      {
        "label": "200g Pack",
        "price": 450,
        "originalPrice": 550
      }
    ],
    "description": "Ganoderma Reishi Red Mushroom instant coffee blend.",
    "origin": "Malaysia",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_49.jpg"
  },
  {
    "id": "mb-07",
    "name": "RED MUSHROOM TEA",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Antioxidant Tea",
    "rating": 4.8,
    "reviews": 90,
    "weights": [
      {
        "label": "250g",
        "price": 490,
        "originalPrice": 588
      }
    ],
    "description": "Herbal Red Mushroom Ganoderma infused black tea.",
    "origin": "Malaysia",
    "shelfLife": "12 Months",
    "price": 490,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_50.jpg"
  },
  {
    "id": "mb-08",
    "name": "SHARBATH",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Cooling Drink",
    "rating": 4.7,
    "reviews": 110,
    "weights": [
      {
        "label": "500ml Bottle",
        "price": 160,
        "originalPrice": 190
      }
    ],
    "description": "Refreshingly sweet natural herb drink syrup.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_51.jpg"
  },
  {
    "id": "mb-09",
    "name": "KUMBUCHA",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Gut Health Drink",
    "rating": 4.9,
    "reviews": 130,
    "weights": [
      {
        "label": "285ml",
        "price": 140,
        "originalPrice": 168
      }
    ],
    "description": "Sparkling fermented probiotic Kombucha beverage.",
    "origin": "Natural Ferment",
    "shelfLife": "6 Months",
    "price": 140,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_52.jpg"
  },
  {
    "id": "mb-10",
    "name": "KEFIR",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Probiotic Milk",
    "rating": 4.8,
    "reviews": 95,
    "weights": [
      {
        "label": "500ml Bottle",
        "price": 190,
        "originalPrice": 240
      }
    ],
    "description": "Live cultured probiotic Kefir milk drink.",
    "origin": "Natural Ferment",
    "shelfLife": "1 Month",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_53.jpg"
  },
  {
    "id": "mb-11",
    "name": "NANNARI SHARBATH",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Body Coolant",
    "rating": 4.9,
    "reviews": 240,
    "weights": [
      {
        "label": "500ml Bottle",
        "price": 180,
        "originalPrice": 220
      }
    ],
    "description": "Authentic Indian Sarsaparilla (Nannari) root syrup.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_54.jpg"
  },
  {
    "id": "mb-12",
    "name": "ROSE MILK SHARBATH",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Aromatic Syrup",
    "rating": 4.8,
    "reviews": 160,
    "weights": [
      {
        "label": "500ml Bottle",
        "price": 170,
        "originalPrice": 200
      }
    ],
    "description": "Fragrant rose petal extract syrup for rose milk.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_55.jpg"
  },
  {
    "id": "mb-13",
    "name": "JAMUN SHARBATH",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Diabetes Friendly",
    "rating": 4.7,
    "reviews": 85,
    "weights": [
      {
        "label": "500ml Bottle",
        "price": 210,
        "originalPrice": 260
      }
    ],
    "description": "Black plum (Jamun/Naval Pazham) fruit sharbath.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_56.jpg"
  },
  {
    "id": "mb-14",
    "name": "BADAM PISIN",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "Almond Gum",
    "rating": 4.9,
    "reviews": 195,
    "weights": [
      {
        "label": "250g Pack",
        "price": 140,
        "originalPrice": 180
      },
      {
        "label": "500g Pack",
        "price": 260,
        "originalPrice": 320
      }
    ],
    "description": "Natural almond tree jelly gum body coolant.",
    "origin": "India",
    "shelfLife": "18 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_57.jpg"
  },
  {
    "id": "mb-15",
    "name": "AGAR AGAR",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "China Grass",
    "rating": 4.8,
    "reviews": 105,
    "weights": [
      {
        "label": "10g",
        "price": 25,
        "originalPrice": 30
      },
      {
        "label": "50g",
        "price": 120,
        "originalPrice": 144
      }
    ],
    "description": "Pure seaweed gelatin strip for puddings and desserts.",
    "origin": "India",
    "shelfLife": "24 Months",
    "price": 25,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_58.jpg"
  },
  {
    "id": "sd-01",
    "name": "CHIA",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Omega-3 Rich",
    "rating": 4.9,
    "reviews": 280,
    "weights": [
      {
        "label": "100g",
        "price": 55,
        "originalPrice": 66
      },
      {
        "label": "250g",
        "price": 130,
        "originalPrice": 156
      },
      {
        "label": "500g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Organic raw black chia seeds.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 55,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_59.jpg"
  },
  {
    "id": "sd-02",
    "name": "PUMPKIN",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Zinc Rich",
    "rating": 4.9,
    "reviews": 210,
    "weights": [
      {
        "label": "250g",
        "price": 220,
        "originalPrice": 270
      },
      {
        "label": "500g",
        "price": 420,
        "originalPrice": 510
      }
    ],
    "description": "AAA grade raw green pumpkin seed kernels.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_60.jpg"
  },
  {
    "id": "sd-03",
    "name": "WATERMELON",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Protein Snack",
    "rating": 4.8,
    "reviews": 140,
    "weights": [
      {
        "label": "100g",
        "price": 90,
        "originalPrice": 108
      },
      {
        "label": "250g",
        "price": 225,
        "originalPrice": 270
      },
      {
        "label": "500g",
        "price": 440,
        "originalPrice": 528
      }
    ],
    "description": "Cleaned raw white watermelon kernels.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 90,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_61.jpg"
  },
  {
    "id": "sd-04",
    "name": "FLAX",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Fiber Booster",
    "rating": 4.7,
    "reviews": 165,
    "weights": [
      {
        "label": "250g",
        "price": 120,
        "originalPrice": 150
      },
      {
        "label": "500g",
        "price": 220,
        "originalPrice": 280
      }
    ],
    "description": "Raw brown roasted flax seeds (Alsi).",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_62.jpg"
  },
  {
    "id": "sd-05",
    "name": "CUCUMBER",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Nutrient Dense",
    "rating": 4.6,
    "reviews": 75,
    "weights": [
      {
        "label": "250g",
        "price": 190,
        "originalPrice": 240
      },
      {
        "label": "500g",
        "price": 360,
        "originalPrice": 450
      }
    ],
    "description": "Dried cucumber seed kernels.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "isFeaturedToday": true,
    "image": "/images/products/product_63.jpg"
  },
  {
    "id": "sd-06",
    "name": "SABJA",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Basil Seeds",
    "rating": 4.9,
    "reviews": 230,
    "weights": [
      {
        "label": "100g",
        "price": 45,
        "originalPrice": 54
      },
      {
        "label": "250g",
        "price": 100,
        "originalPrice": 120
      }
    ],
    "description": "Sweet basil seeds for FALOODA and body cooling drinks.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 45,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_64.jpg"
  },
  {
    "id": "sd-07",
    "name": "PEANUT",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Groundnut",
    "rating": 4.7,
    "reviews": 110,
    "weights": [
      {
        "label": "500g",
        "price": 120,
        "originalPrice": 150
      },
      {
        "label": "1 kg",
        "price": 230,
        "originalPrice": 280
      }
    ],
    "description": "Raw bold raw red peanuts.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_65.jpg"
  },
  {
    "id": "sd-08",
    "name": "SALIYA",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "Garden Cress",
    "rating": 4.8,
    "reviews": 65,
    "weights": [
      {
        "label": "100g",
        "price": 40,
        "originalPrice": 48
      },
      {
        "label": "250g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "500g",
        "price": 190,
        "originalPrice": 228
      }
    ],
    "description": "Garden cress (Halim / Saliya) seeds rich in iron.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 40,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_66.jpg"
  },
  {
    "id": "hn-01",
    "name": "FOREST HONEY",
    "category": "honey",
    "categoryName": "HONEY",
    "badge": "Wild Organic",
    "rating": 5,
    "reviews": 190,
    "weights": [
      {
        "label": "250g",
        "price": 220,
        "originalPrice": 264
      },
      {
        "label": "1250g",
        "price": 740,
        "originalPrice": 888
      }
    ],
    "description": "Raw wild forest honey extracted from deep natural forests.",
    "origin": "Western Ghats",
    "shelfLife": "24 Months",
    "price": 220,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_67.jpg"
  },
  {
    "id": "hn-02",
    "name": "MOUNTAIN HONEY",
    "category": "honey",
    "categoryName": "HONEY",
    "badge": "High Altitude",
    "rating": 4.9,
    "reviews": 140,
    "weights": [
      {
        "label": "500g",
        "price": 450,
        "originalPrice": 540
      }
    ],
    "description": "Unprocessed pure mountain flora honey.",
    "origin": "Himalayas",
    "shelfLife": "24 Months",
    "price": 450,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_68.jpg"
  },
  {
    "id": "hn-03",
    "name": "HONEY AMLA",
    "category": "honey",
    "categoryName": "HONEY",
    "badge": "Immunity Tonic",
    "rating": 4.8,
    "reviews": 165,
    "weights": [
      {
        "label": "350g",
        "price": 185,
        "originalPrice": 222
      }
    ],
    "description": "Fresh Indian gooseberry soaked in pure honey.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 185,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_69.jpg"
  },
  {
    "id": "hn-04",
    "name": "HONEY NUTS MIXED",
    "category": "honey",
    "categoryName": "HONEY",
    "badge": "Energy Crunch",
    "rating": 5,
    "reviews": 260,
    "weights": [
      {
        "label": "250g",
        "price": 160,
        "originalPrice": 192
      },
      {
        "label": "500g",
        "price": 300,
        "originalPrice": 360
      }
    ],
    "description": "Premium almonds, cashews, walnuts, and pistachios immersed in pure honey.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 160,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_70.jpg"
  },
  {
    "id": "rm-01",
    "name": "KARUPPU KAVUNI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Emperor Black Rice",
    "rating": 5,
    "reviews": 310,
    "weights": [
      {
        "label": "500g",
        "price": 140,
        "originalPrice": 170
      },
      {
        "label": "1 kg",
        "price": 260,
        "originalPrice": 320
      }
    ],
    "description": "Heritage Black Kavuni rice rich in anthocyanin antioxidants.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_71.jpg"
  },
  {
    "id": "rm-02",
    "name": "MAPPILAI SAMBA",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Bridegroom Rice",
    "rating": 4.9,
    "reviews": 240,
    "weights": [
      {
        "label": "500g",
        "price": 70,
        "originalPrice": 84
      }
    ],
    "description": "Traditional Red Rice for high energy and physical strength.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 70,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_72.jpg"
  },
  {
    "id": "rm-03",
    "name": "KAATTUYANAM",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Diabetes Control",
    "rating": 4.8,
    "reviews": 180,
    "weights": [
      {
        "label": "500g",
        "price": 110,
        "originalPrice": 140
      },
      {
        "label": "1 kg",
        "price": 210,
        "originalPrice": 260
      }
    ],
    "description": "Native unpolished wild traditional rice.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_73.jpg"
  },
  {
    "id": "rm-04",
    "name": "POONGAR",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Womens Health",
    "rating": 4.9,
    "reviews": 195,
    "weights": [
      {
        "label": "500g",
        "price": 80,
        "originalPrice": 96
      }
    ],
    "description": "Traditional pinkish red rice suitable for idli batter and porridge.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 80,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_74.jpg"
  },
  {
    "id": "rm-05",
    "name": "KARUNKURUVAI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Immunity Rice",
    "rating": 4.8,
    "reviews": 125,
    "weights": [
      {
        "label": "500g",
        "price": 80,
        "originalPrice": 96
      }
    ],
    "description": "Medicinal red rice for nerve health.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 80,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_75.jpg"
  },
  {
    "id": "rm-06",
    "name": "KULLAKAR",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Zinc Rich",
    "rating": 4.7,
    "reviews": 90,
    "weights": [
      {
        "label": "500g",
        "price": 80,
        "originalPrice": 96
      }
    ],
    "description": "Short grain red traditional rice.",
    "origin": "Tamil Nadu",
    "shelfLife": "12 Months",
    "price": 80,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_76.jpg"
  },
  {
    "id": "rm-07",
    "name": "KUTHIRAIVAALI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Barnyard Millet",
    "rating": 4.8,
    "reviews": 150,
    "weights": [
      {
        "label": "250g",
        "price": 45,
        "originalPrice": 54
      },
      {
        "label": "500g",
        "price": 90,
        "originalPrice": 108
      },
      {
        "label": "1kg",
        "price": 170,
        "originalPrice": 204
      }
    ],
    "description": "High fiber Barnyard millet for healthy weight loss.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 45,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_77.jpg"
  },
  {
    "id": "rm-08",
    "name": "THINAI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Foxtail Millet",
    "rating": 4.8,
    "reviews": 160,
    "weights": [
      {
        "label": "250g",
        "price": 40,
        "originalPrice": 48
      },
      {
        "label": "500g",
        "price": 80,
        "originalPrice": 96
      },
      {
        "label": "1kg",
        "price": 150,
        "originalPrice": 180
      }
    ],
    "description": "Foxtail millet grains rich in protein and iron.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 40,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_78.jpg"
  },
  {
    "id": "rm-09",
    "name": "VARAGU",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Kodo Millet",
    "rating": 4.7,
    "reviews": 135,
    "weights": [
      {
        "label": "500g",
        "price": 75,
        "originalPrice": 95
      },
      {
        "label": "1 kg",
        "price": 140,
        "originalPrice": 170
      }
    ],
    "description": "Unpolished Kodo millet for diabetic care.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_79.jpg"
  },
  {
    "id": "rm-10",
    "name": "SAAMAI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Little Millet",
    "rating": 4.8,
    "reviews": 145,
    "weights": [
      {
        "label": "250g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "500g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "1kg",
        "price": 190,
        "originalPrice": 228
      }
    ],
    "description": "Little millet for light digestable meals.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_80.jpg"
  },
  {
    "id": "rm-11",
    "name": "BLACK URID",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Whole Ulundhu",
    "rating": 4.9,
    "reviews": 170,
    "weights": [
      {
        "label": "250g",
        "price": 45,
        "originalPrice": 54
      },
      {
        "label": "500g",
        "price": 85,
        "originalPrice": 102
      },
      {
        "label": "1kg",
        "price": 160,
        "originalPrice": 192
      }
    ],
    "description": "Unpolished black gram dal with skin.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 45,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_81.jpg"
  },
  {
    "id": "rm-12",
    "name": "RAAGI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "Finger Millet",
    "rating": 4.9,
    "reviews": 200,
    "weights": [
      {
        "label": "250g",
        "price": 20,
        "originalPrice": 24
      },
      {
        "label": "500g",
        "price": 40,
        "originalPrice": 48
      },
      {
        "label": "1kg",
        "price": 75,
        "originalPrice": 90
      }
    ],
    "description": "Cleaned whole finger millet grain.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 20,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_82.jpg"
  },
  {
    "id": "ms-01",
    "name": "PEPPER SEED",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Black Gold",
    "rating": 4.9,
    "reviews": 220,
    "weights": [
      {
        "label": "100g",
        "price": 110,
        "originalPrice": 140
      },
      {
        "label": "250g",
        "price": 260,
        "originalPrice": 320
      }
    ],
    "description": "Bold Malabar black pepper seeds.",
    "origin": "Kerala",
    "shelfLife": "18 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_83.jpg"
  },
  {
    "id": "ms-02",
    "name": "JEERAGAM",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Cumin Seeds",
    "rating": 4.8,
    "reviews": 190,
    "weights": [
      {
        "label": "100g",
        "price": 40,
        "originalPrice": 48
      },
      {
        "label": "250g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "500g",
        "price": 200,
        "originalPrice": 240
      },
      {
        "label": "1kg",
        "price": 380,
        "originalPrice": 456
      }
    ],
    "description": "Aromatic cumin seeds.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 40,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_84.jpg"
  },
  {
    "id": "ms-03",
    "name": "SOMBU",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Fennel Seeds",
    "rating": 4.8,
    "reviews": 140,
    "weights": [
      {
        "label": "100g",
        "price": 40,
        "originalPrice": 48
      },
      {
        "label": "250g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "500g",
        "price": 200,
        "originalPrice": 240
      },
      {
        "label": "1kg",
        "price": 380,
        "originalPrice": 456
      }
    ],
    "description": "Sweet green fennel seeds (Saunf).",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 40,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_85.jpg"
  },
  {
    "id": "ms-04",
    "name": "KADUGU",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Mustard Seeds",
    "rating": 4.7,
    "reviews": 110,
    "weights": [
      {
        "label": "100g",
        "price": 20,
        "originalPrice": 24
      },
      {
        "label": "250g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "500g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "1kg",
        "price": 190,
        "originalPrice": 228
      }
    ],
    "description": "Small black mustard seeds for tadka.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 20,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_86.jpg"
  },
  {
    "id": "ms-05",
    "name": "VENTHAYAM",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Fenugreek",
    "rating": 4.8,
    "reviews": 130,
    "weights": [
      {
        "label": "100g",
        "price": 20,
        "originalPrice": 24
      },
      {
        "label": "250g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "500g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "1kg",
        "price": 190,
        "originalPrice": 228
      }
    ],
    "description": "Yellow fenugreek seeds.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 20,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_87.jpg"
  },
  {
    "id": "ms-06",
    "name": "SADHA PATTAI",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Cinnamon Bark",
    "rating": 4.7,
    "reviews": 95,
    "weights": [
      {
        "label": "100g",
        "price": 60,
        "originalPrice": 72
      },
      {
        "label": "500g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "1kg",
        "price": 590,
        "originalPrice": 708
      }
    ],
    "description": "Standard flat cinnamon rolls.",
    "origin": "India",
    "shelfLife": "18 Months",
    "price": 60,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_88.jpg"
  },
  {
    "id": "ms-07",
    "name": "SRILANKA PATTAI",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Ceylon Cinnamon",
    "rating": 5,
    "reviews": 150,
    "weights": [
      {
        "label": "50g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "250g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "500g",
        "price": 1000,
        "originalPrice": 1200
      },
      {
        "label": "1kg",
        "price": 1980,
        "originalPrice": 2376
      }
    ],
    "description": "True soft Ceylon Cinnamon sticks from Sri Lanka.",
    "origin": "Sri Lanka",
    "shelfLife": "24 Months",
    "price": 100,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_89.jpg"
  },
  {
    "id": "ms-08",
    "name": "CLOVE",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Laung",
    "rating": 4.9,
    "reviews": 175,
    "weights": [
      {
        "label": "50g",
        "price": 65,
        "originalPrice": 78
      },
      {
        "label": "250g",
        "price": 325,
        "originalPrice": 390
      },
      {
        "label": "500g",
        "price": 650,
        "originalPrice": 780
      },
      {
        "label": "1kg",
        "price": 1280,
        "originalPrice": 1536
      }
    ],
    "description": "Whole head aromatic cloves (Kirambu).",
    "origin": "Zanzibar",
    "shelfLife": "24 Months",
    "price": 65,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_90.jpg"
  },
  {
    "id": "ms-09",
    "name": "STAR ANISE",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Anasapoo",
    "rating": 4.8,
    "reviews": 120,
    "weights": [
      {
        "label": "50g",
        "price": 55,
        "originalPrice": 66
      },
      {
        "label": "250g",
        "price": 275,
        "originalPrice": 330
      },
      {
        "label": "500g",
        "price": 550,
        "originalPrice": 660
      },
      {
        "label": "1kg",
        "price": 1080,
        "originalPrice": 1296
      }
    ],
    "description": "Whole 8-pointed star anise spice.",
    "origin": "India",
    "shelfLife": "18 Months",
    "price": 55,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_91.jpg"
  },
  {
    "id": "ms-10",
    "name": "OOMAM",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Ajwain",
    "rating": 4.8,
    "reviews": 110,
    "weights": [
      {
        "label": "50g",
        "price": 30,
        "originalPrice": 36
      },
      {
        "label": "250g",
        "price": 150,
        "originalPrice": 180
      },
      {
        "label": "500g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "1kg",
        "price": 580,
        "originalPrice": 696
      }
    ],
    "description": "Carom seeds for digestion and tadka.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 30,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_92.jpg"
  },
  {
    "id": "ms-11",
    "name": "SATHKUPPAI",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Dill Seeds",
    "rating": 4.7,
    "reviews": 65,
    "weights": [
      {
        "label": "50g",
        "price": 30,
        "originalPrice": 36
      },
      {
        "label": "250g",
        "price": 150,
        "originalPrice": 180
      },
      {
        "label": "500g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "1kg",
        "price": 580,
        "originalPrice": 696
      }
    ],
    "description": "Aromatic dill seeds (Sathkuppai).",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 30,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_93.jpg",
    "isFeaturedToday": true
  },
  {
    "id": "ms-12",
    "name": "KARUNJEERAGAM",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Kalonji",
    "rating": 4.9,
    "reviews": 160,
    "weights": [
      {
        "label": "50g",
        "price": 30,
        "originalPrice": 36
      },
      {
        "label": "250g",
        "price": 150,
        "originalPrice": 180
      },
      {
        "label": "500g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "1kg",
        "price": 580,
        "originalPrice": 696
      }
    ],
    "description": "Black seed (Nigella Sativa) kalonji.",
    "origin": "India",
    "shelfLife": "18 Months",
    "price": 30,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_94.jpg"
  },
  {
    "id": "ms-13",
    "name": "BRINJI LEAF",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "Bay Leaf",
    "rating": 4.8,
    "reviews": 90,
    "weights": [
      {
        "label": "50g",
        "price": 15,
        "originalPrice": 18
      },
      {
        "label": "250g",
        "price": 75,
        "originalPrice": 90
      },
      {
        "label": "500g",
        "price": 150,
        "originalPrice": 180
      },
      {
        "label": "1kg",
        "price": 280,
        "originalPrice": 336
      }
    ],
    "description": "Dried Tejpatta bay leaves for biryani.",
    "origin": "India",
    "shelfLife": "12 Months",
    "price": 15,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_95.jpg"
  },
  {
    "id": "sp-01",
    "name": "MUTAVATTUKAL",
    "category": "soup",
    "categoryName": "SOUP",
    "badge": "Kizhi Kizhangu",
    "rating": 4.9,
    "reviews": 140,
    "weights": [
      {
        "label": "50g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 980,
        "originalPrice": 1200
      }
    ],
    "description": "Traditional Mudavattukal kizhangu soup mix for joint pain relief.",
    "origin": "Koli Hills",
    "shelfLife": "9 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_96.jpg"
  },
  {
    "id": "sp-02",
    "name": "MUTAKATTRAAN",
    "category": "soup",
    "categoryName": "SOUP",
    "badge": "Mudakathan Herbal",
    "rating": 4.8,
    "reviews": 180,
    "weights": [
      {
        "label": "50g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 980,
        "originalPrice": 1200
      }
    ],
    "description": "Balloon vine (Mudakathan) leaf herbal soup mix.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_97.jpg"
  },
  {
    "id": "sp-03",
    "name": "VALLARAI",
    "category": "soup",
    "categoryName": "SOUP",
    "badge": "Memory Booster",
    "rating": 4.9,
    "reviews": 165,
    "weights": [
      {
        "label": "50g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 980,
        "originalPrice": 1200
      }
    ],
    "description": "Gotu Kola (Vallarai) brain boosting soup mix.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_98.jpg"
  },
  {
    "id": "sp-04",
    "name": "THUTHUVALAI",
    "category": "soup",
    "categoryName": "SOUP",
    "badge": "Cold & Cough Care",
    "rating": 4.8,
    "reviews": 150,
    "weights": [
      {
        "label": "50g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 980,
        "originalPrice": 1200
      }
    ],
    "description": "Thai Nightshade (Thuthuvalai) herbal soup for respiratory care.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_99.jpg"
  },
  {
    "id": "sp-05",
    "name": "MURUNGAI ILAI",
    "category": "soup",
    "categoryName": "SOUP",
    "badge": "Moringa Soup",
    "rating": 4.9,
    "reviews": 210,
    "weights": [
      {
        "label": "50g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 980,
        "originalPrice": 1200
      }
    ],
    "description": "Moringa drumstick leaf superfood soup powder.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_100.jpg"
  },
  {
    "id": "sp-06",
    "name": "AAVAARAM POO",
    "category": "soup",
    "categoryName": "SOUP",
    "badge": "Tanners Cassia",
    "rating": 4.8,
    "reviews": 115,
    "weights": [
      {
        "label": "50g",
        "price": 50,
        "originalPrice": 60
      },
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "500g",
        "price": 500,
        "originalPrice": 600
      },
      {
        "label": "1kg",
        "price": 980,
        "originalPrice": 1200
      }
    ],
    "description": "Aavaram flower herbal soup for skin and diabetes care.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 50,
    "status": "Active",
    "active": true,
    "image": "https://images.unsplash.com/photo-1508061252966-177bf9f7f457?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "wl-01",
    "name": "Karuppu kahuni kanchi",
    "category": "weight-loss",
    "categoryName": "WEIGHT LOSS PRODUCT",
    "badge": "Detox Porridge",
    "rating": 5,
    "reviews": 195,
    "weights": [
      {
        "label": "250g",
        "price": 120,
        "originalPrice": 144
      }
    ],
    "description": "Black Kavuni rice instant health porridge mix for natural weight loss.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 120,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_101.jpg"
  },
  {
    "id": "wl-02",
    "name": "kefir",
    "category": "weight-loss",
    "categoryName": "WEIGHT LOSS PRODUCT",
    "badge": "Metabolism Drink",
    "rating": 4.9,
    "reviews": 130,
    "weights": [
      {
        "label": "500ml Bottle",
        "price": 190,
        "originalPrice": 240
      }
    ],
    "description": "Probiotic kefir drink to burn belly fat and improve digestive health.",
    "origin": "Natural Ferment",
    "shelfLife": "1 Month",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_102.jpg"
  },
  {
    "id": "wl-03",
    "name": "kumbucha or Scoopy",
    "category": "weight-loss",
    "categoryName": "WEIGHT LOSS PRODUCT",
    "badge": "Fat Burner",
    "rating": 4.8,
    "reviews": 110,
    "weights": [
      {
        "label": "1 SCOBY / 330ml Drink",
        "price": 250,
        "originalPrice": 320
      }
    ],
    "description": "Kombucha organic tea SCOBY starter culture for weight loss detox.",
    "origin": "Natural Ferment",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_103.jpg"
  },
  {
    "id": "wl-04",
    "name": "Redmushroom Black Coffee",
    "category": "weight-loss",
    "categoryName": "WEIGHT LOSS PRODUCT",
    "badge": "Slimming Coffee",
    "rating": 4.9,
    "reviews": 160,
    "weights": [
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Ganoderma Red Mushroom sugar-free black coffee for weight management.",
    "origin": "Malaysia",
    "shelfLife": "12 Months",
    "price": 250,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_104.jpg"
  },
  {
    "id": "hb-01",
    "name": "SAFRON",
    "category": "herbals",
    "categoryName": "HERBALS",
    "badge": "Pure Kumkuma Poo",
    "rating": 5,
    "reviews": 280,
    "weights": [
      {
        "label": "1g Glass Bottle",
        "price": 390,
        "originalPrice": 480
      },
      {
        "label": "2g Pack",
        "price": 750,
        "originalPrice": 920
      }
    ],
    "description": "100% Original Kashmiri Mongra Saffron threads.",
    "origin": "Pampore, Kashmir",
    "shelfLife": "24 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_105.jpg"
  },
  {
    "id": "hb-02",
    "name": "KEFIR",
    "category": "herbals",
    "categoryName": "HERBALS",
    "badge": "Gut Care Culture",
    "rating": 4.9,
    "reviews": 120,
    "weights": [
      {
        "label": "1 Active Culture Pack",
        "price": 350,
        "originalPrice": 450
      }
    ],
    "description": "Live active probiotic herbal kefir grains.",
    "origin": "Natural Ferment",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_106.jpg"
  },
  {
    "id": "hb-03",
    "name": "MUTAVATTUKAL IDLY PODI",
    "category": "herbals",
    "categoryName": "HERBALS",
    "badge": "Herbal Chutney Podi",
    "rating": 4.9,
    "reviews": 175,
    "weights": [
      {
        "label": "200g Pack",
        "price": 160,
        "originalPrice": 200
      },
      {
        "label": "500g Pack",
        "price": 380,
        "originalPrice": 480
      }
    ],
    "description": "Spicy Mudavattukal herbal root idli podi mix.",
    "origin": "Tamil Nadu",
    "shelfLife": "9 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "image": "/images/products/product_107.jpg"
  },
  {
    "id": "vir-1791180887986-0",
    "name": "MILK KEFIR GRAINS",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Premium quality milk kefir grains sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 250,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    "isFeaturedToday": true
  },
  {
    "id": "vir-1791180887986-1",
    "name": "PSHYLIUM HUSK @ ISABGOL",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 150,
        "originalPrice": 180
      },
      {
        "label": "250g",
        "price": 375,
        "originalPrice": 450
      }
    ],
    "description": "Premium quality pshylium husk @ isabgol sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 150,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "vir-1791180887986-2",
    "name": "PATHIMUGAM",
    "category": "viral-product",
    "categoryName": "VIRAL PRODUCT",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 140,
        "originalPrice": 168
      },
      {
        "label": "500g",
        "price": 280,
        "originalPrice": 336
      },
      {
        "label": "1kg",
        "price": 500,
        "originalPrice": 600
      }
    ],
    "description": "Premium quality pathimugam sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 140,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "nut-1791180887986-3",
    "name": "CALIFORNIA REGULAR  ALMOND",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 120,
        "originalPrice": 144
      },
      {
        "label": "250g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "500g",
        "price": 600,
        "originalPrice": 720
      },
      {
        "label": "1kg",
        "price": 1200,
        "originalPrice": 1440
      }
    ],
    "description": "Premium quality california regular  almond sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 120,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "nut-1791180887986-4",
    "name": "CALIFORNIA MINI BOLD  ALMOND",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 330,
        "originalPrice": 396
      },
      {
        "label": "500g",
        "price": 650,
        "originalPrice": 780
      },
      {
        "label": "1kg",
        "price": 1300,
        "originalPrice": 1560
      }
    ],
    "description": "Premium quality california mini bold  almond sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 330,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "nut-1791180887986-5",
    "name": "CALIFORNIA BOLD  ALMOND",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 350,
        "originalPrice": 420
      },
      {
        "label": "500g",
        "price": 700,
        "originalPrice": 840
      },
      {
        "label": "1kg",
        "price": 1380,
        "originalPrice": 1656
      }
    ],
    "description": "Premium quality california bold  almond sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 350,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "nut-1791180887986-6",
    "name": "CASHEW",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "250g",
        "price": 240,
        "originalPrice": 288
      },
      {
        "label": "500g",
        "price": 480,
        "originalPrice": 576
      },
      {
        "label": "1kg",
        "price": 940,
        "originalPrice": 1128
      }
    ],
    "description": "Premium quality cashew sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 100,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "nut-1791180887986-7",
    "name": "HAZALNUT",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 300,
        "originalPrice": 360
      },
      {
        "label": "250g",
        "price": 750,
        "originalPrice": 900
      },
      {
        "label": "500g",
        "price": 1500,
        "originalPrice": 1800
      },
      {
        "label": "1kg",
        "price": 2950,
        "originalPrice": 3540
      }
    ],
    "description": "Premium quality hazalnut sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 300,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "nut-1791180887986-8",
    "name": "STRABERRY",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 85,
        "originalPrice": 102
      },
      {
        "label": "250g",
        "price": 210,
        "originalPrice": 252
      },
      {
        "label": "500g",
        "price": 400,
        "originalPrice": 480
      }
    ],
    "description": "Premium quality straberry sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 85,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
    "isFeaturedToday": false
  },
  {
    "id": "nut-1791180887986-9",
    "name": "BLUBERRY",
    "category": "nuts-dry-fruits",
    "categoryName": "NUTS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 160,
        "originalPrice": 192
      },
      {
        "label": "250g",
        "price": 400,
        "originalPrice": 480
      },
      {
        "label": "500g",
        "price": 780,
        "originalPrice": 936
      }
    ],
    "description": "Premium quality bluberry sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 160,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dat-1791180887986-10",
    "name": "AJWA",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 330,
        "originalPrice": 396
      },
      {
        "label": "1kg",
        "price": 640,
        "originalPrice": 768
      }
    ],
    "description": "Premium quality ajwa sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 330,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dat-1791180887986-11",
    "name": "SAFAVI KALIMA",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 290,
        "originalPrice": 348
      },
      {
        "label": "1kg",
        "price": 560,
        "originalPrice": 672
      }
    ],
    "description": "Premium quality safavi kalima sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 290,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dat-1791180887986-12",
    "name": "KALUTTU",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 220,
        "originalPrice": 264
      },
      {
        "label": "1kg",
        "price": 440,
        "originalPrice": 528
      }
    ],
    "description": "Premium quality kaluttu sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 220,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dat-1791180887986-13",
    "name": "MASAFATI",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 220,
        "originalPrice": 264
      },
      {
        "label": "1kg",
        "price": 440,
        "originalPrice": 528
      }
    ],
    "description": "Premium quality masafati sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 220,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dat-1791180887986-14",
    "name": "BROWN DATES SEED",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 100,
        "originalPrice": 120
      },
      {
        "label": "1kg",
        "price": 200,
        "originalPrice": 240
      }
    ],
    "description": "Premium quality brown dates seed sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 100,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "dat-1791180887986-15",
    "name": "BROWN DATES SEEDLESS",
    "category": "dates",
    "categoryName": "DATES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 145,
        "originalPrice": 174
      },
      {
        "label": "1kg",
        "price": 290,
        "originalPrice": 348
      }
    ],
    "description": "Premium quality brown dates seedless sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 145,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "mal-1791180887986-16",
    "name": "HEALTH MIX POWDER",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 140,
        "originalPrice": 168
      },
      {
        "label": "1kg",
        "price": 280,
        "originalPrice": 336
      }
    ],
    "description": "Premium quality health mix powder sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 140,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "mal-1791180887986-17",
    "name": "MILK KEFIR GRAINS",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Premium quality milk kefir grains sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 250,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "mal-1791180887986-18",
    "name": "BADHAM PISIN",
    "category": "malt-beverages",
    "categoryName": "MALT & BEVERAGES",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 55,
        "originalPrice": 66
      },
      {
        "label": "250g",
        "price": 135,
        "originalPrice": 162
      },
      {
        "label": "500g",
        "price": 270,
        "originalPrice": 324
      }
    ],
    "description": "Premium quality badham pisin sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 55,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "see-1791180887986-19",
    "name": "PUPMKIN",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 70,
        "originalPrice": 84
      },
      {
        "label": "250g",
        "price": 175,
        "originalPrice": 210
      },
      {
        "label": "500g",
        "price": 340,
        "originalPrice": 408
      }
    ],
    "description": "Premium quality pupmkin sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 70,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "see-1791180887986-20",
    "name": "FALX",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 30,
        "originalPrice": 36
      },
      {
        "label": "250g",
        "price": 75,
        "originalPrice": 90
      },
      {
        "label": "500g",
        "price": 140,
        "originalPrice": 168
      }
    ],
    "description": "Premium quality falx sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 30,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "see-1791180887986-21",
    "name": "COCUMER",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 90,
        "originalPrice": 108
      },
      {
        "label": "250g",
        "price": 225,
        "originalPrice": 270
      },
      {
        "label": "500g",
        "price": 440,
        "originalPrice": 528
      }
    ],
    "description": "Premium quality cocumer sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 90,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "see-1791180887986-22",
    "name": "FRIED PEANUT",
    "category": "seeds-items",
    "categoryName": "SEEDS ITEMS",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 55,
        "originalPrice": 66
      },
      {
        "label": "250g",
        "price": 110,
        "originalPrice": 132
      },
      {
        "label": "500g",
        "price": 210,
        "originalPrice": 252
      }
    ],
    "description": "Premium quality fried peanut sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 55,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "ric-1791180887986-23",
    "name": "KARUPPU KAHUNI",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 75,
        "originalPrice": 90
      }
    ],
    "description": "Premium quality karuppu kahuni sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 75,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "ric-1791180887986-24",
    "name": "KAATTUYANA",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "500g",
        "price": 80,
        "originalPrice": 96
      }
    ],
    "description": "Premium quality kaattuyana sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 80,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "ric-1791180887986-25",
    "name": "VARAHU",
    "category": "rice-millet",
    "categoryName": "RICE & MILLET",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 45,
        "originalPrice": 54
      },
      {
        "label": "500g",
        "price": 90,
        "originalPrice": 108
      },
      {
        "label": "1kg",
        "price": 170,
        "originalPrice": 204
      }
    ],
    "description": "Premium quality varahu sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 45,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "mas-1791180887986-26",
    "name": "PEPPER",
    "category": "masala",
    "categoryName": "MASALA",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "100g",
        "price": 90,
        "originalPrice": 108
      },
      {
        "label": "250g",
        "price": 225,
        "originalPrice": 270
      },
      {
        "label": "500g",
        "price": 250,
        "originalPrice": 300
      },
      {
        "label": "1kg",
        "price": 880,
        "originalPrice": 1056
      }
    ],
    "description": "Premium quality pepper sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 90,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "vir-1791180887986-27",
    "name": "MILK KEFIR GRAINS",
    "category": "viral-product",
    "categoryName": "WEIGHT LOSS PRODUCT",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Premium quality milk kefir grains sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 250,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    "id": "vir-1791180887986-28",
    "name": "REDMUSHROOM BLACK COFFEE",
    "category": "viral-product",
    "categoryName": "WEIGHT LOSS PRODUCT",
    "badge": "New Arrival",
    "rating": 4.5,
    "reviews": 12,
    "weights": [
      {
        "label": "250g",
        "price": 250,
        "originalPrice": 300
      }
    ],
    "description": "Premium quality redmushroom black coffee sourced organically.",
    "origin": "India",
    "shelfLife": "6 Months",
    "price": 250,
    "status": "Active",
    "active": true,
    "discountPercent": 15,
    "discount": "15% OFF",
    "stock": 50,
    "ingredients": "100% Natural",
    "storage": "Cool dry place",
    "image": "/images/products/product_104.jpg"
  }
];
