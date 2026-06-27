"use client";

import { useState, useEffect } from "react";
import { Settings2, Cpu, Shield, Key, Bell, Save, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.4);
  const [memoryWindow, setMemoryWindow] = useState("session");
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("agent");

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("vector_model");
      const savedTemp = localStorage.getItem("vector_temperature");
      const savedMemory = localStorage.getItem("vector_memory");
      if (savedModel) setModel(savedModel);
      if (savedTemp) setTemperature(parseFloat(savedTemp));
      if (savedMemory) setMemoryWindow(savedMemory);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("vector_model", model);
    localStorage.setItem("vector_temperature", temperature.toString());
    localStorage.setItem("vector_memory", memoryWindow);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "agent", name: "Agent Parameters", icon: Cpu },
    { id: "api", name: "API Keys & Access", icon: Key },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];


  return (
    <div className="px-4 md:px-8 lg:px-12 pb-8 max-w-[1200px] mx-auto pt-6 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-700 flex items-center justify-center text-white shadow-lg">
            <Settings2 className="w-5 h-5" />
          </div>
          System Settings
        </h2>
        <p className="text-sm text-on-surface-variant/70 max-w-2xl">
          Configure Vector Command Center preferences, agent models, and InsForge Knowledge Base.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors text-left whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-surface-container-high text-on-surface font-semibold border-l-4 border-emerald-500 shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium border-l-4 border-transparent"
                }`}
              >
                <SectionIcon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{section.name}</span>
                <span className="md:hidden">{section.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          

          {/* AGENT SECTION */}
          {activeSection === "agent" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">Agent Inference Parameters</h3>
                <p className="text-xs text-on-surface-variant mt-1">Configure how the AI agents process and respond to your requests.</p>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Setting 1: LLM Model */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">Default LLM Model</label>
                    <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">Active</span>
                  </div>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Fast, Default)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Advanced Reasoning)</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet (Via Vertex AI)</option>
                  </select>
                  <p className="text-[10px] text-on-surface-variant mt-2">The baseline model used by Prism to architect and delegate sub-tasks.</p>
                </div>

                {/* Setting 2: Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">System Temperature (Creativity)</label>
                    <span className="text-sm font-bold text-on-surface">{temperature.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-medium">
                    <span>Deterministic (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>

                {/* Setting 3: Memory Window */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">Agent Memory Window</label>
                  </div>
                  <select
                    value={memoryWindow}
                    onChange={(e) => setMemoryWindow(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="session">Session Only (Ephemeral)</option>
                    <option value="last10">Last 10 Interactions</option>
                    <option value="infinite">Infinite (InsForge Vector Store)</option>
                  </select>
                  <p className="text-[10px] text-on-surface-variant mt-2">Controls how much context is fetched from the InsForge Vector Store during orchestration.</p>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
                {saved && (
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Preferences saved
                  </div>
                )}
                {!saved && <div />}
                <button
                  onClick={handleSave}
                  className="bg-on-surface text-surface-container-lowest px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">API Keys & Access</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Gemini API Key</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••••••"
                      readOnly
                      className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant"
                    />
                    <span className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-2 rounded-lg border border-emerald-500/20 font-bold">Connected</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">InsForge Postgres URI</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••••••"
                      readOnly
                      className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant"
                    />
                    <span className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-2 rounded-lg border border-emerald-500/20 font-bold">Connected</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-2">InsForge Postgres database used for conversation persistence and pgvector embeddings.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">Notifications</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Agent task completion", desc: "Get notified when an orchestration completes", enabled: true },
                  { label: "System errors", desc: "Alert when backend encounters critical errors", enabled: true },
                  { label: "New document embedded", desc: "Notification when InsForge saves a new vector", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.label}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${item.enabled ? 'bg-emerald-500 justify-end' : 'bg-surface-container-highest justify-start'}`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
