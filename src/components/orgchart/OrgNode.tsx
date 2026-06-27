"use client";

import { motion } from "framer-motion";
import { Brain, Globe, AlertCircle } from "lucide-react";
import type { AgentDefinition } from "@/lib/agents/types";
import { getAgent } from "@/lib/agents/registry";
import { MOCK_ORGANIZATIONS } from "@/lib/aicoo/mock-data";

interface OrgNodeProps {
  id: string; // can be internal agent ID or external org ID
  type: 'agent' | 'external_org';
  x: number;
  y: number;
  status?: 'idle' | 'active' | 'communicating';
  isActiveRouteTarget?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function OrgNode({ id, type, x, y, status = 'idle', isActiveRouteTarget, onClick, selected }: OrgNodeProps) {
  const isAgent = type === 'agent';
  const agent = isAgent ? getAgent(id) : null;
  const org = !isAgent ? MOCK_ORGANIZATIONS.find(o => o.id === id) : null;

  if (isAgent && !agent) return null;
  if (!isAgent && !org) return null;

  const gradient = isAgent ? agent!.gradient : org!.gradient;
  const name = isAgent ? agent!.name : org!.name;
  const subtitle = isAgent ? agent!.title : org!.specialization;
  const Icon = isAgent ? Brain : Globe;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onClick={onClick}
      className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group z-10`}
      style={{ left: x, top: y }}
    >
      <div className="relative">
        {/* Glow behind node */}
        {(status === 'active' || status === 'communicating' || isActiveRouteTarget || selected) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute -inset-4 bg-gradient-to-br ${gradient} blur-xl opacity-30 rounded-full`}
          />
        )}
        
        {/* Connection Pulse */}
        {isActiveRouteTarget && (
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full`}
          />
        )}

        <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface/90 backdrop-blur-sm border-2 flex items-center justify-center shadow-xl transition-colors ${
          selected ? `border-${isAgent ? 'violet' : 'cyan'}-500 shadow-${isAgent ? 'violet' : 'cyan'}-500/30` :
          isActiveRouteTarget ? 'border-cyan-500 shadow-cyan-500/40' :
          status === 'communicating' ? 'border-emerald-500 shadow-emerald-500/20' :
          'border-outline-variant/50 group-hover:border-outline-variant'
        }`}>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-inner`}>
            {isAgent ? (
              <span className="font-bold text-lg">{name.charAt(0)}</span>
            ) : (
              <Icon className="w-5 h-5" />
            )}
          </div>

          {/* Badge */}
          {!isAgent && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface border border-outline-variant flex items-center justify-center">
              <Globe className="w-3 h-3 text-cyan-500" />
            </div>
          )}
          {status === 'communicating' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-pulse border-2 border-surface" />
          )}
        </div>
      </div>

      <div className={`text-center transition-opacity ${selected || isActiveRouteTarget || status === 'communicating' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
        <p className="text-[11px] md:text-xs font-bold text-on-surface whitespace-nowrap">{name}</p>
        <p className="text-[9px] md:text-[10px] text-on-surface-variant max-w-[100px] truncate">{subtitle}</p>
      </div>
    </motion.div>
  );
}
