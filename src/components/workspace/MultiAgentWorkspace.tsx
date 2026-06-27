'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

export function MultiAgentWorkspace() {
  const [idea, setIdea] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string, agent?: string}[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initWorkspace = async () => {
      try {
        const res = await fetch('/api/conversations');
        if (!res.ok) return;
        const data = await res.json();
        const list = data.conversations || [];
        
        const savedConvId = typeof window !== 'undefined' ? localStorage.getItem('active_conversation_id') : null;
        const targetConvId = savedConvId && list.some((c: any) => c.conversation_id === savedConvId)
          ? savedConvId
          : (list.length > 0 ? list[0].conversation_id : null);

        if (targetConvId) {
          const convRes = await fetch(`/api/conversations/${targetConvId}`);
          if (convRes.ok) {
            const convData = await convRes.json();
            if (convData.messages && convData.messages.length > 0) {
              const mapped = convData.messages.map((m: any) => ({
                role: m.role,
                content: m.content || "",
                agent: m.role === 'assistant' ? 'Prism' : undefined
              }));
              setMessages(mapped);
              setConversationId(targetConvId);
              localStorage.setItem('active_conversation_id', targetConvId);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load workspace conversation", err);
      }
    };
    initWorkspace();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isProcessing) return;

    const userMsg = idea.trim();
    setIdea('');
    setIsProcessing(true);
    
    setMessages(prev => [
      ...prev,
      { role: "user", content: userMsg },
      { role: "assistant", agent: "Prism", content: "" }
    ]);

    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea: userMsg, 
          projectName: "Dashboard Workspace",
          conversation_id: conversationId
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body received.");
      }

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
            } else if (payload.event === 'meta') {
              if (payload.conversation_id) {
                setConversationId(payload.conversation_id);
                localStorage.setItem('active_conversation_id', payload.conversation_id);
              }
            }
          } catch {
            // Ignore malformed JSON chunks
          }
        }
      }

      if (!currentResponse) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: "Request processed. Please try with more detail for a richer response.",
          };
          return newMessages;
        });
      }

    } catch (err: any) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          content: `⚠️ Connection error: ${err?.message || "Unknown error"}. Ensure the Python backend is running on port 8000.`,
        };
        return newMessages;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="premium-card rounded-xl flex-1 flex flex-col h-[600px] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container/30">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          Strategic Discussion
        </h3>
        <div className="flex items-center gap-2">
          {isProcessing && <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-container-high/50 border border-outline-variant/50 text-on-surface-variant uppercase tracking-wider">
            {conversationId ? 'Active Thread' : 'New Thread'}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface-container-lowest/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-emerald-500/30" />
            </div>
            <p className="text-sm font-semibold text-on-surface/60">Workspace is empty</p>
            <p className="text-xs text-on-surface-variant/50 mt-1.5 max-w-sm text-center">Enter a startup idea or strategic question to begin analysis with the AI executive team.</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 px-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-on-surface/50' : 'text-emerald-500/70'}`}>
                    {msg.role === 'user' ? 'You' : msg.agent || 'Prism'}
                  </span>
                </div>
                <div className={`p-3.5 rounded-xl text-sm border max-w-[90%] ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-on-surface to-on-surface/90 text-surface-container-lowest border-transparent rounded-tr-sm shadow-sm' 
                    : 'bg-surface-container/80 border-outline-variant/30 text-on-surface rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="markdown-content [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-semibold [&>pre]:bg-surface-container-highest [&>pre]:p-2 [&>pre]:rounded [&>pre]:text-xs [&>pre]:overflow-x-auto [&>code]:bg-surface-container-highest [&>code]:px-1 [&>code]:rounded [&>code]:text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || "…"}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isProcessing && !messages[messages.length - 1]?.content && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-on-surface-variant text-sm p-3"
          >
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
            <span className="text-xs text-on-surface-variant/60">Orchestrating agents...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-surface-container/30 border-t border-outline-variant/30">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-surface-container-high/30 border border-outline-variant/40 rounded-xl py-3 pl-4 pr-14 text-sm text-on-surface focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all disabled:opacity-50 placeholder:text-on-surface-variant/30" 
            placeholder="Type your startup idea to trigger the AI team..." 
          />
          <button 
            type="submit"
            disabled={isProcessing || !idea.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
