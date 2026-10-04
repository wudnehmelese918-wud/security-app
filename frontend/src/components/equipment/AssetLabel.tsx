'use client';

import QRCode from 'qrcode.react';
import Barcode from '@/components/ui/Barcode';
import { Shield } from 'lucide-react';

export interface AssetLabelData {
  assetId: string;
  ownerName: string;
  universityId: string;
  brand: string;
  model: string;
  serialNumber?: string;
  department?: string;
  blockNumber?: string;
  dormNumber?: string;
}

interface AssetLabelProps {
  asset: AssetLabelData;
  className?: string;
}

export default function AssetLabel({ asset, className = '' }: AssetLabelProps) {
  const qrPayload = JSON.stringify({
    assetId: asset.assetId,
    ownerName: asset.ownerName,
    universityId: asset.universityId,
    x: 1,
  });

  return (
    <div
      className={`border-2 border-black bg-white p-4 rounded-xl text-black flex flex-col items-center justify-between text-center select-none shadow-sm ${className}`}
      style={{ width: '280px', minHeight: '340px' }}
    >
      {/* Header */}
      <div className="w-full pb-2 border-b border-gray-300">
        <div className="flex items-center justify-center gap-1.5 text-dbu-blue">
          <Shield className="w-4 h-4 fill-current" />
          <p className="font-extrabold text-[12px] tracking-wider uppercase">
            Debre Berhan University
          </p>
        </div>
        <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
          Gate Security Asset Clearance Tag
        </p>
      </div>

      {/* Asset ID Banner */}
      <div className="my-1.5 bg-black text-white px-3 py-1 rounded font-mono font-black text-sm tracking-widest">
        {asset.assetId}
      </div>

      {/* QR Code (Scanned for Exit / OUT) */}
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-inner flex flex-col items-center">
        <QRCode value={qrPayload} size={110} level="M" />
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">
          Scan for EXIT (OUT)
        </span>
      </div>

      {/* Barcode (Scanned for Entry / IN) */}
      <div className="w-full flex flex-col items-center">
        <Barcode value={asset.assetId} width={1.6} height={35} displayValue={false} />
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider -mt-1">
          Scan Barcode for ENTRY (IN)
        </span>
      </div>

      {/* Owner & Device Metadata */}
      <div className="w-full pt-2 border-t border-gray-300 text-left text-[10px] space-y-0.5 leading-tight">
        <div className="flex justify-between font-bold">
          <span className="truncate">{asset.ownerName}</span>
          <span className="font-mono text-gray-700 shrink-0 ml-1">{asset.universityId}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-[9px]">
          <span className="truncate">{asset.brand} {asset.model}</span>
          {asset.blockNumber && (
            <span className="shrink-0 ml-1">
              B:{asset.blockNumber} D:{asset.dormNumber || '—'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
