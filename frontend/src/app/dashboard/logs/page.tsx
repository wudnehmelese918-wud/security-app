'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import {
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  Calendar,
  Clock,
  Shield,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/components/ui/use-toast';

interface ExitLogItem {
  _id: string;
  assetId: string;
  action: 'exit' | 'entry' | 'reject';
  timestamp: string;
  note?: string;
  scannedBy?: {
    fullName: string;
    email: string;
  };
  equipment?: {
    assetId: string;
    ownerName: string;
    universityId: string;
    brand: string;
    model: string;
    ownerPhotoUrl?: string;
    department?: string;
    blockNumber?: string;
    dormNumber?: string;
    year?: string;
    status: string;
  };
}

const actionConfig = {
  exit: {
    label: 'EXIT (OUT)',
    icon: ArrowUpRight,
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-600',
  },
  entry: {
    label: 'ENTRY (IN)',
    icon: ArrowDownLeft,
    badge: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600',
  },
  reject: {
    label: 'REJECTED',
    icon: XCircle,
    badge: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600',
  },
};

export default function ExitLogsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [logs, setLogs] = useState<ExitLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.assetId = search;
      if (actionFilter !== 'all') params.action = actionFilter;
      const res = await api.get('/exit-logs', { params });
      setLogs(res.data.data || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load exit logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  // Filtered in memory if search matches owner name as well
  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter((l) =>
      l.assetId?.toLowerCase().includes(q) ||
      l.equipment?.ownerName?.toLowerCase().includes(q) ||
      l.equipment?.universityId?.toLowerCase().includes(q) ||
      l.scannedBy?.fullName?.toLowerCase().includes(q) ||
      l.equipment?.brand?.toLowerCase().includes(q)
    );
  }, [logs, search]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const exits = filteredLogs.filter((l) => l.action === 'exit').length;
    const entries = filteredLogs.filter((l) => l.action === 'entry').length;
    const rejects = filteredLogs.filter((l) => l.action === 'reject').length;
    return { total, exits, entries, rejects };
  }, [filteredLogs]);

  const exportCSV = () => {
    if (!filteredLogs.length) {
      toast({ title: 'No data', description: 'No logs available to export' });
      return;
    }
    const headers = [
      'Timestamp',
      'Action',
      'Asset ID',
      'Owner Name',
      'University ID',
      'Department',
      'Device',
      'Guard Name',
      'Notes',
    ];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestamp).toLocaleString(),
      l.action.toUpperCase(),
      l.assetId,
      `"${l.equipment?.ownerName ?? ''}"`,
      l.equipment?.universityId ?? '',
      `"${l.equipment?.department ?? ''}"`,
      `"${(l.equipment?.brand ?? '') + ' ' + (l.equipment?.model ?? '')}"`,
      `"${l.scannedBy?.fullName ?? ''}"`,
      `"${l.note ?? ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DBU_Exit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = async () => {
    setClearing(true);
    try {
      await api.delete('/exit-logs');
      toast({ title: '✅ Cleared', description: 'All gate exit logs have been deleted.' });
      setConfirmClearOpen(false);
      fetchLogs();
    } catch {
      toast({ title: 'Error', description: 'Failed to clear logs', variant: 'destructive' });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-dbu-blue" />
            Exit & Entry Logs
          </h1>
          <p className="text-gray-500 text-sm">
            Live campus gate checkpoint tracking and audit trail
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-1.5">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmClearOpen(true)}
              className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear Log
            </Button>
          )}
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-xs text-gray-500 font-medium uppercase">Total Scans</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-xs text-orange-600 font-medium uppercase">Exits (OUT)</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">{stats.exits}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-xs text-green-600 font-medium uppercase">Entries (IN)</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{stats.entries}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-xs text-red-600 font-medium uppercase">Rejections</p>
          <p className="text-2xl font-bold text-red-700 mt-1">{stats.rejects}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by Asset ID, student name, university ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-dbu-blue"
          >
            <option value="all">All Actions</option>
            <option value="exit">Exits (OUT) Only</option>
            <option value="entry">Entries (IN) Only</option>
            <option value="reject">Rejections Only</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-dbu-blue" />
            <p className="text-gray-400 text-sm">Loading gate logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Shield className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-600 font-medium">No exit logs found</p>
            <p className="text-gray-400 text-sm mt-1">
              Gate activity will appear here as QR and barcodes are scanned at checkpoints.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                <tr>
                  <th className="px-4 py-3.5 text-left font-semibold">Time & Date</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Action</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Asset ID</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Owner</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Device</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Guard</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => {
                  const cfg = actionConfig[log.action] || actionConfig.reject;
                  const Icon = cfg.icon;
                  const logDate = new Date(log.timestamp);
                  return (
                    <tr key={log._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {logDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                          <Clock className="w-3 h-3" />
                          {logDate.toLocaleTimeString()}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
                            cfg.badge
                          )}
                        >
                          <Icon className={cn('w-3.5 h-3.5', cfg.iconColor)} />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Asset ID */}
                      <td className="px-4 py-3 font-mono font-bold text-dbu-blue whitespace-nowrap">
                        {log.assetId}
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-3">
                        {log.equipment ? (
                          <div className="flex items-center gap-2.5">
                            {log.equipment.ownerPhotoUrl ? (
                              <img
                                src={log.equipment.ownerPhotoUrl}
                                alt="Owner"
                                className="w-8 h-8 rounded-full object-cover border shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-dbu-blue text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {log.equipment.ownerName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 leading-tight">
                                {log.equipment.ownerName}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {log.equipment.universityId}
                                {log.equipment.department && ` • ${log.equipment.department}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Unregistered / Unknown</span>
                        )}
                      </td>

                      {/* Device */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.equipment ? (
                          <div>
                            <p className="font-medium text-gray-800">
                              {log.equipment.brand} {log.equipment.model}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {log.equipment.blockNumber && `B:${log.equipment.blockNumber}`}
                              {log.equipment.dormNumber && ` D:${log.equipment.dormNumber}`}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Guard */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-gray-700">
                          {log.scannedBy?.fullName || 'Gate System'}
                        </p>
                        <p className="text-gray-400 text-xs">{log.scannedBy?.email || 'Automated'}</p>
                      </td>

                      {/* Note */}
                      <td className="px-4 py-3 max-w-xs truncate text-gray-600">
                        {log.note ? (
                          <span title={log.note}>{log.note}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
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

      {/* Confirmation modal for clearing logs */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-100 p-2.5 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Clear All Gate Logs?</h2>
            </div>
            <p className="text-sm text-gray-600">
              This action will permanently delete all exit and entry logs from the database. This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfirmClearOpen(false)}
                disabled={clearing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearLogs}
                disabled={clearing}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {clearing ? 'Clearing...' : 'Yes, Delete All Logs'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
