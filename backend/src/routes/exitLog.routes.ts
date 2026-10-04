import { Router } from 'express';
import { recordScan, getLogs, clearLogs } from '../controllers/exitLog.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { gateScanRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All exit log operations require authentication
router.use(protect);

// Guard and Admin operations
router.get('/', authorize('admin', 'assistant'), getLogs);
router.post('/', authorize('admin', 'assistant'), gateScanRateLimiter, recordScan);

// Destructive actions strictly restricted to Admin
router.delete('/', authorize('admin'), clearLogs);

export default router;
