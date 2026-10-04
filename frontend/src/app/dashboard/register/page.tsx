'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Webcam from 'react-webcam';
import { api } from '@/lib/api';
import { Camera, X, Upload, CheckCircle, Printer, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import AssetLabel from '@/components/equipment/AssetLabel';


const schema = z.object({
  ownerName: z.string().min(2, 'Required'),
  universityId: z.string().min(4, 'Required'),
  department: z.string().min(2, 'Required'),
  ownerType: z.enum(['student', 'staff']),
  year: z.string().optional(),
  blockNumber: z.string().optional(),
  dormNumber: z.string().optional(),
  brand: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  serialNumber: z.string().min(1, 'Required'),
  color: z.string().optional(),
  equipmentType: z.enum(['laptop', 'desktop', 'tablet', 'other']),
  guardNotes: z.string().optional(),
});
type RegisterForm = z.infer<typeof schema>;

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [ownerPhoto, setOwnerPhoto] = useState<string | null>(null);
  const [equipmentPhoto, setEquipmentPhoto] = useState<string | null>(null);
  const [showOwnerCam, setShowOwnerCam] = useState(false);
  const [showEquipCam, setShowEquipCam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdAsset, setCreatedAsset] = useState<any | null>(null);
  const ownerCamRef = useRef<Webcam>(null);
  const equipCamRef = useRef<Webcam>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'owner' | 'equip') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (target === 'owner') setOwnerPhoto(reader.result);
        else setEquipmentPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { equipmentType: 'laptop', ownerType: 'student' },
  });

  const captureOwner = useCallback(() => {
    const img = ownerCamRef.current?.getScreenshot();
    if (img) { setOwnerPhoto(img); setShowOwnerCam(false); }
  }, []);

  const captureEquip = useCallback(() => {
    const img = equipCamRef.current?.getScreenshot();
    if (img) { setEquipmentPhoto(img); setShowEquipCam(false); }
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    if (!ownerPhoto) {
      toast({ title: 'Owner photo required', description: 'Please capture or upload owner photo', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v !== undefined && formData.append(k, v as string));
      formData.append('ownerPhoto', dataURLtoBlob(ownerPhoto), 'owner.jpg');
      if (equipmentPhoto) {
        formData.append('equipmentPhoto', dataURLtoBlob(equipmentPhoto), 'equipment.jpg');
      }
      const res = await api.post('/equipment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCreatedAsset(res.data.data);
      setStep(3);
      toast({ title: '✅ Asset registered!', description: `Asset ID: ${res.data.data.assetId}` });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast({ title: '❌ Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && createdAsset) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-2xl border shadow-xl p-6 space-y-5 text-center">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full text-green-600 ring-4 ring-green-200">
              <CheckCircle className="w-10 h-10" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Asset Registered Successfully!</h2>
            <p className="text-gray-500 text-xs">Debre Berhan University Security Asset Clearance Tag</p>
          </div>

          <div className="flex justify-center p-3 bg-gray-50 rounded-xl border">
            <AssetLabel asset={createdAsset} />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              Print Sticker
            </Button>
            <Button
              className="flex-1 bg-dbu-blue hover:bg-blue-800 text-white"
              onClick={() => {
                setStep(1);
                setOwnerPhoto(null);
                setEquipmentPhoto(null);
                setCreatedAsset(null);
              }}
            >
              Register Another
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/equipment')}
            className="text-xs text-dbu-blue hover:underline"
          >
            View in Equipment Register →
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register Asset</h1>
        <p className="text-gray-500 text-sm">Step {step} of 2</p>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? 'bg-dbu-blue' : 'bg-gray-200'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-lg">Owner Information</h2>

            {/* Owner Photo */}
            <div className="space-y-2">
              <Label>Owner Photo <span className="text-red-500">*</span></Label>
              {ownerPhoto ? (
                <div className="relative inline-block">
                  <img src={ownerPhoto} alt="Owner" className="w-32 h-32 rounded-xl object-cover border-2 border-dbu-blue" />
                  <button type="button" onClick={() => setOwnerPhoto(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : showOwnerCam ? (
                <div className="space-y-2">
                  <Webcam ref={ownerCamRef} screenshotFormat="image/jpeg" className="rounded-xl w-full max-w-xs" />
                  <Button type="button" onClick={captureOwner} className="gap-2"><Camera className="w-4 h-4" />Capture</Button>
                  <Button type="button" variant="outline" onClick={() => setShowOwnerCam(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowOwnerCam(true)} className="gap-2">
                    <Camera className="w-4 h-4" />Take Photo
                  </Button>
                  <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4 text-gray-500" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'owner')}
                    />
                  </label>
                </div>
              )}

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label>Full Name</Label>
                <Input placeholder="Abebe Kebede" {...register('ownerName')} />
                {errors.ownerName && <p className="text-destructive text-xs">{errors.ownerName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>University ID</Label>
                <Input placeholder="DBU1234567" {...register('universityId')} />
                {errors.universityId && <p className="text-destructive text-xs">{errors.universityId.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Owner Type</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" {...register('ownerType')}>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Department</Label>
                <Input placeholder="Computer Science" {...register('department')} />
              </div>
              {watch('ownerType') === 'student' && (
                <>
                  <div className="space-y-1">
                    <Label>Year</Label>
                    <Input placeholder="3rd" {...register('year')} />
                  </div>
                  <div className="space-y-1">
                    <Label>Block No.</Label>
                    <Input placeholder="B5" {...register('blockNumber')} />
                  </div>
                  <div className="space-y-1">
                    <Label>Dorm No.</Label>
                    <Input placeholder="203" {...register('dormNumber')} />
                  </div>
                </>
              )}
            </div>

            <Button type="button" onClick={() => setStep(2)} className="w-full bg-dbu-blue hover:bg-blue-800">
              Next: Equipment Details →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-lg">Equipment Details</h2>

            {/* Equipment Photo */}
            <div className="space-y-2">
              <Label>Equipment Photo (optional)</Label>
              {equipmentPhoto ? (
                <div className="relative inline-block">
                  <img src={equipmentPhoto} alt="Equipment" className="w-32 h-32 rounded-xl object-cover border-2 border-gray-300" />
                  <button type="button" onClick={() => setEquipmentPhoto(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : showEquipCam ? (
                <div className="space-y-2">
                  <Webcam ref={equipCamRef} screenshotFormat="image/jpeg" className="rounded-xl w-full max-w-xs" />
                  <Button type="button" onClick={captureEquip} className="gap-2"><Camera className="w-4 h-4" />Capture</Button>
                  <Button type="button" variant="outline" onClick={() => setShowEquipCam(false)}>Cancel</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowEquipCam(true)} className="gap-2">
                    <Camera className="w-4 h-4" />Take Photo
                  </Button>
                  <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4 text-gray-500" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'equip')}
                    />
                  </label>
                </div>
              )}

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Type</Label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm" {...register('equipmentType')}>
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="tablet">Tablet</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Brand</Label>
                <Input placeholder="HP, Dell, Lenovo..." {...register('brand')} />
                {errors.brand && <p className="text-destructive text-xs">{errors.brand.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Model</Label>
                <Input placeholder="ProBook 450" {...register('model')} />
                {errors.model && <p className="text-destructive text-xs">{errors.model.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Serial Number</Label>
                <Input placeholder="SN1234567" {...register('serialNumber')} />
              </div>
              <div className="space-y-1">
                <Label>Color</Label>
                <Input placeholder="Black" {...register('color')} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Guard Notes</Label>
                <Input placeholder="Any additional notes..." {...register('guardNotes')} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-dbu-blue hover:bg-blue-800">
                {loading ? 'Registering...' : '✅ Register Asset'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
