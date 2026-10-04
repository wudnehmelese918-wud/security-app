import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft, XCircle } from 'lucide-react';

interface Log {
  _id: string;
  action: 'exit' | 'entry' | 'reject';
  assetId: string;
  timestamp: string;
  scannedBy?: { fullName: string };
  equipment?: { ownerName: string; brand: string; model: string; ownerPhotoUrl?: string };
}

const actionConfig = {
  exit: { label: 'EXIT', icon: ArrowUpRight, color: 'text-orange-600 bg-orange-50' },
  entry: { label: 'ENTRY', icon: ArrowDownLeft, color: 'text-green-600 bg-green-50' },
  reject: { label: 'REJECT', icon: XCircle, color: 'text-red-600 bg-red-50' },
};

export default function RecentActivityTable({ logs }: { logs: unknown[] }) {
  if (!logs.length) {
    return <p className="p-6 text-sm text-gray-400 text-center">No recent activity</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Asset</th>
            <th className="px-4 py-3 text-left">Owner</th>
            <th className="px-4 py-3 text-left">Action</th>
            <th className="px-4 py-3 text-left">Guard</th>
            <th className="px-4 py-3 text-left">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(logs as Log[]).map((log) => {
            const cfg = actionConfig[log.action] ?? actionConfig.reject;
            const Icon = cfg.icon;
            return (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium">{log.assetId}</td>
                <td className="px-4 py-3 text-gray-600">{log.equipment?.ownerName ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', cfg.color)}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{log.scannedBy?.fullName ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
