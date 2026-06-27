"use client";

import { useEffect, useState } from "react";

export type DemoState = 'idle' | 'initializing' | 'planning' | 'executing' | 'external_routing' | 'compiling' | 'completed';

export interface DemoEvent {
  id: string;
  time: number; // relative ms from start
  type: 'agent_active' | 'task_created' | 'aicoo_route' | 'aicoo_response' | 'deliverable_added' | 'state_change';
  agentId?: string;
  targetOrgId?: string;
  message?: string;
  newState?: DemoState;
}

const DEMO_SEQUENCE: DemoEvent[] = [
  { id: '1', time: 0, type: 'state_change', newState: 'initializing', message: 'User requested: "Build an AI Education Startup"' },
  { id: '2', time: 1000, type: 'agent_active', agentId: 'prism', message: 'Architect parsing goal...' },
  { id: '3', time: 2500, type: 'state_change', newState: 'planning', message: 'Breaking goal into 4 core tracks' },
  { id: '4', time: 4000, type: 'task_created', agentId: 'nexus', message: 'Task assigned: Technical Architecture' },
  { id: '5', time: 4500, type: 'task_created', agentId: 'vanguard', message: 'Task assigned: Go-to-market Strategy' },
  { id: '6', time: 5000, type: 'task_created', agentId: 'oracle', message: 'Task assigned: Competitor Research' },
  { id: '7', time: 5500, type: 'task_created', agentId: 'ledger', message: 'Task assigned: Financial Projections' },
  
  { id: '8', time: 7000, type: 'state_change', newState: 'executing', message: 'Executive Council active' },
  { id: '9', time: 8000, type: 'agent_active', agentId: 'vanguard', message: 'CMO requires cinematic branding' },
  
  { id: '10', time: 9500, type: 'state_change', newState: 'external_routing', message: 'Aicoo Network triggered' },
  { id: '11', time: 10000, type: 'aicoo_route', agentId: 'vanguard', targetOrgId: 'brandforge', message: 'Routing branding task to BrandForge Agency' },
  { id: '12', time: 12000, type: 'aicoo_route', agentId: 'nexus', targetOrgId: 'securevault', message: 'Routing security audit to SecureVault' },
  
  { id: '13', time: 15000, type: 'aicoo_response', agentId: 'vanguard', targetOrgId: 'brandforge', message: 'BrandForge: Initial moodboards delivered' },
  { id: '14', time: 16500, type: 'deliverable_added', agentId: 'vanguard', message: 'Brand Identity Guidelines' },
  
  { id: '15', time: 18000, type: 'aicoo_response', agentId: 'nexus', targetOrgId: 'securevault', message: 'SecureVault: Audit complete, zero critical vulns' },
  { id: '16', time: 19500, type: 'deliverable_added', agentId: 'nexus', message: 'Architecture & Security Spec' },
  
  { id: '17', time: 21000, type: 'deliverable_added', agentId: 'oracle', message: 'EdTech Market Analysis' },
  { id: '18', time: 22000, type: 'deliverable_added', agentId: 'ledger', message: '5-Year Revenue Model' },
  
  { id: '19', time: 23500, type: 'state_change', newState: 'compiling', message: 'Architect compiling final Master Plan' },
  { id: '20', time: 26000, type: 'deliverable_added', agentId: 'prism', message: 'Project Vector — Master Execution Plan' },
  { id: '21', time: 28000, type: 'state_change', newState: 'completed', message: 'Orchestration Complete' },
];

export function useDemoOrchestrator(isPlaying: boolean, onEvent: (event: DemoEvent) => void) {
  const [currentTime, setCurrentTime] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    let startTime = Date.now() - currentTime;
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now() - startTime;
      setCurrentTime(now);

      // Check if we passed the next event's time
      if (eventIndex < DEMO_SEQUENCE.length && now >= DEMO_SEQUENCE[eventIndex].time) {
        onEvent(DEMO_SEQUENCE[eventIndex]);
        setEventIndex(prev => prev + 1);
      }

      if (eventIndex < DEMO_SEQUENCE.length) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, eventIndex, currentTime, onEvent]);

  const reset = () => {
    setCurrentTime(0);
    setEventIndex(0);
  };

  return { currentTime, progress: Math.min(100, (currentTime / 28000) * 100), reset };
}
