'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FolderOpen, Bot, LineChart, CreditCard, Network, History, Settings, X, Cpu, Sparkles, Zap, Database, Globe, Play, GitBranch } from "lucide-react";

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 glow-emerald relative">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-emerald-400/20 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none text-on-surface tracking-tight">Vector</h1>
            <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-[0.2em] mt-0.5">AI Command Center</p>
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
      <div className="mx-2 mb-6 px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-500/90 uppercase tracking-wider">All Systems Operational</span>
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
                      ? "text-cyan-500 hover:bg-cyan-500/8 hover:text-cyan-400 font-semibold"
                      : "text-emerald-500 hover:bg-emerald-500/8 hover:text-emerald-400 font-semibold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              )}
              <Icon className={`w-[18px] h-[18px] transition-all duration-200 ${isActive ? 'text-emerald-500 scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[13px] tracking-wide">{item.name}</span>
              {(item as any).highlight && !isActive && (
                <Sparkles className="w-3 h-3 text-emerald-500/50 ml-auto" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Version & User Profile */}
      <div className="mt-auto pt-4 border-t border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-3 px-3 py-3 bg-surface-container/50 rounded-xl border border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant/60 transition-all cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/15 relative">
            <span className="group-hover:hidden text-xs">VA</span>
            <Settings className="w-4 h-4 hidden group-hover:block" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold text-on-surface truncate">Vector Admin</h4>
            <p className="text-[10px] text-on-surface-variant/60 truncate">admin@vector-ai.com</p>
          </div>
        </div>

        <div className="px-3 py-1.5 text-center">
          <span className="text-[9px] font-medium text-on-surface-variant/30 tracking-widest uppercase">Vector v2.0 • 19 Agents • Aicoo</span>
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
