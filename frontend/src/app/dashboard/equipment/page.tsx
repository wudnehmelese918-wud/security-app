'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Trash2,
  RefreshCw,
  Laptop,
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/components/ui/use-toast';
import AssetLabel, { AssetLabelData } from '@/components/equipment/AssetLabel';

interface Equipment {
  _id: string;
  assetId: string;
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
  color?: string;
  ownerType: string;
  ownerName: string;
  universityId: string;
  department: string;
  year?: string;
  blockNumber?: string;
  dormNumber?: string;
  ownerPhotoUrl?: string;
  equipmentPhotoUrl?: string;
  status: 'registered' | 'outside' | 'inside';
  guardNotes?: string;
  lastExitAt?: string;
  lastEntryAt?: string;
  createdAt: string;
}

const statusStyles = {
  registered: 'bg-blue-100 text-blue-700 border-blue-200',
  outside: 'bg-orange-100 text-orange-700 border-orange-200',
  inside: 'bg-green-100 text-green-700 border-green-200',
};

export default function EquipmentPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [items, setItems] = useState<Equipment[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [detailItem, setDetailItem] = useState<Equipment | null>(null);
  const [printLabelItem, setPrintLabelItem] = useState<Equipment | null>(null);
  const [showPrintAllSheet, setShowPrintAllSheet] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '100' };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await api.get('/equipment', { params });
      setItems(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast({ title: 'Error', description: 'Failed to load equipment list', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [search, statusFilter, typeFilter]);

  const exportCSV = () => {
    if (!items.length) {
      toast({ title: 'No data', description: 'No equipment available to export' });
      return;
    }
    const headers = [
      'Asset ID',
      'Owner Name',
      'University ID',
      'Owner Type',
      'Department',
      'Year',
      'Block',
      'Dorm',
      'Type',
      'Brand',
      'Model',
      'Serial Number',
      'Status',
      'Registered Date',
    ];
    const rows = items.map((e) => [
      e.assetId,
      `"${e.ownerName}"`,
      e.universityId,
      e.ownerType,
      `"${e.department}"`,
      e.year || '',
      e.blockNumber || '',
      e.dormNumber || '',
      e.equipmentType,
      `"${e.brand}"`,
      `"${e.model}"`,
      `"${e.serialNumber}"`,
      e.status.toUpperCase(),
      new Date(e.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DBU_Equipment_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/equipment/${deleteTarget._id}`);
      toast({ title: '✅ Deleted', description: `Asset ${deleteTarget.assetId} has been deleted.` });
      setDeleteTarget(null);
      fetchEquipment();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete asset', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const handlePrintAll = () => {
    setShowPrintAllSheet(true);
    setTimeout(() => {
      window.print();
      setShowPrintAllSheet(false);
    }, 400);
  };

  // ─── Guest Scan-Only View ────────────────────────────────────────────────
  const [guestQuery, setGuestQuery] = useState('');
  const [guestResult, setGuestResult] = useState<Equipment | null>(null);
  const [guestError, setGuestError] = useState('');
  const [guestLoading, setGuestLoading] = useState(false);

  const handleGuestScan = async (query: string) => {
    const q = (query || guestQuery).trim().toUpperCase();
    if (!q) return;
    setGuestLoading(true);
    setGuestResult(null);
    setGuestError('');
    try {
      const res = await api.get(`/equipment/scan/${q}`);
      setGuestResult(res.data.data);
    } catch {
      setGuestError('No equipment found for that ID. Please check the asset tag and try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  // Global wedge-scanner listener for guest view
  useEffect(() => {
    if (user?.role !== 'guest') return;
    let buffer = '';
    let lastKeyTime = Date.now();
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.id !== 'guest-scanner') return;
      const now = Date.now();
      if (now - lastKeyTime > 150) buffer = '';
      lastKeyTime = now;
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (buffer.trim().length >= 3) {
          e.preventDefault();
          const code = buffer.trim();
          buffer = '';
          setGuestQuery(code);
          handleGuestScan(code);
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  if (user?.role === 'guest') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-dbu-blue" />
            Equipment Lookup
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Scan an asset barcode, QR code, or type an Asset ID to verify ownership details.
          </p>
        </div>

        {/* Scan Input */}
        <div className="bg-white rounded-xl border p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="guest-scanner"
              placeholder="Scan barcode / type Asset ID (e.g. DBULT0008)…"
              value={guestQuery}
              onChange={(e) => setGuestQuery(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGuestScan(guestQuery);
              }}
              disabled={guestLoading}
              className="pl-9 font-mono text-base border-2 border-dashed border-blue-300 focus:border-dbu-blue bg-blue-50/30"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <Button
            className="w-full bg-dbu-blue hover:bg-blue-800 text-white gap-2"
            onClick={() => handleGuestScan(guestQuery)}
            disabled={!guestQuery.trim() || guestLoading}
          >
            {guestLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Searching…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Verify Asset
              </>
            )}
          </Button>

          {/* Quick test */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-gray-400 font-medium">Quick Test:</span>
            {['DBULT0008', 'DBULT0007', 'DBULT0001'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => { setGuestQuery(id); handleGuestScan(id); }}
                disabled={guestLoading}
                className="text-[11px] font-mono bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-dbu-blue px-2 py-0.5 rounded border border-gray-200 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {guestError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            <XCircle className="w-5 h-5 shrink-0" />
            {guestError}
          </div>
        )}

        {/* Result card */}
        {guestResult && (
          <div className="bg-white rounded-2xl border-2 border-dbu-blue/30 shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-green-700 font-bold text-sm">Asset Found in Database</p>
              <span className={cn(
                'ml-auto inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize',
                statusStyles[guestResult.status] || 'bg-gray-100 text-gray-600'
              )}>
                {guestResult.status}
              </span>
            </div>

            <div className="flex gap-4">
              {guestResult.ownerPhotoUrl ? (
                <img
                  src={guestResult.ownerPhotoUrl}
                  alt="Owner"
                  className="w-20 h-24 object-cover rounded-xl border-2 border-dbu-blue shadow shrink-0"
                />
              ) : (
                <div className="w-20 h-24 rounded-xl bg-dbu-blue text-white flex items-center justify-center font-bold text-2xl shrink-0">
                  {guestResult.ownerName?.charAt(0) || '?'}
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Owner</p>
                <p className="font-bold text-gray-900 text-base leading-tight">{guestResult.ownerName}</p>
                <p className="font-mono text-sm font-semibold text-dbu-blue">{guestResult.universityId}</p>
                <p className="text-sm text-gray-600 truncate">{guestResult.department || '—'}</p>
                {(guestResult.blockNumber || guestResult.dormNumber) && (
                  <p className="text-xs text-gray-500">
                    Block {guestResult.blockNumber || '—'} • Dorm {guestResult.dormNumber || '—'}
                    {guestResult.year && ` • Year ${guestResult.year}`}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm border">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Equipment</p>
              <div className="flex gap-4">
                {guestResult.equipmentPhotoUrl && (
                  <img
                    src={guestResult.equipmentPhotoUrl}
                    alt="Device"
                    className="w-16 h-16 object-cover rounded-lg border shadow shrink-0"
                  />
                )}
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-900">{guestResult.brand} {guestResult.model}</p>
                  <p className="font-mono text-xs text-dbu-blue font-semibold">ID: {guestResult.assetId}</p>
                  <p className="font-mono text-xs text-gray-500">SN: {guestResult.serialNumber || '—'}</p>
                  <p className="text-xs text-gray-500 capitalize">{guestResult.equipmentType}{guestResult.color ? ` • ${guestResult.color}` : ''}</p>
                </div>
              </div>
            </div>

            {guestResult.guardNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                <strong>Guard Note:</strong> {guestResult.guardNotes}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => { setGuestResult(null); setGuestQuery(''); setGuestError(''); }}
            >
              <RefreshCw className="w-4 h-4" />
              Clear / Scan Another
            </Button>
          </div>
        )}
      </div>
    );
  }
  // ─── End Guest View ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Register</h1>
          <p className="text-gray-500 text-sm">{total} total assets registered in system</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={fetchEquipment} className="gap-1.5">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintAll} className="gap-1.5">
            <Printer className="w-4 h-4" />
            Print All Labels
          </Button>
          {(user?.role === 'admin' || user?.role === 'assistant') && (
            <Link href="/dashboard/register">
              <Button size="sm" className="gap-1.5 bg-dbu-blue hover:bg-blue-800 text-white">
                <Plus className="w-4 h-4" />
                Register Asset
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by student name, University ID, asset ID, serial..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm"
          >
            <option value="">All Status</option>
            <option value="inside">Inside Campus</option>
            <option value="outside">Outside Campus</option>
            <option value="registered">Registered</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm capitalize"
          >
            <option value="">All Types</option>
            <option value="laptop">Laptop</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dbu-blue" />
            <p className="text-gray-400 text-sm">Loading equipment database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Laptop className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">No equipment found</p>
            <p className="text-gray-400 text-sm mt-1">
              Click &quot;Register Asset&quot; to add student or staff laptops and devices.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase border-b text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Photo</th>
                  <th className="px-4 py-3 text-left font-semibold">Asset ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Owner</th>
                  <th className="px-4 py-3 text-left font-semibold">Device</th>
                  <th className="px-4 py-3 text-left font-semibold">Department</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Registered</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((eq) => (
                  <tr key={eq._id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Photo */}
                    <td className="px-4 py-3">
                      {eq.ownerPhotoUrl ? (
                        <img
                          src={eq.ownerPhotoUrl}
                          alt="Owner"
                          className="w-10 h-10 rounded-full object-cover border shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-dbu-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {eq.ownerName.charAt(0)}
                        </div>
                      )}
                    </td>

                    {/* Asset ID */}
                    <td className="px-4 py-3 font-mono font-bold text-dbu-blue whitespace-nowrap">
                      {eq.assetId}
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">{eq.ownerName}</p>
                      <p className="text-gray-400 text-xs font-mono">{eq.universityId}</p>
                    </td>

                    {/* Device */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-gray-800">
                        {eq.brand} {eq.model}
                      </p>
                      <p className="text-gray-400 text-xs capitalize">
                        {eq.equipmentType} • SN: {eq.serialNumber || '—'}
                      </p>
                    </td>

                    {/* Department & Dorm */}
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                      <p className="truncate max-w-[150px]">{eq.department || '—'}</p>
                      {eq.blockNumber && (
                        <p className="text-gray-400 text-[11px]">
                          Block {eq.blockNumber}, Dorm {eq.dormNumber || '—'}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize',
                          statusStyles[eq.status] || 'bg-gray-100 text-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            eq.status === 'outside'
                              ? 'bg-orange-500 animate-pulse'
                              : eq.status === 'inside'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          )}
                        />
                        {eq.status}
                      </span>
                    </td>

                    {/* Registration Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-xs">
                      {new Date(eq.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailItem(eq)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-dbu-blue"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrintLabelItem(eq)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-dbu-blue"
                          title="Print Label"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        {user?.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(eq)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Asset Detail Modal */}
      {detailItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDetailItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-mono text-xs text-dbu-blue font-bold">{detailItem.assetId}</p>
                <h2 className="text-lg font-bold text-gray-900">
                  {detailItem.brand} {detailItem.model}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Photos & Status */}
            <div className="flex gap-4 items-center">
              {detailItem.ownerPhotoUrl ? (
                <img
                  src={detailItem.ownerPhotoUrl}
                  alt="Owner"
                  className="w-24 h-28 object-cover rounded-xl border-2 border-dbu-blue shadow-sm"
                />
              ) : (
                <div className="w-24 h-28 rounded-xl bg-dbu-blue text-white flex items-center justify-center font-bold text-2xl">
                  {detailItem.ownerName.charAt(0)}
                </div>
              )}

              {detailItem.equipmentPhotoUrl && (
                <img
                  src={detailItem.equipmentPhotoUrl}
                  alt="Device"
                  className="w-24 h-28 object-cover rounded-xl border shadow-sm"
                />
              )}

              <div className="space-y-1">
                <span
                  className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase',
                    statusStyles[detailItem.status]
                  )}
                >
                  Status: {detailItem.status}
                </span>
                <p className="text-xs text-gray-500">
                  Registered: {new Date(detailItem.createdAt).toLocaleDateString()}
                </p>
                {detailItem.lastExitAt && (
                  <p className="text-xs text-orange-600 font-medium">
                    Last Exit: {new Date(detailItem.lastExitAt).toLocaleString()}
                  </p>
                )}
                {detailItem.lastEntryAt && (
                  <p className="text-xs text-green-600 font-medium">
                    Last Entry: {new Date(detailItem.lastEntryAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Owner Info Grid */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs">
              <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                Owner Information
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Full Name:</span>
                  <p className="font-semibold text-gray-900">{detailItem.ownerName}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">University ID:</span>
                  <p className="font-mono font-semibold text-dbu-blue">{detailItem.universityId}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Department:</span>
                  <p className="font-medium text-gray-800">{detailItem.department || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Campus Residence:</span>
                  <p className="font-medium text-gray-800">
                    Block {detailItem.blockNumber || '—'}, Dorm {detailItem.dormNumber || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Device Info Grid */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs">
              <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                Device Information
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Brand & Model:</span>
                  <p className="font-semibold text-gray-900">{detailItem.brand} {detailItem.model}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Serial Number:</span>
                  <p className="font-mono font-semibold text-gray-800">{detailItem.serialNumber || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Type:</span>
                  <p className="font-medium text-gray-800 capitalize">{detailItem.equipmentType}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Color:</span>
                  <p className="font-medium text-gray-800">{detailItem.color || '—'}</p>
                </div>
              </div>
            </div>

            {detailItem.guardNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                <strong>Guard Notes:</strong> {detailItem.guardNotes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setPrintLabelItem(detailItem);
                  setDetailItem(null);
                }}
                className="gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Sticker Label
              </Button>
              <Button variant="ghost" onClick={() => setDetailItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Single Label Print Modal */}
      {printLabelItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPrintLabelItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <p className="font-semibold text-sm">Asset Clearance Label</p>
              <button
                type="button"
                onClick={() => setPrintLabelItem(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center p-2 bg-gray-50 rounded-xl">
              <AssetLabel asset={printLabelItem} />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPrintLabelItem(null)}
              >
                Done
              </Button>
              <Button
                className="flex-1 bg-dbu-blue hover:bg-blue-800 text-white gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" />
                Print Label
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-100 p-2.5 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Delete Asset Record?</h2>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to permanently delete asset{' '}
              <strong>{deleteTarget.assetId}</strong> ({deleteTarget.brand} {deleteTarget.model})
              registered to <strong>{deleteTarget.ownerName}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? 'Deleting...' : 'Delete Asset'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print All Sheet (Activated when window.print() is called) */}
      <div className={cn('hidden', showPrintAllSheet && 'block print:block')}>
        <div className="print-only p-4">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black uppercase tracking-wider">
              Debre Berhan University - Security Asset Tags
            </h1>
            <p className="text-xs text-gray-500">Official Campus Security Clearance QR & Barcode Sheet</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {items.map((eq) => (
              <div key={eq._id} className="break-inside-avoid flex justify-center">
                <AssetLabel asset={eq} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
