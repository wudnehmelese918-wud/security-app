'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';
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
      className="min-h-screen flex items-stretch relative overflow-hidden"
      style={{
        backgroundImage: "url('/campus-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40 z-0" />

      {/* Left branding panel */}
      <div className="relative z-10 flex-1 hidden md:flex flex-col justify-between px-16 py-12 max-w-[55%]">
        <div>
          {/* Official DBU Logo */}
          <Link href="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 p-0.5 border-2 border-yellow-400 shadow-xl shrink-0 group-hover:scale-105 transition-transform">
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
              <p className="text-white font-black text-2xl leading-tight tracking-wide group-hover:text-yellow-400 transition-colors">
                DBU Security
              </p>
              <p className="text-yellow-400 text-sm font-semibold">Guard & Gate Clearance System</p>
            </div>
          </Link>

          {/* Tagline */}
          <h1 className="text-5xl font-black text-white leading-tight mb-6 drop-shadow-lg">
            Guarding Debre Berhan.<br />
            <span className="text-yellow-400">Zero-Compromise Security.</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-lg">
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
              <div key={text} className="flex items-center gap-3 text-sm text-blue-200/90">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Return to Public Home */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
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
            background: 'rgba(10, 25, 48, 0.75)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1.5px solid rgba(255,255,255,0.18)',
          }}
        >
          {/* Top Return link for mobile */}
          <div className="flex md:hidden items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-yellow-400 font-bold"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-yellow-400">
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
            <span className="text-xs text-white/50">DBU Portal</span>
          </div>

          {/* Card header */}
          <div>
            <h2 className="text-2xl font-black text-white">Sign In to Terminal</h2>
            <p className="text-white/65 text-sm mt-1">
              Authorized credentials required for gate terminal operations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/80 text-sm font-semibold">
                University Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@dbu.edu.et"
                  className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/35 focus-visible:ring-yellow-400/50 focus-visible:border-yellow-400"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-300 text-xs">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/80 text-sm font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/35 focus-visible:ring-yellow-400/50 focus-visible:border-yellow-400"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white transition-colors"
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
              className="w-full h-11 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm tracking-wide shadow-lg mt-2 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-950" />
                  Verifying Credentials...
                </span>
              ) : (
                'Sign In to Security Terminal'
              )}
            </Button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-2 border-t border-white/15 space-y-2">
            <p className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" /> Quick Demo Role Switcher:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@dbu.edu.et')}
                className="py-1.5 px-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 text-[11px] font-bold transition-colors truncate"
                title="Admin Role"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('guard@dbu.edu.et')}
                className="py-1.5 px-2 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-500/40 text-[11px] font-bold transition-colors truncate"
                title="Security Guard Role"
              >
                Guard
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('guest@dbu.edu.et')}
                className="py-1.5 px-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 text-[11px] font-bold transition-colors truncate"
                title="Student / Guest Role"
              >
                Student
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center">
              Password for all demo accounts: <code className="text-yellow-300">password123</code>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-center text-white/40 text-[11px]">
              © {new Date().getFullYear()} Debre Berhan University · Security Directorate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
