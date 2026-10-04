import { Router } from 'express';
import {
  createEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
  updateEquipmentStatus,
  deleteEquipment,
  scanEquipment,
} from '../controllers/equipment.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { gateScanRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All equipment routes require authentication
router.use(protect);

router.get('/', getEquipment);
router.get('/scan/:assetId', gateScanRateLimiter, scanEquipment);
router.get('/:id', getEquipmentById);

// Staff and Guard actions
router.post(
  '/',
  authorize('admin', 'assistant'),
  upload.fields([
    { name: 'ownerPhoto', maxCount: 1 },
    { name: 'equipmentPhoto', maxCount: 1 },
  ]),
  createEquipment
);

router.put('/:id', authorize('admin', 'assistant'), updateEquipment);
router.patch('/:id/status', authorize('admin', 'assistant'), updateEquipmentStatus);

// Admin-only destructive operations
router.delete('/:id', authorize('admin'), deleteEquipment);

export default router;
