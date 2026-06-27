import { BoardRoomClient } from "@/components/boardroom/BoardRoomClient";
import { Sparkles } from "lucide-react";

export default function BoardRoomPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col pt-4 px-4 md:px-8 pb-4 w-full">
      <div className="mb-4 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            The Board Room 
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-500 text-[10px] uppercase tracking-wider font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              Live
            </span>
          </h2>
          <p className="text-sm text-on-surface-variant/70">
            Direct interface with Prism (Architect). Monitor executive council telemetry in real-time.
          </p>
        </div>
      </div>
      
      {/* Client Component handling the interactive state */}
      <BoardRoomClient />
    </div>
  );
}
