"use client";

import { useState } from "react";
import { Download, RefreshCcw, Search, Network, Cloud, Database, Cpu, Lock, Maximize2, Server, Layers, Video, ShieldAlert, Workflow, Zap, X, Activity, ArrowRight, Clock, HardDrive, BarChart3, GitBranch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NodeData = {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
  color: string;
  bg: string;
  gradient: string;
  x: number;
  y: number;
  w: number;
  status: "healthy" | "warning" | "active";
  metrics: { label: string; value: string }[];
  description: string;
  connections: string[];
  tech: string[];
};

const nodes: NodeData[] = [
  {
    id: "waf", label: "Edge WAF", subtitle: "Cloudflare Proxy", icon: ShieldAlert,
    color: "text-orange-500", bg: "bg-orange-500/10", gradient: "from-orange-400 to-orange-600",
    x: 20, y: 220, w: 160, status: "healthy",
    metrics: [{ label: "Requests/s", value: "2,340" }, { label: "Blocked", value: "18" }, { label: "Latency", value: "12ms" }],
    description: "Cloudflare Web Application Firewall providing DDoS protection, rate limiting, and bot management at the edge layer.",
    connections: ["api"], tech: ["Cloudflare Workers", "WAF Rules", "Rate Limiting", "Bot Management"],
  },
  {
    id: "api", label: "API Gateway", subtitle: "Next.js Edge Runtime", icon: Network,
    color: "text-indigo-500", bg: "bg-indigo-500/10", gradient: "from-indigo-400 to-indigo-600",
    x: 250, y: 220, w: 170, status: "healthy",
    metrics: [{ label: "Uptime", value: "99.97%" }, { label: "Routes", value: "24" }, { label: "Avg Resp", value: "45ms" }],
    description: "Next.js 16 Edge Runtime serving as the primary API gateway. Handles authentication, request validation, and routing to backend services.",
    connections: ["orchestrator"], tech: ["Next.js 16", "Edge Functions", "JWT Auth", "Zod Validation"],
  },
  {
    id: "orchestrator", label: "MCP Orchestrator", subtitle: "FastAPI Agent Server", icon: Cpu,
    color: "text-emerald-500", bg: "bg-emerald-500/10", gradient: "from-emerald-400 to-teal-600",
    x: 500, y: 200, w: 180, status: "active",
    metrics: [{ label: "Active Agents", value: "5" }, { label: "Tasks/min", value: "34" }, { label: "Memory", value: "2.1GB" }, { label: "CPU", value: "67%" }],
    description: "Core AI orchestration engine built with FastAPI and Google ADK. Manages the executive agent council (Prism, Atlas, Nexus, Vanguard, Ledger) and coordinates multi-agent task execution via SSE streaming.",
    connections: ["db", "llm", "queue"], tech: ["FastAPI", "Google ADK", "SSE Streaming", "Pydantic", "AsyncIO"],
  },
  {
    id: "db", label: "State Storage", subtitle: "MongoDB Atlas", icon: Database,
    color: "text-amber-500", bg: "bg-amber-500/10", gradient: "from-amber-400 to-amber-600",
    x: 780, y: 80, w: 170, status: "healthy",
    metrics: [{ label: "Collections", value: "12" }, { label: "Documents", value: "4,892" }, { label: "Storage", value: "1.2GB" }],
    description: "MongoDB Atlas replica set storing conversation history, generated documents, project metadata, and agent memory state for persistent context across sessions.",
    connections: [], tech: ["MongoDB Atlas", "Replica Set", "Atlas Search", "Change Streams"],
  },
  {
    id: "queue", label: "Job Queue", subtitle: "Redis Cluster", icon: Workflow,
    color: "text-rose-500", bg: "bg-rose-500/10", gradient: "from-rose-400 to-rose-600",
    x: 780, y: 220, w: 170, status: "active",
    metrics: [{ label: "Pending", value: "24" }, { label: "Processing", value: "3" }, { label: "Completed", value: "1,847" }],
    description: "Redis-backed job queue managing asynchronous task distribution across GPU render nodes. Handles priority scheduling and retry logic for failed jobs.",
    connections: ["gpu"], tech: ["Redis 7", "Bull Queue", "Pub/Sub", "Cluster Mode"],
  },
  {
    id: "llm", label: "LLM Engine", subtitle: "Gemini 2.5 Flash", icon: Cloud,
    color: "text-blue-500", bg: "bg-blue-500/10", gradient: "from-blue-400 to-blue-600",
    x: 780, y: 370, w: 170, status: "healthy",
    metrics: [{ label: "Model", value: "2.5 Flash" }, { label: "Tokens/s", value: "1,200" }, { label: "Context", value: "1M" }],
    description: "Google Gemini 2.5 Flash serving as the primary reasoning engine. Powers all five executive agents with function calling, grounding via Google Search, and structured output generation.",
    connections: [], tech: ["Gemini 2.5 Flash", "Function Calling", "Google Search", "Structured Output"],
  },
  {
    id: "gpu", label: "GPU Cluster", subtitle: "AWS EKS (A100/T4)", icon: Server,
    color: "text-purple-500", bg: "bg-purple-500/10", gradient: "from-purple-400 to-purple-600",
    x: 1040, y: 200, w: 170, status: "active",
    metrics: [{ label: "Nodes", value: "3/4" }, { label: "VRAM", value: "72GB" }, { label: "Util", value: "78%" }],
    description: "Kubernetes-managed GPU cluster on AWS EKS using A100 and T4 spot instances for inference and fine-tuning workloads. Auto-scales based on queue depth.",
    connections: ["model", "lora", "storage"], tech: ["AWS EKS", "NVIDIA A100", "T4 Spot", "Karpenter"],
  },
  {
    id: "model", label: "Base Model", subtitle: "Stable Video Diffusion", icon: Layers,
    color: "text-cyan-500", bg: "bg-cyan-500/10", gradient: "from-cyan-400 to-cyan-600",
    x: 1300, y: 140, w: 170, status: "healthy",
    metrics: [{ label: "Version", value: "v1.1" }, { label: "Params", value: "1.5B" }, { label: "FPS", value: "24" }],
    description: "Stable Video Diffusion v1.1 base model for high-fidelity video generation. Loaded in FP16 precision with optimized attention kernels.",
    connections: [], tech: ["SVD v1.1", "FP16", "xFormers", "Flash Attention"],
  },
  {
    id: "lora", label: "Temporal LoRA", subtitle: "Custom VRAM Injector", icon: GitBranch,
    color: "text-pink-500", bg: "bg-pink-500/10", gradient: "from-pink-400 to-pink-600",
    x: 1300, y: 270, w: 170, status: "healthy",
    metrics: [{ label: "Rank", value: "64" }, { label: "Adapters", value: "8" }, { label: "Size", value: "240MB" }],
    description: "Low-Rank Adaptation weights for temporal coherence in video generation. Custom injection pipeline for real-time adapter swapping during inference.",
    connections: [], tech: ["LoRA r=64", "PEFT", "Adapter Fusion", "Dynamic Loading"],
  },
  {
    id: "storage", label: "Object Storage", subtitle: "S3 + CloudFront CDN", icon: HardDrive,
    color: "text-amber-500", bg: "bg-amber-500/10", gradient: "from-amber-400 to-orange-600",
    x: 1300, y: 400, w: 170, status: "healthy",
    metrics: [{ label: "Objects", value: "24.5K" }, { label: "Storage", value: "890GB" }, { label: "CDN Hit", value: "94%" }],
    description: "AWS S3 for persistent artifact storage with CloudFront CDN for low-latency global delivery of generated videos, documents, and model checkpoints.",
    connections: [], tech: ["AWS S3", "CloudFront", "Lifecycle Rules", "Transfer Acceleration"],
  },
];

const connectionPaths: { from: string; to: string; active: boolean; path: string }[] = [
  { from: "waf", to: "api", active: false, path: "M 180,260 C 215,260 215,260 250,260" },
  { from: "api", to: "orchestrator", active: true, path: "M 420,260 C 460,260 460,260 500,260" },
  { from: "orchestrator", to: "db", active: false, path: "M 680,260 C 730,260 730,120 780,120" },
  { from: "orchestrator", to: "llm", active: false, path: "M 680,260 C 730,260 730,410 780,410" },
  { from: "orchestrator", to: "queue", active: true, path: "M 680,260 C 730,260 730,260 780,260" },
  { from: "queue", to: "gpu", active: true, path: "M 950,260 C 995,260 995,260 1040,260" },
  { from: "gpu", to: "model", active: false, path: "M 1210,260 C 1255,260 1255,180 1300,180" },
  { from: "gpu", to: "lora", active: false, path: "M 1210,260 C 1255,260 1255,310 1300,310" },
  { from: "gpu", to: "storage", active: false, path: "M 1210,260 C 1255,260 1255,440 1300,440" },
];

export default function ArchitecturePage() {
  const [selected, setSelected] = useState<NodeData | null>(null);
  const [hoveredConn, setHoveredConn] = useState<string | null>(null);

  const isConnected = (nodeId: string) => {
    if (!selected) return false;
    return selected.connections.includes(nodeId) || selected.id === nodeId ||
      nodes.find(n => n.id === nodeId)?.connections.includes(selected.id);
  };

  const isPathHighlighted = (from: string, to: string) => {
    if (!selected) return false;
    return (selected.id === from || selected.id === to);
  };

  const handleExportConfig = () => {
    const configData = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      nodes: nodes,
      connections: connectionPaths
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "system_architecture_config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 md:px-8 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1">System Architecture</h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">Click any node to inspect configuration, metrics, and connections. Active data flows animate in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSelected(null)} className="bg-surface-container/50 border border-outline-variant/50 text-on-surface px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Reset View
          </button>
          <button onClick={handleExportConfig} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-[0.98]">
            <Download className="w-4 h-4" /> Export Config
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Canvas */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex-1 bg-surface-container-lowest/50 border border-outline-variant/40 rounded-xl flex flex-col overflow-hidden relative shadow-sm">

          <div className="h-10 border-b border-outline-variant/30 bg-surface-container/30 backdrop-blur-md flex items-center justify-between px-4 z-10 shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.5)]" /> Production (US-East)</span>
              <span className="mx-2 text-outline-variant/50">|</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Auto-Scaling</span>
              <span className="mx-2 text-outline-variant/50">|</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-blue-500" /> 10 Services</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Warning</span>
            </div>
          </div>

          <div className="flex-1 w-full h-full relative overflow-auto bg-[radial-gradient(circle_at_center,var(--outline-variant)_1px,transparent_1px)] bg-[length:24px_24px]">
            <div className="min-w-[1500px] h-[560px] relative p-4">

              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="var(--outline-color)" opacity="0.4" /></marker>
                  <marker id="ah-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#10b981" /></marker>
                  <marker id="ah-hl" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#818cf8" /></marker>
                </defs>
                {connectionPaths.map((c, i) => {
                  const hl = isPathHighlighted(c.from, c.to);
                  return (
                    <path key={i} d={c.path} fill="none"
                      stroke={hl ? "#818cf8" : c.active ? "#10b981" : "var(--outline-color)"}
                      strokeWidth={hl ? 3 : 2}
                      strokeDasharray={c.active || hl ? "6 4" : "none"}
                      markerEnd={hl ? "url(#ah-hl)" : c.active ? "url(#ah-active)" : "url(#ah)"}
                      opacity={selected && !hl ? 0.15 : c.active ? 1 : 0.4}
                      className={c.active || hl ? "animate-[dash_1s_linear_infinite]" : ""}
                      style={{ transition: "opacity 0.3s, stroke 0.3s" }}
                    />
                  );
                })}
              </svg>

              {/* Security wrapper */}
              <div className="absolute left-[765px] top-[350px] w-[200px] h-[120px] border border-dashed border-rose-500/30 rounded-xl pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute -top-3 left-3 bg-surface-container-lowest/80 px-1.5 flex items-center gap-1 text-[9px] text-rose-500 font-bold tracking-wider uppercase"><Lock className="w-3 h-3" /> Model Armor</div>
              </div>
              {/* Inference group */}
              <div className="absolute left-[1285px] top-[120px] w-[200px] h-[210px] border border-dashed border-cyan-500/25 rounded-xl pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute -top-3 right-3 bg-surface-container-lowest/80 px-1.5 flex items-center gap-1 text-[9px] text-cyan-500 font-bold tracking-wider uppercase">Inference Pipeline</div>
              </div>

              {/* Nodes */}
              {nodes.map((node) => {
                const Icon = node.icon;
                const isSelected = selected?.id === node.id;
                const connected = isConnected(node.id);
                const dimmed = selected && !isSelected && !connected;
                return (
                  <motion.div key={node.id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: dimmed ? 0.3 : 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelected(isSelected ? null : node)}
                    className={`absolute cursor-pointer group transition-all duration-300 ${isSelected ? "z-20" : "z-10"}`}
                    style={{ left: node.x, top: node.y, width: node.w }}
                  >
                    <div className={`bg-surface/90 backdrop-blur-sm rounded-xl p-3.5 border-2 transition-all duration-300 ${
                      isSelected ? "border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-105" :
                      connected ? "border-indigo-500/30 shadow-md" :
                      node.status === "active" ? "border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]" :
                      "border-outline-variant/50 hover:border-outline-variant shadow-sm hover:shadow-md"
                    }`}>
                      {node.status === "active" && !isSelected && <div className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse pointer-events-none" />}
                      <div className="flex items-center gap-2.5 mb-2 relative z-10">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.gradient} flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-on-surface truncate">{node.label}</span>
                            <span className={`w-2 h-2 rounded-full shrink-0 ml-1 ${node.status === "active" ? "bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.5)]" : node.status === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                          </div>
                          <div className="text-[10px] text-on-surface-variant/60 font-mono truncate">{node.subtitle}</div>
                        </div>
                      </div>
                      {node.id === "orchestrator" && (
                        <div className="relative z-10 mt-1">
                          <div className="w-full h-1.5 bg-surface-container-high/50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "67%" }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                          </div>
                          <div className="flex justify-between mt-1 text-[9px] text-on-surface-variant/50"><span>CPU Load</span><span>67%</span></div>
                        </div>
                      )}
                      {node.id === "gpu" && (
                        <div className="flex items-center gap-1 mt-1.5 relative z-10">
                          {[true,true,true,false].map((on, i) => <span key={i} className={`w-2 h-2 rounded-full ${on ? "bg-emerald-500 animate-pulse" : "bg-surface-container-high"}`} style={on ? { animationDelay: `${i*200}ms` } : {}} />)}
                          <span className="text-[9px] text-on-surface-variant/50 ml-1.5">3/4 Active</span>
                        </div>
                      )}
                      {node.id === "queue" && (
                        <div className="flex justify-between text-[9px] text-on-surface-variant/50 mt-1.5 relative z-10"><span>Pending: 24</span><span className="text-emerald-500 font-semibold">Processing</span></div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}
              className="w-80 bg-surface/90 backdrop-blur-xl border border-outline-variant/40 rounded-xl shadow-lg flex flex-col overflow-hidden shrink-0">
              
              <div className="p-5 border-b border-outline-variant/30">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selected.gradient} flex items-center justify-center text-white shadow-lg`}>
                    <selected.icon className="w-5 h-5" />
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-on-surface">{selected.label}</h3>
                <p className="text-xs text-on-surface-variant/60 font-mono mt-0.5">{selected.subtitle}</p>
                <div className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                  selected.status === "active" ? "bg-emerald-500/8 text-emerald-500 border-emerald-500/15" :
                  selected.status === "warning" ? "bg-amber-500/8 text-amber-500 border-amber-500/15" :
                  "bg-emerald-500/8 text-emerald-500 border-emerald-500/15"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selected.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"}`} />
                  {selected.status === "active" ? "Active" : "Healthy"}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-xs text-on-surface-variant/80 leading-relaxed">{selected.description}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-2.5">Live Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.metrics.map((m) => (
                      <div key={m.label} className="bg-surface-container/50 border border-outline-variant/30 rounded-lg p-2.5">
                        <p className="text-[9px] text-on-surface-variant/50 font-medium">{m.label}</p>
                        <p className="text-sm font-bold text-on-surface mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-2.5">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tech.map((t) => (
                      <span key={t} className="text-[10px] font-medium px-2 py-1 bg-surface-container-high/30 border border-outline-variant/30 text-on-surface-variant/70 rounded-lg">{t}</span>
                    ))}
                  </div>
                </div>

                {selected.connections.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider mb-2.5">Downstream</h4>
                    <div className="space-y-1.5">
                      {selected.connections.map((cId) => {
                        const target = nodes.find(n => n.id === cId);
                        if (!target) return null;
                        const TIcon = target.icon;
                        return (
                          <button key={cId} onClick={() => setSelected(target)}
                            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/30 transition-all text-left group">
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${target.gradient} flex items-center justify-center text-white shadow-sm`}>
                              <TIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-on-surface group-hover:text-indigo-500 transition-colors">{target.label}</p>
                              <p className="text-[10px] text-on-surface-variant/50">{target.subtitle}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant/30 group-hover:text-indigo-500 transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
