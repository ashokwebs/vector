// ─── Aicoo Service Layer ───────────────────────────────────────
// Simulated implementation of the Aicoo service interfaces.
// When the real Aicoo SDK is provided, only this file changes.

import type {
  IAicooIdentityService,
  IAicooMessagingService,
  IAicooRoutingService,
  IAicooContextService,
  IAicooDiscoveryService,
  IAicooConnectionService,
  AicooExternalAgent,
  AicooMessage,
  AicooRoute,
  AicooContext,
  AicooOrganization,
} from './types';

import {
  MOCK_ORGANIZATIONS,
  MOCK_MESSAGES,
  MOCK_ROUTES,
  MOCK_CONTEXTS,
  MOCK_REQUESTS,
} from './mock-data';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Identity Service ──────────────────────────────────────────
class MockIdentityService implements IAicooIdentityService {
  async getIdentity(agentId: string): Promise<AicooExternalAgent | null> {
    await delay(100);
    for (const org of MOCK_ORGANIZATIONS) {
      const agent = org.agents.find(a => a.id === agentId);
      if (agent) return agent;
    }
    return null;
  }

  async registerIdentity(_agentId: string, _capabilities: string[]): Promise<void> {
    await delay(200);
    // In real SDK: register with Aicoo network
  }
}

// ─── Messaging Service ─────────────────────────────────────────
class MockMessagingService implements IAicooMessagingService {
  private messages: AicooMessage[] = [...MOCK_MESSAGES];

  async sendMessage(message: Omit<AicooMessage, 'id' | 'timestamp'>): Promise<AicooMessage> {
    await delay(300);
    const newMsg: AicooMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
    };
    this.messages.push(newMsg);
    return newMsg;
  }

  async getMessages(_orgId?: string): Promise<AicooMessage[]> {
    await delay(150);
    if (_orgId) {
      return this.messages.filter(
        m => m.fromOrganization === _orgId || m.toOrganization === _orgId
      );
    }
    return [...this.messages].sort((a, b) => b.timestamp - a.timestamp);
  }

  async getConversation(fromOrg: string, toOrg: string): Promise<AicooMessage[]> {
    await delay(150);
    return this.messages
      .filter(
        m =>
          (m.fromOrganization === fromOrg && m.toOrganization === toOrg) ||
          (m.fromOrganization === toOrg && m.toOrganization === fromOrg)
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}

// ─── Routing Service ───────────────────────────────────────────
class MockRoutingService implements IAicooRoutingService {
  private routes: AicooRoute[] = [...MOCK_ROUTES];

  async routeTask(
    route: Omit<AicooRoute, 'id' | 'createdAt' | 'status'>
  ): Promise<AicooRoute> {
    await delay(500);
    const newRoute: AicooRoute = {
      ...route,
      id: `route-${Date.now()}`,
      status: 'routing',
      createdAt: Date.now(),
    };
    this.routes.push(newRoute);
    return newRoute;
  }

  async getRoutes(): Promise<AicooRoute[]> {
    await delay(150);
    return [...this.routes].sort((a, b) => b.createdAt - a.createdAt);
  }

  async getRouteStatus(routeId: string): Promise<AicooRoute | null> {
    await delay(100);
    return this.routes.find(r => r.id === routeId) || null;
  }
}

// ─── Context Service ───────────────────────────────────────────
class MockContextService implements IAicooContextService {
  private contexts: AicooContext[] = [...MOCK_CONTEXTS];

  async shareContext(
    context: Omit<AicooContext, 'id' | 'timestamp'>
  ): Promise<AicooContext> {
    await delay(300);
    const newCtx: AicooContext = {
      ...context,
      id: `ctx-${Date.now()}`,
      timestamp: Date.now(),
    };
    this.contexts.push(newCtx);
    return newCtx;
  }

  async getSharedContexts(projectId?: string): Promise<AicooContext[]> {
    await delay(150);
    if (projectId) {
      return this.contexts.filter(c => c.projectId === projectId);
    }
    return [...this.contexts].sort((a, b) => b.timestamp - a.timestamp);
  }
}

// ─── Discovery Service ─────────────────────────────────────────
class MockDiscoveryService implements IAicooDiscoveryService {
  async getOrganizations(): Promise<AicooOrganization[]> {
    await delay(200);
    return MOCK_ORGANIZATIONS;
  }

  async getOrganization(orgId: string): Promise<AicooOrganization | null> {
    await delay(100);
    return MOCK_ORGANIZATIONS.find(o => o.id === orgId) || null;
  }

  async getExternalAgents(orgId?: string): Promise<AicooExternalAgent[]> {
    await delay(150);
    if (orgId) {
      const org = MOCK_ORGANIZATIONS.find(o => o.id === orgId);
      return org?.agents || [];
    }
    return MOCK_ORGANIZATIONS.flatMap(o => o.agents);
  }

  async searchExperts(capability: string): Promise<AicooExternalAgent[]> {
    await delay(200);
    const lc = capability.toLowerCase();
    return MOCK_ORGANIZATIONS.flatMap(o => o.agents).filter(a =>
      a.capabilities.some(c => c.toLowerCase().includes(lc))
    );
  }
}

// ─── Connection Service ────────────────────────────────────────
class MockConnectionService implements IAicooConnectionService {
  async getConnections(): Promise<AicooOrganization[]> {
    await delay(150);
    return MOCK_ORGANIZATIONS.filter(o => o.status === 'connected');
  }

  async requestConnection(_orgId: string): Promise<void> {
    await delay(300);
    // In real SDK: send connection request via Aicoo
  }

  async acceptConnection(_orgId: string): Promise<void> {
    await delay(300);
    // In real SDK: accept incoming connection
  }
}

// ─── Singleton Service Instances ───────────────────────────────
// These are the service instances consumed by the UI layer.
// When the real Aicoo SDK arrives, swap these implementations.

export const aicooIdentity = new MockIdentityService();
export const aicooMessaging = new MockMessagingService();
export const aicooRouting = new MockRoutingService();
export const aicooContext = new MockContextService();
export const aicooDiscovery = new MockDiscoveryService();
export const aicooConnections = new MockConnectionService();

// Re-export mock data for components that need static access
export { MOCK_ORGANIZATIONS, MOCK_MESSAGES, MOCK_ROUTES, MOCK_CONTEXTS, MOCK_REQUESTS };
