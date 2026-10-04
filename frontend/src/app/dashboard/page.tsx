'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Shield, Package, LogOut, LogIn, Users, Activity } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivityTable from '@/components/dashboard/RecentActivityTable';

interface Stats {
  totalEquipment: number;
  outside: number;
  inside: number;
  registered: number;
  totalLogs: number;
  totalUsers: number;
  recentLogs: unknown[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => {
      setStats(r.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dbu-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Gate security overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Total Assets" value={stats?.totalEquipment ?? 0} icon={Package} color="blue" />
        <StatsCard title="Outside" value={stats?.outside ?? 0} icon={LogOut} color="orange" />
        <StatsCard title="Inside" value={stats?.inside ?? 0} icon={LogIn} color="green" />
        <StatsCard title="Registered" value={stats?.registered ?? 0} icon={Shield} color="purple" />
        <StatsCard title="Total Scans" value={stats?.totalLogs ?? 0} icon={Activity} color="pink" />
        <StatsCard title="Users" value={stats?.totalUsers ?? 0} icon={Users} color="gray" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Recent Gate Activity</h2>
        </div>
        <RecentActivityTable logs={stats?.recentLogs ?? []} />
      </div>
    </div>
  );
}
