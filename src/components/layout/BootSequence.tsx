"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence() {
  const [isVisible, setIsVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const bootLines = [
    "CRAYON_OS v2.4.1 initialized.",
    "Loading NEXUS environment...",
    "Establishing secure connection to AICOO Vectors [OK]",
    "Waking Executive Council: ATLAS, NEXUS, PRISM, VANGUARD, LEDGER",
    "Handshake complete. Bypassing standard protocols.",
    "Welcome to the Board Room, Administrator."
  ];

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("crayon_booted");
    if (!hasBooted) {
      setIsVisible(true);
      sessionStorage.setItem("crayon_booted", "true");
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (currentLineIndex < bootLines.length) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, bootLines[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      }, Math.random() * 300 + 200); // Random delay between 200-500ms
      return () => clearTimeout(timeout);
    } else {
      // Finished all lines, wait a bit and fade out
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="boot-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col justify-end p-8 md:p-16 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative font-mono text-sm md:text-base space-y-2 z-10 w-full max-w-4xl mx-auto">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${i === bootLines.length - 1 ? 'text-emerald-400 font-bold mt-8' : 'text-zinc-400'}`}
              >
                <span className="text-zinc-600 mr-4">{`[${(Math.random() * 10).toFixed(3)}]`}</span>
                {line}
              </motion.div>
            ))}
            
            {/* Blinking cursor */}
            {currentLineIndex < bootLines.length && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-3 h-5 bg-zinc-400 mt-2 inline-block align-middle"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
