'use client';

import React, { useState } from 'react';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    idNumber: '',
    category: 'pass-clearance',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#031524] text-white selection:bg-cyan-400 selection:text-sky-950">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden py-20 lg:py-28 border-b border-cyan-900/40 bg-gradient-to-b from-[#041d33] to-[#031524]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/70 border border-red-700/60 text-red-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              24/7 Security Emergency Response
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Emergency Dispatch &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-200">
                Gate Helpdesk
              </span>
            </h1>
            <p className="text-cyan-100/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              Direct connection to Debre Berhan University gate checkpoints, campus patrol
              commanders, and asset registration officers.
            </p>
          </div>
        </section>

        {/* CONTACT DIRECTORY & FORM */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Direct Phone & Gate Booths */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white mb-2">Immediate Gate Contacts</h2>
                <p className="text-cyan-100/70 text-sm">
                  In case of urgent gate clearance disputes, lost assets, or security emergencies,
                  call our field operators directly.
                </p>
              </div>

              {/* Emergency Hotline Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-red-950/30 border border-red-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> 24/7 Emergency Line
                  </div>
                  <p className="text-2xl font-black text-white font-mono">991 / 907</p>
                  <p className="text-xs text-red-200/70">Campus Police & Security Liaison</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#062238]/60 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <Phone className="w-4 h-4" /> Security Dispatch Office
                  </div>
                  <p className="text-2xl font-black text-white font-mono">+251 11 681 5440</p>
                  <p className="text-xs text-cyan-200/70">Extension 114 (Central Command)</p>
                </div>
              </div>

              {/* Gate Booths List */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">Station Checkpoint Terminals</h3>
                <div className="space-y-2.5">
                  {[
                    {
                      name: 'Gate 1 · Main Administrative Gate',
                      ext: 'Ext. 101',
                      duty: 'Officer on Duty 24/7',
                    },
                    {
                      name: 'Gate 2 · Science & Technology Gate',
                      ext: 'Ext. 102',
                      duty: 'Officer on Duty 24/7',
                    },
                    {
                      name: 'Gate 3 · Maru Student Residence Gate',
                      ext: 'Ext. 103',
                      duty: '06:00 - 22:00 Active',
                    },
                    {
                      name: 'Gate 4 · Health Sciences & Hospital Gate',
                      ext: 'Ext. 104',
                      duty: 'Officer on Duty 24/7',
                    },
                  ].map(({ name, ext, duty }) => (
                    <div
                      key={name}
                      className="p-4 rounded-xl bg-[#062238]/50 border border-cyan-500/25 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{name}</p>
                        <p className="text-xs text-cyan-200/70">{duty}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-500/40">
                        {ext}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Address */}
              <div className="p-6 rounded-2xl bg-[#051e33] border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Campus Headquarters
                </div>
                <p className="text-white text-sm font-bold">
                  Debre Berhan University · Security Directorate Building
                </p>
                <p className="text-xs text-cyan-100/70 leading-relaxed">
                  Located near the Main Administrative Complex, P.O. Box 445, Debre Berhan, Amhara
                  National Regional State, Ethiopia.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Report & Helpdesk Form */}
            <div className="p-8 rounded-3xl bg-[#062238]/60 border border-cyan-500/30 shadow-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Submit Incident / Clearance Inquiry</h2>
                <p className="text-cyan-100/70 text-sm mt-1">
                  Report a lost equipment item, inquire about an asset QR pass, or reach out to
                  campus security administrators.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-400/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
                  <p className="text-cyan-100/80 text-sm leading-relaxed max-w-sm mx-auto">
                    Your report has been logged in the security incident dispatch queue. A campus
                    security officer will follow up with you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        idNumber: '',
                        category: 'pass-clearance',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-[#02182b] font-bold text-xs shadow hover:from-cyan-300 hover:to-sky-300 transition-all"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-cyan-200">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Abebe Bekele"
                        className="w-full h-11 px-4 rounded-xl bg-[#041a2e] border border-cyan-500/30 text-white placeholder:text-cyan-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-cyan-200">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@dbu.edu.et"
                        className="w-full h-11 px-4 rounded-xl bg-[#041a2e] border border-cyan-500/30 text-white placeholder:text-cyan-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-cyan-200">
                        University ID or Asset ID
                      </label>
                      <input
                        type="text"
                        value={form.idNumber}
                        onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                        placeholder="e.g. DBU/1234/14 or DBULT0001"
                        className="w-full h-11 px-4 rounded-xl bg-[#041a2e] border border-cyan-500/30 text-white placeholder:text-cyan-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-cyan-200">Inquiry Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-[#041a2e] border border-cyan-500/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="pass-clearance">Equipment Pass Clearance Issue</option>
                        <option value="lost-item">Report Missing / Stolen Equipment</option>
                        <option value="registration">New Asset Registration Query</option>
                        <option value="gate-feedback">Gate Officer Conduct Feedback</option>
                        <option value="other">General Security Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-cyan-200">Incident Details</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe the checkpoint location, asset details, or security incident..."
                      className="w-full p-4 rounded-xl bg-[#041a2e] border border-cyan-500/30 text-white placeholder:text-cyan-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 text-[#02182b] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit to Security Dispatch</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
