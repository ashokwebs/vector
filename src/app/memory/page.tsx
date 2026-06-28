"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, ArrowRight, Zap, X, Code2, ShieldCheck, Target, TrendingUp, Cpu, Brain, Network, Clock } from "lucide-react";

// Generate mock vector data
const generateVectors = () => {
  const vectors = [];
  const topics = [
    { name: "E-Commerce Strategy", cluster: "Operations", agent: "Atlas" },
    { name: "Zero-Trust Infra", cluster: "Security", agent: "Nexus" },
    { name: "Fintech Model", cluster: "Finance", agent: "Ledger" },
    { name: "Marketing Loop", cluster: "Growth", agent: "Vanguard" },
    { name: "User Auth", cluster: "Security", agent: "Nexus" },
    { name: "Data Pipeline", cluster: "Engineering", agent: "Prism" },
    { name: "Quantum Resilient Key Exchange", cluster: "Security", agent: "Nexus" },
    { name: "LLM Context Window Optimization", cluster: "Engineering", agent: "Prism" },
    { name: "Stripe Webhook Parsing", cluster: "Finance", agent: "Ledger" },
    { name: "B2B Outreach Sequence", cluster: "Growth", agent: "Vanguard" },
    { name: "Kubernetes Scaling Pod", cluster: "Operations", agent: "Atlas" },
    { name: "SOC2 Compliance Matrix", cluster: "Security", agent: "Nexus" },
  ];
  
  for (let i = 0; i < 400; i++) {
    const t = topics[Math.floor(Math.random() * topics.length)];
    vectors.push({
      id: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
      topic: t.name,
      cluster: t.cluster,
      agent: t.agent,
      confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
      bytes: Math.floor(Math.random() * 8000 + 512),
      active: Math.random() > 0.85, // 15% are active/glowing
    });
  }
  return vectors;
};

const VECTORS = generateVectors();

export default function MemoryMatrixPage() {
  const [vectors, setVectors] = useState(VECTORS);
  const [hoveredVector, setHoveredVector] = useState<typeof VECTORS[0] | null>(null);
  const [selectedVector, setSelectedVector] = useState<typeof VECTORS[0] | null>(null);
  const [search, setSearch] = useState("");

  const filteredVectors = vectors.filter(v => v.topic.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase()));

  const handleInject = () => {
    const newVec = {
      id: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
      topic: "LIVE INJECTION PROTOCOL",
      cluster: "System",
      agent: "Prism",
      confidence: "0.99",
      bytes: 14204,
      active: true,
    };
    setVectors(prev => [newVec, ...prev]);
  };

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            <Database className="w-8 h-8 text-zinc-300 drop-shadow-[0_0_10px_rgba(212,212,216,0.3)]" />
            AICOO Memory Matrix
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Real-time visualization of your persistent `pgvector` embeddings. Hover over multi-dimensional points to retrieve semantic context.
          </p>
        </div>
        
        <div className="relative flex items-center gap-4">
          <button 
            onClick={handleInject}
            className="flex items-center gap-2 bg-zinc-800/50 text-zinc-300 border border-zinc-600/30 hover:bg-zinc-700/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-[0_0_10px_rgba(212,212,216,0.05)]"
          >
            <Zap className="w-4 h-4 text-zinc-400" />
            Inject Vector
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search semantic space..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container border border-outline-variant/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50 w-64 text-on-surface transition-colors"
            />
          </div>
        </div>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Non-Technical Explainer & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="premium-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-zinc-300" />
              What is the Memory Matrix?
            </h3>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-4">
              Think of this as the long-term brain of the AI. Instead of reading words, the AI converts concepts into coordinates in a massive digital space. Closely related ideas group together in "clusters".
            </p>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed">
              When you ask a question, the AI instantly finds the nearest cluster of knowledge to give you a highly accurate, context-aware answer without needing to re-read your entire history.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="premium-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-on-surface mb-4 uppercase tracking-wider text-zinc-400">Business Impact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center"><Network className="w-4 h-4 text-emerald-400" /></div>
                  <span className="text-sm font-medium text-zinc-300">Concepts Indexed</span>
                </div>
                <span className="text-base font-bold text-white">14,204</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center"><Clock className="w-4 h-4 text-zinc-400" /></div>
                  <span className="text-sm font-medium text-zinc-300">Time Saved (Recall)</span>
                </div>
                <span className="text-base font-bold text-white">4,200 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center"><Target className="w-4 h-4 text-rose-400" /></div>
                  <span className="text-sm font-medium text-zinc-300">Context Accuracy</span>
                </div>
                <span className="text-base font-bold text-white">99.8%</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="premium-card rounded-2xl p-6 flex-1 min-h-[250px] flex flex-col">
            <h3 className="text-sm font-bold text-on-surface mb-4 uppercase tracking-wider text-zinc-400">Recent Memories Formed</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {[
                { time: "2 mins ago", text: "Learned the Q3 Marketing Strategy from Vanguard" },
                { time: "15 mins ago", text: "Memorized the new API endpoints for Stripe Webhooks" },
                { time: "1 hour ago", text: "Processed 42 pages of SEC Filings for Ledger" },
                { time: "3 hours ago", text: "Mapped the Kubernetes Pod Scaling architecture" },
                { time: "5 hours ago", text: "Ingested the Zero-Trust Security Policy guidelines" },
              ].map((feed, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0 shadow-[0_0_5px_#a1a1aa]" />
                  <div>
                    <p className="text-xs text-zinc-300 leading-snug">{feed.text}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{feed.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column: The Matrix */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden relative shadow-inner p-8 flex flex-col min-h-[500px]">
        {/* Holographic grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(161,161,170,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Stats Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-500 pointer-events-none">
          <span>{filteredVectors.length} Vectors Loaded</span>
          <span>Dimensionality: 1536</span>
          <span>Distance Metric: Cosine</span>
        </div>

        {/* The Matrix */}
        <div className="flex-1 mt-6 overflow-y-auto pr-4 flex flex-wrap content-start gap-1.5 relative z-10" onMouseLeave={() => setHoveredVector(null)}>
          {filteredVectors.map((v, i) => {
            const isHovered = hoveredVector?.id === v.id;
            const isDimmed = hoveredVector && hoveredVector.cluster !== v.cluster;
            const isSelected = selectedVector?.id === v.id;

            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isDimmed && !isSelected ? 0.2 : 1, scale: 1 }}
                transition={{ delay: i * 0.001, duration: 0.2 }}
                onMouseEnter={() => setHoveredVector(v)}
                onClick={() => setSelectedVector(v)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm cursor-pointer transition-all duration-200 ${
                  v.topic === "LIVE INJECTION PROTOCOL" ? 'bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse z-30' :
                  v.active 
                    ? 'bg-zinc-400 shadow-[0_0_10px_#a1a1aa]' 
                    : 'bg-zinc-800 hover:bg-zinc-500/50'
                } ${isHovered || isSelected ? 'ring-2 ring-white scale-150 z-20 relative shadow-[0_0_20px_rgba(255,255,255,0.5)]' : ''}`}
              />
            );
          })}
          {filteredVectors.length === 0 && (
            <div className="w-full text-center text-zinc-500 mt-20 font-mono text-sm">NO SEMANTIC MATCHES DETECTED IN CLUSTER.</div>
          )}
        </div>
      </div>
      </div>

      {/* Floating Context Tooltip */}
      <AnimatePresence>
        {hoveredVector && !selectedVector && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-xl border border-zinc-500/30 rounded-xl p-4 shadow-2xl flex items-center gap-6 min-w-[400px] z-50 pointer-events-none"
          >
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-1">Vector Hash</p>
              <p className="text-sm font-mono text-zinc-300">{hoveredVector.id}</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex-1">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Semantic Context</p>
              <p className="text-sm font-bold text-white truncate">{hoveredVector.topic}</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-1">Cluster</p>
              <p className="text-sm font-bold text-zinc-300">{hoveredVector.cluster}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep Inspection Side Panel */}
      <AnimatePresence>
        {selectedVector && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSelectedVector(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface border-l border-outline-variant/50 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container/50">
                <h3 className="font-bold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-zinc-400" />
                  Vector Deep Inspection
                </h3>
                <button onClick={() => setSelectedVector(null)} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
                
                {/* Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Origin Agent</p>
                    <p className="font-bold text-indigo-300">{selectedVector.agent}</p>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Payload Size</p>
                    <p className="font-bold text-emerald-400">{selectedVector.bytes.toLocaleString()} bytes</p>
                  </div>
                </div>

                {/* Context */}
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2">Decoded Semantic Context</p>
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed font-medium">
                    {selectedVector.topic}
                  </div>
                </div>

                {/* Raw Vector */}
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2">Raw Embedding Data (First 16 dims)</p>
                  <div className="bg-black border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-500 leading-relaxed max-h-40 overflow-y-auto shadow-inner shadow-black/50">
                    [
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span key={i} className={i % 3 === 0 ? 'text-indigo-400' : 'text-emerald-400'}>
                        {(Math.random() * 2 - 1).toFixed(6)}
                        {i < 15 ? ', ' : ''}
                      </span>
                    ))}
                    ... 1520 more dimensions
                    ]
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
