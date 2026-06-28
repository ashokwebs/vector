"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Terminal, Shield, FileText, Settings, Database, 
  Cpu, Users, BarChart3, LayoutDashboard, ChevronRight, MessageSquare 
} from "lucide-react";

type CommandItem = {
  name: string;
  href: string;
  icon: any;
  category: string;
};

const commands: CommandItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, category: "Navigation" },
  { name: "The Board Room", href: "/boardroom", icon: Terminal, category: "Operations" },
  { name: "Aicoo Network", href: "/aicoo", icon: Database, category: "Infrastructure" },
  { name: "Executive Strategy", href: "/strategy", icon: BarChart3, category: "Documentation" },
  { name: "Finance & Analytics", href: "/finance", icon: BarChart3, category: "Documentation" },
  { name: "Active Agents", href: "/agents", icon: Users, category: "Management" },
  { name: "System Architecture", href: "/architecture", icon: Cpu, category: "Documentation" },
  { name: "Knowledge Base", href: "/knowledge", icon: Database, category: "Management" },
  { name: "Platform Settings", href: "/settings", icon: Settings, category: "System" },
  { name: "Provide Feedback", href: "/feedback", icon: MessageSquare, category: "Support" },
  { name: "Privacy Policy", href: "/privacy", icon: Shield, category: "Support" },
  { name: "Cookie Policy", href: "/cookie", icon: FileText, category: "Support" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface/90 backdrop-blur-xl border border-outline-variant/50 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center px-4 border-b border-outline-variant/30">
              <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
              <input
                autoFocus
                className="w-full bg-transparent px-4 py-5 outline-none text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                placeholder="Search Crayon OS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="text-[10px] text-on-surface-variant/60 font-mono px-2 py-1 rounded bg-surface-container/50 border border-outline-variant/30 hidden sm:block">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700">
              {filteredCommands.length === 0 ? (
                <div className="py-14 px-6 text-center text-sm text-on-surface-variant">
                  No results found for "{search}".
                </div>
              ) : (
                <div className="flex flex-col gap-1 p-2">
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.name}
                      onClick={() => handleSelect(cmd.href)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-container-high/80 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-surface-container/50 border border-outline-variant/30 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                          <cmd.icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-on-surface group-hover:text-emerald-50 transition-colors">{cmd.name}</span>
                          <span className="text-[10px] font-mono text-on-surface-variant/70 uppercase">{cmd.category}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-surface-container/30 px-4 py-3 border-t border-outline-variant/30 text-xs flex items-center justify-between text-on-surface-variant/70">
              <span>Crayon Command Palette</span>
              <span>Team OSPRED</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
