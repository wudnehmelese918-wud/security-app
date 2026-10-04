'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Layers, QrCode,
  BarChart3, Users, Settings, Shield, LogOut, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'assistant'] },
  { href: '/dashboard/equipment', label: 'Equipment', icon: Package, roles: ['admin', 'assistant'] },
  { href: '/dashboard/materials', label: 'Materials', icon: Layers, roles: ['admin', 'assistant', 'guest'] },
  { href: '/dashboard/register', label: 'Register Asset', icon: QrCode, roles: ['admin', 'assistant'] },
  { href: '/dashboard/gate', label: 'Gate Scanner', icon: Shield, roles: ['admin', 'assistant', 'guest'] },
  { href: '/dashboard/logs', label: 'Exit Logs', icon: BarChart3, roles: ['admin', 'assistant'] },
  { href: '/dashboard/users', label: 'Users', icon: Users, roles: ['admin'] },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const visibleItems = navItems.filter(item => item.roles.includes(user?.role ?? 'guest'));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[#082240] dark:bg-[#030f1c] border-r border-sky-700/50 dark:border-cyan-800/40 flex flex-col h-full shadow-xl shrink-0">

      {/* Logo & Header */}
      <div className="p-5 border-b border-sky-700/50 dark:border-cyan-800/50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white/15 p-0.5 border-2 border-sky-300 dark:border-cyan-400 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
            <Image src="/dbu-logo.png" alt="DBU Crest" width={44} height={44} className="w-full h-full object-cover rounded-full" priority />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight group-hover:text-sky-200 dark:group-hover:text-cyan-300 transition-colors">
              DBU Security
            </p>
            <p className="text-sky-300 dark:text-cyan-300 text-xs font-semibold">Terminal Operations</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-sky-400 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-sky-400 text-[#02182b] font-black shadow-md shadow-sky-300/30 dark:shadow-cyan-500/20'
                  : 'text-sky-100/90 dark:text-cyan-100/80 hover:bg-sky-700/60 dark:hover:bg-cyan-950/60 hover:text-white'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#02182b]' : 'text-sky-300 dark:text-cyan-400')} />
              <span>{label}</span>
            </Link>
          );
        })}

        <div className="pt-4 border-t border-sky-700/50 dark:border-cyan-800/50 mt-4">
          <Link href="/"
            className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-sky-200/80 dark:text-cyan-200/80 hover:text-white hover:bg-sky-700/40 dark:hover:bg-cyan-950/60 rounded-xl transition-colors"
          >
            <Globe className="w-4 h-4 text-sky-300 dark:text-cyan-400" />
            Public University Site
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-sky-700/50 dark:border-cyan-800/50 bg-sky-900/30 dark:bg-[#020b14]/60">
        <div className="mb-3 px-2">
          <p className="text-white text-sm font-bold truncate">{user?.fullName}</p>
          <p className="text-sky-300 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            {user?.role === 'assistant' ? 'Security Guard' : user?.role}
          </p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-sky-200 dark:text-cyan-200/80 hover:bg-red-900/50 hover:text-red-300 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
