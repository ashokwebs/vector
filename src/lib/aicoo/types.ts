// ─── Aicoo Type System ─────────────────────────────────────────
// Abstraction types for the Aicoo cross-organization coordination backbone.

export interface AicooOrganization {
  id: string;
  name: string;
  specialization: string;
  description: string;
  agentCount: number;
  status: 'connected' | 'pending' | 'available' | 'offline';
  connectedAt?: number;
  agents: AicooExternalAgent[];
  accentColor: string;
  gradient: string;
}

export interface AicooExternalAgent {
  id: string;
  name: string;
  role: string;
  title: string;
  organizationId: string;
  organizationName: string;
  capabilities: string[];
  status: 'online' | 'busy' | 'offline';
  accentHex: string;
  gradient: string;
  icon: string;
}

export interface AicooMessage {
  id: string;
  fromAgentId: string;
  fromAgentName: string;
  fromOrganization: string;
  toAgentId: string;
  toAgentName: string;
  toOrganization: string;
  content: string;
  type: 'request' | 'response' | 'context_share' | 'status_update';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface AicooRoute {
  id: string;
  taskId: string;
  taskDescription: string;
  sourceAgentId: string;
  sourceAgentName: string;
  sourceOrganization: string;
  targetAgentId: string;
  targetAgentName: string;
  targetOrganization: string;
  status: 'routing' | 'in_progress' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  result?: string;
}

export interface AicooContext {
  id: string;
  projectId: string;
  sharedBy: string;
  sharedWith: string;
  contextType: 'project_brief' | 'requirements' | 'deliverable' | 'review' | 'research';
  title: string;
  content: string;
  timestamp: number;
  approved: boolean;
}

export interface AicooRequest {
  id: string;
  fromOrganization: string;
  fromAgent: string;
  toOrganization: string;
  toAgent: string;
  type: 'task_request' | 'review_request' | 'consultation' | 'data_request';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: number;
}

export interface IAicooIdentityService {
  getIdentity(agentId: string): Promise<AicooExternalAgent | null>;
  registerIdentity(agentId: string, capabilities: string[]): Promise<void>;
}

export interface IAicooMessagingService {
  sendMessage(message: Omit<AicooMessage, 'id' | 'timestamp'>): Promise<AicooMessage>;
  getMessages(orgId?: string): Promise<AicooMessage[]>;
  getConversation(fromOrg: string, toOrg: string): Promise<AicooMessage[]>;
}

export interface IAicooRoutingService {
  routeTask(route: Omit<AicooRoute, 'id' | 'createdAt' | 'status'>): Promise<AicooRoute>;
  getRoutes(): Promise<AicooRoute[]>;
  getRouteStatus(routeId: string): Promise<AicooRoute | null>;
}

export interface IAicooContextService {
  shareContext(context: Omit<AicooContext, 'id' | 'timestamp'>): Promise<AicooContext>;
  getSharedContexts(projectId?: string): Promise<AicooContext[]>;
}

export interface IAicooDiscoveryService {
  getOrganizations(): Promise<AicooOrganization[]>;
  getOrganization(orgId: string): Promise<AicooOrganization | null>;
  getExternalAgents(orgId?: string): Promise<AicooExternalAgent[]>;
  searchExperts(capability: string): Promise<AicooExternalAgent[]>;
}

export interface IAicooConnectionService {
  getConnections(): Promise<AicooOrganization[]>;
  requestConnection(orgId: string): Promise<void>;
  acceptConnection(orgId: string): Promise<void>;
}
