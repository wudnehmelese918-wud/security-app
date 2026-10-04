'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  ShieldCheck,
  QrCode,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  Layers,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#081528] text-white selection:bg-amber-400 selection:text-blue-950">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-blue-900/40">
          {/* Subtle glow / grid background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(26,58,107,0.5),rgba(255,255,255,0))] pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-900/60 border border-blue-700/60 shadow-inner">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 shrink-0">
                  <Image
                    src="/dbu-logo.png"
                    alt="DBU Emblem"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Debre Berhan University · Security Directorate
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] font-semibold text-amber-400">Ver. 2.4.0</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                Intelligent Campus Security &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                  Gate Clearance
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-blue-200/80 leading-relaxed max-w-3xl mx-auto font-normal">
                Protecting over 30,000 university assets, students, and staff across Debre Berhan
                University. High-speed encrypted QR pass validation, real-time biometric matching,
                and zero-loss asset accountability at every gate.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#081528] font-black text-base shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
                >
                  <Lock className="w-5 h-5 text-[#081528]" />
                  <span>Access Security Terminal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 transition-all hover:border-amber-400/50"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Explore Security Features</span>
                </Link>
              </div>

              {/* Trust & Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-12 border-t border-blue-900/60 mt-12 text-left">
                {[
                  {
                    value: '30,000+',
                    label: 'Campus Community',
                    desc: 'Students, Faculty & Staff',
                  },
                  {
                    value: '< 0.8s',
                    label: 'Clearance Speed',
                    desc: 'Instant QR gate validation',
                  },
                  {
                    value: '99.98%',
                    label: 'System Uptime',
                    desc: '24/7 continuous operation',
                  },
                  {
                    value: '4 Gates',
                    label: 'Campus Checkpoints',
                    desc: 'Fully interconnected live',
                  },
                ].map(({ value, label, desc }) => (
                  <div
                    key={label}
                    className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/50 backdrop-blur-sm"
                  >
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">{value}</p>
                    <p className="text-white font-bold text-sm mt-0.5">{label}</p>
                    <p className="text-blue-300/70 text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW THE SYSTEM WORKS */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How Campus Gate Clearance Works
            </h2>
            <p className="text-blue-200/80 text-base max-w-2xl mx-auto">
              Our 3-step digital chain of custody eliminates paper gate passes and guarantees zero
              unauthorized asset removal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Asset Registration & QR Passport',
                desc: 'Equipment serial numbers, owner identity, photos, and department authorizations are bound to a tamper-proof cryptographic QR code pass.',
                icon: QrCode,
              },
              {
                step: '02',
                title: 'Rapid Checkpoint Scanning',
                desc: 'At any campus gate, security officers scan the pass with optical hardware or camera terminals in under 800ms to verify identity.',
                icon: ShieldCheck,
              },
              {
                step: '03',
                title: 'Instant Log & Clearance Grant',
                desc: 'The gate system validates status, compares owner facial photo against the carrier, logs departure timestamp, and grants passage.',
                icon: Layers,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="relative p-8 rounded-3xl bg-blue-950/30 border border-blue-900/60 hover:border-amber-400/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-amber-400/40 group-hover:text-amber-400 transition-colors font-mono">
                    {step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-blue-900/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CAMPUS GATE CHECKPOINTS */}
        <section className="py-20 bg-[#071324] border-t border-b border-blue-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Active Security Network
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-1">
                  Connected Campus Checkpoints
                </h2>
              </div>
              <p className="text-blue-200/70 text-sm max-w-md">
                Every gate checkpoint operates with synchronized real-time database replication to
                prevent cross-gate asset smuggling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Gate A · Main Gate',
                  zone: 'Administrative Zone',
                  hours: '24/7 Active',
                  status: 'Online',
                  desc: 'Primary vehicular & staff entrance with high-speed automated pass scanner.',
                },
                {
                  name: 'Gate B · Science Gate',
                  zone: 'Technology Complex',
                  hours: '24/7 Active',
                  status: 'Online',
                  desc: 'Specialized checkpoint for lab electronics, computers, and engineering assets.',
                },
                {
                  name: 'Gate C · Maru Gate',
                  zone: 'Student Residential Block',
                  hours: '06:00 - 22:00',
                  status: 'Online',
                  desc: 'Dedicated student laptop & personal tablet departure inspection booth.',
                },
                {
                  name: 'Gate D · Health Gate',
                  zone: 'Medical & Hospital Campus',
                  hours: '24/7 Active',
                  status: 'Online',
                  desc: 'Medical device clearance and hospital clinical staff equipment terminal.',
                },
              ].map(({ name, zone, hours, status, desc }) => (
                <div
                  key={name}
                  className="p-6 rounded-2xl bg-blue-950/40 border border-blue-900/60 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {status}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-300">{hours}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{name}</h4>
                    <p className="text-amber-400 text-xs font-semibold mt-0.5">{zone}</p>
                    <p className="text-blue-200/70 text-xs mt-2 leading-relaxed">{desc}</p>
                  </div>
                  <div className="pt-3 border-t border-blue-900/50 flex items-center justify-between text-[11px] text-blue-300/80">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> DBU Terminal
                    </span>
                    <span className="font-mono text-amber-300">Terminal Linked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY & GOVERNANCE PILLARS */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/60 text-blue-200 border border-blue-700/60">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Enterprise Security Armor
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Engineered for Absolute Integrity & Institutional Compliance
              </h2>
              <p className="text-blue-200/80 text-base leading-relaxed">
                The DBU Gate Security System is fortified with industry-leading safeguards. Every
                transaction is secured against brute-force attacks, token hijacking, and unauthorized
                privilege escalations.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: 'Multi-Tier Rate Limiting (Sliding Window)',
                    desc: 'Blocks brute-force credential stuffing on authentication endpoints while maintaining millisecond scanner responsiveness.',
                  },
                  {
                    title: 'Role-Based Access Control (RBAC)',
                    desc: 'Granular permissions segregate Administrators, Security Gate Officers, and Students/Faculty with strict 403 Forbidden enforcement.',
                  },
                  {
                    title: 'Dual-Photo Carrier Verification',
                    desc: 'Officer terminals visually display the registered owner alongside the physical carrier to prevent impersonation or theft.',
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{title}</p>
                      <p className="text-blue-200/70 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card graphic */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/60 to-[#0c1f38] border border-blue-800/60 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-blue-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-blue-300 ml-2">dbu-security-core</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  ENCRYPTION ACTIVE
                </span>
              </div>

              <div className="font-mono text-xs space-y-2 text-blue-200/80">
                <p className="text-blue-400 font-bold">// Security Protocol Handshake</p>
                <p>
                  &gt; AUTH_MECHANISM: <span className="text-amber-300">JWT / SHA-256</span>
                </p>
                <p>
                  &gt; RATE_LIMIT: <span className="text-amber-300">Active (10 req/15m auth, 120/m scan)</span>
                </p>
                <p>
                  &gt; ACCESS_POLICY: <span className="text-amber-300">RBAC (Admin, Assistant, Guest)</span>
                </p>
                <p>
                  &gt; GATE_LATENCY: <span className="text-emerald-400">42ms avg response</span>
                </p>
                <p>
                  &gt; AUDIT_TRAIL: <span className="text-emerald-400">Immutable timestamp log</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-800/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Need Security Terminal Access?</p>
                  <p className="text-[11px] text-blue-300">Authorized personnel only</p>
                </div>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#081528] font-bold text-xs shadow transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
