'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import RoleGuard from '@/components/auth/RoleGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    } else if (user?.role === 'guest') {
      // Guests land on materials by default if navigating to base dashboard
      if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
        router.replace('/dashboard/materials');
      }
    }
  }, [token, user, router]);

  if (!token) return null;

  return (
    <div className="flex h-screen bg-sky-50 dark:bg-[#041624] overflow-hidden font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <RoleGuard>{children}</RoleGuard>
        </main>
      </div>
    </div>
  );
}
