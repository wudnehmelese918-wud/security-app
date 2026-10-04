'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  QrCode,
  BarChart3,
  Users,
  Settings,
  Shield,
  LogOut,
  Globe,
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

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role ?? 'guest')
  );

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-dbu-blue flex flex-col h-full shadow-xl shrink-0">
      {/* Official DBU Logo & Header */}
      <div className="p-5 border-b border-blue-700/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white/10 p-0.5 border-2 border-amber-400 shadow-md shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/dbu-logo.png"
              alt="Debre Berhan University Official Crest"
              width={44}
              height={44}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight group-hover:text-amber-300 transition-colors">
              DBU Security
            </p>
            <p className="text-blue-300 text-xs">Terminal Operations</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-white text-dbu-blue font-bold shadow-sm'
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}

        <div className="pt-4 border-t border-blue-700/60 mt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-800/60 rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            Public University Site
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-blue-700">
        <div className="mb-3 px-2">
          <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            {user?.role === 'assistant' ? 'Security Guard' : user?.role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
