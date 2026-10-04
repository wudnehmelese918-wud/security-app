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
  Sparkles,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import CampusCarousel from '@/components/home/CampusCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#031524] text-white selection:bg-cyan-400 selection:text-sky-950">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-cyan-900/40">
          {/* Subtle water glow / radial background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.25),rgba(255,255,255,0))] pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[350px] h-[300px] bg-sky-400/15 blur-[110px] rounded-full pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#07243c]/80 border border-cyan-500/40 shadow-inner">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-400 shrink-0">
                  <Image
                    src="/dbu-logo.png"
                    alt="DBU Emblem"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                  Debre Berhan University · Security Directorate
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-cyan-300">Ver. 2.4.0</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                Intelligent Campus Security &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-200">
                  Gate Clearance
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-cyan-100/80 leading-relaxed max-w-3xl mx-auto font-normal">
                Protecting over 30,000 university assets, students, and staff across Debre Berhan
                University. High-speed encrypted QR pass validation, real-time biometric matching,
                and zero-loss asset accountability at every gate.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 text-[#02182b] font-black text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.99] transition-all"
                >
                  <Lock className="w-5 h-5 text-[#02182b]" />
                  <span>Access Security Terminal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#062035]/80 hover:bg-[#082a47] text-white font-bold text-base border border-cyan-500/30 transition-all hover:border-cyan-400"
                >
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Explore Security Features</span>
                </Link>
              </div>

              {/* Trust & Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-cyan-900/40 mt-10 text-left">
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
                    className="p-5 rounded-2xl bg-[#062238]/60 border border-cyan-500/25 backdrop-blur-sm shadow-lg"
                  >
                    <p className="text-2xl sm:text-3xl font-black text-cyan-300">{value}</p>
                    <p className="text-white font-bold text-sm mt-0.5">{label}</p>
                    <p className="text-cyan-200/70 text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CAMPUS CAROUSEL SHOWCASE SECTION */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#031524] via-[#051e33] to-[#031524] relative overflow-hidden border-b border-cyan-900/40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/70 text-cyan-300 border border-cyan-500/40">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>DBU Campus Photography</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Debre Berhan University Campus Grounds
              </h2>
              <p className="text-cyan-100/80 text-base max-w-2xl mx-auto">
                Take a visual tour of our scenic academic corridors, state-of-the-art facilities,
                and perimeter gates secured around the clock.
              </p>
            </div>

            {/* The Campus Carousel */}
            <CampusCarousel />
          </div>
        </section>

        {/* HOW THE SYSTEM WORKS */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How Campus Gate Clearance Works
            </h2>
            <p className="text-cyan-100/80 text-base max-w-2xl mx-auto">
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
                className="relative p-8 rounded-3xl bg-[#062238]/60 border border-cyan-500/30 hover:border-cyan-400 transition-all group shadow-lg shadow-cyan-950/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black text-cyan-400/40 group-hover:text-cyan-300 transition-colors font-mono">
                    {step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-cyan-100/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CAMPUS GATE CHECKPOINTS */}
        <section className="py-20 bg-[#041a2c] border-t border-b border-cyan-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Active Security Network
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mt-1">
                  Connected Campus Checkpoints
                </h2>
              </div>
              <p className="text-cyan-100/70 text-sm max-w-md">
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
                  className="p-6 rounded-2xl bg-[#062238]/60 border border-cyan-500/25 flex flex-col justify-between space-y-4 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {status}
                      </span>
                      <span className="text-[11px] font-semibold text-cyan-200">{hours}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{name}</h4>
                    <p className="text-cyan-300 text-xs font-semibold mt-0.5">{zone}</p>
                    <p className="text-cyan-100/70 text-xs mt-2 leading-relaxed">{desc}</p>
                  </div>
                  <div className="pt-3 border-t border-cyan-900/40 flex items-center justify-between text-[11px] text-cyan-200/80">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" /> DBU Terminal
                    </span>
                    <span className="font-mono text-cyan-300">Terminal Linked</span>
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-950/60 text-cyan-200 border border-cyan-500/40">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Enterprise Security Armor
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Engineered for Absolute Integrity & Institutional Compliance
              </h2>
              <p className="text-cyan-100/80 text-base leading-relaxed">
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
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-400/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{title}</p>
                      <p className="text-cyan-100/70 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card graphic in water blue */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#06243d] to-[#041a2c] border border-cyan-500/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-cyan-800/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-cyan-300 ml-2">dbu-security-core</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                  ENCRYPTION ACTIVE
                </span>
              </div>

              <div className="font-mono text-xs space-y-2 text-cyan-100/80">
                <p className="text-cyan-400 font-bold">// Security Protocol Handshake</p>
                <p>
                  &gt; AUTH_MECHANISM: <span className="text-cyan-300">JWT / SHA-256</span>
                </p>
                <p>
                  &gt; RATE_LIMIT: <span className="text-cyan-300">Active (10 req/15m auth, 120/m scan)</span>
                </p>
                <p>
                  &gt; ACCESS_POLICY: <span className="text-cyan-300">RBAC (Admin, Assistant, Guest)</span>
                </p>
                <p>
                  &gt; GATE_LATENCY: <span className="text-emerald-400">42ms avg response</span>
                </p>
                <p>
                  &gt; AUDIT_TRAIL: <span className="text-emerald-400">Immutable timestamp log</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Need Security Terminal Access?</p>
                  <p className="text-[11px] text-cyan-200">Authorized personnel only</p>
                </div>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-[#02182b] font-bold text-xs shadow transition-all"
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
