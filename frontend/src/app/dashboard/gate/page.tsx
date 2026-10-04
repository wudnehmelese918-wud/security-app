'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { api } from '@/lib/api';
import {
  Shield,
  CheckCircle,
  XCircle,
  Camera,
  RefreshCw,
  QrCode,
  Barcode,
  Keyboard,
  AlertTriangle,
  User,
  Laptop,
  Upload,
  Pause,
  Play,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { sounds } from '@/lib/sound';

type ScanMode = 'exit' | 'entry';
type Verdict = 'APPROVED' | 'REJECTED' | null;

interface EquipmentDetail {
  _id: string;
  assetId: string;
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  color?: string;
  ownerType: string;
  ownerName: string;
  universityId: string;
  department?: string;
  year?: string;
  blockNumber?: string;
  dormNumber?: string;
  ownerPhotoUrl?: string;
  equipmentPhotoUrl?: string;
  qrCodeUrl?: string;
  status: string;
  guardNotes?: string;
  lastExitAt?: string;
  lastEntryAt?: string;
  createdAt?: string;
}

interface ScanResult {
  verdict: Verdict;
  message: string;
  equipment?: EquipmentDetail;
  action: ScanMode;
}

export default function GatePage() {
  const { toast } = useToast();
  const [mode, setMode] = useState<ScanMode>('exit');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [usbInput, setUsbInput] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [camStatus, setCamStatus] = useState<string>('');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const usbInputRef = useRef<HTMLInputElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultMode = localStorage.getItem('dbu_default_mode');
      if (defaultMode === 'exit' || defaultMode === 'entry') {
        setMode(defaultMode);
      }
    }
  }, []);

  // Auto-focus USB scanner input on load or when verdict clears
  useEffect(() => {
    if (!scanning && !processing && !scanResult) {
      usbInputRef.current?.focus();
    }
  }, [scanning, processing, scanResult]);

  // Handle auto-reset countdown after verdict
  useEffect(() => {
    if (!scanResult || isPaused) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (!isPaused) setCountdown(null);
      return;
    }

    const resetSecStr = localStorage.getItem('dbu_auto_reset');
    const resetSec = resetSecStr !== null ? Number(resetSecStr) : 4;

    if (resetSec > 0) {
      setCountdown(resetSec);
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            setScanResult(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [scanResult, isPaused]);

  // Global listener for USB / Bluetooth hardware wedge scanners
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const onGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a non-scanner input
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.id !== 'usb-scanner') {
        return;
      }

      const now = Date.now();
      // Hardware barcode scanners type very rapidly (< 100ms per character)
      if (now - lastKeyTime > 150) {
        buffer = '';
      }
      lastKeyTime = now;

      if (e.key === 'Enter' || e.key === 'Tab') {
        if (buffer.trim().length >= 3) {
          e.preventDefault();
          const code = buffer.trim();
          buffer = '';
          handleScan(code);
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [mode, processing]);

  const startScanner = async () => {
    setScanResult(null);
    setScanning(true);
    setCamStatus('Initializing camera...');

    try {
      // Wait for DOM
      await new Promise((r) => setTimeout(r, 100));
      const el = document.getElementById('qr-reader');
      if (!el) throw new Error('Scanner element not found in DOM');

      // Stop previous instance if any
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          await scannerRef.current.clear();
        } catch {}
        scannerRef.current = null;
      }

      const html5Qr = new Html5Qrcode('qr-reader', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
        ],
        verbose: false,
      });
      scannerRef.current = html5Qr;

      const scanConfig = { fps: 15, qrbox: { width: 280, height: 200 } };
      const onScanSuccess = async (decodedText: string) => {
        stopScanner();
        await handleScan(decodedText);
      };

      // Try environment (back/rear camera) first, then fallback to user webcam
      try {
        await html5Qr.start({ facingMode: 'environment' }, scanConfig, onScanSuccess, () => {});
        setCamStatus('Camera active (Environment/Rear). Align barcode or QR code.');
      } catch (envErr) {
        console.warn('Environment camera unavailable, falling back to webcam:', envErr);
        await html5Qr.start({ facingMode: 'user' }, scanConfig, onScanSuccess, () => {});
        setCamStatus('Webcam active. Hold label in front of camera.');
      }
    } catch (err: unknown) {
      console.error('Camera startup error:', err);
      const msg = (err as Error)?.message || 'Camera blocked or unavailable';
      setScanning(false);
      setCamStatus('');
      toast({
        title: 'Camera Access Error',
        description: msg.includes('Permission') || msg.includes('NotAllowed')
          ? 'Camera permission denied. Please allow camera access in your browser address bar.'
          : 'Could not access webcam. You can also use the USB scanner or Upload Image button below.',
        variant: 'destructive',
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (e) {
        console.warn('Error clearing scanner:', e);
      }
      scannerRef.current = null;
    }
    setScanning(false);
    setCamStatus('');
  };

  // Image upload scan fallback
  const handleScanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const tempScanner = new Html5Qrcode('qr-reader-temp', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
        ],
        verbose: false,
      });
      const decoded = await tempScanner.scanFile(file, true);
      tempScanner.clear();
      await handleScan(decoded);
    } catch (err) {
      toast({
        title: 'Could not read barcode/QR',
        description: 'Please ensure the photo is clear and well lit, or use the manual verification box.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
      e.target.value = '';
    }
  };

  const handleScan = async (raw: string) => {
    if (!raw || !raw.trim() || processing) return;
    setProcessing(true);

    let assetId = raw.trim();
    let detectedAction = mode;

    // Detect QR payload JSON
    try {
      const parsed = JSON.parse(raw);
      if (parsed.assetId) assetId = parsed.assetId;
      else if (parsed.i) assetId = parsed.i;
      else if (parsed.id) assetId = parsed.id;
      else if (parsed.sn) assetId = parsed.sn;

      if (parsed.x !== undefined || parsed.a === 'ASSET') {
        // In prototype and DBU system, QR labels represent gate exit authorizations
        detectedAction = 'exit';
      }
    } catch {
      // Plain string
    }

    assetId = assetId.trim().toUpperCase();

    const soundEnabled =
      typeof window !== 'undefined' ? localStorage.getItem('dbu_sound_enabled') !== 'false' : true;

    try {
      const res = await api.post('/exit-logs', { assetId, action: detectedAction });
      const eq = res.data.equipment;

      setScanResult({
        verdict: 'APPROVED',
        message:
          res.data.message ||
          (detectedAction === 'exit'
            ? 'CLEARANCE GRANTED: Equipment authorized to leave campus.'
            : 'CHECK-IN VERIFIED: Equipment returned safely inside campus.'),
        equipment: eq,
        action: detectedAction,
      });

      if (soundEnabled) sounds.playApproved();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Asset verification failed';

      // Always try fetching equipment details even on reject so guard sees who it belongs to
      let eqData: EquipmentDetail | undefined = undefined;
      try {
        const checkRes = await api.get(`/equipment/scan/${assetId}`);
        eqData = checkRes.data.data;
      } catch {}

      setScanResult({
        verdict: 'REJECTED',
        message: msg,
        equipment: eqData,
        action: detectedAction,
      });

      if (soundEnabled) sounds.playRejected();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([500]);
      }
    } finally {
      setProcessing(false);
      setUsbInput('');
    }
  };

  const handleUsbKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const val = usbInput.trim();
      setUsbInput('');
      if (val) handleScan(val);
    }
  };

  useEffect(() => () => {
    stopScanner();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hidden container for file scans */}
      <div id="qr-reader-temp" className="hidden" />

      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
          <Shield className="w-6 h-6 text-dbu-blue" />
          Campus Gate Scanner
        </h1>
        <p className="text-gray-500 text-sm">
          Debre Berhan University Security Checkpoint • QR Code (OUT) & Barcode (IN)
        </p>
      </div>

      {/* Mode Toggle Banner */}
      <div className="bg-white rounded-2xl border p-2 shadow-sm grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('exit');
            setScanResult(null);
          }}
          className={cn(
            'flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all',
            mode === 'exit'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md ring-2 ring-orange-300'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          <QrCode className="w-4 h-4" />
          <span>Exit Gate (OUT)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('entry');
            setScanResult(null);
          }}
          className={cn(
            'flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all',
            mode === 'entry'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md ring-2 ring-green-300'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          <Barcode className="w-4 h-4" />
          <span>Entry Gate (IN)</span>
        </button>
      </div>

      {/* USB Hardware Scanner Input */}
      <div className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="usb-scanner" className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4 text-dbu-blue" />
            Handheld USB / Wireless Scanner / Manual Code
          </Label>
          <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded font-mono font-medium">
            Scanner Ready
          </span>
        </div>

        <div className="relative">
          <Input
            id="usb-scanner"
            ref={usbInputRef}
            placeholder="Scan barcode/QR or type asset ID (e.g. DBULT0008)..."
            value={usbInput}
            onChange={(e) => setUsbInput(e.target.value)}
            onKeyDown={handleUsbKeyDown}
            disabled={processing}
            className="font-mono text-base py-5 pl-4 pr-24 border-2 border-dashed border-blue-300 focus:border-dbu-blue bg-blue-50/30"
            autoComplete="off"
            spellCheck="false"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const val = usbInput.trim();
              setUsbInput('');
              if (val) handleScan(val);
            }}
            disabled={!usbInput.trim() || processing}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-dbu-blue hover:bg-blue-800 text-xs px-3"
          >
            Verify
          </Button>
        </div>

        {/* Quick test buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-gray-400 font-medium">Quick Test:</span>
          {['DBULT0008', 'DBULT0007', 'DBULT0001', 'DBULT0002'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleScan(id)}
              disabled={processing}
              className="text-[11px] font-mono bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-dbu-blue px-2 py-0.5 rounded border border-gray-200 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Scanner Container */}
      <div className="bg-white rounded-xl border shadow-sm p-4 space-y-3 overflow-hidden">
        {/* Permanent video container so Html5Qrcode element is always mounted */}
        <div
          id="qr-reader"
          className={cn(
            'w-full rounded-lg overflow-hidden border border-gray-300 bg-black min-h-[220px]',
            !scanning && 'hidden'
          )}
        />

        {scanning ? (
          <div className="space-y-2">
            {camStatus && <p className="text-xs text-center text-gray-500 font-medium">{camStatus}</p>}
            <Button
              variant="outline"
              onClick={stopScanner}
              className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
              Stop Camera
            </Button>
          </div>
        ) : processing ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dbu-blue" />
            <p className="text-gray-600 font-medium text-sm">Verifying with Gate Security...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
            <div className="bg-blue-50 p-3.5 rounded-full text-dbu-blue">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Camera / Webcam Scanner</p>
              <p className="text-gray-400 text-xs mt-0.5">Supports both QR Codes (OUT) and Barcodes (IN)</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={startScanner}
                className="gap-2 bg-dbu-blue hover:bg-blue-800 text-white shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Start Camera Scanner
              </Button>

              <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-sm">
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                Scan Image File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScanFile}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Rich Verdict Box */}
      {scanResult && (
        <div
          className={cn(
            'rounded-2xl border-2 p-6 shadow-xl space-y-5 transition-all',
            scanResult.verdict === 'APPROVED'
              ? 'bg-gradient-to-b from-green-50 to-white border-green-400'
              : 'bg-gradient-to-b from-red-50 to-white border-red-400'
          )}
        >
          {/* Big Banner Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              {scanResult.verdict === 'APPROVED' ? (
                <div className="bg-green-100 p-2.5 rounded-full text-green-600 ring-4 ring-green-200">
                  <CheckCircle className="w-8 h-8" />
                </div>
              ) : (
                <div className="bg-red-100 p-2.5 rounded-full text-red-600 ring-4 ring-red-200">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
              <div>
                <h2
                  className={cn(
                    'text-2xl font-black tracking-wide',
                    scanResult.verdict === 'APPROVED' ? 'text-green-800' : 'text-red-800'
                  )}
                >
                  {scanResult.verdict === 'APPROVED' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                </h2>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-0.5">
                  Action: {scanResult.action === 'exit' ? 'Gate Exit (OUT)' : 'Gate Entry (IN)'}
                </p>
              </div>
            </div>

            {/* Auto-reset badge & Hold toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? 'Resume countdown' : 'Hold details on screen'}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs flex items-center gap-1 px-2"
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{isPaused ? 'Resume' : 'Hold'}</span>
              </button>

              {!isPaused && countdown !== null && (
                <span className="text-[11px] font-mono font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {countdown}s
                </span>
              )}
            </div>
          </div>

          {/* Verdict Message Alert */}
          <div
            className={cn(
              'p-3.5 rounded-xl text-sm font-medium flex items-center gap-2',
              scanResult.verdict === 'APPROVED'
                ? 'bg-green-100/70 text-green-900'
                : 'bg-red-100/70 text-red-900'
            )}
          >
            {scanResult.verdict === 'APPROVED' ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            )}
            <span>{scanResult.message}</span>
          </div>

          {/* Full Equipment & Owner Details Card */}
          {scanResult.equipment ? (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

              {/* Photos Row */}
              <div className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-white border-b">
                {/* Owner photo */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {scanResult.equipment.ownerPhotoUrl ? (
                    <img
                      src={scanResult.equipment.ownerPhotoUrl}
                      alt="Owner"
                      className="w-24 h-28 object-cover rounded-xl border-2 border-dbu-blue shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-28 rounded-xl bg-dbu-blue text-white flex flex-col items-center justify-center text-2xl font-bold shadow">
                      <User className="w-9 h-9 opacity-80 mb-1" />
                      <span>{scanResult.equipment.ownerName?.charAt(0) || '?'}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Owner</span>
                </div>

                {/* Device photo */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {scanResult.equipment.equipmentPhotoUrl ? (
                    <img
                      src={scanResult.equipment.equipmentPhotoUrl}
                      alt="Device"
                      className="w-24 h-28 object-cover rounded-xl border-2 border-gray-300 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-28 rounded-xl bg-gray-100 text-gray-400 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                      <Laptop className="w-9 h-9 mb-1" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Device</span>
                </div>

                {/* Status & asset ID summary */}
                <div className="flex-1 space-y-2 pt-1 min-w-0">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold capitalize mt-0.5',
                      scanResult.equipment.status === 'inside'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : scanResult.equipment.status === 'outside'
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'bg-blue-100 text-blue-700 border border-blue-300'
                    )}>
                      <span className={cn('w-2 h-2 rounded-full',
                        scanResult.equipment.status === 'inside' ? 'bg-green-500' :
                        scanResult.equipment.status === 'outside' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500'
                      )} />
                      {scanResult.equipment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Asset ID</p>
                    <p className="font-mono font-black text-dbu-blue text-base">{scanResult.equipment.assetId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Owner Type</p>
                    <p className="text-sm font-semibold capitalize text-gray-800">{scanResult.equipment.ownerType || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Owner Info Section */}
              <div className="p-4 border-b space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">👤 Owner Information</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Full Name</p>
                    <p className="font-bold text-gray-900">{scanResult.equipment.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">University ID</p>
                    <p className="font-mono font-bold text-dbu-blue">{scanResult.equipment.universityId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Department</p>
                    <p className="font-medium text-gray-800">{scanResult.equipment.department || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Year</p>
                    <p className="font-medium text-gray-800">{scanResult.equipment.year || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Block No.</p>
                    <p className="font-medium text-gray-800">{scanResult.equipment.blockNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Dorm No.</p>
                    <p className="font-medium text-gray-800">{scanResult.equipment.dormNumber || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Device Info Section */}
              <div className="p-4 border-b space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">💻 Equipment Information</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Brand &amp; Model</p>
                    <p className="font-bold text-gray-900">{scanResult.equipment.brand} {scanResult.equipment.model}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Type</p>
                    <p className="font-medium text-gray-800 capitalize">{scanResult.equipment.equipmentType || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Serial Number</p>
                    <p className="font-mono font-semibold text-gray-800">{scanResult.equipment.serialNumber || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Color</p>
                    <p className="font-medium text-gray-800 capitalize">{scanResult.equipment.color || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Timestamps Section */}
              <div className="p-4 border-b">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">🕐 Activity History</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {scanResult.equipment.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-2 border">
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Registered</p>
                      <p className="font-medium text-gray-700 mt-0.5">{new Date(scanResult.equipment.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                  {scanResult.equipment.lastExitAt ? (
                    <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                      <p className="text-orange-400 font-semibold uppercase text-[10px]">Last Exit</p>
                      <p className="font-medium text-orange-700 mt-0.5">{new Date(scanResult.equipment.lastExitAt).toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-2 border">
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Last Exit</p>
                      <p className="text-gray-400 mt-0.5">Never</p>
                    </div>
                  )}
                  {scanResult.equipment.lastEntryAt ? (
                    <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                      <p className="text-green-500 font-semibold uppercase text-[10px]">Last Entry</p>
                      <p className="font-medium text-green-700 mt-0.5">{new Date(scanResult.equipment.lastEntryAt).toLocaleString()}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-2 border">
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Last Entry</p>
                      <p className="text-gray-400 mt-0.5">Never</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guard Notes */}
              {scanResult.equipment.guardNotes && (
                <div className="p-4 bg-amber-50 border-t border-amber-200">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">⚠ Guard Notes</p>
                  <p className="text-sm text-amber-900 font-medium">{scanResult.equipment.guardNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border text-sm text-gray-500 text-center">
              Item details could not be retrieved from registration database.
            </div>
          )}

          {/* Action Button: Clear/Next Scan */}
          <div className="flex gap-2 pt-2">
            <Button
              className="w-full bg-dbu-blue hover:bg-blue-800 text-white gap-2"
              onClick={() => {
                setScanResult(null);
                setUsbInput('');
                usbInputRef.current?.focus();
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Scan Next Item
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
