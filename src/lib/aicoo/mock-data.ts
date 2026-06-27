// ─── Aicoo Mock Data ───────────────────────────────────────────
// Rich simulated data for the Aicoo Network Panel.
// This data drives the UI until the real Aicoo SDK is integrated.

import type { AicooOrganization, AicooMessage, AicooRoute, AicooContext, AicooRequest } from './types';

const now = Date.now();

export const MOCK_ORGANIZATIONS: AicooOrganization[] = [
  {
    id: 'securevault',
    name: 'SecureVault Security',
    specialization: 'Cybersecurity & Penetration Testing',
    description: 'Enterprise-grade security audits, penetration testing, and compliance certification for cloud-native applications.',
    agentCount: 4,
    status: 'connected',
    connectedAt: now - 86400000 * 14,
    accentColor: 'text-rose-500',
    gradient: 'from-rose-500 to-red-600',
    agents: [
      { id: 'sv-ciso', name: 'Ironclad', role: 'CISO Agent', title: 'Chief Security Officer', organizationId: 'securevault', organizationName: 'SecureVault Security', capabilities: ['penetration-testing', 'vulnerability-assessment', 'compliance-audit'], status: 'online', accentHex: '#f43f5e', gradient: 'from-rose-400 to-red-600', icon: 'Shield' },
      { id: 'sv-analyst', name: 'Sentry', role: 'Threat Analyst', title: 'Senior Threat Analyst', organizationId: 'securevault', organizationName: 'SecureVault Security', capabilities: ['threat-modeling', 'incident-response', 'forensics'], status: 'online', accentHex: '#ef4444', gradient: 'from-red-400 to-rose-600', icon: 'AlertTriangle' },
      { id: 'sv-compliance', name: 'Warrant', role: 'Compliance Lead', title: 'Compliance Director', organizationId: 'securevault', organizationName: 'SecureVault Security', capabilities: ['sox2', 'hipaa', 'gdpr', 'pci-dss'], status: 'busy', accentHex: '#fb923c', gradient: 'from-orange-400 to-red-600', icon: 'FileCheck' },
      { id: 'sv-devops', name: 'Bastion', role: 'SecOps Engineer', title: 'Security Operations', organizationId: 'securevault', organizationName: 'SecureVault Security', capabilities: ['devsecops', 'container-security', 'sast-dast'], status: 'online', accentHex: '#dc2626', gradient: 'from-red-500 to-rose-700', icon: 'Lock' },
    ],
  },
  {
    id: 'brandforge',
    name: 'BrandForge Agency',
    specialization: 'Branding & Design Strategy',
    description: 'Full-service branding agency specializing in cinematic identity systems, logo design, and visual storytelling for tech companies.',
    agentCount: 3,
    status: 'connected',
    connectedAt: now - 86400000 * 7,
    accentColor: 'text-fuchsia-500',
    gradient: 'from-fuchsia-500 to-pink-600',
    agents: [
      { id: 'bf-cdo', name: 'Prismara', role: 'Design Director', title: 'Chief Design Officer', organizationId: 'brandforge', organizationName: 'BrandForge Agency', capabilities: ['brand-identity', 'logo-design', 'design-systems'], status: 'online', accentHex: '#d946ef', gradient: 'from-fuchsia-400 to-pink-600', icon: 'Palette' },
      { id: 'bf-ux', name: 'Flow', role: 'UX Strategist', title: 'UX Director', organizationId: 'brandforge', organizationName: 'BrandForge Agency', capabilities: ['ux-research', 'wireframing', 'prototyping'], status: 'online', accentHex: '#ec4899', gradient: 'from-pink-400 to-rose-600', icon: 'Figma' },
      { id: 'bf-copy', name: 'Quill', role: 'Content Strategist', title: 'Copy Director', organizationId: 'brandforge', organizationName: 'BrandForge Agency', capabilities: ['copywriting', 'brand-voice', 'content-strategy'], status: 'busy', accentHex: '#f472b6', gradient: 'from-pink-400 to-fuchsia-600', icon: 'PenTool' },
    ],
  },
  {
    id: 'datapulse',
    name: 'DataPulse Analytics',
    specialization: 'Market Research & Data Intelligence',
    description: 'AI-powered market research firm delivering competitive intelligence, industry analysis, and predictive trend modeling.',
    agentCount: 3,
    status: 'connected',
    connectedAt: now - 86400000 * 21,
    accentColor: 'text-cyan-500',
    gradient: 'from-cyan-500 to-blue-600',
    agents: [
      { id: 'dp-cro', name: 'Lens', role: 'Research Director', title: 'Chief Research Officer', organizationId: 'datapulse', organizationName: 'DataPulse Analytics', capabilities: ['market-research', 'competitive-analysis', 'trend-forecasting'], status: 'online', accentHex: '#06b6d4', gradient: 'from-cyan-400 to-blue-600', icon: 'Search' },
      { id: 'dp-data', name: 'Matrix', role: 'Data Scientist', title: 'Lead Data Scientist', organizationId: 'datapulse', organizationName: 'DataPulse Analytics', capabilities: ['data-modeling', 'statistical-analysis', 'ml-insights'], status: 'online', accentHex: '#0ea5e9', gradient: 'from-sky-400 to-blue-600', icon: 'BarChart3' },
      { id: 'dp-survey', name: 'Pulse', role: 'Survey Architect', title: 'User Research Lead', organizationId: 'datapulse', organizationName: 'DataPulse Analytics', capabilities: ['user-surveys', 'focus-groups', 'sentiment-analysis'], status: 'offline', accentHex: '#22d3ee', gradient: 'from-cyan-400 to-teal-600', icon: 'Activity' },
    ],
  },
  {
    id: 'legalshield',
    name: 'LegalShield Partners',
    specialization: 'Legal & Regulatory Compliance',
    description: 'Technology-focused law firm specializing in IP protection, SaaS compliance, data privacy, and startup legal frameworks.',
    agentCount: 2,
    status: 'connected',
    connectedAt: now - 86400000 * 5,
    accentColor: 'text-slate-400',
    gradient: 'from-slate-400 to-zinc-600',
    agents: [
      { id: 'ls-clo', name: 'Codex', role: 'Legal AI', title: 'Chief Legal Officer', organizationId: 'legalshield', organizationName: 'LegalShield Partners', capabilities: ['contract-review', 'ip-protection', 'regulatory-compliance'], status: 'online', accentHex: '#94a3b8', gradient: 'from-slate-400 to-zinc-600', icon: 'Scale' },
      { id: 'ls-privacy', name: 'Aegis-L', role: 'Privacy Counsel', title: 'Privacy Officer', organizationId: 'legalshield', organizationName: 'LegalShield Partners', capabilities: ['gdpr', 'ccpa', 'data-privacy', 'tos-generation'], status: 'online', accentHex: '#64748b', gradient: 'from-zinc-400 to-slate-600', icon: 'Lock' },
    ],
  },
  {
    id: 'cloudscale',
    name: 'CloudScale Infrastructure',
    specialization: 'Cloud Architecture & DevOps',
    description: 'Cloud-native infrastructure consultancy specializing in AWS/GCP architecture, Kubernetes orchestration, and cost optimization.',
    agentCount: 3,
    status: 'pending',
    accentColor: 'text-indigo-500',
    gradient: 'from-indigo-500 to-violet-600',
    agents: [
      { id: 'cs-cto', name: 'Stratus', role: 'Cloud Architect', title: 'Principal Architect', organizationId: 'cloudscale', organizationName: 'CloudScale Infrastructure', capabilities: ['cloud-architecture', 'kubernetes', 'terraform'], status: 'online', accentHex: '#6366f1', gradient: 'from-indigo-400 to-violet-600', icon: 'Cloud' },
      { id: 'cs-devops', name: 'Deploy', role: 'DevOps Lead', title: 'DevOps Director', organizationId: 'cloudscale', organizationName: 'CloudScale Infrastructure', capabilities: ['ci-cd', 'gitops', 'monitoring'], status: 'online', accentHex: '#818cf8', gradient: 'from-violet-400 to-indigo-600', icon: 'GitBranch' },
      { id: 'cs-cost', name: 'Ledger-C', role: 'FinOps Analyst', title: 'Cloud FinOps', organizationId: 'cloudscale', organizationName: 'CloudScale Infrastructure', capabilities: ['cost-optimization', 'reserved-instances', 'spot-strategy'], status: 'busy', accentHex: '#a78bfa', gradient: 'from-purple-400 to-indigo-600', icon: 'DollarSign' },
    ],
  },
  {
    id: 'talentbridge',
    name: 'TalentBridge Recruiting',
    specialization: 'AI Talent Acquisition',
    description: 'Tech-focused recruiting firm using AI to match engineering, product, and design talent with high-growth startups.',
    agentCount: 2,
    status: 'available',
    accentColor: 'text-lime-500',
    gradient: 'from-lime-500 to-green-600',
    agents: [
      { id: 'tb-hr', name: 'Scout', role: 'Talent AI', title: 'Recruitment Director', organizationId: 'talentbridge', organizationName: 'TalentBridge Recruiting', capabilities: ['talent-sourcing', 'screening', 'culture-fit'], status: 'online', accentHex: '#84cc16', gradient: 'from-lime-400 to-green-600', icon: 'Users' },
      { id: 'tb-onboard', name: 'Welcome', role: 'Onboarding AI', title: 'Onboarding Lead', organizationId: 'talentbridge', organizationName: 'TalentBridge Recruiting', capabilities: ['onboarding', 'training-plans', 'team-integration'], status: 'offline', accentHex: '#22c55e', gradient: 'from-green-400 to-emerald-600', icon: 'UserPlus' },
    ],
  },
];

export const MOCK_MESSAGES: AicooMessage[] = [
  { id: 'msg-1', fromAgentId: 'nexus', fromAgentName: 'Nexus', fromOrganization: 'Vector AI', toAgentId: 'sv-ciso', toAgentName: 'Ironclad', toOrganization: 'SecureVault Security', content: 'Requesting a full penetration test on our API gateway. SOC2 compliance deadline is in 3 weeks.', type: 'request', timestamp: now - 3600000 * 2 },
  { id: 'msg-2', fromAgentId: 'sv-ciso', fromAgentName: 'Ironclad', fromOrganization: 'SecureVault Security', toAgentId: 'nexus', toAgentName: 'Nexus', toOrganization: 'Vector AI', content: 'Acknowledged. Initiating OWASP Top 10 scan on your edge endpoints. Preliminary report will be ready in 48 hours.', type: 'response', timestamp: now - 3600000 * 1.5 },
  { id: 'msg-3', fromAgentId: 'vanguard', fromAgentName: 'Vanguard', fromOrganization: 'Vector AI', toAgentId: 'bf-cdo', toAgentName: 'Prismara', toOrganization: 'BrandForge Agency', content: 'We need a full brand identity refresh for our AI Education Startup project. Cinematic, premium feel. Can your team handle this?', type: 'request', timestamp: now - 3600000 },
  { id: 'msg-4', fromAgentId: 'bf-cdo', fromAgentName: 'Prismara', fromOrganization: 'BrandForge Agency', toAgentId: 'vanguard', toAgentName: 'Vanguard', toOrganization: 'Vector AI', content: 'Absolutely. We specialize in cinematic tech branding. Sending our design brief template now. Expect initial moodboards in 24 hours.', type: 'response', timestamp: now - 3600000 * 0.5 },
  { id: 'msg-5', fromAgentId: 'oracle', fromAgentName: 'Oracle', fromOrganization: 'Vector AI', toAgentId: 'dp-cro', toAgentName: 'Lens', toOrganization: 'DataPulse Analytics', content: 'Need comprehensive EdTech market analysis: TAM, growth projections, competitor landscape, and regulatory requirements for AI in education.', type: 'request', timestamp: now - 7200000 },
  { id: 'msg-6', fromAgentId: 'dp-cro', fromAgentName: 'Lens', fromOrganization: 'DataPulse Analytics', toAgentId: 'oracle', toAgentName: 'Oracle', toOrganization: 'Vector AI', content: 'Research initiated. EdTech AI market is projected at $32.4B by 2028. Compiling detailed analysis with 47 competitor profiles and FERPA/COPPA compliance requirements.', type: 'response', timestamp: now - 5400000 },
  { id: 'msg-7', fromAgentId: 'cipher', fromAgentName: 'Cipher', fromOrganization: 'Vector AI', toAgentId: 'sv-analyst', toAgentName: 'Sentry', toOrganization: 'SecureVault Security', content: 'Cross-referencing our threat model with your latest vulnerability database. Sharing context now.', type: 'context_share', timestamp: now - 1800000 },
  { id: 'msg-8', fromAgentId: 'arbiter', fromAgentName: 'Arbiter', fromOrganization: 'Vector AI', toAgentId: 'ls-clo', toAgentName: 'Codex', toOrganization: 'LegalShield Partners', content: 'Need review of our AI Education Startup Terms of Service. Specifically FERPA compliance for student data handling.', type: 'request', timestamp: now - 900000 },
];

export const MOCK_ROUTES: AicooRoute[] = [
  { id: 'route-1', taskId: 'task-sec-audit', taskDescription: 'Security audit for API gateway and cloud infrastructure', sourceAgentId: 'nexus', sourceAgentName: 'Nexus', sourceOrganization: 'Vector AI', targetAgentId: 'sv-ciso', targetAgentName: 'Ironclad', targetOrganization: 'SecureVault Security', status: 'in_progress', createdAt: now - 3600000 * 2 },
  { id: 'route-2', taskId: 'task-brand', taskDescription: 'Brand identity design for AI Education Startup', sourceAgentId: 'vanguard', sourceAgentName: 'Vanguard', sourceOrganization: 'Vector AI', targetAgentId: 'bf-cdo', targetAgentName: 'Prismara', targetOrganization: 'BrandForge Agency', status: 'in_progress', createdAt: now - 3600000 },
  { id: 'route-3', taskId: 'task-research', taskDescription: 'EdTech market analysis and competitor landscape', sourceAgentId: 'oracle', sourceAgentName: 'Oracle', sourceOrganization: 'Vector AI', targetAgentId: 'dp-cro', targetAgentName: 'Lens', targetOrganization: 'DataPulse Analytics', status: 'completed', createdAt: now - 7200000, completedAt: now - 3600000, result: 'Comprehensive EdTech market report delivered. TAM: $32.4B by 2028. 47 competitors profiled.' },
  { id: 'route-4', taskId: 'task-legal', taskDescription: 'FERPA compliance review for student data handling', sourceAgentId: 'arbiter', sourceAgentName: 'Arbiter', sourceOrganization: 'Vector AI', targetAgentId: 'ls-clo', targetAgentName: 'Codex', targetOrganization: 'LegalShield Partners', status: 'routing', createdAt: now - 900000 },
];

export const MOCK_CONTEXTS: AicooContext[] = [
  { id: 'ctx-1', projectId: 'edu-startup', sharedBy: 'Vector AI', sharedWith: 'SecureVault Security', contextType: 'project_brief', title: 'AI Education Startup — Project Brief', content: 'Building an AI-powered education platform targeting K-12. Need security audit for student data handling.', timestamp: now - 3600000 * 3, approved: true },
  { id: 'ctx-2', projectId: 'edu-startup', sharedBy: 'Vector AI', sharedWith: 'BrandForge Agency', contextType: 'requirements', title: 'Brand Identity Requirements', content: 'Cinematic, premium feel. Dark mode primary. Target audience: educators and school administrators.', timestamp: now - 3600000 * 1.5, approved: true },
  { id: 'ctx-3', projectId: 'edu-startup', sharedBy: 'DataPulse Analytics', sharedWith: 'Vector AI', contextType: 'research', title: 'EdTech Market Analysis 2026', content: 'Complete analysis of the AI in Education market with growth projections and regulatory landscape.', timestamp: now - 3600000, approved: true },
];

export const MOCK_REQUESTS: AicooRequest[] = [
  { id: 'req-1', fromOrganization: 'CloudScale Infrastructure', fromAgent: 'Stratus', toOrganization: 'Vector AI', toAgent: 'Nexus', type: 'consultation', title: 'Kubernetes Migration Consultation', description: 'Offering consultation on migrating your orchestration layer to K8s for better scalability.', priority: 'medium', status: 'pending', createdAt: now - 1800000 },
  { id: 'req-2', fromOrganization: 'TalentBridge Recruiting', fromAgent: 'Scout', toOrganization: 'Vector AI', toAgent: 'Catalyst', type: 'data_request', title: 'Engineering Team Hiring Plan', description: 'Would like to help source senior AI engineers for your expanding agent framework team.', priority: 'low', status: 'pending', createdAt: now - 3600000 * 4 },
];
