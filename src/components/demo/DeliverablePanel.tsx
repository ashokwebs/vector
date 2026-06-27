"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Code2, Presentation, ShieldCheck, LineChart } from "lucide-react";
import type { DemoEvent } from "./DemoOrchestrator";

const DOC_ICONS: Record<string, React.ReactNode> = {
  'Brand Identity Guidelines': <PaletteIcon />,
  'Architecture & Security Spec': <ShieldCheck className="w-5 h-5" />,
  'EdTech Market Analysis': <LineChart className="w-5 h-5" />,
  '5-Year Revenue Model': <Code2 className="w-5 h-5" />,
  'Project Vector — Master Execution Plan': <Presentation className="w-5 h-5 text-violet-500" />
};

function PaletteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
  );
}

export function DeliverablePanel({ events }: { events: DemoEvent[] }) {
  const deliverables = events.filter(e => e.type === 'deliverable_added');

  return (
    <div className="bg-surface-container/30 border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/50">
        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Project Memory: Final Artifacts</h4>
        <span className="text-[10px] text-on-surface-variant/50 font-mono">{deliverables.length} / 5 Compiled</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        <AnimatePresence>
          {deliverables.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <FileText className="w-12 h-12 mb-3 text-on-surface-variant" />
              <p className="text-xs text-on-surface-variant">Artifacts will appear here<br/>as they are generated.</p>
            </motion.div>
          )}

          {deliverables.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`p-3 rounded-xl border flex items-center gap-3 group ${
                doc.agentId === 'prism' 
                  ? 'bg-violet-500/10 border-violet-500/30' 
                  : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant/60'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                doc.agentId === 'prism' ? 'bg-violet-500/20' : 'bg-surface-container-high'
              }`}>
                {DOC_ICONS[doc.message || ''] || <FileText className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${doc.agentId === 'prism' ? 'text-violet-400' : 'text-on-surface'}`}>
                  {doc.message}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider">Authored by {doc.agentId}</span>
                </div>
              </div>
              
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-high hover:text-on-surface">
                <Download className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
