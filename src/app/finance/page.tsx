"use client";

import { Download, TrendingUp, TrendingDown, DollarSign, Activity, Zap, HardDrive, Database, Brain, Target, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const billingData = [
  {
    name: "Atlas (CEO Agent)",
    icon: Target,
    gradient: "from-emerald-400 to-teal-600",
    resource: "Gemini Flash Latest Tokens",
    usage: "1,240,500",
    cost: "$3.72",
  },
  {
    name: "Nexus (CTO Agent)",
    icon: Terminal,
    gradient: "from-blue-400 to-indigo-600",
    resource: "Gemini Flash Latest Tokens",
    usage: "4,100,000",
    cost: "$12.30",
  },
  {
    name: "Vanguard (CMO Agent)",
    icon: TrendingUp,
    gradient: "from-amber-400 to-orange-600",
    resource: "Gemini Flash Latest Tokens",
    usage: "3,512,000",
    cost: "$10.53",
  },
  {
    name: "Ledger (CFO Agent)",
    icon: DollarSign,
    gradient: "from-indigo-400 to-violet-600",
    resource: "Gemini Flash Latest Tokens",
    usage: "1,850,000",
    cost: "$5.55",
  },
  {
    name: "AWS EKS Cluster",
    icon: Database,
    gradient: "from-violet-400 to-purple-600",
    resource: "T4 GPU Spot Instances",
    usage: "120 Hours",
    cost: "$180.40",
  },
  {
    name: "MongoDB Atlas",
    icon: Database,
    gradient: "from-amber-400 to-amber-600",
    resource: "Shared Cluster Data",
    usage: "1.2 GB",
    cost: "$25.00",
  },
  {
    name: "Vector Search Storage",
    icon: HardDrive,
    gradient: "from-indigo-400 to-blue-600",
    resource: "Storage GB/Month",
    usage: "3.5 GB",
    cost: "$12.40",
  },
];

export default function FinancePage() {
  const handleExportCSV = () => {
    const headers = ["Service/Agent Name", "Resource", "Usage", "Cost"];
    const rows = billingData.map(b => [
      `"${b.name}"`, 
      `"${b.resource}"`, 
      `"${b.usage}"`, 
      `"${b.cost}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vector_financial_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-end shrink-0"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1">Financial Operations</h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Monitor your startup&apos;s burn rate, runway, and granular LLM API costs.
          </p>
        </div>
        <button onClick={handleExportCSV} className="bg-surface-container/50 border border-outline-variant/50 text-on-surface px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container hover:border-outline-variant transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        
        {/* Metric 1: Burn Rate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card rounded-xl p-6 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/8 border border-rose-500/15 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" />
              +2.1%
            </div>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant/60 mb-1">Monthly Burn Rate</p>
          <p className="text-4xl font-bold text-on-surface tracking-tight">$3,840</p>
        </motion.div>

        {/* Metric 2: API Costs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card rounded-xl p-6 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 rounded-lg">
              <TrendingDown className="w-3 h-3" />
              -0.5%
            </div>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant/60 mb-1">LLM API Costs (MTD)</p>
          <p className="text-4xl font-bold text-on-surface tracking-tight">$112.45</p>
          
          {/* Mock Sparkline */}
          <div className="absolute bottom-0 left-0 w-full h-12 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-indigo-500">
              <path d="M0,30 L0,20 C10,15 20,25 30,10 C40,-5 50,20 60,15 C70,10 80,25 90,5 L100,0 L100,30 Z" fill="currentColor" />
            </svg>
          </div>
        </motion.div>

        {/* Metric 3: Runway */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card rounded-xl p-6 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Stable
            </span>
          </div>
          <p className="text-sm font-semibold text-on-surface-variant/60 mb-1">Projected Runway</p>
          <p className="text-4xl font-bold text-on-surface tracking-tight">18 <span className="text-xl text-on-surface-variant/40">Mos</span></p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 premium-card rounded-xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container/20 flex justify-between items-center">
          <h3 className="text-sm font-bold text-on-surface">Detailed Billing Breakdown</h3>
          <span className="text-xs text-on-surface-variant/50 font-medium">May 1 - May 31, 2026</span>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container/30 text-[10px] text-on-surface-variant/50 uppercase tracking-wider font-bold border-b border-outline-variant/30">
                <th className="p-4">Service / Agent</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Usage</th>
                <th className="p-4 text-right">Cost (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {billingData.map((row, idx) => {
                const RowIcon = row.icon;
                return (
                  <tr key={idx} className="hover:bg-surface-container/30 transition-colors group">
                    <td className="p-4 font-medium text-on-surface flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${row.gradient} flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                        <RowIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{row.name}</span>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant/60">{row.resource}</td>
                    <td className="p-4 text-sm text-on-surface-variant/60 font-mono">{row.usage}</td>
                    <td className="p-4 text-sm font-bold text-on-surface text-right">{row.cost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container/20 flex justify-between items-center">
          <span className="text-sm font-semibold text-on-surface-variant/60">Total Selected Resources</span>
          <span className="text-xl font-bold gradient-text">$249.90</span>
        </div>
      </motion.div>
    </div>
  );
}
