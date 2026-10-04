'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import { ShieldCheck, ShieldAlert, User, Globe } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const { user } = useAuthStore();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-500/40">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            System Administrator
          </span>
        );
      case 'assistant':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-950/70 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Security Guard / Officer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-500/40">
            <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Student / Staff Member
          </span>
        );
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#0a1e30] border-b border-sky-100 dark:border-cyan-800/40 flex items-center justify-between px-6 shadow-sm dark:shadow-cyan-950/20 shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-sky-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">
            Debre Berhan University
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-sky-100 leading-tight">
            Security Gate Operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Link back to public site */}
        <Link href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 dark:text-sky-300 hover:text-sky-600 dark:hover:text-cyan-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-xl transition-colors border border-sky-200 dark:border-sky-700/40"
        >
          <Globe className="w-3.5 h-3.5" />
          Public Site
        </Link>

        {/* Role Badge */}
        {getRoleBadge(user?.role)}

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-cyan-800/40">
          <div className="w-9 h-9 bg-gradient-to-tr from-sky-600 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-gray-800 dark:text-sky-100 leading-none truncate max-w-[140px]">
              {user?.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-sky-400 mt-0.5 truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
