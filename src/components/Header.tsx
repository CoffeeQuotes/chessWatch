// src/components/Header.tsx
'use client';

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 px-4 py-3 flex justify-between items-center transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-md" 
        : "bg-transparent"
    }`}>
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">♔</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-800 dark:text-white">
          ChessWatch
        </h1>
      </div>
      <ThemeToggle />   
    </header>
  );
}