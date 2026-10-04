'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { ShieldCheck, ShieldAlert, User, Globe } from 'lucide-react';

export default function Header() {
  const { user } = useAuthStore();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            System Administrator
          </span>
        );
      case 'assistant':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Security Guard / Officer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Student / Staff Member
          </span>
        );
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Debre Berhan University
          </p>
          <p className="text-sm font-bold text-gray-900 leading-tight">
            Security Gate Operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Link back to public site */}
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-dbu-blue bg-gray-100 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
        >
          <Globe className="w-3.5 h-3.5 text-gray-500" />
          Public Site
        </Link>

        {/* Role Badge */}
        {getRoleBadge(user?.role)}

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-9 h-9 bg-dbu-blue text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-gray-800 leading-none truncate max-w-[140px]">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
