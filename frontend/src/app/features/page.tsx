'use client';

import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import Link from 'next/link';
import {
  Shield, ShieldCheck, Eye, Lock, Zap, Users, QrCode,
  BarChart3, Bell, FileText, CheckCircle2, ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: QrCode,
    category: 'Asset Management',
    title: 'Cryptographic QR Gate Passes',
    desc: 'Each asset exit pass contains a tamper-proof encrypted QR code linked to the owner\'s identity, department, and equipment serial number. Passes expire automatically after the authorized duration.',
    highlights: ['SHA-256 hash binding', 'Auto-expiry timestamps', 'Owner photo embedded'],
  },
  {
    icon: Shield,
    category: 'Gate Control',
    title: 'Sub-second Gate Clearance',
    desc: 'Security terminals process gate passes in under 800ms using local edge-cached database. Guards see the registered owner photo, asset details, and authorization status instantly.',
    highlights: ['42ms average verification', 'Offline-capable edge mode', 'Dual photo comparison'],
  },
  {
    icon: Eye,
    category: 'Surveillance',
    title: 'Live Camera Integration Ready',
    desc: 'The system architecture supports RTSP and ONVIF-compatible IP cameras at checkpoints. Captured frames are automatically tagged with gate scan events for review.',
    highlights: ['RTSP / ONVIF compatible', 'Event-tagged snapshots', 'Archival storage'],
  },
  {
    icon: Users,
    category: 'Access Control',
    title: 'Role-Based Access Control (RBAC)',
    desc: 'Three distinct permission tiers govern access: Administrators configure system policies, Security Officers conduct scans and log exits, Students/Staff track their own pass status.',
    highlights: ['3-tier RBAC model', 'Isolated data views', 'Force logout on compromise'],
  },
  {
    icon: BarChart3,
    category: 'Analytics',
    title: 'Real-Time Exit Analytics',
    desc: 'Comprehensive dashboard with hourly, daily, and weekly exit volume charts. Administrators can identify peak gate traffic periods, suspicious activity spikes, and asset absence durations.',
    highlights: ['Hourly trend graphs', 'Anomaly spike alerts', 'Absence duration tracking'],
  },
  {
    icon: Bell,
    category: 'Alerting',
    title: 'Automated Incident Alerts',
    desc: 'When a flagged asset, expired pass, or blacklisted ID is scanned, the system automatically triggers an alert to the guard terminal and central command simultaneously.',
    highlights: ['Blacklist lookups', 'Real-time push alerts', 'Audit trail notifications'],
  },
  {
    icon: Lock,
    category: 'Security',
    title: 'JWT + Rate-Limited Authentication',
    desc: 'All API endpoints are protected with signed JWTs. Auth endpoints enforce sliding window rate limiting to block brute-force attacks. Tokens are short-lived with secure refresh cycles.',
    highlights: ['Short-lived tokens (15m)', 'Sliding window rate limit', 'Bcrypt password hashing'],
  },
  {
    icon: FileText,
    category: 'Audit',
    title: 'Immutable Audit Logs',
    desc: 'Every gate scan, pass creation, user login, and settings change is written to an append-only audit log. Records are timestamped to millisecond precision and administrator-queryable.',
    highlights: ['Append-only writes', 'Millisecond timestamps', 'Admin query interface'],
  },
  {
    icon: Zap,
    category: 'Performance',
    title: 'High-Throughput Processing',
    desc: 'Node.js + PostgreSQL backend is optimized for burst traffic during lecture dismissal hours when hundreds of students may converge on checkpoints simultaneously.',
    highlights: ['Clustered Node.js', 'Indexed DB queries', 'Connection pooling'],
  },
];

export default function FeaturesPage() {
  return (
    <div className="dbu-page">
      <PublicNavbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative py-20 border-b border-sky-200 dark:border-cyan-900/40 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(14,165,233,0.10),transparent)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(6,182,212,0.18),transparent)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider dbu-badge border border-sky-300 dark:border-cyan-500/40">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
              Platform Capabilities
            </div>
            <h1 className="text-4xl sm:text-6xl font-black dbu-heading tracking-tight leading-[1.1]">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 dark:from-cyan-300 dark:via-sky-300 dark:to-blue-200">
                Institutional-Grade
              </span>{' '}
              Campus Security
            </h1>
            <p className="text-lg text-sky-900/75 dark:text-cyan-100/80 leading-relaxed max-w-2xl mx-auto">
              Every feature was purpose-built to address real threats faced by African university
              campuses — asset theft, impersonation, and zero-accountability paper pass systems.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, category, title, desc, highlights }) => (
              <div key={title}
                className="group p-7 rounded-3xl bg-white dark:bg-[#062238]/60 border border-sky-200 dark:border-cyan-500/25 hover:border-sky-400 dark:hover:border-cyan-400 transition-all shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-cyan-950/30 flex flex-col space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-cyan-950/80 border border-sky-200 dark:border-cyan-500/40 flex items-center justify-center text-sky-600 dark:text-cyan-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-sky-700 dark:text-cyan-300 bg-sky-50 dark:bg-cyan-950/80 px-2.5 py-1 rounded-full border border-sky-200 dark:border-cyan-700/40">
                    {category}
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-base font-bold dbu-heading leading-snug">{title}</h3>
                  <p className="dbu-muted text-sm leading-relaxed">{desc}</p>
                </div>
                <ul className="space-y-2 pt-3 border-t border-sky-100 dark:border-cyan-900/40">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-[12px] font-semibold text-sky-800 dark:text-cyan-100/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 dbu-section-alt">
          <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 space-y-6">
            <h2 className="text-3xl font-black dbu-heading">Ready to Secure Your Campus?</h2>
            <p className="dbu-muted text-base leading-relaxed">
              Log in with your institutional credentials to begin processing gate clearances,
              managing assets, and viewing real-time campus exit analytics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-sm shadow-lg shadow-sky-300/30 dark:shadow-cyan-500/20 transition-all"
              >
                <Lock className="w-4 h-4" />
                Access Security Terminal
              </Link>
              <Link href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white dark:bg-[#062035]/80 border border-sky-300 dark:border-cyan-500/30 text-sky-800 dark:text-white font-semibold text-sm transition-all"
              >
                Contact Security Team
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
