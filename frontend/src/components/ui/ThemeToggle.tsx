'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark (night) mode'}
      className="relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#04141e]"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0c1d2e 60%, #0ea5e9)'
          : 'linear-gradient(135deg, #bae6fd 10%, #38bdf8)',
        boxShadow: isDark
          ? 'inset 0 0 8px rgba(6,182,212,0.25), 0 0 0 1px rgba(14,165,233,0.3)'
          : 'inset 0 0 8px rgba(14,165,233,0.2), 0 0 0 1px rgba(186,230,253,0.8)',
      }}
    >
      {/* Thumb */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ${
          isDark
            ? 'translate-x-7 bg-[#0ea5e9]'
            : 'translate-x-0.5 bg-white'
        }`}
      >
        {isDark
          ? <Moon className="w-3.5 h-3.5 text-white" />
          : <Sun className="w-3.5 h-3.5 text-sky-500" />
        }
      </span>

      {/* Background icons */}
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
        {isDark ? <Moon className="w-3 h-3 text-sky-200" /> : <Sun className="w-3 h-3 text-sky-700" />}
      </span>
    </button>
  );
}
