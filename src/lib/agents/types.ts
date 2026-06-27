// ─── Agent Type System ─────────────────────────────────────────
// Central type definitions for the Vector AI Operating System agent framework.

export type AgentTier = 'architect' | 'executive' | 'director';

export type AgentStatus = 'Online' | 'Busy' | 'Idle' | 'Offline';

export type AgentState = 'Idle' | 'Analyzing' | 'Synthesizing' | 'Complete' | 'Routing';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'routed_external';

export interface AicooIdentity {
  agentId: string;
  displayName: string;
  organization: string;
  capabilities: string[];
  externalId?: string; // Aicoo SDK identity once integrated
}

export interface AgentDefinition {
  id: string;
  name: string;         // Human name, e.g. "Atlas"
  codename: string;     // Same as name for now
  title: string;        // e.g. "Chief Executive Officer"
  role: string;         // Short role, e.g. "CEO Agent"
  tier: AgentTier;
  description: string;
  skills: string[];
  icon: string;         // Lucide icon name
  gradient: string;     // Tailwind gradient classes
  glowColor: string;    // Tailwind shadow color
  accentHex: string;    // Hex color for SVG/canvas rendering
  status: AgentStatus;
  aicoo: AicooIdentity;
}

export interface AgentMessage {
  id: string;
  agentId: string;
  agentName: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface TaskAssignment {
  id: string;
  projectId: string;
  agentId: string;
  agentName: string;
  task: string;
  priority: TaskPriority;
  status: TaskStatus;
  dependencies: string[];
  output?: string;
  externalRouteOrg?: string; // Aicoo external routing target
  createdAt: number;
  completedAt?: number;
}

export interface PerformanceMetrics {
  agentId: string;
  tasksCompleted: number;
  avgResponseTime: number; // ms
  successRate: number;     // 0-100
  tokensUsed: number;
  lastActive: number;
}

export interface ProjectMemoryEntry {
  id: string;
  projectId: string;
  category: 'mission' | 'goal' | 'decision' | 'task_completed' | 'task_pending' | 'document' | 'research' | 'external_conversation' | 'meeting_summary' | 'approval' | 'timeline_event';
  agentId?: string;
  title: string;
  content: string;
  createdAt: number;
  metadata?: Record<string, unknown>;
}
