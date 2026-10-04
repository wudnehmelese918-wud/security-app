'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Lock, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { token, user } = useAuthStore();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About System' },
    { href: '/features', label: 'Security Features' },
    { href: '/contact', label: 'Emergency & Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 dbu-nav backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & University Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-sky-100 dark:bg-white/10 p-0.5 border-2 border-sky-500 dark:border-cyan-400 shadow-lg shadow-sky-200/50 dark:shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Image src="/dbu-logo.png" alt="Debre Berhan University Logo" width={48} height={48} className="w-full h-full object-cover rounded-full" priority />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="dbu-heading font-black text-lg tracking-wide group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                  DBU SECURITY
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-cyan-950/80 text-emerald-700 dark:text-cyan-300 border border-emerald-300 dark:border-cyan-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-cyan-400 animate-pulse" />
                  GATEWAYS ACTIVE
                </span>
              </div>
              <p className="text-sky-700 dark:text-cyan-200/80 text-xs font-medium tracking-tight">
                Debre Berhan University Gate Protection System
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-sky-700 dark:text-cyan-300 bg-sky-100 dark:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/40 shadow-sm'
                      : 'text-sky-900 dark:text-cyan-100/80 hover:text-sky-700 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-cyan-900/30'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            {token && user ? (
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white text-sm font-black shadow-lg shadow-sky-300/40 dark:shadow-cyan-500/25 transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Dashboard ({user.role})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/60 text-white dark:text-cyan-100 border border-sky-600 dark:border-cyan-500/30 hover:dark:border-cyan-400 text-sm font-semibold transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Security Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-sky-700 dark:text-cyan-200 hover:text-sky-900 dark:hover:text-white hover:bg-sky-100 dark:hover:bg-cyan-900/40 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#041624] border-b border-sky-200 dark:border-cyan-800/60 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-sky-900 dark:text-cyan-100 hover:text-sky-700 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-cyan-900/40 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-sky-200 dark:border-cyan-800/40">
            {token ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-sky-600 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-sky-400 text-white dark:text-[#02182b] font-black text-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-cyan-950/60 text-sky-800 dark:text-cyan-100 font-semibold text-sm border border-sky-300 dark:border-cyan-500/30"
              >
                <Lock className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <span>Security Portal Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
