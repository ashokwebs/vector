"use client";

import { useState, useEffect } from "react";
import { Globe, Search, ArrowRight, MessageSquare, Clock, Zap, Shield, Activity, Brain, Network, Send, Check, AlertCircle, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_ORGANIZATIONS, MOCK_MESSAGES, MOCK_ROUTES, MOCK_CONTEXTS, MOCK_REQUESTS } from "@/lib/aicoo/mock-data";
import type { AicooOrganization, AicooMessage, AicooRoute, AicooRequest } from "@/lib/aicoo/types";

type Tab = 'overview' | 'messages' | 'routes' | 'requests';

export default function AicooPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedOrg, setSelectedOrg] = useState<AicooOrganization | null>(null);

  const connected = MOCK_ORGANIZATIONS.filter(o => o.status === 'connected');
  const pending = MOCK_ORGANIZATIONS.filter(o => o.status === 'pending');
  const available = MOCK_ORGANIZATIONS.filter(o => o.status === 'available');
  const allAgents = MOCK_ORGANIZATIONS.flatMap(o => o.agents);
  const activeRoutes = MOCK_ROUTES.filter(r => r.status !== 'completed');
  const completedRoutes = MOCK_ROUTES.filter(r => r.status === 'completed');

  function timeAgo(ts: number) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'messages', label: 'Messages', count: MOCK_MESSAGES.length },
    { id: 'routes', label: 'Routes', count: MOCK_ROUTES.length },
    { id: 'requests', label: 'Requests', count: MOCK_REQUESTS.length },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-8 max-w-[1600px] mx-auto flex flex-col pt-6 md:pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
              Aicoo <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Network</span>
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Cross-organization agent coordination backbone. Connect with external AI teams, route tasks, and share context securely.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-emerald-500 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {connected.length} Connected
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/8 border border-amber-500/15 text-amber-500 font-bold">
            {pending.length} Pending
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-on-surface-variant font-bold">
            {allAgents.length} Agents
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 bg-surface-container/50 border border-outline-variant/40 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-on-surface text-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-surface/20 text-surface' : 'bg-surface-container-high text-on-surface-variant'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Connected Organizations */}
            <section>
              <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected Organizations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {connected.map((org, idx) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}
                    className={`premium-card rounded-xl p-5 cursor-pointer group transition-all ${selectedOrg?.id === org.id ? 'ring-2 ring-cyan-500/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${org.gradient} flex items-center justify-center text-white shadow-lg text-lg font-bold`}>
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface group-hover:text-cyan-500 transition-colors">{org.name}</h4>
                          <p className="text-[10px] text-on-surface-variant/60 font-medium">{org.specialization}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">Connected</span>
                    </div>
                    <p className="text-xs text-on-surface-variant/70 line-clamp-2 mb-3">{org.description}</p>
                    <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/30">
                      <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1"><Brain className="w-3 h-3" /> {org.agentCount} agents</span>
                      <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1"><Clock className="w-3 h-3" /> {org.connectedAt ? timeAgo(org.connectedAt) : 'N/A'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Selected Org Detail */}
            <AnimatePresence>
              {selectedOrg && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="premium-card rounded-xl p-6">
                    <h3 className="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedOrg.gradient} flex items-center justify-center text-white text-sm font-bold`}>{selectedOrg.name.charAt(0)}</div>
                      {selectedOrg.name} — External Agents
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {selectedOrg.agents.map(agent => (
                        <div key={agent.id} className="bg-surface-container/50 border border-outline-variant/30 rounded-xl p-4 hover:border-outline-variant/60 transition-all">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white text-xs font-bold`}>{agent.name.charAt(0)}</div>
                            <div>
                              <p className="text-xs font-bold text-on-surface">{agent.name}</p>
                              <p className="text-[10px] text-on-surface-variant/60">{agent.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
                            <span className="text-[10px] text-on-surface-variant/60 capitalize">{agent.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.capabilities.slice(0, 2).map(c => (
                              <span key={c} className="text-[9px] px-1.5 py-0.5 bg-surface-container-high/50 border border-outline-variant/20 rounded text-on-surface-variant/60">{c}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Pending + Available */}
            {(pending.length > 0 || available.length > 0) && (
              <section>
                <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Pending & Available
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[...pending, ...available].map((org, idx) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="premium-card rounded-xl p-5 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${org.gradient} flex items-center justify-center text-white shadow-lg text-lg font-bold`}>
                            {org.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-on-surface">{org.name}</h4>
                            <p className="text-[10px] text-on-surface-variant/60">{org.specialization}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                          org.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                        }`}>{org.status}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant/70 line-clamp-2">{org.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Active Routes', value: String(activeRoutes.length), color: 'text-cyan-500', bg: 'bg-cyan-500/8' },
                { label: 'Completed Tasks', value: String(completedRoutes.length), color: 'text-emerald-500', bg: 'bg-emerald-500/8' },
                { label: 'Shared Contexts', value: String(MOCK_CONTEXTS.length), color: 'text-violet-500', bg: 'bg-violet-500/8' },
                { label: 'Pending Requests', value: String(MOCK_REQUESTS.filter(r => r.status === 'pending').length), color: 'text-amber-500', bg: 'bg-amber-500/8' },
              ].map(stat => (
                <div key={stat.label} className="premium-card rounded-xl p-4">
                  <p className="text-[11px] text-on-surface-variant/60 font-medium mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </section>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div key="messages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {MOCK_MESSAGES.sort((a, b) => b.timestamp - a.timestamp).map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="premium-card rounded-xl p-4 flex gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0 ${
                  msg.fromOrganization === 'Vector AI' ? 'bg-gradient-to-br from-emerald-400 to-teal-600' : 'bg-gradient-to-br from-cyan-400 to-blue-600'
                }`}>
                  {msg.fromAgentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-on-surface">{msg.fromAgentName}</span>
                    <ArrowRight className="w-3 h-3 text-on-surface-variant/30" />
                    <span className="text-sm font-medium text-on-surface-variant">{msg.toAgentName}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      msg.type === 'request' ? 'bg-amber-500/10 text-amber-500' :
                      msg.type === 'response' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-violet-500/10 text-violet-500'
                    }`}>{msg.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/50 mb-2">
                    <span>{msg.fromOrganization}</span>
                    <span>→</span>
                    <span>{msg.toOrganization}</span>
                    <span className="ml-auto flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(msg.timestamp)}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant/80 leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'routes' && (
          <motion.div key="routes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {MOCK_ROUTES.sort((a, b) => b.createdAt - a.createdAt).map((route, idx) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="premium-card rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      route.status === 'completed' ? 'bg-emerald-500' :
                      route.status === 'in_progress' ? 'bg-blue-500 animate-pulse' :
                      route.status === 'routing' ? 'bg-amber-500 animate-pulse' :
                      'bg-rose-500'
                    }`} />
                    <h4 className="text-sm font-bold text-on-surface">{route.taskDescription}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    route.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    route.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    route.status === 'routing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>{route.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 mb-2">
                  <span className="font-medium text-on-surface">{route.sourceAgentName}</span>
                  <span className="text-on-surface-variant/30">({route.sourceOrganization})</span>
                  <ArrowRight className="w-3 h-3 text-cyan-500" />
                  <span className="font-medium text-on-surface">{route.targetAgentName}</span>
                  <span className="text-on-surface-variant/30">({route.targetOrganization})</span>
                </div>
                {route.result && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                    <p className="text-xs text-emerald-500/80"><Check className="w-3 h-3 inline mr-1" />{route.result}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3 text-[10px] text-on-surface-variant/40">
                  <Clock className="w-3 h-3" />
                  <span>Created {timeAgo(route.createdAt)}</span>
                  {route.completedAt && <span>• Completed {timeAgo(route.completedAt)}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div key="requests" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {MOCK_REQUESTS.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="premium-card rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-on-surface">{req.title}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                    req.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    req.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-surface-container-high text-on-surface-variant border-outline-variant/30'
                  }`}>{req.priority}</span>
                </div>
                <p className="text-xs text-on-surface-variant/70 mb-3">{req.description}</p>
                <div className="flex items-center gap-4 text-[10px] text-on-surface-variant/50">
                  <span>From: <strong className="text-on-surface-variant">{req.fromOrganization}</strong> ({req.fromAgent})</span>
                  <span>→ {req.toAgent}</span>
                  <span className="ml-auto"><Clock className="w-3 h-3 inline mr-0.5" />{timeAgo(req.createdAt)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-[0.98]">
                    <Check className="w-3 h-3 inline mr-1" />Accept
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/50 text-on-surface-variant text-xs font-semibold hover:border-outline-variant transition-all">
                    Decline
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
