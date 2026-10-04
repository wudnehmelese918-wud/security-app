import { Router } from 'express';
import { getStats, triggerSeed } from '../controllers/dashboard.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

// Dashboard metrics for Admin and Security Guards
router.get('/stats', authorize('admin', 'assistant'), getStats);

// Database seeding / reset strictly restricted to System Administrator
router.post('/seed', authorize('admin'), triggerSeed);

export default router;
