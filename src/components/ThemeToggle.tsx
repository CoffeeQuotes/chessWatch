// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/context/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun Icon - Visible in Light Mode */}
      <Sun
        className={`w-5 h-5 transition-all duration-300 transform ${
          theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
        }`}
      />
      {/* Moon Icon - Visible in Dark Mode */}
      <Moon
        className={`absolute w-5 h-5 transition-all duration-300 transform ${
          theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
        }`}
      />
    </button>
  );
}