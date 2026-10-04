'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Lock, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

// Strict Role Access Configuration
export const ROUTE_PERMISSIONS: Record<string, ('admin' | 'assistant' | 'guest')[]> = {
  '/dashboard': ['admin', 'assistant'],
  '/dashboard/equipment': ['admin', 'assistant'],
  '/dashboard/materials': ['admin', 'assistant', 'guest'],
  '/dashboard/register': ['admin', 'assistant'],
  '/dashboard/gate': ['admin', 'assistant', 'guest'],
  '/dashboard/logs': ['admin', 'assistant'],
  '/dashboard/users': ['admin'],
  '/dashboard/settings': ['admin'],
};

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const userRole = user?.role || 'guest';
  const allowedRoles = ROUTE_PERMISSIONS[pathname];

  // If route is restricted and user's role is not permitted
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-red-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
              <Lock className="w-3.5 h-3.5" /> 403 Forbidden Access
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Access Restricted to This Section
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your account currently has the role of{' '}
              <span className="font-bold text-gray-900 capitalize px-2 py-0.5 bg-gray-100 rounded">
                {userRole}
              </span>
              . This administrative module requires elevated privileges:{' '}
              <span className="font-semibold text-blue-800">
                [{allowedRoles.map((r) => r.toUpperCase()).join(' or ')}]
              </span>
              .
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 text-left space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              Role Permission Policy:
            </p>
            <p>
              • <strong>Admin:</strong> Complete system authority, user management, and audit logs.
            </p>
            <p>
              • <strong>Assistant (Guard):</strong> Asset registration, gate check-in/out scanning, and verification.
            </p>
            <p>
              • <strong>Guest / Student:</strong> Viewing owned materials and gate pass verification only.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={userRole === 'guest' ? '/dashboard/materials' : '/dashboard'}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-dbu-blue text-white font-semibold text-sm hover:bg-blue-900 transition-colors shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Allowed Area
            </Link>
            <Link
              href="/dashboard/gate"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Gate Scanner
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
