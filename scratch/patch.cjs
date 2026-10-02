const fs = require('fs');
const file = './src/context/CartContext.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add API imports
if (!code.includes('fetchAdminStateApi')) {
  code = code.replace(
    /import \{ createCategory as createCategoryApi.*\} from '..\/api\/categoryApi';/,
    `import { createCategory as createCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from '../api/categoryApi';\nimport { fetchAdminStateApi, syncAdminStateApi } from '../api/index.js';`
  );
}

// 2. Add sync function
if (!code.includes('syncAdminStateToCloud')) {
  const syncFunc = `
  const syncAdminStateToCloud = async (newStates = {}) => {
    try {
      const payload = {
        orders: newStates.orders || orders,
        offers: newStates.offers || offers,
        reviews: newStates.reviews || reviews,
        storeSettings: newStates.storeSettings || storeSettings,
        registeredUsers: newStates.registeredUsers || registeredUsers
      };
      await syncAdminStateApi(payload);
    } catch(err) {}
  };

`;
  code = code.replace('// USER AUTH HANDLERS', syncFunc + '// USER AUTH HANDLERS');
}

// 3. Add load effect
if (!code.includes('fetchAdminStateApi()')) {
  const loadEffect = `
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const res = await fetchAdminStateApi();
        if (res && res.success && res.data) {
          if (res.data.orders && res.data.orders.length > 0) setOrders(res.data.orders);
          if (res.data.offers && res.data.offers.length > 0) setOffers(res.data.offers);
          if (res.data.reviews && res.data.reviews.length > 0) setReviews(res.data.reviews);
          if (res.data.storeSettings) setStoreSettings(res.data.storeSettings);
          if (res.data.registeredUsers && res.data.registeredUsers.length > 0) setRegisteredUsers(res.data.registeredUsers);
        }
      } catch(err) {}
    };
    loadAdmin();
  }, []);

`;
  code = code.replace('// Helper to reset store state', loadEffect + '  // Helper to reset store state');
}

// 4. Update CRUD handlers to call syncAdminStateToCloud
code = code.replace(
  /setOrders\(prev => \[\n?\s*newOrderObj,\n?\s*\.\.\.prev\n?\s*\]\);/g,
  `setOrders(prev => { const upd = [newOrderObj, ...prev]; syncAdminStateToCloud({ orders: upd }); return upd; });`
);
code = code.replace(
  /setOrders\(prev => prev\.map\(o => o\.orderId === orderId \? \{ \.\.\.o, status: newStatus \} : o\)\);/g,
  `setOrders(prev => { const upd = prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o); syncAdminStateToCloud({ orders: upd }); return upd; });`
);
code = code.replace(
  /setOrders\(prev => prev\.filter\(o => o\.orderId !== orderId\)\);/g,
  `setOrders(prev => { const upd = prev.filter(o => o.orderId !== orderId); syncAdminStateToCloud({ orders: upd }); return upd; });`
);

code = code.replace(
  /setOffers\(prev => \[\n?\s*newOffer,\n?\s*\.\.\.prev\n?\s*\]\);/g,
  `setOffers(prev => { const upd = [newOffer, ...prev]; syncAdminStateToCloud({ offers: upd }); return upd; });`
);
code = code.replace(
  /setOffers\(prev => prev\.map\(off => off\.id === offerId \? \{ \.\.\.off, \.\.\.updatedFields \} : off\)\);/g,
  `setOffers(prev => { const upd = prev.map(off => off.id === offerId ? { ...off, ...updatedFields } : off); syncAdminStateToCloud({ offers: upd }); return upd; });`
);
code = code.replace(
  /setOffers\(prev => prev\.filter\(off => off\.id !== offerId\)\);/g,
  `setOffers(prev => { const upd = prev.filter(off => off.id !== offerId); syncAdminStateToCloud({ offers: upd }); return upd; });`
);

code = code.replace(
  /setReviews\(prev => \[\n?\s*newRev,\n?\s*\.\.\.prev\n?\s*\]\);/g,
  `setReviews(prev => { const upd = [newRev, ...prev]; syncAdminStateToCloud({ reviews: upd }); return upd; });`
);
code = code.replace(
  /setReviews\(prev => prev\.map\(r => r\.id === reviewId \? \{ \.\.\.r, status: newStatus \} : r\)\);/g,
  `setReviews(prev => { const upd = prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r); syncAdminStateToCloud({ reviews: upd }); return upd; });`
);
code = code.replace(
  /setReviews\(prev => prev\.filter\(r => r\.id !== reviewId\)\);/g,
  `setReviews(prev => { const upd = prev.filter(r => r.id !== reviewId); syncAdminStateToCloud({ reviews: upd }); return upd; });`
);

code = code.replace(
  /setStoreSettings\(prev => \(\{ \.\.\.prev, \.\.\.newSettings \}\)\);/g,
  `setStoreSettings(prev => { const upd = { ...prev, ...newSettings }; syncAdminStateToCloud({ storeSettings: upd }); return upd; });`
);

// Special patch for setRegisteredUsers in registerUser
code = code.replace(
  /setRegisteredUsers\(prev => \{\n\s*const filtered = prev\.filter\(u => \n\s*!\(u\.phone && u\.phone === newUser\.phone\) && \n\s*!\(u\.email && u\.email\.toLowerCase\(\) === newUser\.email\.toLowerCase\(\)\)\n\s*\);\n\s*return \[\.\.\.filtered, newUser\];\n\s*\}\);/g,
  `setRegisteredUsers(prev => {
      const filtered = prev.filter(u => 
        !(u.phone && u.phone === newUser.phone) && 
        !(u.email && u.email.toLowerCase() === newUser.email.toLowerCase())
      );
      const upd = [...filtered, newUser];
      syncAdminStateToCloud({ registeredUsers: upd });
      return upd;
    });`
);

fs.writeFileSync(file, code, 'utf8');
console.log('CartContext patched successfully.');
