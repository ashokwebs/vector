"use client";

import { motion } from "framer-motion";
import { FileText, Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1200px] mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center max-w-3xl mx-auto"
      >
        <Cookie className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-4">Cookie Policy</h2>
        <p className="text-on-surface-variant/70 text-lg">
          Minimal tracking. Maximum performance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8 text-on-surface-variant"
      >
        <section className="bg-surface-container-lowest/50 border border-outline-variant/40 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-400" />
            Essential Telemetry Only
          </h3>
          <p className="mb-4">
            Crayon OS uses local storage and encrypted session cookies exclusively for maintaining your authenticated state, storing your preferred AI agent parameters, and caching the AICOO vector embeddings locally to reduce latency. 
          </p>
          <p>
            We do not use third-party advertising cookies, and Team OSPRED does not sell your orchestration telemetry to data brokers.
          </p>
        </section>

        <section className="bg-surface-container-lowest/50 border border-outline-variant/40 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-4">Managing Your Data</h3>
          <p>
            You can clear your local storage at any time via your browser settings, which will prompt a re-authentication and a fresh download of your Executive Council context from the AICOO PostgreSQL database upon your next login.
          </p>
        </section>
        
        <div className="text-center text-xs text-on-surface-variant/50 pt-8">
          Last updated: 2026. Engineered by Team OSPRED (Ashok P).
        </div>
      </motion.div>
    </div>
  );
}
