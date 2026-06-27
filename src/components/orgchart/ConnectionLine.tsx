"use client";

import { motion } from "framer-motion";

interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active?: boolean;
  type?: 'internal' | 'external'; // external is Aicoo routed
  color?: string; // hex color for active state
}

export function ConnectionLine({ startX, startY, endX, endY, active, type = 'internal', color = '#10b981' }: ConnectionLineProps) {
  // SVG path generation (simple bezier curve for horizontal/vertical flow)
  const isHorizontal = Math.abs(startX - endX) > Math.abs(startY - endY);
  
  let path = '';
  if (isHorizontal) {
    const cpX = (startX + endX) / 2;
    path = `M ${startX} ${startY} C ${cpX} ${startY}, ${cpX} ${endY}, ${endX} ${endY}`;
  } else {
    const cpY = (startY + endY) / 2;
    path = `M ${startX} ${startY} C ${startX} ${cpY}, ${endX} ${cpY}, ${endX} ${endY}`;
  }

  const isExternal = type === 'external';

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <defs>
        <linearGradient id={`grad-${startX}-${endX}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0.8} />
        </linearGradient>
      </defs>

      {/* Base line (inactive) */}
      <path
        d={path}
        fill="none"
        stroke="var(--outline-variant)"
        strokeWidth={isExternal ? 1.5 : 2}
        strokeDasharray={isExternal ? "6 4" : "none"}
        opacity={active ? 0.2 : 0.4}
        className="transition-opacity duration-300"
      />

      {/* Active line with flowing dash animation */}
      {active && (
        <path
          d={path}
          fill="none"
          stroke={`url(#grad-${startX}-${endX})`}
          strokeWidth={isExternal ? 2 : 2.5}
          strokeDasharray="8 6"
          className="animate-[dash_1s_linear_infinite]"
        />
      )}
      
      {/* Glow effect on active */}
      {active && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={6}
          opacity={0.15}
          className="blur-sm"
        />
      )}
    </svg>
  );
}
