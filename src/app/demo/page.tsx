"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, FastForward, RotateCcw, LayoutDashboard, Globe, Shield, Rocket } from "lucide-react";
import Link from "next/link";
import { useDemoOrchestrator, DemoEvent, DemoState } from "@/components/demo/DemoOrchestrator";
import { TaskFlowVisualization } from "@/components/demo/TaskFlowVisualization";
import { DeliverablePanel } from "@/components/demo/DeliverablePanel";
import { OrgNode } from "@/components/orgchart/OrgNode";
import { ConnectionLine } from "@/components/orgchart/ConnectionLine";
import { NeuralBackground } from "@/components/orgchart/NeuralBackground";
import { getArchitect, getExecutives } from "@/lib/agents/registry";
import { MOCK_ORGANIZATIONS } from "@/lib/aicoo/mock-data";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [demoState, setDemoState] = useState<DemoState>('idle');
  
  const handleEvent = (event: DemoEvent) => {
    setEvents(prev => [...prev, event]);
    if (event.newState) {
      setDemoState(event.newState);
      if (event.newState === 'completed') {
        setIsPlaying(false);
      }
    }
  };

  const { progress, reset } = useDemoOrchestrator(isPlaying, handleEvent);

  const handleReset = () => {
    setIsPlaying(false);
    setEvents([]);
    setDemoState('idle');
    reset();
  };

  // Minimal Org Chart Layout for Demo Split Screen
  const architect = getArchitect();
  const executives = getExecutives().slice(0, 4); // Only show core 4 for demo
  const externalOrgs = MOCK_ORGANIZATIONS.slice(0, 2); // Show BrandForge and SecureVault

  const activeAgentId = events[events.length - 1]?.agentId;
  const activeRouteTarget = events[events.length - 1]?.targetOrgId;

  return (
    <div className="px-4 md:px-8 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-emerald-500" />
            Live Orchestration Demo
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Watch the Vector OS and Aicoo network autonomously plan, route, and execute a multi-organization project in real-time.
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-2 p-1.5 bg-surface-container/50 border border-outline-variant/30 rounded-xl backdrop-blur">
          {!isPlaying && demoState !== 'completed' ? (
            <button onClick={() => setIsPlaying(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-surface rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all">
              <Play className="w-4 h-4 fill-current" /> Start Demo
            </button>
          ) : (
            <button onClick={() => setIsPlaying(false)} disabled={demoState === 'completed'} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-surface rounded-lg text-sm font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-400 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none">
              <Square className="w-4 h-4 fill-current" /> Stop
            </button>
          )}
          <button onClick={handleReset} className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-surface-container-high/50 rounded-full overflow-hidden mb-6 shrink-0">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left: Visualization */}
        <div className="lg:col-span-7 bg-surface-container-lowest/50 border border-outline-variant/40 rounded-xl overflow-hidden relative shadow-sm">
          <NeuralBackground />
          <div className="absolute top-4 left-4 z-20">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider backdrop-blur ${
              demoState === 'executing' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              demoState === 'external_routing' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' :
              demoState === 'compiling' ? 'bg-violet-500/10 border-violet-500/20 text-violet-500' :
              'bg-surface-container border-outline-variant/50 text-on-surface-variant'
            }`}>
              State: {demoState.replace('_', ' ')}
            </div>
          </div>

          {/* Org Chart Rendering */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[800px] h-[600px] scale-75 md:scale-90 xl:scale-100">
              {/* Architect -> Execs */}
              {executives.map((exec, i) => (
                <ConnectionLine key={`c1-${exec.id}`} startX={400} startY={100} endX={150 + i * 165} endY={300} active={demoState !== 'idle' && demoState !== 'completed' && (activeAgentId === exec.id || activeAgentId === architect.id)} color={exec.accentHex} />
              ))}
              {/* Execs -> External */}
              <ConnectionLine startX={150 + 1 * 165} startY={300} endX={250} endY={500} active={activeRouteTarget === 'securevault'} type="external" color="#06b6d4" />
              <ConnectionLine startX={150 + 2 * 165} startY={300} endX={550} endY={500} active={activeRouteTarget === 'brandforge'} type="external" color="#06b6d4" />

              {/* Nodes */}
              <OrgNode id={architect.id} type="agent" x={400} y={100} status={activeAgentId === architect.id ? 'active' : 'idle'} />
              {executives.map((exec, i) => (
                <OrgNode key={exec.id} id={exec.id} type="agent" x={150 + i * 165} y={300} status={activeAgentId === exec.id ? 'active' : 'idle'} />
              ))}
              <OrgNode id="securevault" type="external_org" x={250} y={500} isActiveRouteTarget={activeRouteTarget === 'securevault'} />
              <OrgNode id="brandforge" type="external_org" x={550} y={500} isActiveRouteTarget={activeRouteTarget === 'brandforge'} />
            </div>
          </div>
        </div>

        {/* Right: Data Flow & Deliverables */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
          <div className="flex-1 bg-surface-container-lowest/50 border border-outline-variant/40 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container/30">
              <h3 className="text-sm font-bold text-on-surface">Live Orchestration Feed</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <TaskFlowVisualization events={events} />
            </div>
          </div>
          
          <div className="h-[250px] shrink-0">
            <DeliverablePanel events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
