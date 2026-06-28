"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Activity, Server, Shield, Cpu, Network } from "lucide-react";
import { AGENTS } from "@/lib/agents/registry";

interface AicooMessage {
  id: string;
  from: string;
  to: string;
  action: string;
  payload: string;
  status: "pending" | "processing" | "success" | "warning";
}

const ICONS: Record<string, React.ReactNode> = {
  Atlas: <Server className="w-4 h-4" />,
  Nexus: <Cpu className="w-4 h-4" />,
  Vanguard: <Shield className="w-4 h-4" />,
  Prism: <Terminal className="w-4 h-4" />,
  default: <Network className="w-4 h-4" />
};

export function AicooLiveFeed({ active = true, isCompleted = false, speedMs = 300 }: { active?: boolean, isCompleted?: boolean, speedMs?: number }) {
  const [messages, setMessages] = useState<AicooMessage[]>([]);
  const [currentLatency, setCurrentLatency] = useState(speedMs);
  const containerRef = useRef<HTMLDivElement>(null);

  // A hardcoded but highly dynamic looking script that cycles for the hackathon demo
  const DYNAMIC_SCRIPT = [
    { from: "Prism", to: "Atlas", action: "REQ_DATA_SYNC", payload: "Initiating project context sync.", status: "success" },
    { from: "Atlas", to: "Prism", action: "ACK_SYNC", payload: "Context loaded. 142kb hashed.", status: "success" },
    { from: "Prism", to: "Nexus", action: "REQ_SYS_DESIGN", payload: "Generate distributed architecture.", status: "processing" },
    { from: "Nexus", to: "Vanguard", action: "VERIFY_SEC", payload: "Checking compliance on proposed infra.", status: "pending" },
    { from: "Vanguard", to: "Nexus", action: "SEC_WARNING", payload: "Port 3000 vulnerable. Rewriting policy.", status: "warning" },
    { from: "Nexus", to: "Prism", action: "RES_SYS_DESIGN", payload: "Architecture finalized. Zero trust applied.", status: "success" },
    { from: "Prism", to: "Ledger", action: "REQ_BUDGET", payload: "Calculate run costs for new infra.", status: "processing" },
    { from: "Ledger", to: "Prism", action: "RES_BUDGET", payload: "Estimated $14.20/mo. Approved.", status: "success" },
    { from: "Prism", to: "Echo", action: "REQ_COMM", payload: "Draft stakeholder update.", status: "processing" },
    { from: "Echo", to: "Prism", action: "RES_COMM", payload: "Update ready. Sentiment: Positive.", status: "success" }
  ];

  useEffect(() => {
    if (!active) return;
    
    let index = 0;
    const interval = setInterval(() => {
      // Randomize latency between 250ms and 1500ms
      setCurrentLatency(Math.floor(Math.random() * 1250) + 250);

      const scriptItem = DYNAMIC_SCRIPT[index % DYNAMIC_SCRIPT.length];
      
      const newMsg: AicooMessage = {
        id: Math.random().toString(36).substring(7),
        from: scriptItem.from,
        to: scriptItem.to,
        action: scriptItem.action,
        payload: scriptItem.payload,
        status: scriptItem.status as any
      };

      setMessages(prev => {
        const next = [...prev, newMsg];
        if (next.length > 50) return next.slice(next.length - 50); // Keep last 50
        return next;
      });

      index++;
    }, speedMs);

    return () => clearInterval(interval);
  }, [active, speedMs]);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          {
            id: "final-1",
            from: "Prism",
            to: "System",
            action: "HALT_ORCHESTRATION",
            payload: "All Executive Council tasks completed successfully. Synthesizing final artifacts.",
            status: "success"
          },
          {
            id: "final-2",
            from: "System",
            to: "Aicoo",
            action: "SYNC_COMPLETE",
            payload: "Vectors successfully embedded in AICOO network. Session closed.",
            status: "success"
          }
        ]);
        setCurrentLatency(0);
      }, 500);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden font-mono text-xs shadow-[0_0_15px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-zinc-300">
          <Activity className="w-4 h-4 animate-pulse text-zinc-400" />
          <span className="font-semibold tracking-wider uppercase">Aicoo Live Network</span>
        </div>
        <div className="flex items-center gap-2">
          {active ? (
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-zinc-600" />
          )}
          <span className="text-zinc-500">{currentLatency}ms latency</span>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-1 pb-2 border-b border-white/5"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-zinc-500">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                <div className="flex items-center gap-1 text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded">
                  {ICONS[msg.from] || ICONS.default}
                  <span>{msg.from}</span>
                </div>
                <span className="text-zinc-600">→</span>
                <div className="flex items-center gap-1 text-zinc-300 bg-white/5 px-1.5 py-0.5 rounded">
                  {ICONS[msg.to] || ICONS.default}
                  <span>{msg.to}</span>
                </div>
                <span className={`ml-auto text-[10px] px-1.5 rounded-full border uppercase ${
                  msg.status === 'success' ? 'border-zinc-500 text-zinc-300 bg-zinc-500/20' :
                  msg.status === 'warning' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                  msg.status === 'processing' ? 'border-zinc-600/50 text-zinc-300 bg-zinc-800/10 animate-pulse' :
                  'border-zinc-700 text-zinc-500 bg-zinc-800'
                }`}>
                  {msg.action}
                </span>
              </div>
              <div className="pl-20 text-zinc-300">
                {">"} {msg.payload}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="text-zinc-600 italic">Waiting for network activity...</div>
        )}
      </div>
    </div>
  );
}
