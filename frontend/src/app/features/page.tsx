'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  QrCode,
  Lock,
  BarChart3,
  Camera,
  AlertOctagon,
  Zap,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function FeaturesPage() {
  const featuresList = [
    {
      icon: QrCode,
      tag: 'Core Clearance Engine',
      title: 'Cryptographic QR Asset Passports',
      desc: 'Each registered laptop, tablet, or laboratory device receives a uniquely serialized QR passport. Encrypted payloads ensure passes cannot be duplicated, screenshot-swapped, or counterfeited.',
      badge: 'Sub-second Verification',
    },
    {
      icon: Camera,
      tag: 'Biometric Integrity',
      title: 'Dual-Photo Facial & Asset Matcher',
      desc: 'Gate terminals display the registered owner’s verified university portrait alongside the physical equipment image. Guards immediately spot identity discrepancies before exit clearance.',
      badge: 'Zero Identity Fraud',
    },
    {
      icon: Lock,
      tag: 'Zero-Trust Architecture',
      title: 'Serious Role-Based Access Control (RBAC)',
      desc: 'Enforces strict organizational privilege isolation: System Admins manage infrastructure, Security Guards perform rapid gate inspections, and Students track their own assets with zero cross-tenant leakage.',
      badge: 'Granular Permissions',
    },
    {
      icon: Zap,
      tag: 'Infrastructure Armor',
      title: 'Sliding-Window Rate Limiting & Anti-Brute-Force',
      desc: 'Sophisticated IP-level token buckets throttle excessive authentication attempts and lock accounts after 5 failures, while preserving ultra-fast scan throughput for busy checkpoints.',
      badge: 'Enterprise Fortified',
    },
    {
      icon: BarChart3,
      tag: 'Compliance & Audits',
      title: 'Immutable Forensic Departure Logs',
      desc: 'Every scan event is stamped with microsecond timestamps, gate identifier, officer credentials, and clearance status. Instantly queryable for campus investigative reports.',
      badge: 'Tamper-Proof Audit',
    },
    {
      icon: AlertOctagon,
      tag: 'Asset Protection',
      title: 'Instant Flagging & Blacklist Interception',
      desc: 'If an item is flagged missing, stolen, or restricted by the department head, optical gate scanners trigger instant visual alerts, blocking gate release automatically.',
      badge: 'Real-time Alerts',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#031524] text-white selection:bg-cyan-400 selection:text-sky-950">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden py-20 lg:py-28 border-b border-cyan-900/40 bg-gradient-to-b from-[#041d33] to-[#031524]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#06243c]/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Advanced Security Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Enterprise Features Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-200">
                Institutional Defense
              </span>
            </h1>
            <p className="text-cyan-100/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              Explore the advanced cryptographic, biometric, and access-control modules powering
              Debre Berhan University&apos;s campus security perimeter.
            </p>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresList.map(({ icon: Icon, tag, title, desc, badge }) => (
              <div
                key={title}
                className="p-8 rounded-3xl bg-[#062238]/60 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-6 group shadow-lg shadow-cyan-950/20"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-400/30">
                      {badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300/80">
                      {tag}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">{title}</h3>
                  </div>
                  <p className="text-cyan-100/70 text-sm leading-relaxed">{desc}</p>
                </div>

                <div className="pt-4 border-t border-cyan-900/40 flex items-center text-xs text-cyan-300 font-semibold gap-1">
                  <span>Module Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM TERMINAL CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#041e33] to-[#07304f] border border-cyan-500/35 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-2xl font-black text-white">Ready to Deploy or Test System?</h3>
              <p className="text-cyan-100/80 text-sm mt-1">
                Access the security guard checkpoint terminal or test equipment pass validation.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-[#02182b] font-black text-sm shadow transition-all"
              >
                Sign In to Terminal
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-100 font-bold text-sm border border-cyan-500/30 transition-colors"
              >
                Learn About System
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
