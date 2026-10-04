'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, KeyRound, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.token, res.data.user);
      toast({
        title: '✅ Access Granted',
        description: `Welcome back, ${res.data.user.fullName} (${res.data.user.role.toUpperCase()})`,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Authentication failed. Please verify your credentials.';
      toast({ title: '❌ Authentication Denied', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div
      className="min-h-screen flex items-stretch relative overflow-hidden selection:bg-cyan-400 selection:text-sky-950"
      style={{
        backgroundImage: "url('/carousel/campus-4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Water blue dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#031524]/95 via-[#041d33]/85 to-[#021424]/60 z-0" />

      {/* Left branding panel */}
      <div className="relative z-10 flex-1 hidden md:flex flex-col justify-between px-16 py-12 max-w-[55%]">
        <div>
          {/* Official DBU Logo */}
          <Link href="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 p-0.5 border-2 border-cyan-400 shadow-xl shadow-cyan-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/dbu-logo.png"
                alt="Debre Berhan University Official Crest"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <div>
              <p className="text-white font-black text-2xl leading-tight tracking-wide group-hover:text-cyan-300 transition-colors">
                DBU Security
              </p>
              <p className="text-cyan-300 text-sm font-semibold">Guard & Gate Clearance System</p>
            </div>
          </Link>

          {/* Tagline */}
          <h1 className="text-5xl font-black text-white leading-tight mb-6 drop-shadow-lg">
            Guarding Debre Berhan.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-200">
              Zero-Compromise Security.
            </span>
          </h1>
          <p className="text-cyan-100/80 text-lg leading-relaxed max-w-lg">
            Debre Berhan University&apos;s digital security platform — track equipment, verify
            biometric identity, and enforce multi-role gate access in real time.
          </p>

          {/* Security Features List */}
          <div className="mt-8 space-y-3 max-w-md">
            {[
              'Rate-limited authentication with sliding-window protection',
              'Strict Role-Based Access Control (Admin, Guard, Student)',
              'Instant cryptographic QR validation & audit trail',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm text-cyan-200/90">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Return to Public Home */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public University Portal</span>
          </Link>
        </div>
      </div>

      {/* Right login card */}
      <div className="relative z-10 flex items-center justify-center flex-1 p-6 md:p-12">
        <div
          className="w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl"
          style={{
            background: 'rgba(4, 25, 45, 0.85)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1.5px solid rgba(6, 182, 212, 0.35)',
          }}
        >
          {/* Top Return link for mobile */}
          <div className="flex md:hidden items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-cyan-300 font-bold"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-400">
                <Image
                  src="/dbu-logo.png"
                  alt="DBU Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <span className="text-xs text-cyan-200/60">DBU Portal</span>
          </div>

          {/* Card header */}
          <div>
            <h2 className="text-2xl font-black text-white">Sign In to Terminal</h2>
            <p className="text-cyan-100/70 text-sm mt-1">
              Authorized credentials required for gate terminal operations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-cyan-100 text-sm font-semibold">
                University Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@dbu.edu.et"
                  className="pl-10 h-11 bg-white/5 border-cyan-500/30 text-white placeholder:text-cyan-300/30 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-300 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-cyan-100 text-sm font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300/50" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-white/5 border-cyan-500/30 text-white placeholder:text-cyan-300/30 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 text-[#02182b] font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 mt-2 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#02182b]" />
                  Verifying Credentials...
                </span>
              ) : (
                'Sign In to Security Terminal'
              )}
            </Button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-2 border-t border-cyan-800/40 space-y-2">
            <p className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Quick Demo Role Switcher:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@dbu.edu.et')}
                className="py-1.5 px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40 text-[11px] font-bold transition-colors truncate"
                title="Admin Role"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('guard@dbu.edu.et')}
                className="py-1.5 px-2 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-200 border border-sky-500/40 text-[11px] font-bold transition-colors truncate"
                title="Security Guard Role"
              >
                Guard
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('guest@dbu.edu.et')}
                className="py-1.5 px-2 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-teal-200 border border-teal-500/40 text-[11px] font-bold transition-colors truncate"
                title="Student / Guest Role"
              >
                Student
              </button>
            </div>
            <p className="text-[10px] text-cyan-200/50 text-center">
              Password for all demo accounts: <code className="text-cyan-300">password123</code>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-cyan-800/40 pt-3">
            <p className="text-center text-cyan-200/50 text-[11px]">
              © {new Date().getFullYear()} Debre Berhan University · Security Directorate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
