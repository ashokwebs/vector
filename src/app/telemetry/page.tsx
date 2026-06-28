"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Cpu, Database, Network, Globe, AlertTriangle } from "lucide-react";

export default function TelemetryPage() {
  const [metrics, setMetrics] = useState({
    tokenBurn: 412,
    gpuTemp: 64,
    activeVectors: 14204,
    latency: 12.4,
    networkLoad: 42,
  });

  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING TELEMETRY STREAM...",
    "ESTABLISHING CONNECTION TO AICOO CLUSTER [OK]",
    "VANGUARD: ACTIVE",
    "NEXUS: ACTIVE",
    "ATLAS: ACTIVE",
    "LEDGER: ACTIVE",
    "PRISM: ORCHESTRATING"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        tokenBurn: prev.tokenBurn + Math.floor(Math.random() * 5),
        gpuTemp: Math.min(85, Math.max(55, prev.gpuTemp + (Math.random() * 2 - 1))),
        activeVectors: prev.activeVectors + Math.floor(Math.random() * 10),
        latency: Number((Math.random() * 15 + 10).toFixed(1)),
        networkLoad: Math.min(100, Math.max(10, prev.networkLoad + (Math.random() * 10 - 5))),
      }));

      if (Math.random() > 0.7) {
        setLogs(prev => {
          const newLogs = [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 8)}] AICOO NODE-${Math.floor(Math.random() * 100)} SYNC: ${Math.random().toString(36).substring(7).toUpperCase()}`];
          return newLogs.length > 15 ? newLogs.slice(newLogs.length - 15) : newLogs;
        });
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 p-4 md:p-8 font-mono relative overflow-hidden flex flex-col">
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(39,39,42,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.2)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Global Telemetry</h1>
          <p className="text-emerald-500/70 text-xs">CRAYON OS COMMAND CENTER // LIVE</p>
        </div>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 shrink-0">
        <MetricCard title="Token Burn Rate" value={metrics.tokenBurn} unit="t/s" icon={<Cpu className="w-5 h-5 text-indigo-400" />} />
        <MetricCard title="AICOO Vectors" value={metrics.activeVectors.toLocaleString()} unit="pts" icon={<Database className="w-5 h-5 text-emerald-400" />} />
        <MetricCard title="Global Latency" value={metrics.latency.toFixed(1)} unit="ms" icon={<Globe className="w-5 h-5 text-blue-400" />} />
        <MetricCard title="Network Load" value={metrics.networkLoad.toFixed(0)} unit="%" icon={<Network className="w-5 h-5 text-amber-400" />} />
        <MetricCard title="Core Temp" value={metrics.gpuTemp.toFixed(1)} unit="°C" icon={<Server className="w-5 h-5 text-red-400" />} highlight={metrics.gpuTemp > 75} />
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Resource Allocation Matrix */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden relative shadow-inner shadow-black/50 p-6 flex flex-col justify-between backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-zinc-300 text-xs font-bold tracking-widest uppercase">Global Cluster Topology</span>
            </div>
            <span className="text-zinc-500 text-[10px] font-mono border border-zinc-800 px-2 py-1 rounded bg-black/40">US-EAST-1 // EU-WEST-2</span>
          </div>

          <div className="space-y-5 flex-1">
            {[
              { name: "NEXUS CORE", usage: 78, color: "bg-emerald-500" },
              { name: "VANGUARD EDGE", usage: 42, color: "bg-emerald-500" },
              { name: "LEDGER DB", usage: 91, color: "bg-amber-500" },
              { name: "PRISM ORCHESTRATOR", usage: 64, color: "bg-emerald-500" },
              { name: "ATLAS CDN", usage: 28, color: "bg-emerald-500" },
            ].map((node, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-zinc-400 font-mono tracking-wider">{node.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{node.usage}% ALLOCATED</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-zinc-800/50">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${node.usage + Math.random() * 5 - 2}%` }} 
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className={`h-full ${node.color} shadow-[0_0_8px_currentColor] opacity-80`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-zinc-800/50 flex justify-between items-center text-[10px] text-zinc-500 font-mono tracking-widest">
            <span>UPTIME: 99.999%</span>
            <span>ENCRYPTION: AES-256</span>
            <span>NODES: 1,402</span>
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="bg-black/80 border border-zinc-800 rounded-xl p-4 flex flex-col overflow-hidden relative shadow-inner shadow-black/50">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <span className="text-zinc-400 text-xs tracking-wider">SYSTEM_LOGS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500/50" />
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col justify-end gap-1.5">
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={`text-[10px] sm:text-xs ${log.includes('WARNING') || log.includes('ERROR') ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {">"} {log}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, icon, highlight = false }: { title: string, value: string | number, unit: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`bg-black/40 border ${highlight ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-zinc-800'} rounded-xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
      {highlight && <div className="absolute inset-0 bg-red-500/5 animate-pulse" />}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className={`text-2xl sm:text-3xl font-black ${highlight ? 'text-red-400' : 'text-zinc-200'} tracking-tight`}>{value}</span>
        <span className="text-xs text-zinc-500">{unit}</span>
      </div>
    </div>
  );
}
