"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, GitBranch, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { NeuralBackground } from "@/components/orgchart/NeuralBackground";
import { OrgNode } from "@/components/orgchart/OrgNode";
import { ConnectionLine } from "@/components/orgchart/ConnectionLine";
import { getArchitect, getExecutives, getDirectors } from "@/lib/agents/registry";
import { MOCK_ORGANIZATIONS } from "@/lib/aicoo/mock-data";

export default function OrgChartPage() {
  const architect = getArchitect();
  const executives = getExecutives();
  const directors = getDirectors();
  const externalOrgs = MOCK_ORGANIZATIONS.filter(o => o.status === 'connected').slice(0, 4);

  // Layout calculations (simplified for demo purposes)
  // X values are horizontal positions, Y are vertical tiers
  const canvasW = 1200;
  const canvasH = 800;
  
  const archPos = { x: canvasW / 2, y: 150 };
  
  const execY = 350;
  const execSpacing = 160;
  const execStartX = (canvasW - (executives.length - 1) * execSpacing) / 2;
  
  const dirY = 550;
  const dirSpacing = 120;
  const dirStartX = (canvasW - (directors.length - 1) * dirSpacing) / 2;

  const extY = 750;
  const extSpacing = 250;
  const extStartX = (canvasW - (externalOrgs.length - 1) * extSpacing) / 2;

  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [simulatedTraffic, setSimulatedTraffic] = useState<string[]>([]);

  // Simulate real-time network traffic
  useEffect(() => {
    const allNodes = [
      architect.id,
      ...executives.map(e => e.id),
      ...directors.map(d => d.id),
      ...externalOrgs.map(o => o.id)
    ];

    const interval = setInterval(() => {
      // Pick 2-4 random nodes to be active
      const numActive = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...allNodes].sort(() => 0.5 - Math.random());
      setSimulatedTraffic(shuffled.slice(0, numActive));
    }, 2000);

    return () => clearInterval(interval);
  }, [architect.id, executives, directors, externalOrgs]);

  // Determine if a connection line should be active
  const isLineActive = (from: string, to: string) => {
    if (activeNode) return activeNode === from || activeNode === to;
    return simulatedTraffic.includes(from) || simulatedTraffic.includes(to);
  };

  return (
    <div className="px-4 md:px-8 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex justify-between items-end shrink-0 z-10 relative">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-zinc-300" />
            Organizational Structure
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Live visualization of your AI executive hierarchy and external Aicoo network connections. Observing simulated real-time orchestration traffic.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/aicoo" className="bg-surface-container border border-zinc-600/30 text-zinc-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-800/10 transition-all flex items-center gap-2">
            <Globe className="w-4 h-4" /> Aicoo Network
          </Link>
          <Link href="/demo" className="bg-gradient-to-r from-zinc-800 to-zinc-950 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Run Live Demo
          </Link>
        </div>
      </motion.div>

      <div className="flex-1 bg-surface-container-lowest/50 border border-outline-variant/40 rounded-xl overflow-hidden relative shadow-sm">
        <NeuralBackground />
        
        <div className="absolute inset-0 overflow-auto">
          <div className="relative min-w-[1200px] min-h-[900px] mx-auto" style={{ width: canvasW, height: canvasH }}>
            
            {/* Connections: Architect -> Executives */}
            {executives.map((exec, i) => (
              <ConnectionLine
                key={`conn-arch-${exec.id}`}
                startX={archPos.x} startY={archPos.y + 40}
                endX={execStartX + i * execSpacing} endY={execY - 40}
                active={isLineActive(architect.id, exec.id)}
                color={exec.accentHex}
              />
            ))}

            {/* Connections: Executives -> Directors (simplified direct mapping) */}
            {directors.map((dir, i) => {
              // Map director to closest executive above them horizontally
              const dirX = dirStartX + i * dirSpacing;
              const closestExec = executives.reduce((prev, curr, idx) => {
                const currX = execStartX + idx * execSpacing;
                const prevX = execStartX + executives.indexOf(prev) * execSpacing;
                return Math.abs(currX - dirX) < Math.abs(prevX - dirX) ? curr : prev;
              });
              const execX = execStartX + executives.indexOf(closestExec) * execSpacing;

              return (
                <ConnectionLine
                  key={`conn-exec-${dir.id}`}
                  startX={execX} startY={execY + 40}
                  endX={dirX} endY={dirY - 40}
                  active={isLineActive(closestExec.id, dir.id)}
                  color={dir.accentHex}
                />
              );
            })}

            {/* Connections: Any internal -> External Aicoo (Aicoo lines are dashed) */}
            {externalOrgs.map((org, i) => {
              const orgX = extStartX + i * extSpacing;
              // Map to architect or a specific executive for visual balance
              const sourceNodeId = i % 2 === 0 ? architect.id : executives[i % executives.length].id;
              const startX = sourceNodeId === architect.id ? archPos.x : execStartX + executives.findIndex(e => e.id === sourceNodeId) * execSpacing;
              const startY = sourceNodeId === architect.id ? archPos.y + 40 : execY + 40;

              return (
                <ConnectionLine
                  key={`conn-aicoo-${org.id}`}
                  startX={startX} startY={startY}
                  endX={orgX} endY={extY - 40}
                  active={isLineActive(sourceNodeId, org.id)}
                  type="external"
                  color="#71717a" // Zinc for Aicoo
                />
              );
            })}

            {/* Render Nodes */}
            <OrgNode
              id={architect.id}
              type="agent"
              x={archPos.x}
              y={archPos.y}
              selected={activeNode === architect.id}
              onClick={() => setActiveNode(activeNode === architect.id ? null : architect.id)}
            />

            {executives.map((exec, i) => (
              <OrgNode
                key={exec.id}
                id={exec.id}
                type="agent"
                x={execStartX + i * execSpacing}
                y={execY}
                selected={activeNode === exec.id}
                onClick={() => setActiveNode(activeNode === exec.id ? null : exec.id)}
              />
            ))}

            {directors.map((dir, i) => (
              <OrgNode
                key={dir.id}
                id={dir.id}
                type="agent"
                x={dirStartX + i * dirSpacing}
                y={dirY}
                selected={activeNode === dir.id}
                onClick={() => setActiveNode(activeNode === dir.id ? null : dir.id)}
              />
            ))}

            {externalOrgs.map((org, i) => (
              <OrgNode
                key={org.id}
                id={org.id}
                type="external_org"
                x={extStartX + i * extSpacing}
                y={extY}
                selected={activeNode === org.id}
                onClick={() => setActiveNode(activeNode === org.id ? null : org.id)}
              />
            ))}

            {/* Aicoo Network Label */}
            <div className="absolute w-full flex justify-center pointer-events-none" style={{ top: extY - 100 }}>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-600/30 bg-surface/80 backdrop-blur text-zinc-300 text-xs font-bold uppercase tracking-[0.2em]">
                <Globe className="w-4 h-4" /> Aicoo Cross-Org Network
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Organizational Insight Footer */}
      <div className="mt-6 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="premium-card rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <GitBranch className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Hierarchical Routing</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1">
              Prism acts as the core orchestrator, directly dispatching strategic imperatives to Executive-level agents, which cascade execution down to Specialized Directors.
            </p>
          </div>
        </div>
        <div className="premium-card rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Aicoo Integration</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1">
              External organization nodes dynamically map to your internal executives, establishing secure, cross-boundary context channels for autonomous SLA negotiation.
            </p>
          </div>
        </div>
        <div className="premium-card rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Node Telemetry</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1">
              Each node maintains an independent memory context and processing state, synchronized through the central Crayon OS Event Bus for absolute operational transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
