"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, Zap, Menu, Command, Globe } from "lucide-react";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-background/70 backdrop-blur-2xl border-b border-outline-variant/40 flex justify-between items-center h-16 px-4 md:px-6 transition-colors duration-300">
      {/* Mobile Brand (Hidden on Desktop) */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-bold text-on-surface">Vector</h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="hidden md:flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4 transition-colors group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            className="bg-surface-container/50 border border-outline-variant/50 rounded-lg py-2 pl-10 pr-20 text-sm text-on-surface focus:outline-none focus:border-emerald-500/50 focus:bg-surface-container w-72 transition-all placeholder:text-on-surface-variant/40" 
            placeholder="Search anything..." 
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-on-surface-variant/30">
            <kbd className="text-[10px] font-mono bg-surface-container-high/50 border border-outline-variant/30 rounded px-1.5 py-0.5 flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-1.5 md:gap-2 ml-auto md:ml-0">
        
        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-on-surface-variant hover:text-on-surface transition-all focus:outline-none flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container/80 active:scale-95"
        >
          {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <button className="text-on-surface-variant hover:text-cyan-500 transition-all focus:outline-none relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-cyan-500/10 active:scale-95 group">
          <Globe className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_6px_rgba(6,182,212,0.5)] animate-pulse" />
        </button>

        <button className="text-on-surface-variant hover:text-on-surface transition-all focus:outline-none relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container/80 active:scale-95">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
        </button>
        
        {/* Profile avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-surface overflow-hidden ml-1 hover:border-outline-variant transition-all duration-200 cursor-pointer flex items-center justify-center shadow-lg shadow-violet-500/10 active:scale-95 relative">
          <span className="text-white text-xs font-bold">VA</span>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface" />
        </div>
      </div>
    </header>
  );
}
