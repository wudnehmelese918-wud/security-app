import { Request, Response } from 'express';
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';
import { Equipment } from '../models/equipment.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { config } from '../config/env';

const BASE_URL = `http://localhost:${config.PORT}`;

/** POST /api/equipment */
export const createEquipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const ownerPhotoFile = files?.ownerPhoto?.[0];
    const equipmentPhotoFile = files?.equipmentPhoto?.[0];

    // Explicitly generate assetId if not provided
    let assetId = req.body.assetId;
    if (!assetId) {
      const type = req.body.equipmentType || 'laptop';
      const prefix =
        type === 'laptop'
          ? 'DBULT'
          : type === 'desktop'
          ? 'DBUPC'
          : type === 'tablet'
          ? 'DBUTA'
          : 'DBUOT';
      let count = await Equipment.countDocuments();
      let candidate = `${prefix}${String(count + 1).padStart(4, '0')}`;
      while (await Equipment.exists({ assetId: candidate })) {
        count++;
        candidate = `${prefix}${String(count + 1).padStart(4, '0')}`;
      }
      assetId = candidate;
    }

    const equipment = new Equipment({
      ...req.body,
      assetId,
      registeredBy: req.user?.id,
      ownerPhotoUrl: ownerPhotoFile
        ? `${BASE_URL}/uploads/photos/${ownerPhotoFile.filename}`
        : undefined,
      equipmentPhotoUrl: equipmentPhotoFile
        ? `${BASE_URL}/uploads/equipment/${equipmentPhotoFile.filename}`
        : undefined,
    });
    await equipment.save();

    // Generate QR code after we have the assetId
    try {
      const qrDir = path.join(config.UPLOAD_DIR, 'qrcodes');
      if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
      const qrPath = path.join(qrDir, `${equipment.assetId}.png`);
      const qrPayload = JSON.stringify({
        assetId: equipment.assetId,
        ownerName: equipment.ownerName,
        universityId: equipment.universityId,
        brand: equipment.brand,
        model: equipment.model,
        x: 1, // exit permission flag
      });
      await QRCode.toFile(qrPath, qrPayload, { width: 300, margin: 1 });
      equipment.qrCodeUrl = `${BASE_URL}/uploads/qrcodes/${equipment.assetId}.png`;
      await equipment.save();
    } catch (qrErr) {
      console.warn('⚠️ QR Code generation warning:', (qrErr as Error).message);
    }

    res.status(201).json({ success: true, data: equipment });
  } catch (error) {
    console.error('❌ Error creating equipment:', error);
    res.status(400).json({
      success: false,
      message: (error as Error).message || 'Failed to register equipment',
    });
  }
};

/** GET /api/equipment */
export const getEquipment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { status, type, search, page = 1, limit = 20 } = req.query;
  const filter: Record<string, unknown> = {};

  // Role-based visibility: If user is guest, only show their own equipment
  if (req.user?.role === 'guest') {
    filter.$or = [
      { registeredBy: req.user.id },
      { ownerName: { $regex: req.user.fullName || '---', $options: 'i' } },
    ];
  }

  if (status) filter.status = status;
  if (type) filter.equipmentType = type;
  if (search) {
    const searchFilter = [
      { ownerName: { $regex: search, $options: 'i' } },
      { assetId: { $regex: search, $options: 'i' } },
      { universityId: { $regex: search, $options: 'i' } },
      { serialNumber: { $regex: search, $options: 'i' } },
    ];
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchFilter }];
      delete filter.$or;
    } else {
      filter.$or = searchFilter;
    }
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Equipment.find(filter)
      .populate('registeredBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Equipment.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, total, page: Number(page), limit: Number(limit) });
};

/** GET /api/equipment/:id */
export const getEquipmentById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const equipment = await Equipment.findById(req.params.id).populate(
    'registeredBy',
    'fullName email'
  );
  if (!equipment) {
    res.status(404).json({ message: 'Equipment not found' });
    return;
  }

  // RBAC ownership check for guests
  if (req.user?.role === 'guest') {
    const isOwner =
      equipment.registeredBy?.toString() === req.user.id ||
      equipment.ownerName.toLowerCase().includes(req.user.fullName.toLowerCase());
    if (!isOwner) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only view equipment registered under your profile.',
      });
      return;
    }
  }

  res.json({ success: true, data: equipment });
};

/** GET /api/equipment/scan/:assetId */
export const scanEquipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  let search = (req.params.assetId || '').trim();
  try {
    const parsed = JSON.parse(search);
    search = parsed.assetId || parsed.i || parsed.id || parsed.sn || search;
  } catch {
    // raw string
  }
  search = search.toUpperCase();
  const equipment = await Equipment.findOne({
    $or: [
      { assetId: search },
      { assetId: new RegExp(`^${search}$`, 'i') },
      { serialNumber: search },
      { serialNumber: new RegExp(`^${search}$`, 'i') },
    ],
  });
  if (!equipment) {
    res.status(404).json({ message: 'Equipment not found', verdict: 'REJECTED' });
    return;
  }
  res.json({ success: true, data: equipment });
};

/**
 * Public pass verification lookup (used by landing page & public checkpoint pass check)
 * Safe sanitized payload without sensitive student private credentials
 */
export const publicVerifyAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  let search = (req.params.query || '').trim();
  try {
    const parsed = JSON.parse(search);
    search = parsed.assetId || parsed.i || parsed.id || parsed.sn || search;
  } catch {
    // raw string
  }
  search = search.toUpperCase();

  const equipment = await Equipment.findOne({
    $or: [
      { assetId: search },
      { assetId: new RegExp(`^${search}$`, 'i') },
      { serialNumber: search },
      { serialNumber: new RegExp(`^${search}$`, 'i') },
    ],
  });

  if (!equipment) {
    res.status(404).json({
      success: false,
      verified: false,
      message: `No active campus clearance found for identifier "${search}".`,
    });
    return;
  }

  res.json({
    success: true,
    verified: true,
    data: {
      assetId: equipment.assetId,
      equipmentType: equipment.equipmentType,
      brand: equipment.brand,
      model: equipment.model,
      serialNumberMasked: equipment.serialNumber
        ? '••••' + equipment.serialNumber.slice(-4)
        : undefined,
      department: equipment.department,
      status: equipment.status,
      registeredAt: equipment.createdAt,
      lastGateActivity: equipment.lastExitAt || equipment.lastEntryAt,
    },
  });
};

/** PATCH /api/equipment/:id/status */
export const updateEquipmentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.body;
  const equipment = await Equipment.findByIdAndUpdate(
    req.params.id,
    {
      status,
      ...(status === 'outside' ? { lastExitAt: new Date() } : {}),
      ...(status === 'inside' ? { lastEntryAt: new Date() } : {}),
    },
    { new: true }
  );
  if (!equipment) {
    res.status(404).json({ message: 'Equipment not found' });
    return;
  }
  res.json({ success: true, data: equipment });
};

/** PUT /api/equipment/:id */
export const updateEquipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const equipment = await Equipment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!equipment) {
    res.status(404).json({ message: 'Equipment not found' });
    return;
  }
  res.json({ success: true, data: equipment });
};

/** DELETE /api/equipment/:id */
export const deleteEquipment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const equipment = await Equipment.findByIdAndDelete(req.params.id);
  if (!equipment) {
    res.status(404).json({ message: 'Equipment not found' });
    return;
  }
  res.json({ success: true, message: 'Equipment deleted' });
};
