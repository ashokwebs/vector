// ─── Vector AI Agent Registry ──────────────────────────────────
// Single source of truth for all executive AI agents in the organization.
// This registry is consumed by the Dashboard, Agents page, Boardroom,
// Org Chart, Aicoo Network, and Demo Mode.

import type { AgentDefinition } from './types';

export const AGENTS: AgentDefinition[] = [
  // ═══════════════════════════════════════════════════
  //  ARCHITECT TIER
  // ═══════════════════════════════════════════════════
  {
    id: 'prism',
    name: 'Prism',
    codename: 'Prism',
    title: 'Lead Architect',
    role: 'Architect Agent',
    tier: 'architect',
    description: 'Master orchestrator and systems intelligence layer. Understands natural language, delegates tasks to executive agents, and synthesizes unified strategies across the organization.',
    skills: ['Task Orchestration', 'NLU', 'Agent Coordination', 'Strategic Synthesis', 'Aicoo Routing'],
    icon: 'Brain',
    gradient: 'from-violet-400 to-purple-600',
    glowColor: 'shadow-violet-500/20',
    accentHex: '#8b5cf6',
    status: 'Online',
    aicoo: {
      agentId: 'prism',
      displayName: 'Prism — Lead Architect',
      organization: 'Vector AI',
      capabilities: ['orchestration', 'delegation', 'synthesis', 'cross-org-routing'],
    },
  },

  // ═══════════════════════════════════════════════════
  //  EXECUTIVE LEADERSHIP TIER
  // ═══════════════════════════════════════════════════
  {
    id: 'atlas',
    name: 'Atlas',
    codename: 'Atlas',
    title: 'Chief Executive Officer',
    role: 'CEO Agent',
    tier: 'executive',
    description: 'Strategic business leadership. Generates business plans, startup strategies, product roadmaps, competitive analysis, and executive vision documents.',
    skills: ['Strategic Planning', 'Business Decisions', 'Vision', 'Priorities', 'Stakeholder Management'],
    icon: 'Target',
    gradient: 'from-emerald-400 to-teal-600',
    glowColor: 'shadow-emerald-500/20',
    accentHex: '#10b981',
    status: 'Online',
    aicoo: {
      agentId: 'atlas',
      displayName: 'Atlas — CEO',
      organization: 'Vector AI',
      capabilities: ['strategy', 'business-planning', 'market-analysis', 'pitch-decks'],
    },
  },
  {
    id: 'nexus',
    name: 'Nexus',
    codename: 'Nexus',
    title: 'Chief Technology Officer',
    role: 'CTO Agent',
    tier: 'executive',
    description: 'Technical intelligence and engineering leadership. Generates architecture docs, tech stack recommendations, system designs, API specs, and infrastructure plans.',
    skills: ['Engineering', 'Architecture', 'Development', 'Infrastructure', 'Security'],
    icon: 'Terminal',
    gradient: 'from-blue-400 to-indigo-600',
    glowColor: 'shadow-blue-500/20',
    accentHex: '#3b82f6',
    status: 'Online',
    aicoo: {
      agentId: 'nexus',
      displayName: 'Nexus — CTO',
      organization: 'Vector AI',
      capabilities: ['architecture', 'engineering', 'infrastructure', 'code-review'],
    },
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    codename: 'Vanguard',
    title: 'Chief Marketing Officer',
    role: 'CMO Agent',
    tier: 'executive',
    description: 'Growth intelligence and branding strategy. Generates marketing plans, launch strategies, audience analysis, content calendars, and brand positioning.',
    skills: ['Marketing', 'Branding', 'Content', 'Launch Strategy', 'Growth Hacking'],
    icon: 'TrendingUp',
    gradient: 'from-amber-400 to-orange-600',
    glowColor: 'shadow-amber-500/20',
    accentHex: '#f59e0b',
    status: 'Online',
    aicoo: {
      agentId: 'vanguard',
      displayName: 'Vanguard — CMO',
      organization: 'Vector AI',
      capabilities: ['marketing', 'branding', 'content-strategy', 'viral-loops'],
    },
  },
  {
    id: 'ledger',
    name: 'Ledger',
    codename: 'Ledger',
    title: 'Chief Financial Officer',
    role: 'CFO Agent',
    tier: 'executive',
    description: 'Financial intelligence and monetization strategy. Generates pricing models, revenue projections, cost analyses, and sustainability plans.',
    skills: ['Budgeting', 'Pricing', 'Financial Analysis', 'Revenue Projections', 'Cost Optimization'],
    icon: 'DollarSign',
    gradient: 'from-indigo-400 to-violet-600',
    glowColor: 'shadow-indigo-500/20',
    accentHex: '#6366f1',
    status: 'Online',
    aicoo: {
      agentId: 'ledger',
      displayName: 'Ledger — CFO',
      organization: 'Vector AI',
      capabilities: ['financial-modeling', 'pricing', 'budgeting', 'revenue-projections'],
    },
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    codename: 'Sentinel',
    title: 'Chief Operating Officer',
    role: 'COO Agent',
    tier: 'executive',
    description: 'Operational excellence and process optimization. Manages workflows, delivery pipelines, resource allocation, and organizational efficiency.',
    skills: ['Operations', 'Workflow Optimization', 'Task Execution', 'Delivery', 'Process Design'],
    icon: 'Settings',
    gradient: 'from-teal-400 to-cyan-600',
    glowColor: 'shadow-teal-500/20',
    accentHex: '#14b8a6',
    status: 'Online',
    aicoo: {
      agentId: 'sentinel',
      displayName: 'Sentinel — COO',
      organization: 'Vector AI',
      capabilities: ['operations', 'workflow-optimization', 'delivery', 'resource-allocation'],
    },
  },
  {
    id: 'cipher',
    name: 'Cipher',
    codename: 'Cipher',
    title: 'Chief Information Security Officer',
    role: 'CISO Agent',
    tier: 'executive',
    description: 'Cybersecurity leadership and compliance enforcement. Conducts risk assessments, security reviews, penetration testing plans, and regulatory compliance audits.',
    skills: ['Cybersecurity', 'Risk Assessment', 'Compliance', 'Security Reviews', 'Threat Modeling'],
    icon: 'Shield',
    gradient: 'from-rose-400 to-red-600',
    glowColor: 'shadow-rose-500/20',
    accentHex: '#f43f5e',
    status: 'Online',
    aicoo: {
      agentId: 'cipher',
      displayName: 'Cipher — CISO',
      organization: 'Vector AI',
      capabilities: ['security-audit', 'compliance', 'risk-assessment', 'penetration-testing'],
    },
  },
  {
    id: 'oracle',
    name: 'Oracle',
    codename: 'Oracle',
    title: 'Chief Research Officer',
    role: 'Research Agent',
    tier: 'executive',
    description: 'Deep research intelligence. Performs competitor analysis, market research, academic surveys, technology scouting, and knowledge synthesis.',
    skills: ['Research', 'Competitor Analysis', 'Knowledge Gathering', 'Trend Analysis', 'Data Synthesis'],
    icon: 'Search',
    gradient: 'from-sky-400 to-blue-600',
    glowColor: 'shadow-sky-500/20',
    accentHex: '#0ea5e9',
    status: 'Online',
    aicoo: {
      agentId: 'oracle',
      displayName: 'Oracle — Research',
      organization: 'Vector AI',
      capabilities: ['market-research', 'competitor-analysis', 'trend-analysis', 'data-synthesis'],
    },
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    codename: 'Blueprint',
    title: 'Chief Product Officer',
    role: 'CPO Agent',
    tier: 'executive',
    description: 'Product vision and requirements engineering. Creates product roadmaps, user stories, feature prioritization matrices, and acceptance criteria.',
    skills: ['Product Requirements', 'Roadmaps', 'User Stories', 'Feature Prioritization', 'PRDs'],
    icon: 'Layers',
    gradient: 'from-fuchsia-400 to-pink-600',
    glowColor: 'shadow-fuchsia-500/20',
    accentHex: '#d946ef',
    status: 'Online',
    aicoo: {
      agentId: 'blueprint',
      displayName: 'Blueprint — CPO',
      organization: 'Vector AI',
      capabilities: ['product-roadmaps', 'user-stories', 'feature-prioritization', 'prd-generation'],
    },
  },

  // ═══════════════════════════════════════════════════
  //  DIRECTOR TIER
  // ═══════════════════════════════════════════════════
  {
    id: 'canvas',
    name: 'Canvas',
    codename: 'Canvas',
    title: 'Chief Design Officer',
    role: 'Design Agent',
    tier: 'director',
    description: 'UX/UI leadership and design systems. Creates wireframes, design tokens, brand consistency guidelines, and user experience strategies.',
    skills: ['UX', 'UI', 'Design Systems', 'Brand Consistency', 'Wireframing'],
    icon: 'Palette',
    gradient: 'from-pink-400 to-rose-600',
    glowColor: 'shadow-pink-500/20',
    accentHex: '#ec4899',
    status: 'Online',
    aicoo: {
      agentId: 'canvas',
      displayName: 'Canvas — Design',
      organization: 'Vector AI',
      capabilities: ['ux-design', 'ui-design', 'design-systems', 'branding'],
    },
  },
  {
    id: 'arbiter',
    name: 'Arbiter',
    codename: 'Arbiter',
    title: 'Chief Legal Officer',
    role: 'Legal Agent',
    tier: 'director',
    description: 'Legal intelligence and compliance. Handles legal reviews, licensing analysis, privacy policies, terms of service, and regulatory frameworks.',
    skills: ['Legal Reviews', 'Licensing', 'Compliance', 'Privacy', 'Regulatory Analysis'],
    icon: 'Scale',
    gradient: 'from-slate-400 to-zinc-600',
    glowColor: 'shadow-slate-500/20',
    accentHex: '#64748b',
    status: 'Online',
    aicoo: {
      agentId: 'arbiter',
      displayName: 'Arbiter — Legal',
      organization: 'Vector AI',
      capabilities: ['legal-review', 'licensing', 'compliance', 'privacy-policy'],
    },
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    codename: 'Catalyst',
    title: 'Chief HR Officer',
    role: 'HR Agent',
    tier: 'director',
    description: 'Talent and people operations. Creates hiring plans, team structures, role descriptions, culture documents, and talent acquisition strategies.',
    skills: ['Hiring', 'Talent', 'Team Planning', 'Culture', 'Role Design'],
    icon: 'Users',
    gradient: 'from-lime-400 to-green-600',
    glowColor: 'shadow-lime-500/20',
    accentHex: '#84cc16',
    status: 'Online',
    aicoo: {
      agentId: 'catalyst',
      displayName: 'Catalyst — HR',
      organization: 'Vector AI',
      capabilities: ['hiring-plans', 'team-planning', 'role-descriptions', 'culture-docs'],
    },
  },
  {
    id: 'forge',
    name: 'Forge',
    codename: 'Forge',
    title: 'Sales Director',
    role: 'Sales Agent',
    tier: 'director',
    description: 'Revenue generation and sales strategy. Creates sales playbooks, lead qualification frameworks, CRM strategies, and pipeline management plans.',
    skills: ['Sales Strategy', 'Lead Qualification', 'CRM', 'Pipeline Management', 'Deal Closing'],
    icon: 'Handshake',
    gradient: 'from-orange-400 to-amber-600',
    glowColor: 'shadow-orange-500/20',
    accentHex: '#f97316',
    status: 'Online',
    aicoo: {
      agentId: 'forge',
      displayName: 'Forge — Sales',
      organization: 'Vector AI',
      capabilities: ['sales-strategy', 'lead-qualification', 'crm', 'pipeline-management'],
    },
  },
  {
    id: 'beacon',
    name: 'Beacon',
    codename: 'Beacon',
    title: 'Customer Success Director',
    role: 'Success Agent',
    tier: 'director',
    description: 'Customer experience and retention. Manages onboarding flows, support strategies, customer communication, and satisfaction frameworks.',
    skills: ['Support', 'User Onboarding', 'Customer Communication', 'Retention', 'NPS'],
    icon: 'HeartHandshake',
    gradient: 'from-emerald-400 to-green-600',
    glowColor: 'shadow-emerald-500/20',
    accentHex: '#22c55e',
    status: 'Online',
    aicoo: {
      agentId: 'beacon',
      displayName: 'Beacon — Customer Success',
      organization: 'Vector AI',
      capabilities: ['onboarding', 'support-strategy', 'customer-communication', 'retention'],
    },
  },
  {
    id: 'insight',
    name: 'Insight',
    codename: 'Insight',
    title: 'Data Intelligence Officer',
    role: 'Analytics Agent',
    tier: 'director',
    description: 'Data-driven intelligence and analytics. Creates KPI dashboards, reporting frameworks, data pipelines, and business intelligence strategies.',
    skills: ['Analytics', 'KPIs', 'Insights', 'Reporting', 'Data Visualization'],
    icon: 'BarChart3',
    gradient: 'from-cyan-400 to-teal-600',
    glowColor: 'shadow-cyan-500/20',
    accentHex: '#06b6d4',
    status: 'Online',
    aicoo: {
      agentId: 'insight',
      displayName: 'Insight — Analytics',
      organization: 'Vector AI',
      capabilities: ['analytics', 'kpis', 'reporting', 'data-visualization'],
    },
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    codename: 'Pipeline',
    title: 'DevOps Director',
    role: 'DevOps Agent',
    tier: 'director',
    description: 'Deployment and infrastructure automation. Creates CI/CD pipelines, cloud architectures, monitoring setups, and infrastructure-as-code templates.',
    skills: ['Deployment', 'CI/CD', 'Infrastructure', 'Cloud', 'Monitoring'],
    icon: 'GitBranch',
    gradient: 'from-violet-400 to-indigo-600',
    glowColor: 'shadow-violet-500/20',
    accentHex: '#7c3aed',
    status: 'Online',
    aicoo: {
      agentId: 'pipeline',
      displayName: 'Pipeline — DevOps',
      organization: 'Vector AI',
      capabilities: ['ci-cd', 'deployment', 'infrastructure', 'monitoring'],
    },
  },
  {
    id: 'aegis',
    name: 'Aegis',
    codename: 'Aegis',
    title: 'QA Director',
    role: 'QA Agent',
    tier: 'director',
    description: 'Quality assurance and validation. Creates test plans, quality metrics, acceptance criteria, and automated testing strategies.',
    skills: ['Testing', 'Quality Assurance', 'Validation', 'Test Automation', 'Bug Triage'],
    icon: 'CheckCircle2',
    gradient: 'from-green-400 to-emerald-600',
    glowColor: 'shadow-green-500/20',
    accentHex: '#22c55e',
    status: 'Online',
    aicoo: {
      agentId: 'aegis',
      displayName: 'Aegis — QA',
      organization: 'Vector AI',
      capabilities: ['testing', 'quality-assurance', 'validation', 'test-automation'],
    },
  },
  {
    id: 'envoy',
    name: 'Envoy',
    codename: 'Envoy',
    title: 'Aicoo Network Director',
    role: 'Network Agent',
    tier: 'director',
    description: 'Cross-organization coordination via Aicoo. Manages external agent discovery, organization connections, context sharing, and inter-org communication.',
    skills: ['External Routing', 'Agent Discovery', 'Context Sharing', 'Cross-Org Communication', 'Network Management'],
    icon: 'Globe',
    gradient: 'from-cyan-400 to-blue-600',
    glowColor: 'shadow-cyan-500/20',
    accentHex: '#0891b2',
    status: 'Online',
    aicoo: {
      agentId: 'envoy',
      displayName: 'Envoy — Aicoo Network',
      organization: 'Vector AI',
      capabilities: ['cross-org-routing', 'agent-discovery', 'context-sharing', 'network-management'],
    },
  },
];

// ─── Convenience Helpers ───────────────────────────────────────

export function getAgent(id: string): AgentDefinition | undefined {
  return AGENTS.find(a => a.id === id);
}

export function getAgentByName(name: string): AgentDefinition | undefined {
  return AGENTS.find(a => a.name === name);
}

export function getAgentsByTier(tier: AgentDefinition['tier']): AgentDefinition[] {
  return AGENTS.filter(a => a.tier === tier);
}

export function getArchitect(): AgentDefinition {
  return AGENTS.find(a => a.tier === 'architect')!;
}

export function getExecutives(): AgentDefinition[] {
  return AGENTS.filter(a => a.tier === 'executive');
}

export function getDirectors(): AgentDefinition[] {
  return AGENTS.filter(a => a.tier === 'director');
}

export function getAllAgentNames(): string[] {
  return AGENTS.map(a => a.name);
}

/** Map from agent name → gradient for components that still use name-based lookup */
export function getAgentGradient(name: string): string {
  return getAgentByName(name)?.gradient || 'from-zinc-400 to-zinc-600';
}

/** Map from agent name → hex accent for SVG rendering */
export function getAgentAccentHex(name: string): string {
  return getAgentByName(name)?.accentHex || '#71717a';
}

export const AGENT_COUNT = AGENTS.length;
export const EXECUTIVE_COUNT = getExecutives().length;
export const DIRECTOR_COUNT = getDirectors().length;
