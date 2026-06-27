"use client";

import { useEffect, useState } from "react";
import { History, Target, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Session = {
  _id: string;
  session_id: string;
  project_id: string;
  idea: string;
  status: string;
  final_strategy?: string;
};

export default function ActivityPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions');
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <History className="w-5 h-5" />
            </div>
            Activity Log
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Review past agent orchestrations, architecture plans, and executive strategies saved in the InsForge database.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center text-on-surface-variant flex flex-col items-center">
          <Target className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No activity found.</p>
          <p className="text-sm mt-1">Start an orchestration in the Board Room to see it here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                    session.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {session.status}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">{session.session_id}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Original Idea</h4>
                  <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/50 text-sm text-on-surface">
                    {session.idea}
                  </div>
                </div>

                {session.final_strategy && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Final Executed Strategy</h4>
                    <div className="bg-surface-container-lowest p-6 rounded-lg border border-emerald-500/20 text-sm text-on-surface shadow-inner max-h-[400px] overflow-y-auto markdown-content [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>h3]:text-base [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {session.final_strategy}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
