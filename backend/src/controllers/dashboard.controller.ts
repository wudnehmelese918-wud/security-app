import { Request, Response } from 'express';
import { Equipment } from '../models/equipment.model';
import { ExitLog } from '../models/exitLog.model';
import { User } from '../models/user.model';

/** GET /api/dashboard/stats */
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const [
    totalEquipment,
    outside,
    inside,
    registered,
    totalLogs,
    totalUsers,
    recentLogs,
  ] = await Promise.all([
    Equipment.countDocuments(),
    Equipment.countDocuments({ status: 'outside' }),
    Equipment.countDocuments({ status: 'inside' }),
    Equipment.countDocuments({ status: 'registered' }),
    ExitLog.countDocuments(),
    User.countDocuments(),
    ExitLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('equipment', 'assetId ownerName brand model ownerPhotoUrl')
      .populate('scannedBy', 'fullName'),
  ]);

  res.json({
    success: true,
    data: {
      totalEquipment,
      outside,
      inside,
      registered,
      totalLogs,
      totalUsers,
      recentLogs,
    },
  });
};

/** POST /api/dashboard/seed */
export const triggerSeed = async (_req: Request, res: Response): Promise<void> => {
  const { seedDatabase } = await import('../config/seed');
  await seedDatabase();
  res.json({ success: true, message: 'Sample data seeded successfully' });
};

