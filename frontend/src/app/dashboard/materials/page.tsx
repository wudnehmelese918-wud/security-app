'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import {
  Layers,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface MaterialItem {
  _id: string;
  assetId: string;
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
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
  lastExitAt?: string;
  lastEntryAt?: string;
  createdAt: string;
}

export default function MaterialsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string } | null>(null);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/equipment', { params: { limit: 100 } });
      setItems(res.data.data || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load materials list', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Distinct departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.department) set.add(i.department);
    });
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        item.ownerName?.toLowerCase().includes(q) ||
        item.universityId?.toLowerCase().includes(q) ||
        item.assetId?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.model?.toLowerCase().includes(q) ||
        item.serialNumber?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q);

      // Status
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      // Department
      const matchDept = deptFilter === 'all' || item.department === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [items, search, statusFilter, deptFilter]);

  // Helper to split full name into First, Second, Last names
  const splitName = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/);
    return {
      first: parts[0] || '—',
      second: parts[1] || '—',
      last: parts.slice(2).join(' ') || '—',
    };
  };

  const exportCSV = () => {
    if (!filteredItems.length) {
      toast({ title: 'No data', description: 'No materials available to export' });
      return;
    }
    const headers = [
      'No.',
      'Asset ID',
      'PC Name',
      'Serial Number',
      'First Name',
      'Second Name',
      'Last Name',
      'University ID',
      'Department',
      'Block',
      'Dorm',
      'Year',
      'Date Out',
      'Time Out',
      'Date In',
      'Time In',
      'Status',
    ];
    const rows = filteredItems.map((item, idx) => {
      const names = splitName(item.ownerName);
      const exitDate = item.lastExitAt ? new Date(item.lastExitAt) : null;
      const entryDate = item.lastEntryAt ? new Date(item.lastEntryAt) : null;
      return [
        idx + 1,
        item.assetId,
        `"${item.brand} ${item.model}"`,
        `"${item.serialNumber || ''}"`,
        `"${names.first}"`,
        `"${names.second}"`,
        `"${names.last}"`,
        item.universityId,
        `"${item.department || ''}"`,
        item.blockNumber || '',
        item.dormNumber || '',
        item.year || '',
        exitDate ? exitDate.toLocaleDateString() : '—',
        exitDate ? exitDate.toLocaleTimeString() : '—',
        entryDate ? entryDate.toLocaleDateString() : '—',
        entryDate ? entryDate.toLocaleTimeString() : '—',
        item.status.toUpperCase(),
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DBU_Materials_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-dbu-blue" />
            List of Materials
          </h1>
          <p className="text-gray-500 text-sm">
            Complete inventory register of laptops, desktops & electronic devices at Debre Berhan University
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={fetchMaterials} className="gap-1.5">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 bg-dbu-blue hover:bg-blue-800 text-white"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by student name, ID, serial, PC brand/model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-dbu-blue"
          >
            <option value="all">All Status</option>
            <option value="inside">Inside Campus</option>
            <option value="outside">Outside Campus</option>
            <option value="registered">Newly Registered</option>
          </select>
          {departments.length > 0 && (
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-dbu-blue max-w-xs truncate"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dbu-blue" />
            <p className="text-gray-400 text-sm">Loading materials register...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Laptop className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">No materials found</p>
            <p className="text-gray-400 text-sm mt-1">
              Registered student and faculty equipment will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase border-b text-[11px]">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold">No.</th>
                  <th className="px-3 py-3 text-left font-semibold">Face</th>
                  <th className="px-3 py-3 text-left font-semibold">PC Photo</th>
                  <th className="px-3 py-3 text-left font-semibold">PC Name</th>
                  <th className="px-3 py-3 text-left font-semibold">First Name</th>
                  <th className="px-3 py-3 text-left font-semibold">Second Name</th>
                  <th className="px-3 py-3 text-left font-semibold">Last Name</th>
                  <th className="px-3 py-3 text-left font-semibold">University ID</th>
                  <th className="px-3 py-3 text-left font-semibold">Department</th>
                  <th className="px-3 py-3 text-center font-semibold">Block</th>
                  <th className="px-3 py-3 text-center font-semibold">Dorm</th>
                  <th className="px-3 py-3 text-center font-semibold">Year</th>
                  <th className="px-3 py-3 text-left font-semibold">Date Out</th>
                  <th className="px-3 py-3 text-left font-semibold">Time Out</th>
                  <th className="px-3 py-3 text-left font-semibold">Date In</th>
                  <th className="px-3 py-3 text-left font-semibold">Time In</th>
                  <th className="px-3 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item, idx) => {
                  const names = splitName(item.ownerName);
                  const exitDate = item.lastExitAt ? new Date(item.lastExitAt) : null;
                  const entryDate = item.lastEntryAt ? new Date(item.lastEntryAt) : null;
                  return (
                    <tr key={item._id} className="hover:bg-blue-50/40 transition-colors">
                      {/* No. */}
                      <td className="px-3 py-2.5 font-mono text-gray-400 font-semibold">{idx + 1}</td>

                      {/* Face photo */}
                      <td className="px-3 py-2.5">
                        {item.ownerPhotoUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePhotoModal({
                                url: item.ownerPhotoUrl!,
                                title: `Face Photo: ${item.ownerName}`,
                              })
                            }
                            className="group relative block"
                          >
                            <img
                              src={item.ownerPhotoUrl}
                              alt={item.ownerName}
                              className="w-10 h-12 object-cover rounded-md border border-gray-200 group-hover:ring-2 group-hover:ring-dbu-blue transition-all"
                            />
                            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-md flex items-center justify-center text-white transition-opacity">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        ) : (
                          <div className="w-10 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-bold border border-dashed">
                            No Pic
                          </div>
                        )}
                      </td>

                      {/* PC photo */}
                      <td className="px-3 py-2.5">
                        {item.equipmentPhotoUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePhotoModal({
                                url: item.equipmentPhotoUrl!,
                                title: `PC Photo: ${item.brand} ${item.model} (${item.assetId})`,
                              })
                            }
                            className="group relative block"
                          >
                            <img
                              src={item.equipmentPhotoUrl}
                              alt="PC"
                              className="w-10 h-10 object-cover rounded-md border border-gray-200 group-hover:ring-2 group-hover:ring-dbu-blue transition-all"
                            />
                            <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-md flex items-center justify-center text-white transition-opacity">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-bold border border-dashed">
                            No PC
                          </div>
                        )}
                      </td>

                      {/* PC name */}
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">{item.brand} {item.model}</p>
                        <p className="font-mono text-gray-400 text-[10px]">{item.assetId}</p>
                      </td>

                      {/* Names */}
                      <td className="px-3 py-2.5 font-medium text-gray-800 whitespace-nowrap">{names.first}</td>
                      <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{names.second}</td>
                      <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{names.last}</td>

                      {/* University ID */}
                      <td className="px-3 py-2.5 font-mono font-medium text-dbu-blue whitespace-nowrap">
                        {item.universityId}
                      </td>

                      {/* Department */}
                      <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap max-w-xs truncate">
                        {item.department || '—'}
                      </td>

                      {/* Block, Dorm, Year */}
                      <td className="px-3 py-2.5 text-center font-mono font-medium">{item.blockNumber || '—'}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-medium">{item.dormNumber || '—'}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{item.year || '—'}</td>

                      {/* Date / Time Out */}
                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">
                        {exitDate ? exitDate.toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-600 font-mono">
                        {exitDate ? exitDate.toLocaleTimeString() : '—'}
                      </td>

                      {/* Date / Time In */}
                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">
                        {entryDate ? entryDate.toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-600 font-mono">
                        {entryDate ? entryDate.toLocaleTimeString() : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        {item.status === 'outside' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            OUT
                          </span>
                        ) : item.status === 'inside' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            IN
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                            Registered
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-xs italic">
        * Note: Devices leave campus upon QR scan verification and return upon Barcode scan verification.
      </p>

      {/* Image Preview Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900 text-sm truncate">{activePhotoModal.title}</p>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center bg-gray-100 rounded-xl overflow-hidden max-h-[70vh]">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title}
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
