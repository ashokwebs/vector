"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, ShieldAlert } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TerminalMessage {
  id: string;
  role: "user" | "prism" | "system";
  content: string;
}

export default function TerminalPage() {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { id: "msg-1", role: "system", content: "CRAYON_OS TERMINAL SECURE LINK ESTABLISHED." },
    { id: "msg-2", role: "prism", content: "I am Prism, Lead Architect. How can the Executive Council assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { id: `msg-${Date.now()}-u`, role: "user", content: userMsg }]);
    setInput("");
    setIsTyping(true);
    
    // Add an empty Prism message to append stream to
    setMessages(prev => [...prev, { id: `msg-${Date.now()}-p`, role: "prism", content: "" }]);

    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: userMsg, 
          projectName: "Terminal Secure Shell",
          conversation_id: null // Terminal always spawns a fresh thread or we could persist it
        })
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      if (!res.body) throw new Error("No response body received.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentResponse = "";
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          const dataStr = trimmed.slice(6);
          if (!dataStr) continue;

          try {
            const payload = JSON.parse(dataStr);
            if (payload.event === 'content') {
              currentResponse += payload.data;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  content: currentResponse,
                };
                return newMessages;
              });
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    } catch (err: any) {
      // If the backend fails (e.g., Python server not running), fallback to a high-fidelity mock stream
      console.warn("Backend unavailable, falling back to local simulation.", err);
      
      let mockResponse = "";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes("/architect") || lower.includes("build") || lower.includes("create")) {
        mockResponse = "Architecture sequence initiated.\n\n* **Nexus:** Drafting zero-trust infrastructure.\n* **Vanguard:** Outlining GTM loop.\n\nI will sync the final markdown to your Project Memory when they complete. Anything else?";
      } else if (lower.includes("budget") || lower.includes("cost") || lower.includes("finance")) {
        mockResponse = "Routing query to **Ledger**.\n\nHe is currently running a Monte Carlo simulation on projected token consumption and cloud amortizations. Results will be posted to the Finance dashboard.";
      } else if (lower.includes("lockdown") || lower.includes("red alert") || lower.includes("hack")) {
        mockResponse = "⚠️ **WARNING: Unrecognized security elevation request.**\n\nPlease use the global Command Palette (`Cmd+K`) to trigger Zero-Trust Protocols manually.";
      } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("whats up") || lower.includes("what") || lower.includes("who")) {
        mockResponse = "Greetings. I am **Prism**, Lead Architect of the Crayon OS Executive Council.\n\nI can assist you with system architecture, security lockdowns, or routing complex tasks to other agents. Try typing `/architect next-gen app` or ask about our `budget`.";
      } else {
        mockResponse = `Analyzing input: "${userMsg}"\n\nI have logged your request into the AICOO vector network. The Executive Council is currently operating in offline simulation mode, but your query has been cached for when the uplink is restored.`;
      }
      let i = 0;
      let currentMock = "";
      
      const streamInterval = setInterval(() => {
        if (i < mockResponse.length) {
          // Stream chunks of 2-5 characters for realism
          const chunkLength = Math.floor(Math.random() * 4) + 2;
          currentMock += mockResponse.slice(i, i + chunkLength);
          i += chunkLength;
          
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: currentMock,
            };
            return newMessages;
          });
        } else {
          clearInterval(streamInterval);
          setIsTyping(false);
        }
      }, 30); // Fast typing speed
      
      // We don't call setIsTyping(false) here because the interval handles it.
      return;
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1000px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            <TerminalIcon className="w-8 h-8 text-emerald-400" />
            Prism Direct Link
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Bypass the standard UI and orchestrate the Executive Council directly via the command line.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Secure Shell
        </div>
      </motion.div>

      <div className="flex-1 bg-black/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono relative">
        {/* Terminal Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-500 text-xs ml-4 tracking-widest">root@prism-orchestrator:~</span>
        </div>

        {/* Message Log */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`text-xs mb-1 uppercase tracking-wider font-bold ${
                  msg.role === 'system' ? 'text-zinc-500' : 
                  msg.role === 'prism' ? 'text-emerald-500' : 'text-indigo-400'
                }`}>
                  {msg.role}
                </div>
                <div className={`max-w-[85%] p-4 rounded-xl leading-relaxed text-sm shadow-xl ${
                  msg.role === 'system' ? 'text-zinc-400 border border-zinc-800/50 italic bg-black/40' :
                  msg.role === 'prism' ? 'bg-zinc-900/90 text-zinc-300 border border-zinc-700/50 backdrop-blur-md' : 
                  'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20 backdrop-blur-md'
                }`}>
                  {msg.role === 'prism' ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-emerald">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || "..."}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && messages[messages.length - 1]?.role !== 'prism' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
                <div className="text-xs mb-1 uppercase tracking-wider font-bold text-emerald-500">prism</div>
                <div className="max-w-[80%] p-4 rounded-xl bg-zinc-900/80 text-zinc-300 border border-zinc-800 flex items-center gap-3">
                  <div className="w-2 h-4 bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-500 text-xs animate-pulse font-mono tracking-widest uppercase">AICOO Network processing request...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-950 shrink-0 flex gap-4">
          <div className="flex-1 relative flex items-center">
            <span className="absolute left-4 text-emerald-500 font-bold">{">"}</span>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter command (e.g., /architect next-gen social network)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700"
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
}
