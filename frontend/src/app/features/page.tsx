'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  QrCode,
  Lock,
  Layers,
  BarChart3,
  Camera,
  AlertOctagon,
  FileCheck2,
  Clock,
  ArrowRight,
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
    <div className="min-h-screen flex flex-col bg-[#081528] text-white selection:bg-amber-400 selection:text-blue-950">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden py-20 lg:py-28 border-b border-blue-900/50 bg-gradient-to-b from-[#0a1e3b] to-[#081528]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Advanced Security Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Enterprise Features Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                Institutional Defense
              </span>
            </h1>
            <p className="text-blue-200/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
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
                className="p-8 rounded-3xl bg-blue-950/30 border border-blue-900/60 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      {badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
                      {tag}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">{title}</h3>
                  </div>
                  <p className="text-blue-200/70 text-sm leading-relaxed">{desc}</p>
                </div>

                <div className="pt-4 border-t border-blue-900/50 flex items-center text-xs text-amber-400 font-semibold gap-1">
                  <span>Module Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM TERMINAL CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-950 to-[#0e2547] border border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white">Ready to Deploy or Test System?</h3>
              <p className="text-blue-200/80 text-sm mt-1">
                Access the security guard checkpoint terminal or test equipment pass validation.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#081528] font-black text-sm shadow transition-colors"
              >
                Sign In to Terminal
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors"
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
