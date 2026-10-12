export const INITIAL_STORE_SETTINGS = {
  storeName: 'HAJI NUTS & SPICES',
  logoUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200',
  whatsappNumber: '919876543210',
  phone: '+91 98765 43210',
  email: 'orders@nutsandspices.store',
  address: '124, Gourmet Spice Market Road, T. Nagar, Chennai - 600017',
  deliveryCharge: 50,
  minOrderAmount: 500,
  instagram: 'https://instagram.com/nutsandspices',
  facebook: 'https://facebook.com/nutsandspices'
};

export const INITIAL_ORDERS = [
  {
    orderId: '1789792548000',
    customerName: 'Rakkammal',
    phone: '9876543210',
    email: 'rakkammal@gmail.com',
    address: 'Main Street',
    city: 'Kalingapatti',
    pincode: '627756',
    date: '19 Sept 2026',
    status: 'Pending',
    total: 3287,
    items: [
      { productId: 'vp-01', name: 'Viral Saffron Cardamom Wellness Elixir', weight: '500g Jar', price: 890, quantity: 2 },
      { productId: 'ndf-01', name: 'California Jumbo Almonds (Badam)', weight: '1 kg', price: 1507, quantity: 1 }
    ],
    notes: 'Urgent delivery requested.'
  },
  {
    orderId: 'NS10025',
    customerName: 'Ramesh Kumar',
    phone: '9876543210',
    email: 'ramesh.k@gmail.com',
    address: '45, North Usman Road, T. Nagar, Chennai - 600017',
    city: 'Chennai',
    pincode: '600017',
    date: '2026-09-18',
    status: 'NEW',
    total: 1447,
    items: [
      { productId: 'vp-01', name: 'Viral Saffron Cardamom Wellness Elixir', weight: '500g Jar', price: 890, quantity: 1 },
      { productId: 'ndf-01', name: 'California Jumbo Almonds (Badam)', weight: '250g', price: 340, quantity: 1 },
      { productId: 'sp-01', name: 'Nourishing Organic Herbal Soup Powder', weight: '150g Box', price: 190, quantity: 1 }
    ],
    notes: 'Please pack in gift wrap.'
  },
  {
    orderId: 'NS10024',
    customerName: 'Customer 2 (Priya Sharma)',
    phone: '9876543211',
    email: 'priya.s@yahoo.com',
    address: '12, 3rd Main Road, Anna Nagar, Chennai - 600040',
    city: 'Chennai',
    pincode: '600040',
    date: '2026-09-18',
    status: 'CONFIRMED',
    total: 899,
    items: [
      { productId: 'vp-01', name: 'Viral Saffron Cardamom Wellness Elixir', weight: '500g Jar', price: 890, quantity: 1 }
    ],
    notes: 'Leave at door step.'
  },
  {
    orderId: 'NS10023',
    customerName: 'Customer 3 (Anand Sundaram)',
    phone: '9876543212',
    email: 'anand.sun@gmail.com',
    address: '88, LB Road, Adyar, Chennai - 600020',
    city: 'Chennai',
    pincode: '600020',
    date: '2026-09-17',
    status: 'DELIVERED',
    total: 650,
    items: [
      { productId: 'ndf-01', name: 'California Jumbo Almonds (Badam)', weight: '500g', price: 650, quantity: 1 }
    ],
    notes: ''
  },
  {
    orderId: 'NS10022',
    customerName: 'Kavitha Swaminathan',
    phone: '9876543213',
    email: 'kavitha.s@hotmail.com',
    address: '22, Velachery Main Road, Chennai - 600042',
    city: 'Chennai',
    pincode: '600042',
    date: '2026-09-16',
    status: 'PREPARING',
    total: 1250,
    items: [
      { productId: 'dt-02', name: 'Premium Ajwa Al-Madinah Dates', weight: '500g', price: 1250, quantity: 1 }
    ],
    notes: 'Fast delivery requested'
  },
  {
    orderId: 'NS10021',
    customerName: 'Suresh Babu',
    phone: '9876543214',
    email: 'suresh.babu@gmail.com',
    address: '10, Mount Road, Guindy, Chennai - 600032',
    city: 'Chennai',
    pincode: '600032',
    date: '2026-09-15',
    status: 'OUT FOR DELIVERY',
    total: 1780,
    items: [
      { productId: 'ndf-02', name: 'W240 King Size Whole Cashews (Kaju)', weight: '1 kg', price: 1390, quantity: 1 },
      { productId: 'hn-01', name: 'Raw Unprocessed Forest Honey', weight: '250g Bottle', price: 240, quantity: 1 }
    ],
    notes: ''
  },
  {
    orderId: 'NS10012',
    customerName: 'Customer 1 (Ramesh Kumar)',
    phone: '9876543210',
    email: 'ramesh.k@gmail.com',
    address: '45, North Usman Road, T. Nagar, Chennai - 600017',
    city: 'Chennai',
    pincode: '600017',
    date: '2026-09-10',
    status: 'DELIVERED',
    total: 2100,
    items: [
      { productId: 'ndf-01', name: 'California Jumbo Almonds (Badam)', weight: '1 kg', price: 1250, quantity: 1 },
      { productId: 'hn-01', name: 'Raw Unprocessed Forest Honey', weight: '1 kg Bottle', price: 820, quantity: 1 }
    ],
    notes: ''
  },
  {
    orderId: 'NS10005',
    customerName: 'Customer 1 (Ramesh Kumar)',
    phone: '9876543210',
    email: 'ramesh.k@gmail.com',
    address: '45, North Usman Road, T. Nagar, Chennai - 600017',
    city: 'Chennai',
    pincode: '600017',
    date: '2026-08-28',
    status: 'DELIVERED',
    total: 980,
    items: [
      { productId: 'ndf-03', name: 'Afghan Sun-Dried Anjeer (Figs)', weight: '500g', price: 870, quantity: 1 }
    ],
    notes: ''
  }
];

export const INITIAL_OFFERS = [
  {
    id: 'off-01',
    name: '20% OFF – Premium Nuts',
    discountPercent: 20,
    applicableCategory: 'nuts-dry-fruits',
    applicableCategoryName: 'Nuts & Dry Fruits',
    minOrderAmount: 999,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'ACTIVE'
  },
  {
    id: 'off-02',
    name: '15% OFF – Royal Dates Harvest',
    discountPercent: 15,
    applicableCategory: 'dates',
    applicableCategoryName: 'Dates',
    minOrderAmount: 500,
    startDate: '2026-09-10',
    endDate: '2026-10-15',
    status: 'ACTIVE'
  },
  {
    id: 'off-03',
    name: 'Festive Gourmet Spice Combo 25% OFF',
    discountPercent: 25,
    applicableCategory: 'masala',
    applicableCategoryName: 'Masala & Spices',
    minOrderAmount: 750,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    status: 'SCHEDULED'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-01',
    productName: 'Viral Saffron Cardamom Wellness Elixir',
    productId: 'vp-01',
    customerName: 'Meenakshi Iyer',
    rating: 5,
    comment: 'Extremely fresh and authentic saffron aroma! Drinking this every night with warm milk.',
    date: '2026-09-17',
    status: 'APPROVED'
  },
  {
    id: 'rev-02',
    productName: 'California Jumbo Almonds (Badam)',
    productId: 'ndf-01',
    customerName: 'Karthik Raja',
    rating: 5,
    comment: 'Super crunchy badam, uniform size. Very fast delivery via WhatsApp order!',
    date: '2026-09-16',
    status: 'APPROVED'
  },
  {
    id: 'rev-03',
    productName: 'Raw Unprocessed Forest Honey',
    productId: 'hn-01',
    customerName: 'Divya Narayanan',
    rating: 4,
    comment: 'Pure honey texture, crystallizes naturally in cool weather. Great taste.',
    date: '2026-09-15',
    status: 'PENDING'
  },
  {
    id: 'rev-04',
    productName: 'Handcrafted Heritage Royal Garam Masala',
    productId: 'ms-01',
    customerName: 'Sanjay Kumar',
    rating: 5,
    comment: 'Aroma is unbelievable! Very authentic South Indian blend.',
    date: '2026-09-14',
    status: 'APPROVED'
  }
];

export const INITIAL_COMBO_DEALS = [
  {
    id: 'combo-royal-01',
    name: 'Royal Mughal Imperial Dry Fruit Hamper',
    category: 'gift-hampers',
    categoryLabel: 'Royal Gift Hampers',
    badge: '👑 FESTIVE BESTSELLER',
    badgeColor: 'bg-amber-500 text-white',
    rating: 4.9,
    reviewsCount: 168,
    status: 'ACTIVE',
    description: 'Handcrafted luxury gift presentation packed with jumbo California almonds, royal whole cashews, Iranian roasted pistachios and rich Arabian dates. Includes greeting card & brass satin ribbon.',
    items: [
      '250g Jumbo California Almonds (Badam)',
      '250g W240 Royal Whole Cashews (Kaju)',
      '250g Roasted Salted Iranian Pistachios (Pista)',
      '250g Arabian Safawi Royal Dates',
      'Complimentary Handcrafted Gift Box'
    ],
    weights: [
      { label: '1 KG ROYAL BOX', price: 1449, originalPrice: 1899 },
      { label: '2 KG GRAND HAMPER', price: 2799, originalPrice: 3699 }
    ],
    image: '/images/combo_banner.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-immunity-02',
    name: 'Kashmir Saffron & Superfoods Immunity Elixir',
    category: 'wellness',
    categoryLabel: 'Health & Wellness',
    badge: '⚡ IMMUNITY SHIELD',
    badgeColor: 'bg-emerald-600 text-white',
    rating: 5.0,
    reviewsCount: 94,
    status: 'ACTIVE',
    description: 'Pure certified Kashmiri Mongra saffron combined with fragrant green cardamom, organic mamra almonds, and walnut kernels for maximum vitality and glowing health.',
    items: [
      '1g Pure Kashmir Mongra Saffron (Kesar)',
      '50g Royal Green Cardamom (Elaichi)',
      '250g Kashmiri Mamra High-Oil Almonds',
      '250g Organic Akhrot (Kashmiri Walnut Kernels)'
    ],
    weights: [
      { label: 'STANDARD BOOSTER PACK', price: 1299, originalPrice: 1650 },
      { label: 'DOUBLE REFILL PACK', price: 2499, originalPrice: 3199 }
    ],
    image: '/images/products/product_1.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-biryani-03',
    name: 'South Indian Grand Biryani & Royal Masala Kit',
    category: 'spices',
    categoryLabel: 'Masterchef Spices',
    badge: '🌶️ CHEF SIGNATURE',
    badgeColor: 'bg-rose-600 text-white',
    rating: 4.8,
    reviewsCount: 120,
    status: 'ACTIVE',
    description: 'Authentic Sowcarpet aromatic whole spice kit. Handpicked direct from Western Ghats and Malabar plantations for restaurant-style fragrant biryanis and royal curries.',
    items: [
      '100g Zanzibar Extra Aromatic Cloves (Lavang)',
      '100g Star Anise (Chakra Phool)',
      '100g Tellicherry Bold Black Pepper',
      '100g Ceylon Cinnamon Sticks (Dalchini)',
      '50g Green Cardamom Extra Large',
      '200g Kashmiri Bright Degi Mirch'
    ],
    weights: [
      { label: 'MASTER CHEF 6-PIECE KIT (650G)', price: 749, originalPrice: 999 },
      { label: 'RESTAURANT MEGA PACK (1.3 KG)', price: 1399, originalPrice: 1899 }
    ],
    image: '/images/products/product_6.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-energy-04',
    name: 'Daily Energy & Workout Power Snack Pack',
    category: 'wellness',
    categoryLabel: 'Health & Wellness',
    badge: '💪 DAILY POWER',
    badgeColor: 'bg-blue-600 text-white',
    rating: 4.9,
    reviewsCount: 88,
    status: 'ACTIVE',
    description: 'The ultimate wholesome fuel pack for active professionals, students, and fitness enthusiasts. High in protein, natural dietary fiber, and healthy omega fatty acids.',
    items: [
      '500g Crunchy California Almonds',
      '250g Seedless Afghan Black Kishmish',
      '200g Roasted 5-Seeds Trail Mix (Chia, Pumpkin, Flax, Sunflower)',
      '250g Royal Medjool Soft Dates'
    ],
    weights: [
      { label: '1.2 KG MONTHLY PACK', price: 949, originalPrice: 1250 },
      { label: '2.4 KG FAMILY FITNESS PACK', price: 1799, originalPrice: 2399 }
    ],
    image: '/images/products/product_2.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-potli-05',
    name: 'Festive Celebration Dry Fruit Potli (Set of 4)',
    category: 'gift-hampers',
    categoryLabel: 'Royal Gift Hampers',
    badge: '🎉 CELEBRATION SPECIAL',
    badgeColor: 'bg-amber-600 text-white',
    rating: 4.9,
    reviewsCount: 142,
    status: 'ACTIVE',
    description: 'Four elegant traditional velvet embroidered potli drawstring pouches filled with premium grade dry fruits. Ready for wedding return favors and festive gifting.',
    items: [
      '150g Roasted Salted Cashews in Golden Potli',
      '150g California Roasted Almonds in Red Potli',
      '150g Afghan Kishmish in Emerald Potli',
      '150g Salted Pistachios in Royal Blue Potli'
    ],
    weights: [
      { label: 'SET OF 4 POTLIS (600G)', price: 899, originalPrice: 1199 },
      { label: 'SET OF 8 POTLIS (1.2 KG)', price: 1699, originalPrice: 2299 }
    ],
    image: '/images/products/product_5.jpg',
    fastDelivery: false
  },
  {
    id: 'combo-snacks-06',
    name: 'Gourmet Roasted & Flavoured Snacking Trio',
    category: 'budget',
    categoryLabel: 'Under ₹999 Deals',
    badge: '🍿 CRUNCHY SNACK',
    badgeColor: 'bg-purple-600 text-white',
    rating: 4.8,
    reviewsCount: 76,
    status: 'ACTIVE',
    description: 'Zero oil roasted premium nuts coated with lip-smacking gourmet spices. Perfect for evening tea, office breaks, and weekend gatherings.',
    items: [
      '200g Spicy Peri-Peri Whole Cashews',
      '200g Smoked Barbecue Roasted Almonds',
      '200g Himalayan Pink Salt Crunchy Pistachios'
    ],
    weights: [
      { label: 'TRIO PACK (600G)', price: 799, originalPrice: 1050 },
      { label: 'MEGA TRIO PACK (1.2 KG)', price: 1499, originalPrice: 1999 }
    ],
    image: '/images/products/product_11.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-sweet-07',
    name: 'Sowcarpet Royal Sweet & Kheer Essentials',
    category: 'budget',
    categoryLabel: 'Under ₹999 Deals',
    badge: '🍨 SWEET DELIGHTS',
    badgeColor: 'bg-amber-700 text-white',
    rating: 4.9,
    reviewsCount: 65,
    status: 'ACTIVE',
    description: 'Traditional ingredients specially handpicked for festive payasam, halwa, kheer, and authentic royal Indian sweets with unforgettable rich aroma.',
    items: [
      '250g Kashmiri Snow White Walnut Kernels',
      '100g Charoli / Chironji Seeds',
      '50g Extra Fragrant Green Cardamom Powder',
      '100g Silver-Cut Slivers of Pista & Badam'
    ],
    weights: [
      { label: 'DESSERT MASTER PACK (500G)', price: 849, originalPrice: 1150 }
    ],
    image: '/images/products/product_14.jpg',
    fastDelivery: true
  },
  {
    id: 'combo-budget-08',
    name: 'Student & Office Pocket Energy Duo',
    category: 'budget',
    categoryLabel: 'Under ₹999 Deals',
    badge: '⚡ VALUE PACK',
    badgeColor: 'bg-teal-700 text-white',
    rating: 4.7,
    reviewsCount: 114,
    status: 'ACTIVE',
    description: 'A pocket-friendly, high-nutrition essential pairing of California raw almonds and naturally sweet Afghan green kishmish.',
    items: [
      '250g California Raw Crunchy Almonds',
      '250g Natural Afghan Long Green Kishmish'
    ],
    weights: [
      { label: '500G POCKET DUO', price: 499, originalPrice: 650 },
      { label: '1 KG COMBO DUO', price: 899, originalPrice: 1200 }
    ],
    image: '/images/products/product_4.jpg',
    fastDelivery: true
  }
];

