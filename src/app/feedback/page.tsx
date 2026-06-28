"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFeedback("");
    }, 1200);
  };

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[800px] mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-4">Direct Feed to Team OSPRED</h2>
        <p className="text-on-surface-variant/70 text-lg">
          Ashok P personally reviews all telemetry and feature requests. Submit your intelligence report below.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold text-on-surface mb-2">Transmission Received</h3>
            <p className="text-on-surface-variant mb-6">
              Your feedback has been securely routed to the AICOO vector network and flagged for Ashok P's review.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors"
            >
              Send Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest/50 border border-outline-variant/40 rounded-2xl p-8 shadow-sm flex flex-col gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Transmission Type</label>
              <select className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-indigo-500/50 appearance-none">
                <option>Bug Report / Core System Failure</option>
                <option>Feature Request (Executive Council)</option>
                <option>AICOO Database Integration Issue</option>
                <option>Enterprise Sales Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Intelligence Report</label>
              <textarea 
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Detail your operational insights..."
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-indigo-500/50 min-h-[150px] resize-y placeholder:text-on-surface-variant/40"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Encrypt & Transmit to Team OSPRED
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
