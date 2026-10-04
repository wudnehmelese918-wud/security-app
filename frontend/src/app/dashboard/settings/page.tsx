'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Settings,
  Shield,
  Volume2,
  VolumeX,
  Database,
  User,
  Info,
  Server,
  Sparkles,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/components/ui/use-toast';
import { sounds } from '@/lib/sound';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();


  // Settings preferences persisted in localStorage
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoResetSeconds, setAutoResetSeconds] = useState(3);
  const [defaultMode, setDefaultMode] = useState<'exit' | 'entry'>('exit');
  const [seeding, setSeeding] = useState(false);
  const [systemHealth, setSystemHealth] = useState<'checking' | 'healthy' | 'unreachable'>('checking');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('dbu_sound_enabled');
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');

      const savedReset = localStorage.getItem('dbu_auto_reset');
      if (savedReset !== null) setAutoResetSeconds(Number(savedReset));

      const savedMode = localStorage.getItem('dbu_default_mode');
      if (savedMode === 'exit' || savedMode === 'entry') setDefaultMode(savedMode);
    }

    // Check system health
    api
      .get('/health')
      .then(() => setSystemHealth('healthy'))
      .catch(() => setSystemHealth('unreachable'));
  }, []);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('dbu_sound_enabled', String(enabled));
    if (enabled) {
      sounds.playApproved();
      toast({ title: 'Sound enabled', description: 'Scanner audio feedback is now ON.' });
    } else {
      toast({ title: 'Sound disabled', description: 'Scanner audio feedback is now MUTED.' });
    }
  };

  const handleSetAutoReset = (sec: number) => {
    setAutoResetSeconds(sec);
    localStorage.setItem('dbu_auto_reset', String(sec));
    toast({ title: 'Preference saved', description: `Auto-reset set to ${sec === 0 ? 'Manual' : `${sec} seconds`}.` });
  };

  const handleSetDefaultMode = (mode: 'exit' | 'entry') => {
    setDefaultMode(mode);
    localStorage.setItem('dbu_default_mode', mode);
    toast({ title: 'Preference saved', description: `Default scan mode is now ${mode.toUpperCase()}.` });
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await api.post('/dashboard/seed');
      toast({
        title: '🌱 Demo Data Seeded!',
        description: 'Sample students, laptops, and gate logs have been added.',
      });
    } catch {
      toast({ title: 'Seed Error', description: 'Could not seed demo data.', variant: 'destructive' });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-dbu-blue" />
          System Settings & Preferences
        </h1>
        <p className="text-gray-500 text-sm">
          Configure gate checkpoint behavior, sound alerts, and sample data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gate Scanner Preferences */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b">
            <Shield className="w-5 h-5 text-dbu-blue" />
            <h2 className="font-bold text-gray-900">Gate Scanner Settings</h2>
          </div>

          {/* Sound Alert Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-semibold text-gray-800 flex items-center gap-1.5">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-green-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
                Scanner Audio Alerts
              </Label>
              <p className="text-xs text-gray-500">
                Audible chime on approval and double buzz on rejected scans
              </p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleToggleSound(true)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  soundEnabled ? 'bg-white shadow text-green-700' : 'text-gray-500'
                }`}
              >
                ON
              </button>
              <button
                type="button"
                onClick={() => handleToggleSound(false)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  !soundEnabled ? 'bg-white shadow text-gray-800' : 'text-gray-500'
                }`}
              >
                MUTE
              </button>
            </div>
          </div>

          {/* Test Sound Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => sounds.playApproved()}
              className="text-xs flex-1 gap-1 text-green-700"
            >
              Test Approval Chime
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => sounds.playRejected()}
              className="text-xs flex-1 gap-1 text-red-700"
            >
              Test Reject Buzz
            </Button>
          </div>

          {/* Default Mode on Load */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="font-semibold text-gray-800">Default Scan Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSetDefaultMode('exit')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                  defaultMode === 'exit'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                🚪 Exit (OUT)
              </button>
              <button
                type="button"
                onClick={() => handleSetDefaultMode('entry')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                  defaultMode === 'entry'
                    ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                🏠 Entry (IN)
              </button>
            </div>
          </div>

          {/* Auto-reset Delay */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="font-semibold text-gray-800">Scanner Auto-Reset Delay</Label>
            <p className="text-xs text-gray-500">
              Seconds to display the verdict before resetting for the next scan
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 5, 0].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleSetAutoReset(sec)}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                    autoResetSeconds === sec
                      ? 'border-dbu-blue bg-blue-50 text-dbu-blue ring-2 ring-blue-100'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {sec === 0 ? 'Manual' : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Data & Diagnostics */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b">
            <Database className="w-5 h-5 text-dbu-blue" />
            <h2 className="font-bold text-gray-900">Database & Demo Data</h2>
          </div>

          {/* Seed Data Action */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 leading-relaxed">
              Quickly populate the system with realistic sample records:
              Student laptops (Computer Science, Electrical Eng), staff workstations, and exit/entry logs.
            </p>
            <Button
              onClick={handleSeedData}
              disabled={seeding}
              className="w-full gap-2 bg-gradient-to-r from-dbu-blue to-blue-800 text-white shadow-md hover:from-blue-900 hover:to-blue-950"
            >
              <Sparkles className={cn('w-4 h-4 text-dbu-gold', seeding && 'animate-spin')} />
              {seeding ? 'Generating Data...' : 'Seed Sample University Assets'}
            </Button>
          </div>

          {/* System Status */}
          <div className="pt-3 border-t space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
              <Server className="w-4 h-4 text-gray-500" />
              System Status
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">API Health:</span>
                <span className="font-semibold flex items-center gap-1">
                  {systemHealth === 'healthy' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-700">Online & Responding</span>
                    </>
                  ) : systemHealth === 'checking' ? (
                    <span className="text-gray-400">Checking...</span>
                  ) : (
                    <span className="text-amber-600">Pending Start</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">API Endpoint:</span>
                <span className="font-mono text-gray-700">
                  {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Institution:</span>
                <span className="font-medium text-gray-900">Debre Berhan University (DBU)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Version:</span>
                <span className="font-medium text-gray-900">2.0.0 (Production Ready)</span>
              </div>
            </div>
          </div>

          {/* Current Profile Card */}
          <div className="pt-3 border-t space-y-2">
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-500" />
              Active Session
            </h3>
            <div className="flex items-center gap-3 bg-blue-50/60 p-3 rounded-lg border border-blue-100">
              <div className="w-9 h-9 rounded-full bg-dbu-blue text-white flex items-center justify-center font-bold text-sm">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{currentUser?.fullName}</p>
                <p className="text-gray-500 text-xs font-mono">{currentUser?.email}</p>
              </div>
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-dbu-gold/20 text-blue-900 border border-dbu-gold/40">
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
