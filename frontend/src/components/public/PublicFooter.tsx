import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, FileCheck2, Scale, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#021424] text-cyan-100 border-t border-cyan-900/50">
      {/* Top emergency dispatch banner */}
      <div className="bg-gradient-to-r from-[#031c30] via-[#052844] to-[#031c30] border-b border-cyan-700/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-cyan-300 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>24/7 CAMPUS SECURITY DISPATCH:</span>
            <span className="text-white font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
              Direct: +251 (0) 11 681 5440
            </span>
            <span className="text-white font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
              Emergency: 991
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-cyan-200/80">
            <span>Main Checkpoint Gate: Operational</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Science & Technology Gate: Operational</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dormitory Access Gate: Operational</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Institutional Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/10 p-0.5 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 shrink-0">
                <Image
                  src="/dbu-logo.png"
                  alt="Debre Berhan University Crest"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-white font-black text-lg tracking-wide">
                  DEBRE BERHAN UNIVERSITY
                </p>
                <p className="text-cyan-300 text-xs font-semibold">
                  Directorate of Campus Security & Assets
                </p>
              </div>
            </div>

            <p className="text-cyan-100/70 text-sm leading-relaxed pr-6">
              The official centralized security infrastructure engineered for Debre Berhan
              University (DBU). Providing real-time asset enrollment, cryptographic QR gate pass
              clearance, biometric owner verification, and instant digital departure audits across
              all campus entry points.
            </p>

            <div className="space-y-2 pt-2 text-xs text-cyan-200/80">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Debre Berhan University Main Campus, Amhara Region, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+251 (0) 11 681 5440 / Extension 114 (Security Control)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>security@dbu.edu.et / info@dbu.edu.et</span>
              </div>
            </div>
          </div>

          {/* Column 2: System Navigation */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-cyan-800/60 pb-2">
              System Modules
            </h4>
            <ul className="space-y-2 text-sm text-cyan-100/70">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Gate Clearance Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  About Security Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-cyan-300 transition-colors">
                  Verification Features
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                  Emergency & Gate Helpdesk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-300 transition-colors">
                  Staff / Guard Portal Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">
                  Officer Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Checkpoints & Campus Units */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-cyan-800/60 pb-2">
              Campus Checkpoints
            </h4>
            <ul className="space-y-2 text-sm text-cyan-100/70">
              <li>• Gate A: Main Administrative Entrance</li>
              <li>• Gate B: Science & Technology Complex</li>
              <li>• Gate C: Atse Zera Yacob Hall Gate</li>
              <li>• Gate D: Health Sciences & Hospital Gate</li>
              <li>• Gate E: Agriculture & Veterinary Gate</li>
              <li>• Security Command Central Center</li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal License */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-cyan-800/60 pb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyan-400" />
              Governance & License
            </h4>
            <div className="space-y-2 text-xs text-cyan-100/70">
              <p>
                <strong>Institutional License:</strong> DBU-ESG-2026. Proprietary software
                developed under the authority of Debre Berhan University Senate Security Protocol.
              </p>
              <p>
                <strong>Asset Clearance Policy:</strong> In accordance with DBU Senate Legislation
                Article 142, all electronic property (laptops, lab equipment, tablets) must possess a
                valid digital pass prior to exit.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-cyan-300">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">ISO/IEC 27001 Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Institutional License & Software Attribution Footage */}
        <div className="mt-12 pt-8 border-t border-cyan-900/60 text-xs text-cyan-300/60 space-y-4">
          <div className="bg-[#041d33]/80 border border-cyan-800/40 rounded-xl p-4 leading-relaxed">
            <p className="font-semibold text-white mb-1">
              INSTITUTIONAL SOFTWARE LICENSE & USAGE NOTICE:
            </p>
            <p>
              This web application, database schema, and gate scanning algorithm are the exclusive
              intellectual property of <strong>Debre Berhan University (DBU)</strong>. Unauthorized
              reproduction, network intrusion, token forgery, or malicious tampering with security
              exit records is punishable under the Federal Democratic Republic of Ethiopia
              Computer Crime Proclamation No. 958/2016. All checkpoint activities are cryptographically
              logged and audited in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>
              © {new Date().getFullYear()} Debre Berhan University (DBU). All Rights Reserved.
              Directorate of Campus Security & Assets.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-cyan-300 transition-colors">
                Security Policy
              </Link>
              <Link href="/features" className="hover:text-cyan-300 transition-colors">
                System Terms
              </Link>
              <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                Emergency Hotline
              </Link>
              <span className="text-cyan-400 font-mono">v2.4.0-Production</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
