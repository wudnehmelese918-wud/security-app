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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-600" />
            System Administrator
          </span>
        );
      case 'assistant':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            Security Guard / Officer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
            <User className="w-3.5 h-3.5 text-teal-600" />
            Student / Staff Member
          </span>
        );
    }
  };

  return (
    <header className="h-16 bg-white border-b border-sky-100 flex items-center justify-between px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-sky-600 font-semibold uppercase tracking-wider">
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
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 hover:text-cyan-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200"
        >
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          Public Site
        </Link>

        {/* Role Badge */}
        {getRoleBadge(user?.role)}

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-600 to-sky-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
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
