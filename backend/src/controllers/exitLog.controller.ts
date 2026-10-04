import { Request, Response } from 'express';
import { ExitLog } from '../models/exitLog.model';
import { Equipment } from '../models/equipment.model';
import { AuthRequest } from '../middleware/auth.middleware';

/** POST /api/exit-logs  - Record a gate scan */
export const recordScan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { assetId, action = 'exit', note } = req.body;

    if (!assetId) {
      res.status(400).json({ success: false, verdict: 'REJECTED', message: 'No asset identifier provided' });
      return;
    }

    // Parse potential JSON QR payload (handles {assetId:...}, {i:...}, {id:...}, {sn:...})
    let rawStr = String(assetId).trim();
    let searchId = rawStr;
    try {
      const parsed = JSON.parse(rawStr);
      searchId = parsed.assetId || parsed.i || parsed.id || parsed.sn || rawStr;
    } catch {
      // Plain barcode string
    }
    searchId = String(searchId).trim().toUpperCase();

    // Find equipment by assetId (case-insensitive) or by serialNumber (case-insensitive)
    const equipment = await Equipment.findOne({
      $or: [
        { assetId: searchId },
        { assetId: new RegExp(`^${searchId}$`, 'i') },
        { serialNumber: searchId },
        { serialNumber: new RegExp(`^${searchId}$`, 'i') },
      ],
    });

    if (!equipment) {
      const log = await ExitLog.create({
        equipment: null,
        assetId: searchId,
        action: 'reject',
        scannedBy: req.user?.id,
        note: `Asset "${searchId}" not found in system`,
      });
      res.status(404).json({
        success: false,
        verdict: 'REJECTED',
        message: `Asset "${searchId}" not found. Verify asset ID or register equipment first.`,
        log,
      });
      return;
    }

    // Context note if status was already matching
    let auditNote = note || '';
    if (action === 'exit' && equipment.status === 'outside') {
      auditNote = auditNote ? `${auditNote} (Re-exit logged)` : 'Re-exit logged (was already outside)';
    } else if (action === 'entry' && equipment.status === 'inside') {
      auditNote = auditNote ? `${auditNote} (Re-entry logged)` : 'Re-entry logged (was already inside)';
    }

    const newStatus = action === 'exit' ? 'outside' : 'inside';
    equipment.status = newStatus;
    if (action === 'exit') equipment.lastExitAt = new Date();
    if (action === 'entry') equipment.lastEntryAt = new Date();
    await equipment.save();

    const log = await ExitLog.create({
      equipment: equipment._id,
      assetId: equipment.assetId,
      action,
      scannedBy: req.user?.id,
      note: auditNote || undefined,
    });

    res.status(200).json({
      success: true,
      verdict: 'APPROVED',
      equipment,
      log,
      message:
        action === 'exit'
          ? 'CLEARANCE GRANTED: Equipment authorized to leave campus.'
          : 'CHECK-IN VERIFIED: Equipment returned safely inside campus.',
    });
  } catch (error) {
    console.error('Error recording scan:', error);
    res.status(500).json({
      success: false,
      verdict: 'REJECTED',
      message: (error as Error).message || 'Failed to record gate scan',
    });
  }
};

/** GET /api/exit-logs */
export const getLogs = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 50, assetId, action } = req.query;
  const filter: Record<string, unknown> = {};
  if (assetId) filter.assetId = { $regex: String(assetId), $options: 'i' };
  if (action && action !== 'all') filter.action = action;
  const skip = (Number(page) - 1) * Number(limit);
  const [logs, total] = await Promise.all([
    ExitLog.find(filter)
      .populate('scannedBy', 'fullName email')
      .populate('equipment', 'assetId ownerName universityId brand model ownerPhotoUrl equipmentPhotoUrl department blockNumber dormNumber year status')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ExitLog.countDocuments(filter),
  ]);
  res.json({ success: true, data: logs, total, page: Number(page), limit: Number(limit) });
};

/** DELETE /api/exit-logs - Clear all logs (admin only) */
export const clearLogs = async (_req: Request, res: Response): Promise<void> => {
  await ExitLog.deleteMany({});
  res.json({ success: true, message: 'Exit logs cleared successfully' });
};

