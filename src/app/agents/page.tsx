"use client";

import { useState } from "react";
import { Search, Cpu, Brain, Target, Terminal, TrendingUp, DollarSign, Shield, FileText, Zap, Settings, Layers, Palette, Scale, Users, Globe, BarChart3, GitBranch, CheckCircle2, Handshake, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { AGENTS } from "@/lib/agents/registry";
import type { AgentDefinition, AgentTier } from "@/lib/agents/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Target, Terminal, TrendingUp, DollarSign, Settings, Shield, Search, Layers, Palette, Scale, Users, Globe, BarChart3, GitBranch, CheckCircle2, Handshake, HeartHandshake,
};

const TIER_LABELS: Record<AgentTier, string> = {
  architect: 'Architect',
  executive: 'Executive',
  director: 'Director',
};

const TIER_COLORS: Record<AgentTier, { badge: string; dot: string }> = {
  architect: { badge: 'bg-violet-500/10 text-violet-500 border-violet-500/20', dot: 'bg-violet-500' },
  executive: { badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', dot: 'bg-emerald-500' },
  director: { badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20', dot: 'bg-blue-500' },
};

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<AgentTier | 'all'>('all');

  const filtered = AGENTS.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || a.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-8 max-w-[1600px] mx-auto flex flex-col pt-6 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1">Agent Console</h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Configure, deploy, and monitor your {AGENTS.length} executive AI agents. Each agent has an Aicoo identity for cross-organization coordination.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative group max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4 transition-colors group-focus-within:text-emerald-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container/50 border border-outline-variant/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 w-full transition-all placeholder:text-on-surface-variant/40"
            placeholder="Search agents..."
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'architect', 'executive', 'director'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                tierFilter === tier
                  ? 'bg-on-surface text-surface border-on-surface'
                  : 'bg-surface-container/50 text-on-surface-variant border-outline-variant/50 hover:border-outline-variant'
              }`}
            >
              {tier === 'all' ? `All (${AGENTS.length})` : `${TIER_LABELS[tier]}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8">
        {filtered.map((agent, idx) => {
          const AgentIcon = ICON_MAP[agent.icon] || Brain;
          const tierColor = TIER_COLORS[agent.tier];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="premium-card rounded-xl overflow-hidden flex flex-col group"
            >
              <div className="p-5 border-b border-outline-variant/30">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-lg ${agent.glowColor} transition-transform duration-300 group-hover:scale-110`}>
                      <AgentIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-on-surface">{agent.name}</h3>
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">{agent.title}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-emerald-500/8 text-emerald-500 border-emerald-500/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                    Online
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant/70 mb-4 leading-relaxed line-clamp-2">
                  {agent.description}
                </p>

                {/* Tier + Aicoo badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${tierColor.badge}`}>
                    {TIER_LABELS[agent.tier]}
                  </span>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/8 text-cyan-500 border border-cyan-500/15 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> Aicoo
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {agent.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium px-2 py-1 bg-surface-container-high/30 border border-outline-variant/30 text-on-surface-variant/80 rounded-lg hover:border-outline-variant/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {agent.skills.length > 4 && (
                    <span className="text-[10px] font-medium px-2 py-1 text-on-surface-variant/40">
                      +{agent.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Telemetry */}
              <div className="bg-surface-container-lowest/30 p-4 flex-1 font-mono text-[11px] leading-relaxed text-on-surface-variant/60 relative overflow-hidden min-h-[70px]">
                <div className="flex items-center gap-2 mb-2 text-on-surface-variant/30 font-sans font-bold tracking-wider text-[9px] uppercase">
                  <Terminal className="w-3 h-3" /> Aicoo Identity
                </div>
                <p className="text-emerald-500/60">&gt; {agent.aicoo.displayName}</p>
                <p>&gt; org: {agent.aicoo.organization}</p>
                <p>&gt; caps: [{agent.aicoo.capabilities.slice(0, 3).join(', ')}]</p>
                <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-surface-container-lowest/80 to-transparent"></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
