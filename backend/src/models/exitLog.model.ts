import mongoose, { Document, Schema } from 'mongoose';

export type LogAction = 'exit' | 'entry' | 'reject';

export interface IExitLog extends Document {
  equipment: mongoose.Types.ObjectId;
  assetId: string;
  action: LogAction;
  scannedBy: mongoose.Types.ObjectId;
  note?: string;
  timestamp: Date;
}

const exitLogSchema = new Schema<IExitLog>(
  {
    equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    assetId: { type: String, required: true },
    action: { type: String, enum: ['exit', 'entry', 'reject'], required: true },
    scannedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ExitLog = mongoose.model<IExitLog>('ExitLog', exitLogSchema);
