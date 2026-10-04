import mongoose, { Document, Schema } from 'mongoose';

export type EquipmentType = 'laptop' | 'desktop' | 'tablet' | 'other';
export type EquipmentStatus = 'registered' | 'outside' | 'inside';
export type OwnerType = 'student' | 'staff';

export interface IEquipment {
  _id?: string | mongoose.Types.ObjectId;
  assetId: string; // e.g. DBULT0001
  equipmentType: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  color?: string;

  // Owner info
  ownerType: OwnerType;
  ownerName: string;
  universityId: string; // DBU1...
  department: string;
  year?: string;       // For students
  blockNumber?: string;
  dormNumber?: string;

  // Media
  ownerPhotoUrl?: string;
  equipmentPhotoUrl?: string;
  qrCodeUrl?: string;

  // Status
  status: EquipmentStatus;
  guardNotes?: string;
  registeredBy: mongoose.Types.ObjectId;
  lastExitAt?: Date;
  lastEntryAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const equipmentSchema = new Schema<IEquipment>(
  {
    assetId: { type: String, unique: true, uppercase: true, index: true },
    equipmentType: {
      type: String,
      enum: ['laptop', 'desktop', 'tablet', 'other'],
      required: true,
    },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, trim: true },
    color: { type: String, trim: true },

    ownerType: { type: String, enum: ['student', 'staff'], required: true },
    ownerName: { type: String, required: true, trim: true },
    universityId: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String },
    blockNumber: { type: String },
    dormNumber: { type: String },

    ownerPhotoUrl: { type: String },
    equipmentPhotoUrl: { type: String },
    qrCodeUrl: { type: String },

    status: {
      type: String,
      enum: ['registered', 'outside', 'inside'],
      default: 'registered',
    },
    guardNotes: { type: String },
    registeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastExitAt: { type: Date },
    lastEntryAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate asset ID before validation so required check passes
equipmentSchema.pre('validate', async function (next) {
  if (!this.assetId) {
    const prefix =
      this.equipmentType === 'laptop'
        ? 'DBULT'
        : this.equipmentType === 'desktop'
        ? 'DBUPC'
        : this.equipmentType === 'tablet'
        ? 'DBUTA'
        : 'DBUOT';
    let count = await mongoose.model('Equipment').countDocuments();
    let candidate = `${prefix}${String(count + 1).padStart(4, '0')}`;
    while (await mongoose.model('Equipment').exists({ assetId: candidate })) {
      count++;
      candidate = `${prefix}${String(count + 1).padStart(4, '0')}`;
    }
    this.assetId = candidate;
  }
  next();
});

export const Equipment = mongoose.model<IEquipment>('Equipment', equipmentSchema);
