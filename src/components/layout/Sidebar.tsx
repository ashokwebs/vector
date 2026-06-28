'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FolderOpen, Bot, LineChart, CreditCard, Network, History, Settings, X, Cpu, Sparkles, Zap, Database, Globe, Play, GitBranch, MessageSquare } from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen for toggle event from TopNav
  useEffect(() => {
    const handler = () => setMobileOpen(prev => !prev);
    window.addEventListener("toggle-mobile-sidebar", handler);
    return () => window.removeEventListener("toggle-mobile-sidebar", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Board Room", icon: Bot, href: "/boardroom", highlight: true },
    { name: "Aicoo Network", icon: Globe, href: "/aicoo", highlight: true, aicoo: true },
    { name: "Org Chart", icon: GitBranch, href: "/orgchart" },
    { name: "Projects", icon: FolderOpen, href: "/projects" },
    { name: "Agents", icon: Cpu, href: "/agents" },
    { name: "Strategy", icon: LineChart, href: "/strategy" },
    { name: "Finance", icon: CreditCard, href: "/finance" },
    { name: "Architecture", icon: Network, href: "/architecture" },
    { name: "Activity", icon: History, href: "/activity" },
    { name: "Knowledge Base", icon: Database, href: "/knowledge" },
    { name: "Demo", icon: Play, href: "/demo", highlight: true },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center justify-between mb-6 px-2 mt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 flex items-center justify-center shadow-lg shadow-black/25 relative">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-zinc-800/20 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none text-on-surface tracking-tight">Crayon</h1>
            <p className="text-[9px] font-bold text-zinc-300/80 uppercase tracking-[0.2em] mt-0.5">AI Command Center</p>
          </div>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* System Status */}
      <div className="mx-2 mb-6 px-3 py-2.5 rounded-lg bg-zinc-800/5 border border-zinc-600/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-400 shadow-[0_0_6px_rgba(255,255,255,0.3)] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-zinc-300/90 uppercase tracking-wider">Crayon OS v2.4.1</span>
            <span className="text-[8px] font-medium text-zinc-500 uppercase tracking-wider">Enterprise Systems Nominal</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-0.5 flex-1">
        <p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-[0.15em] px-4 mb-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium transition-all duration-200 w-full text-left relative group ${
                isActive 
                  ? "bg-surface-container-high/80 text-on-surface shadow-sm" 
                  : (item as any).highlight 
                    ? (item as any).aicoo
                      ? "text-zinc-300 hover:bg-zinc-800/8 hover:text-zinc-300 font-semibold"
                      : "text-zinc-300 hover:bg-zinc-800/8 hover:text-zinc-300 font-semibold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              )}
              <Icon className={`w-[18px] h-[18px] transition-all duration-200 ${isActive ? 'text-zinc-300 scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[13px] tracking-wide">{item.name}</span>
              {(item as any).highlight && !isActive && (
                <Sparkles className="w-3 h-3 text-zinc-300/50 ml-auto" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Version & User Profile */}
      <div className="shrink-0 p-4 border-t border-outline-variant/30 flex flex-col gap-3">
        <Link 
          href="/settings"
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-medium text-sm w-full",
            pathname === "/settings" 
              ? "bg-surface-container-high text-on-surface shadow-sm" 
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          Settings
        </Link>
        <Link 
          href="/feedback"
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-medium text-sm w-full",
            pathname === "/feedback" 
              ? "bg-surface-container-high text-on-surface shadow-sm" 
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          )}
        >
          <MessageSquare className="w-5 h-5 shrink-0" />
          Feedback
        </Link>

        {/* User Profile Footer */}
        <div className="mt-2 pt-4 border-t border-outline-variant/20 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-950 border border-zinc-600/50 flex items-center justify-center text-zinc-200 font-bold text-sm shrink-0 shadow-inner">
            CR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-on-surface truncate">Admin</span>
            <span className="text-[10px] text-on-surface-variant truncate font-mono">Team OSPRED • Ashok P</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-on-surface-variant/50 font-medium">
          <Link href="/privacy" className="hover:text-on-surface-variant transition-colors">Privacy</Link>
          <Link href="/cookie" className="hover:text-on-surface-variant transition-colors">Cookies</Link>
          <span>v2.4.1</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface/95 backdrop-blur-2xl border-r border-outline-variant/50 flex-col p-4 z-40 transition-colors duration-300">
        {sidebarContent}
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <nav
        className={`md:hidden fixed left-0 top-0 h-screen w-72 bg-surface border-r border-outline-variant flex flex-col p-4 z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </nav>
    </>
  );
}
