"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Globe, Brain } from "lucide-react";
import type { DemoEvent } from "./DemoOrchestrator";
import { getAgent } from "@/lib/agents/registry";
import { MOCK_ORGANIZATIONS } from "@/lib/aicoo/mock-data";

export function TaskFlowVisualization({ events }: { events: DemoEvent[] }) {
  const activeEvents = events.filter(e => e.type !== 'state_change').slice(-6); // show last 6

  return (
    <div className="flex flex-col gap-3">
      {activeEvents.length === 0 && (
        <div className="text-center p-8 text-on-surface-variant/50 text-sm">
          Awaiting orchestration events...
        </div>
      )}
      
      {activeEvents.map((event, idx) => {
        const agent = event.agentId ? getAgent(event.agentId) : null;
        const org = event.targetOrgId ? MOCK_ORGANIZATIONS.find(o => o.id === event.targetOrgId) : null;
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            className="premium-card rounded-lg p-3 flex gap-3 items-start border-l-2 border-l-emerald-500"
          >
            {event.type === 'aicoo_route' || event.type === 'aicoo_response' ? (
              <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
            ) : event.type === 'deliverable_added' ? (
              <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className={`w-8 h-8 rounded bg-gradient-to-br ${agent?.gradient || 'from-zinc-400 to-zinc-600'} text-white flex items-center justify-center shrink-0`}>
                <Brain className="w-4 h-4" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-on-surface">
                  {event.type === 'aicoo_route' ? 'Aicoo Routing' :
                   event.type === 'aicoo_response' ? 'External Fulfillment' :
                   event.type === 'deliverable_added' ? 'Deliverable Compiled' : 'Agent Active'}
                </span>
                <span className="text-[9px] text-on-surface-variant/50">{(event.time / 1000).toFixed(1)}s</span>
              </div>
              <p className="text-[11px] text-on-surface-variant/80">{event.message}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
