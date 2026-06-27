"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function NeuralBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Dynamic CSS Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"
        style={{ maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)' }}
      />
      
      {/* Floating Orbs representing external network nodes */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0], 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0], 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.5, 1] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, 40, 0], 
          opacity: [0.05, 0.15, 0.05] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[40%] right-[30%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px]"
      />
    </div>
  );
}
