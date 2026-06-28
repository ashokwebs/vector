"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1200px] mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center max-w-3xl mx-auto"
      >
        <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-4">Privacy Policy</h2>
        <p className="text-on-surface-variant/70 text-lg">
          Your data is your proprietary asset. Our zero-trust architecture ensures it stays that way.
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
            <Database className="w-5 h-5 text-zinc-400" />
            1. Zero-Trust Vector Ingestion
          </h3>
          <p className="mb-4">
            Crayon OS, built by Team OSPRED, utilizes the AICOO PostgreSQL infrastructure to store conversational context and orchestrate agent interactions. Before any data reaches our vector stores, it passes through our proprietary Local Data Scrubber. This ensures all personally identifiable information (PII) and hardcoded credentials are automatically stripped.
          </p>
          <p>
            Your intellectual property is never used to train public Large Language Models.
          </p>
        </section>

        <section className="bg-surface-container-lowest/50 border border-outline-variant/40 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-zinc-400" />
            2. Data Retention & Shredding
          </h3>
          <p className="mb-4">
            All data associated with your Crayon OS account is strictly isolated using Row-Level Security (RLS) in the AICOO database. When you request an account deletion, we don't just soft-delete your relational records; we cryptographically shred your multi-dimensional vector embeddings, making recovery mathematically impossible.
          </p>
        </section>

        <section className="bg-surface-container-lowest/50 border border-outline-variant/40 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-4">3. Contact Team OSPRED</h3>
          <p>
            For legal inquiries, data exportation requests, or compliance auditing (SOC2/HIPAA), please contact Ashok P (Lead Engineer & Founder, Team OSPRED) via our official Feedback terminal or directly at <code>compliance@ospred.dev</code>.
          </p>
        </section>
        
        <div className="text-center text-xs text-on-surface-variant/50 pt-8">
          Last updated: 2026. Engineered by Team OSPRED (Ashok P).
        </div>
      </motion.div>
    </div>
  );
}
