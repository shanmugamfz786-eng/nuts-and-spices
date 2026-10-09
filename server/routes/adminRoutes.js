import express from 'express';
import { getDashboardStats, syncGitCatalog, syncAdminState, getAdminState } from '../controllers/adminController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Allow state to be synced without auth because frontend admin mock bypasses backend JWT
router.post('/state', syncAdminState);
router.get('/state', getAdminState);

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard/stats', getDashboardStats);
router.post('/sync-git', syncGitCatalog);

export default router;
