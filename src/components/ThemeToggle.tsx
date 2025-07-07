// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/context/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 p-1 transition-colors"
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white dark:bg-yellow-300 shadow-md transform transition-transform ${
        theme === 'light' ? 'translate-x-0' : 'translate-x-6'
      }`}>
        {theme === 'light' ? (
          <span className="absolute inset-0 flex items-center justify-center text-yellow-500">☀️</span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-blue-800">🌙</span>
        )}
      </div>
    </button>
  );
}