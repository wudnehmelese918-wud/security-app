'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Target,
  Award,
  Users2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building,
  GraduationCap,
  History,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#081528] text-white selection:bg-amber-400 selection:text-blue-950">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden py-20 lg:py-28 border-b border-blue-900/50 bg-gradient-to-b from-[#0a1e3b] to-[#081528]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-900/60 border border-blue-700/60 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400 shrink-0">
                <Image
                  src="/dbu-logo.png"
                  alt="DBU Crest"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              Directorate of Campus Security & Assets
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Safeguarding the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                Debre Berhan University
              </span>
            </h1>
            <p className="text-blue-200/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              A comprehensive digital governance initiative modernizing university physical
              security, asset tracking, and gate verification for over 30,000 campus members.
            </p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-blue-950/40 border border-blue-900/70 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Our Strategic Mission</h2>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                To establish an impenetrable, efficient, and transparent campus perimeter security
                ecosystem. We ensure zero unauthorized asset leakage, seamless student movement,
                and instant cryptographic verification across all university gateways through
                cutting-edge hardware and software synergy.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-blue-950/40 border border-blue-900/70 space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Our Vision</h2>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                To serve as Ethiopia&apos;s benchmark higher-education digital campus security model,
                fostering a peaceful and technology-enabled academic environment where research
                equipment, institutional technology, and student property are safeguarded with
                maximum reliability.
              </p>
            </div>
          </div>
        </section>

        {/* TRANSFORMATION: FROM PAPER TO DIGITAL */}
        <section className="py-20 bg-[#071324] border-t border-b border-blue-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/60 text-blue-200">
                <History className="w-3.5 h-3.5 text-amber-400" />
                Security Modernization
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                The Shift from Paper Ledgers to Real-Time Cloud Verification
              </h2>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                Historically, campus gatekeepers relied on paper logbooks that caused gate bottlenecks,
                illegible records, and lost asset reports. Today, DBU Security runs an instant digital
                chain of custody.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Old vs New */}
              <div className="p-8 rounded-3xl bg-red-950/20 border border-red-900/40 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/20 text-red-300">
                  Legacy Paper Gatebooks (Replaced)
                </span>
                <ul className="space-y-3 text-sm text-red-200/70 pt-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Long queuing and gate congestion during morning and evening rush
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    No photo verification (vulnerable to badge swapping and equipment theft)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Paper registers damaged or lost; impossible to run historical audits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    No cross-gate coordination between Main, Science, and Residence gates
                  </li>
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-900/50 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300">
                  Modern DBU Security System (Active)
                </span>
                <ul className="space-y-3 text-sm text-emerald-200/80 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Sub-second optical barcode & QR camera scan clearance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Dual-photo verification matching registered owner against the carrier
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Cryptographic token hashing with strict role-based access control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Instant synchronized database across all 4 university campus gateways
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ORGANIZATIONAL GOVERNANCE */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Institutional Governance Framework
            </h2>
            <p className="text-blue-200/80 text-sm max-w-xl mx-auto">
              Operated jointly under the executive oversight of university leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Office of the Vice President for Administration',
                role: 'Executive Institutional Oversight',
                desc: 'Establishes campus safety regulations, asset protection bylaws, and security budget allocation.',
                icon: Building,
              },
              {
                title: 'Directorate of Campus Security',
                role: 'Field Operations & Gate Enforcement',
                desc: 'Commanding over 150 certified security guards, patrol officers, and checkpoint supervisors.',
                icon: Shield,
              },
              {
                title: 'ICT Services Directorate',
                role: 'System Architecture & Infrastructure',
                desc: 'Maintains encrypted database replication, optical hardware maintenance, and cybersecurity defenses.',
                icon: Lock,
              },
            ].map(({ title, role, desc, icon: Icon }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-blue-950/30 border border-blue-900/60 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-xs font-semibold text-amber-400">{role}</p>
                <p className="text-xs text-blue-200/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-950 to-[#0e2547] border border-blue-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white">Have Questions or Need Pass Help?</h3>
              <p className="text-blue-200/80 text-sm mt-1">
                Reach out to the 24/7 Security Gate Dispatch or visit our checkpoint booths.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#081528] font-bold text-sm shadow transition-colors"
              >
                Emergency & Contact
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                Officer Portal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
