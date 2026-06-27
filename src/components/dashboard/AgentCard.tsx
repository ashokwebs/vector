'use client';

import { Brain, Target, Terminal, TrendingUp, DollarSign, Settings, Shield, Search, Layers, Palette, Scale, Users, Globe, BarChart3, GitBranch, CheckCircle2, Handshake, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AgentDefinition } from '@/lib/agents/types';

interface AgentCardProps {
  agent?: AgentDefinition;
  // Legacy props for backwards compat
  name?: string;
  role?: string;
  status?: 'Thinking' | 'Processing' | 'Idle';
  task?: string;
  confidence?: number | null;
  avatarUrl?: string;
  color?: string;
  compact?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  GitBranch: <GitBranch className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Handshake: <Handshake className="w-4 h-4" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4" />,
};

// Legacy name-based lookups (backwards compat for existing code)
const legacyGradients: Record<string, string> = {
  Atlas: 'from-emerald-400 to-teal-600',
  Nexus: 'from-blue-400 to-indigo-600',
  Prism: 'from-violet-400 to-purple-600',
  Vanguard: 'from-amber-400 to-orange-600',
  Ledger: 'from-indigo-400 to-violet-600',
};
const legacyGlows: Record<string, string> = {
  Atlas: 'shadow-emerald-500/20',
  Nexus: 'shadow-blue-500/20',
  Prism: 'shadow-violet-500/20',
  Vanguard: 'shadow-amber-500/20',
  Ledger: 'shadow-indigo-500/20',
};
const legacyIcons: Record<string, React.ReactNode> = {
  Atlas: <Target className="w-4 h-4" />,
  Nexus: <Terminal className="w-4 h-4" />,
  Prism: <Brain className="w-4 h-4" />,
  Vanguard: <TrendingUp className="w-4 h-4" />,
  Ledger: <DollarSign className="w-4 h-4" />,
};

export function AgentCard({ agent, name, role, status, task, confidence, compact }: AgentCardProps) {
  // Resolve from agent definition or legacy props
  const displayName = agent?.name || name || 'Agent';
  const displayRole = agent?.role || role || 'Agent';
  const displayStatus = status || (agent?.status === 'Online' ? 'Idle' : 'Idle');
  const displayTask = task || agent?.description || '';
  const gradient = agent?.gradient || legacyGradients[displayName] || 'from-zinc-400 to-zinc-600';
  const glow = agent?.glowColor || legacyGlows[displayName] || 'shadow-zinc-500/20';
  const icon = agent ? (ICON_MAP[agent.icon] || <Brain className="w-4 h-4" />) : (legacyIcons[displayName] || <Brain className="w-4 h-4" />);

  const getStatusDot = () => {
    switch (displayStatus) {
      case 'Thinking': return 'status-dot-processing animate-pulse';
      case 'Processing': return 'status-dot-processing animate-pulse';
      case 'Idle': return 'status-dot-idle';
    }
  };

  const tierBadge = agent?.tier === 'architect' ? 'bg-violet-500/10 text-violet-500 border-violet-500/20' :
    agent?.tier === 'executive' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
    agent?.tier === 'director' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : '';

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 bg-surface-container/50 hover:border-outline-variant/60 hover:bg-surface-container transition-all group"
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm ${glow} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-on-surface truncate">{displayName}</h4>
          <p className="text-[10px] text-on-surface-variant/60 truncate">{displayRole}</p>
        </div>
        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="premium-card rounded-xl p-4 flex flex-col gap-3 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${glow} transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">{displayName}</h4>
            <p className="text-[11px] text-on-surface-variant font-medium">{displayRole}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-surface-container-high/60 px-2.5 py-1 rounded-lg border border-outline-variant/50">
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`}></span>
          <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
            {displayStatus}
          </span>
        </div>
      </div>
      
      <div className="mt-1">
        <p className="text-[13px] text-on-surface-variant/80 line-clamp-2 h-10 leading-relaxed">
          {displayTask}
        </p>
      </div>

      {/* Tier badge + Aicoo indicator */}
      {agent && (
        <div className="flex items-center gap-2 mt-auto">
          {agent.tier && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${tierBadge}`}>
              {agent.tier}
            </span>
          )}
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/8 text-cyan-500 border border-cyan-500/15 flex items-center gap-1">
            <Globe className="w-2.5 h-2.5" /> Aicoo
          </span>
        </div>
      )}
      
      {confidence !== null && confidence !== undefined && (
        <div className="mt-auto pt-3 border-t border-outline-variant/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-on-surface-variant font-medium">Confidence</span>
            <span className="text-[11px] font-bold text-on-surface">{confidence}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
