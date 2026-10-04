'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield, Target, Award, Lock,
  CheckCircle2, Building, History, ArrowRight,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function AboutPage() {
  return (
    <div className="dbu-page selection:bg-sky-200 dark:selection:bg-cyan-400 selection:text-sky-950">
      <PublicNavbar />

      <main className="flex-1">

        {/* HERO BANNER */}
        <section className="relative overflow-hidden py-20 lg:py-28 border-b border-sky-200 dark:border-cyan-900/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(14,165,233,0.10),transparent)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(6,182,212,0.18),transparent)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full dbu-badge border border-sky-300 dark:border-cyan-500/40 text-xs font-bold uppercase tracking-wider">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-sky-400 dark:border-cyan-400 shrink-0">
                <Image src="/dbu-logo.png" alt="DBU" width={24} height={24} className="w-full h-full object-cover rounded-full" priority />
              </div>
              <span className="text-sky-800 dark:text-cyan-200">Debre Berhan University — Est. 2007</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black dbu-heading tracking-tight leading-[1.1]">
              About the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 dark:from-cyan-300 dark:via-sky-300 dark:to-blue-200">
                DBU Gate Security
              </span>{' '}
              System
            </h1>
            <p className="text-lg text-sky-900/75 dark:text-cyan-100/80 leading-relaxed max-w-2xl mx-auto">
              A mission-critical digital infrastructure protecting the university's 30,000-member
              community and its entire inventory of institutional assets.
            </p>
          </div>
        </section>

        {/* MISSION / VISION */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                desc: 'To make unauthorized removal of university property impossible through digital accountability, while accelerating legitimate exit clearance for students and staff.',
              },
              {
                icon: Shield,
                title: 'Our Mandate',
                desc: 'Deployed under the directive of the University Security Directorate to modernize paper-based gate passes and eliminate the loopholes exploited for asset theft.',
              },
              {
                icon: Award,
                title: 'Our Standard',
                desc: 'We adhere to internationally recognized Information Security Management standards (ISO 27001 framework) and Ethiopian Higher Education Institution guidelines.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 rounded-3xl bg-white dark:bg-[#062238]/60 border border-sky-200 dark:border-cyan-500/25 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-cyan-950/80 border border-sky-200 dark:border-cyan-500/40 flex items-center justify-center text-sky-600 dark:text-cyan-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black dbu-heading">{title}</h3>
                <p className="dbu-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HISTORY */}
        <section className="py-20 dbu-section-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-sky-600 dark:text-cyan-400" />
                  <h2 className="text-2xl font-black dbu-heading">System History & Development</h2>
                </div>
                <div className="space-y-6 pl-2">
                  {[
                    { year: '2022', event: 'Project Inception', desc: 'University administration commissioned a digital gate security feasibility study following asset loss incidents.' },
                    { year: '2023', event: 'Prototype Deployment', desc: 'First pilot terminal installed at Gate A (Main Gate) with 500 registered assets for controlled testing.' },
                    { year: '2024', event: 'Full Campus Rollout', desc: 'All 4 gates were equipped. Over 15,000 assets registered. Digital passes replaced all paper gate pass systems.' },
                    { year: '2025', event: 'v2.0 — AI Enhancement', desc: 'Real-time anomaly detection and smart alert routing introduced. System now tracks 30,000+ assets.' },
                  ].map(({ year, event, desc }, i) => (
                    <div key={year} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-10 h-10 rounded-full bg-sky-500 dark:bg-cyan-400 text-white dark:text-[#02182b] flex items-center justify-center text-xs font-black shadow-md">
                          {year.slice(2)}
                        </div>
                        {i < 3 && <div className="w-0.5 h-12 bg-sky-200 dark:bg-cyan-800/50 mt-2" />}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-400">{year}</p>
                        <p className="font-black dbu-heading text-base">{event}</p>
                        <p className="dbu-muted text-sm mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black dbu-heading">Technology Foundation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { layer: 'Frontend', stack: 'Next.js 14 · TypeScript · Tailwind CSS', icon: '⚡' },
                    { layer: 'Backend', stack: 'Node.js · Express · TypeScript', icon: '🖥️' },
                    { layer: 'Database', stack: 'PostgreSQL · Prisma ORM', icon: '🗄️' },
                    { layer: 'Auth', stack: 'JWT · bcrypt · Rate Limiting', icon: '🔐' },
                    { layer: 'QR Engine', stack: 'QRCode.js · Crypto SHA-256', icon: '📱' },
                    { layer: 'Deployment', stack: 'Vercel (Full Stack)', icon: '🚀' },
                  ].map(({ layer, stack, icon }) => (
                    <div key={layer} className="p-4 rounded-2xl bg-white dark:bg-[#062238]/60 border border-sky-200 dark:border-cyan-500/25 shadow-sm">
                      <p className="text-lg">{icon}</p>
                      <p className="font-bold dbu-heading text-sm mt-1">{layer}</p>
                      <p className="text-sky-700 dark:text-cyan-200/80 text-xs mt-0.5 leading-relaxed">{stack}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY PILLARS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black dbu-heading mb-10 text-center">Security Commitments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Zero paper gate passes — 100% digital audit trail',
              'Multi-factor identity verification at each checkpoint',
              'Encrypted asset records — never stored in plaintext',
              'Daily automated backups to off-site storage',
              'Role isolation prevents cross-privilege data leaks',
              'Incident logs are append-only and tamper-evident',
            ].map((commitment) => (
              <div key={commitment} className="flex items-start gap-3 p-5 rounded-2xl bg-white dark:bg-[#062238]/60 border border-sky-200 dark:border-cyan-500/25 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-sky-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                <p className="dbu-body text-sm font-semibold leading-relaxed">{commitment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* UNIVERSITY INFO */}
        <section className="py-20 dbu-section-alt">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building className="w-8 h-8 text-sky-600 dark:text-cyan-400" />
              <h2 className="text-2xl font-black dbu-heading">Debre Berhan University</h2>
            </div>
            <p className="dbu-muted text-base leading-relaxed">
              Founded in 2007, Debre Berhan University is a public research university located in the city of Debre Berhan,
              Amhara Region, Ethiopia. With over 15 colleges and institutes, the university serves more than 30,000 students
              across undergraduate, postgraduate, and doctoral programmes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              {[
                { value: '2007', label: 'Founded' },
                { value: '30K+', label: 'Students Enrolled' },
                { value: '15+', label: 'Colleges & Institutes' },
                { value: '4', label: 'Security Checkpoints' },
              ].map(({ value, label }) => (
                <div key={label} className="p-4 rounded-2xl bg-white dark:bg-[#062238]/60 border border-sky-200 dark:border-cyan-500/25 shadow-sm">
                  <p className="text-2xl font-black text-sky-600 dark:text-cyan-300">{value}</p>
                  <p className="dbu-muted text-xs mt-0.5 font-semibold">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-sky-300/30 dark:shadow-cyan-500/20"
              >
                Explore Features <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#062035]/80 border border-sky-300 dark:border-cyan-500/30 text-sky-800 dark:text-white font-semibold text-sm"
              >
                <Lock className="w-4 h-4 text-sky-500 dark:text-cyan-400" />
                Contact & Emergency
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
