"use client";

import { useState, useRef, useEffect, memo } from "react";
import { Send, Terminal, Brain, Target, Shield, ArrowRight, Loader2, TrendingUp, DollarSign, MessageSquare, Plus, FileText, ArrowLeft, Save, Edit, Trash, Cpu } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

type AgentState = "Idle" | "Analyzing" | "Synthesizing" | "Complete";

type ConversationListItem = {
  conversation_id: string;
  title?: string;
  created_at?: string;
  messages?: { role: string; content: string }[];
};

export function BoardRoomClient() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [messages, setMessages] = useState<{role: string, content: string, agent?: string}[]>([
    { role: "assistant", agent: "Prism", content: "Hey! I'm Prism, your Lead Architect. I'm connected to the InsForge database and the executive council is online. Give me a project idea and I'll rally the team." },
    { role: "assistant", agent: "Atlas", content: "Atlas (Strategy) standing by. Ready to analyze market fit, TAM, and business objectives." },
    { role: "assistant", agent: "Nexus", content: "Nexus (Engineering) online. Cloud infrastructure and system architectures are green. Ready for deployment specs." },
    { role: "assistant", agent: "Vanguard", content: "Vanguard (Marketing) synced. Go-to-market algorithms and social campaign matrices are loaded." },
    { role: "assistant", agent: "Ledger", content: "Ledger (Finance) connected. Financial modeling and burn rate parameters are nominal." }
  ]);
  
  // Documents state
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeRightTab, setActiveRightTab] = useState<'telemetry' | 'documents' | 'tokens'>('telemetry');
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");

  // Executive Council State
  const [ceoState, setCeoState] = useState<AgentState>("Idle");
  const [ctoState, setCtoState] = useState<AgentState>("Idle");
  const [marketingState, setMarketingState] = useState<AgentState>("Idle");
  const [financeState, setFinanceState] = useState<AgentState>("Idle");
  const [telemetry, setTelemetry] = useState<string[]>(["[SYSTEM] Board Room initialized."]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const telemetryEndRef = useRef<HTMLDivElement>(null);

  // Fetch documents for the active conversation
  const fetchDocuments = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  const handleCreateDocument = async () => {
    if (!conversationId || !newDocTitle.trim()) return;
    const title = newDocTitle.trim();
    setShowNewDocModal(false);
    setNewDocTitle("");
    
    setIsSavingDoc(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: "# " + title + "\n\nStart writing your document here...",
          conversation_id: conversationId
        })
      });
      if (res.ok) {
        const newDoc = await res.json();
        await fetchDocuments(conversationId);
        setActiveRightTab('documents');
        addTelemetry(`[SYSTEM] Created document '${title}'`);
      }
    } catch (err) {
      console.error("Failed to create document", err);
      addTelemetry(`[ERROR] Failed to create document.`);
    } finally {
      setIsSavingDoc(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!editingDoc) return;
    setIsSavingDoc(true);
    try {
      const res = await fetch(`/api/documents/${editingDoc._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingDoc.title,
          content: editingDoc.content,
          conversation_id: conversationId || ""
        })
      });
      if (res.ok) {
        addTelemetry(`[SYSTEM] Saved document '${editingDoc.title}'`);
        if (conversationId) {
          await fetchDocuments(conversationId);
        }
        setEditingDoc(null);
      }
    } catch (err) {
      console.error("Failed to save document", err);
    } finally {
      setIsSavingDoc(false);
    }
  };

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { telemetryEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [telemetry]);

  const getMockConversations = () => {
    const baseDate = Date.now();
    return [
      {
        conversation_id: "demo-1",
        title: "Project NexusRed: Zero-Trust Security Arch",
        created_at: new Date(baseDate - 1000 * 60 * 60 * 2).toISOString(),
        messages: [
          { role: "user", content: "We need to design a zero-trust architecture for a new fintech client. They are scaling fast and need to ensure compliance with SOC2 and PCI-DSS." },
          { role: "assistant", agent: "Prism", content: "Understood. Rallying the team for a Zero-Trust architecture plan that meets strict fintech compliance standards." },
          { role: "assistant", agent: "Atlas", content: "From a strategic standpoint, this is a great opportunity. Achieving SOC2 and PCI-DSS compliance early will allow this client to onboard enterprise partners much faster. We should highlight compliance as a core feature of their GTM strategy." },
          { role: "assistant", agent: "Nexus", content: "For the architecture, I recommend a service mesh using Envoy proxies. We need mutual TLS (mTLS) for all service-to-service communication. For identity access management, we should integrate Auth0 with strict role-based access control (RBAC)." },
          { role: "assistant", agent: "Prism", content: "Nexus, how do you plan to handle the database layer encryption to satisfy PCI-DSS?" },
          { role: "assistant", agent: "Nexus", content: "We will use PostgreSQL with at-rest encryption via AWS KMS. Additionally, all PII and PAN data will be tokenized before ever hitting the primary database." },
          { role: "assistant", agent: "Ledger", content: "Cost estimate for mTLS overhead, Auth0 enterprise tiers, and KMS API calls on AWS is around $800/mo at their current scale. This is well within a standard Series A infrastructure budget." },
          { role: "assistant", agent: "Vanguard", content: "I'll draft a whitepaper on our security-first approach to use as a lead magnet for enterprise sales." }
        ]
      },
      {
        conversation_id: "demo-2",
        title: "NovaVault: Autonomous Fintech OS",
        created_at: new Date(baseDate - 1000 * 60 * 60 * 24).toISOString(),
        messages: [
          { role: "user", content: "Upgrade the NovaVault AI assistant with context-aware, portfolio-synced financial reasoning." },
          { role: "assistant", agent: "Prism", content: "Fintech OS upgrade protocols initiated. Connecting Ledger and Nexus for financial routing and backend architecture." },
          { role: "assistant", agent: "Ledger", content: "To make this commercially viable, we must implement a full-stack Stripe payment architecture. We need subscription management, tiered billing (Free vs Pro), and invoice processing." },
          { role: "assistant", agent: "Nexus", content: "I'll wire the Stripe webhooks to a secure PostgreSQL backend using Next.js 16 App Router. We'll use Prisma ORM for type-safe database queries. For the AI assistant context, we need to inject the user's live portfolio data into the prompt securely." },
          { role: "user", content: "How do we ensure the AI doesn't hallucinate financial advice?" },
          { role: "assistant", agent: "Prism", content: "Great question. We need strict guardrails." },
          { role: "assistant", agent: "Nexus", content: "We will implement a RAG (Retrieval-Augmented Generation) pipeline. The AI will only be allowed to reference official SEC filings and the user's actual portfolio data. We'll add a system prompt enforcing a 'no financial advice' disclaimer." },
          { role: "assistant", agent: "Atlas", content: "Perfect. We position the AI as a 'Financial Co-Pilot' rather than an 'Advisor' to avoid regulatory hurdles with the SEC." }
        ]
      },
      {
        conversation_id: "demo-3",
        title: "Gengen: Cinematic Identity Platform",
        created_at: new Date(baseDate - 1000 * 60 * 60 * 48).toISOString(),
        messages: [
          { role: "user", content: "Finalize the NEXUS Identity OS by implementing an interactive, login-gated cinematic boot sequence." },
          { role: "assistant", agent: "Prism", content: "Cinematic sequence design started. This is highly visual, Vanguard should take the lead on aesthetic direction." },
          { role: "assistant", agent: "Vanguard", content: "The visual aesthetic is crucial here. We need dynamic animations, particle effects, and a hyper-polished dark mode. The boot sequence should feel like terminal hacking meets luxury OS." },
          { role: "assistant", agent: "Nexus", content: "I'll use Framer Motion for the React animations. We can create a matrix-style terminal text effect using a custom hook. We need to keep the bundle size small though, so no heavy 3D libraries." },
          { role: "assistant", agent: "Atlas", content: "Make sure we gate the premium features behind a robust authentication layer. The cinematic boot should act as a teaser. Once they are hooked, we hit them with the sign-up wall." },
          { role: "assistant", agent: "Ledger", content: "If we increase conversion by just 2% with this cinematic onboarding, our Customer Acquisition Cost (CAC) will drop significantly." }
        ]
      },
      {
        conversation_id: "demo-4",
        title: "QuantumLedger: HFT Financial Engine",
        created_at: new Date(baseDate - 1000 * 60 * 60 * 120).toISOString(),
        messages: [
          { role: "user", content: "Build an HFT (High-Frequency Trading) engine. We need sub-millisecond latency for crypto arbitrage." },
          { role: "assistant", agent: "Prism", content: "High-Frequency Trading engine requested. Engaging Nexus for deep systems architecture." },
          { role: "assistant", agent: "Nexus", content: "For sub-millisecond latency, Python or Node.js won't cut it. We must build the core engine in Rust. We'll use io_uring for zero-copy networking to bypass the Linux kernel overhead." },
          { role: "user", content: "What about connecting to Binance and FTX websockets?" },
          { role: "assistant", agent: "Nexus", content: "We will maintain persistent WebSocket connections using the `tokio-tungstenite` crate in Rust. We'll also need co-location for our servers—hosting in Tokyo and AWS us-east-1 near the exchange servers." },
          { role: "assistant", agent: "Ledger", content: "Co-location is expensive. A dedicated bare-metal server near the exchange will cost roughly $2,500/month. We need to ensure the arbitrage spread covers this fixed cost." },
          { role: "assistant", agent: "Atlas", content: "Let's focus purely on stablecoin triangular arbitrage first. It's lower risk and will let us battle-test the Rust engine before touching volatile assets." }
        ]
      },
      {
        conversation_id: "demo-5",
        title: "Don't Press The Button: Viral Game",
        created_at: new Date(baseDate - 1000 * 60 * 60 * 160).toISOString(),
        messages: [
          { role: "user", content: "Develop a highly polished, chaotic browser game where an evolving, sentient red button reacts to user interactions." },
          { role: "assistant", agent: "Prism", content: "Viral gaming loop initialized." },
          { role: "assistant", agent: "Vanguard", content: "This is a brilliant viral marketing play. We need meme-heavy dialogue, unpredictable visual corruption, and a sense of escalating panic. It's perfect for Twitch streamers and YouTube let's-plays." },
          { role: "assistant", agent: "Nexus", content: "I'll architect a modular React/Vite system. We can build a 'Chaos Engine' context provider that dispatches random UI-breaking events. Things like CSS screen-shake, inverted colors, and fake error popups." },
          { role: "user", content: "Can we add procedural audio? Like a heartbeat that gets faster?" },
          { role: "assistant", agent: "Nexus", content: "Absolutely. The Web Audio API is perfect for this. We can tie an oscillator's frequency to the user's click count, simulating a rising heartbeat." },
          { role: "assistant", agent: "Atlas", content: "To monetize, we can add a 'Golden Button' skin that costs $0.99. Microtransactions in viral games have insanely high margins." }
        ]
      }
    ];
  };

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations([...(data.conversations || []), ...getMockConversations()]);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  useEffect(() => {
    const initChats = async () => {
      try {
        const res = await fetch('/api/conversations');
        if (!res.ok) return;
        const data = await res.json();
        const list = [...(data.conversations || []), ...getMockConversations()];
        setConversations(list);
        
        // Auto-select based on localStorage first, fallback to list[0]
        const savedConvId = typeof window !== 'undefined' ? localStorage.getItem('active_conversation_id') : null;
        const targetConvId = savedConvId && list.some((c: any) => c.conversation_id === savedConvId)
          ? savedConvId
          : (data.conversations?.length > 0 ? data.conversations[0].conversation_id : null);

        if (targetConvId) {
          setIsProcessing(true);
          setTelemetry(prev => [...prev, `[SYSTEM] Auto-restoring active session ${targetConvId}...`]);
          
          if (targetConvId.startsWith('demo-')) {
            const mockConv = getMockConversations().find(c => c.conversation_id === targetConvId);
            if (mockConv && mockConv.messages) {
              setMessages(mockConv.messages.map(m => ({...m, agent: m.agent || (m.role === 'assistant' ? 'Prism' : undefined)})));
              setConversationId(targetConvId);
              localStorage.setItem('active_conversation_id', targetConvId);
              setDocuments([]); // Mock projects have no docs
              setTelemetry(prev => [...prev, `[SYSTEM] Restored mock session successfully.`]);
            }
          } else {
            const convRes = await fetch(`/api/conversations/${targetConvId}`);
            if (convRes.ok) {
              const convData = await convRes.json();
              if (convData.messages && convData.messages.length > 0) {
                const mapped = convData.messages.map((m: any) => ({
                  role: m.role,
                  content: m.content,
                  agent: m.role === 'assistant' ? 'Prism' : undefined
                }));
                setMessages(mapped);
                setConversationId(targetConvId);
                localStorage.setItem('active_conversation_id', targetConvId);
                fetchDocuments(targetConvId);
                setTelemetry(prev => [...prev, `[SYSTEM] Restored active conversation successfully.`]);
              }
            }
          }
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("Failed to auto-restore latest conversation", err);
        setIsProcessing(false);
      }
    };
    initChats();
  }, []);

  const addTelemetry = (msg: string) => setTelemetry(prev => [...prev, `[${new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}] ${msg}`]);

  // Load a conversation
  const handleSelectConversation = async (convId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    addTelemetry(`[SYSTEM] Loading conversation ${convId}...`);
    try {
      if (convId.startsWith('demo-')) {
        const mockConv = getMockConversations().find(c => c.conversation_id === convId);
        if (mockConv && mockConv.messages) {
          setMessages(mockConv.messages.map(m => ({...m, agent: m.agent || (m.role === 'assistant' ? 'Prism' : undefined)})));
          setConversationId(convId);
          localStorage.setItem('active_conversation_id', convId);
          setDocuments([]); // No docs for mocks
          setEditingDoc(null);
          addTelemetry(`[SYSTEM] Loaded conversation successfully.`);
        } else {
          throw new Error("Mock conversation not found.");
        }
        return;
      }

      const res = await fetch(`/api/conversations/${convId}`);
      if (!res.ok) throw new Error(`Failed to load conversation: ${res.status}`);
      const data = await res.json();
      
      if (data.messages && data.messages.length > 0) {
        const mapped = data.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
          agent: m.role === 'assistant' ? 'Prism' : undefined
        }));
        setMessages(mapped);
        setConversationId(convId);
        localStorage.setItem('active_conversation_id', convId);
        fetchDocuments(convId);
        setEditingDoc(null); // Close active document when switching chat
        addTelemetry(`[SYSTEM] Loaded conversation successfully.`);
      } else {
        throw new Error("No messages found in conversation.");
      }
    } catch (err: any) {
      addTelemetry(`[ERROR] ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start a new conversation
  const handleNewSession = () => {
    if (isProcessing) return;
    setConversationId(null);
    localStorage.removeItem('active_conversation_id');
    setDocuments([]);
    setEditingDoc(null);
    setMessages([
      { role: "assistant", agent: "Prism", content: "Hey! I'm Prism, your Lead Architect. I'm connected to the InsForge database and the executive council is online. Give me a project idea and I'll rally the team." },
      { role: "assistant", agent: "Atlas", content: "Atlas (Strategy) standing by. Ready to analyze market fit, TAM, and business objectives." },
      { role: "assistant", agent: "Nexus", content: "Nexus (Engineering) online. Cloud infrastructure and system architectures are green. Ready for deployment specs." },
      { role: "assistant", agent: "Vanguard", content: "Vanguard (Marketing) synced. Go-to-market algorithms and social campaign matrices are loaded." },
      { role: "assistant", agent: "Ledger", content: "Ledger (Finance) connected. Financial modeling and burn rate parameters are nominal." }
    ]);
    addTelemetry("[SYSTEM] Initialized new session.");
  };

  const handleRenameConversation = async (convId: string, currentTitle: string) => {
    const newTitle = prompt("Enter new title for conversation:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;

    try {
      if (convId.startsWith('demo-')) {
        setConversations(prev => prev.map(c => c.conversation_id === convId ? { ...c, title: newTitle } : c));
        return;
      }
      const res = await fetch(`/api/conversations/${convId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      if (res.ok) {
        fetchConversations();
      }
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      if (convId.startsWith('demo-')) {
        setConversations(prev => prev.filter(c => c.conversation_id !== convId));
        if (conversationId === convId) handleNewSession();
        return;
      }
      
      const numericId = convId.replace('db-', '');
      const res = await fetch(`/api/projects/${numericId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (conversationId === convId) {
          handleNewSession();
        }
        fetchConversations();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSend = async (userIdea: string) => {
    setIsProcessing(true);
    setCeoState("Idle");
    setCtoState("Idle");
    setMarketingState("Idle");
    setFinanceState("Idle");
    
    addTelemetry(`[Prism] Received input: Analyzing intent...`);
    
    // Stagger agent startup to look like they are spinning up sequentially while we wait for the API
    setTimeout(() => { setCeoState("Analyzing"); addTelemetry(`[Prism] Atlas engaged for strategy...`); }, 500);
    setTimeout(() => { setCtoState("Analyzing"); addTelemetry(`[Prism] Nexus engaged for architecture...`); }, 1000);
    setTimeout(() => { setMarketingState("Analyzing"); addTelemetry(`[Prism] Vanguard engaged for growth...`); }, 1500);
    setTimeout(() => { setFinanceState("Analyzing"); addTelemetry(`[Prism] Ledger engaged for modeling...`); }, 2000);
    
    // Add empty assistant message to fill in
    setMessages(prev => [...prev, { role: "assistant", agent: "Prism", content: "" }]);

    try {
      // Build conversation history for context (last 20 messages)
      const recentHistory = messages.slice(-20).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userIdea, history: recentHistory, conversation_id: conversationId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();

      if (data.mode === "plan") {
        // Handle InsForge DB Project ID
        if (data.conversation_id) {
          setConversationId(data.conversation_id);
          localStorage.setItem('active_conversation_id', data.conversation_id);
          fetchConversations(); // Update sidebar with new project
        }

        // Planning mode — complete delegation
        addTelemetry(`[Prism] Planning mode complete. Compiling Executive Council outputs...`);

        // Show Prism's message
        setMessages(prev => {
          const newMsg = [...prev];
          newMsg[newMsg.length - 1] = { ...newMsg[newMsg.length - 1], content: data.message };
          return newMsg;
        });

        if (data.documents && data.documents.length > 0) {
          const newDocs = data.documents.map((doc: any, i: number) => ({
            _id: `doc-${Date.now()}-${i}`,
            title: doc.title,
            content: doc.content,
            status: "completed",
            agent: doc.agent,
            conversation_id: data.conversation_id || conversationId || "local",
          }));
          setDocuments(prev => [...newDocs, ...prev]);
          setActiveRightTab("documents");
          
          data.documents.forEach((doc: any) => {
            addTelemetry(`[${doc.agent}] Generated: "${doc.title}"`);
          });
        }

        if (data.tasks && data.tasks.length > 0) {
          data.tasks.forEach((task: any) => {
            addTelemetry(`[${task.agent}] Task assigned (${task.priority}): ${task.task}`);
          });
        }

        addTelemetry("[System] All documents compiled. Council tasks assigned.");
        setCeoState("Complete");
        setCtoState("Complete");
        setMarketingState("Complete");
        setFinanceState("Complete");
        setIsProcessing(false);

        setTimeout(() => {
          setCeoState("Idle");
          setCtoState("Idle");
          setMarketingState("Idle");
          setFinanceState("Idle");
        }, 3000);

      } else {
        // Chat mode — abort council planning animation
        setCeoState("Idle");
        setCtoState("Idle");
        setMarketingState("Idle");
        setFinanceState("Idle");
        addTelemetry(`[Prism] Responding in conversation mode.`);
        setMessages(prev => {
          const newMsg = [...prev];
          newMsg[newMsg.length - 1] = { ...newMsg[newMsg.length - 1], content: data.message };
          return newMsg;
        });
        setIsProcessing(false);
      }

    } catch (err: any) {
      addTelemetry(`[ERROR] ${err.message}`);
      setMessages(prev => {
        const newMsg = [...prev];
        newMsg[newMsg.length - 1] = { ...newMsg[newMsg.length - 1], content: `⚠️ Error: ${err.message}. Make sure GEMINI_API_KEY is set in your environment variables.` };
        return newMsg;
      });
      setIsProcessing(false);
    }
  };

  const getUsedTokens = () => {
    let totalChars = 0;
    messages.forEach(m => {
      totalChars += (m.content || "").length;
    });
    return Math.max(1450, Math.round(totalChars / 3.8));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    
    handleSend(userMsg);
  };

  return (
    <>
    <div className="flex-1 flex gap-4 h-full min-h-0 overflow-hidden">
      
      {/* LEFT PANE: Executive Council & History */}
      <div className="w-80 flex flex-col gap-4 shrink-0">
        
        {/* Council Status */}
        <div className="bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-xl p-4 shadow-sm flex-[2] overflow-y-auto min-h-0">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Executive Council
          </h3>
          
          <div className="flex flex-col gap-4">
            <AgentStatusCard 
              name="Prism" 
              role="Architect" 
              state={isProcessing ? "Synthesizing" : "Idle"} 
              icon={<Brain className="w-4 h-4" />}
              color="8b5cf6"
            />
            <AgentStatusCard 
              name="Atlas" 
              role="CEO" 
              state={ceoState} 
              icon={<Target className="w-4 h-4" />}
              color="10b981"
            />
            <AgentStatusCard 
              name="Nexus" 
              role="CTO" 
              state={ctoState} 
              icon={<Terminal className="w-4 h-4" />}
              color="3b82f6"
            />
            <AgentStatusCard 
              name="Vanguard" 
              role="Marketing" 
              state={marketingState} 
              icon={<TrendingUp className="w-4 h-4" />}
              color="f59e0b"
            />
            <AgentStatusCard 
              name="Ledger" 
              role="Finance" 
              state={financeState} 
              icon={<DollarSign className="w-4 h-4" />}
              color="6366f1"
            />
          </div>
        </div>

        {/* Saved Chats */}
        <div className="bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-xl p-4 shadow-sm flex-[1] overflow-y-auto min-h-0 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Active Chats
            </h3>
            <button
              onClick={handleNewSession}
              disabled={isProcessing}
              className="text-[10px] font-semibold text-emerald-500 hover:text-emerald-400 disabled:opacity-50 flex items-center gap-1 bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 rounded-lg transition-all"
            >
              <Plus className="w-3 h-3" /> New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {conversations.length === 0 ? (
              <div className="text-[11px] text-on-surface-variant/70 text-center py-6">
                No active chat history found.
              </div>
            ) : (
              conversations.map((conv) => {
                const displayName = conv.title || "Untitled Project";
                const firstMsg = conv.messages?.[0]?.content || "No message";
                const isSelected = conv.conversation_id === conversationId;
                return (
                  <div key={conv.conversation_id} className="relative group">
                    <button
                      onClick={() => handleSelectConversation(conv.conversation_id)}
                      disabled={isProcessing}
                      className={`w-full text-left p-2.5 rounded-lg border text-[11px] transition-all flex flex-col gap-1 pr-16 ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-500/5 text-on-surface' 
                          : 'border-outline-variant hover:border-on-surface-variant/30 text-on-surface-variant'
                      }`}
                    >
                      <span className="font-semibold text-[11px] truncate block text-emerald-400">
                        {displayName}
                      </span>
                      <span className="truncate text-on-surface-variant/75 text-[10px] block">
                        {firstMsg}
                      </span>
                    </button>
                    
                    {/* Action buttons (hidden by default, show on group hover) */}
                    <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-surface-container-low rounded-md px-1 py-0.5 shadow-sm border border-outline-variant">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRenameConversation(conv.conversation_id, displayName); }}
                        className="p-1 text-on-surface-variant hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                        title="Rename"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.conversation_id); }}
                        className="p-1 text-on-surface-variant hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* CENTER PANE: Architect Chat / Document Editor */}
      {editingDoc ? (
        <div className="flex-1 bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-xl shadow-sm flex flex-col min-w-0">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
            <button 
              onClick={() => setEditingDoc(null)} 
              className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Chat
            </button>
            <div className="flex items-center gap-2">
              {isSavingDoc && <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
              <button 
                onClick={handleSaveDocument}
                disabled={isSavingDoc}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-surface font-bold text-xs hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-outline-variant overflow-hidden">
            {/* Editor text area */}
            <div className="flex-1 flex flex-col p-4 min-w-0">
              <input 
                type="text" 
                value={editingDoc.title}
                onChange={(e) => setEditingDoc({...editingDoc, title: e.target.value})}
                className="w-full bg-transparent border-b border-outline-variant pb-2 mb-4 font-bold text-lg text-on-surface focus:outline-none focus:border-outline"
                placeholder="Document Title"
              />
              <textarea
                value={editingDoc.content}
                onChange={(e) => setEditingDoc({...editingDoc, content: e.target.value})}
                className="flex-1 w-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed text-on-surface font-mono p-1"
                placeholder="Write markdown here..."
              />
            </div>
            
            {/* Preview pane */}
            <div className="flex-1 p-4 overflow-y-auto bg-surface-container-lowest min-w-0">
              <div className="text-[10px] uppercase font-bold text-on-surface-variant/55 mb-3 tracking-widest">Live Preview</div>
              <div className="markdown-content text-sm leading-relaxed text-on-surface [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h1]:mt-4 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:mt-3 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>h3]:mt-2 [&>pre]:bg-surface-container-highest [&>pre]:p-3 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>code]:bg-surface-container-highest [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-on-surface-variant">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {editingDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-xl shadow-sm flex flex-col min-w-0">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface leading-tight">Prism</h3>
                <p className="text-[10px] text-on-surface-variant font-medium">Lead Architect • Gemini 2.5</p>
              </div>
            </div>
            {isProcessing && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
          </div>
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-surface-container-lowest/30">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} msg={msg} />
              ))}
              {isProcessing && !messages[messages.length - 1]?.content && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="self-start flex flex-col items-start max-w-[85%]"
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Prism</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container border border-outline-variant text-on-surface rounded-tl-sm flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                    <span className="text-on-surface-variant text-xs ml-2">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
  
          {/* Chat Input */}
          <div className="p-4 bg-surface-container/30 border-t border-outline-variant/30">
            <form onSubmit={handleSubmit} className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                disabled={isProcessing}
                placeholder="Ask Prism anything or give a project idea..."
                className="w-full bg-surface-container-high/30 border border-outline-variant/40 rounded-xl py-3 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none disabled:opacity-50 min-h-[50px] max-h-[150px] placeholder:text-on-surface-variant/30"
                rows={1}
              />
              <button 
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="absolute right-2 top-2 w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-center text-on-surface-variant mt-2">
              Prism answers directly or delegates to the council when needed.
            </div>
          </div>
        </div>
      )}
  
      {/* RIGHT PANE: Live Telemetry & Documents */}
      <div className="w-80 flex flex-col shrink-0 gap-4">
        
        <div className="bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-xl shadow-sm flex flex-col h-full overflow-hidden min-h-[300px]">
          {/* Tab headers */}
          <div className="h-10 border-b border-outline-variant/30 flex items-center px-2 bg-surface-container/30 shrink-0 justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveRightTab('telemetry')}
                className={`flex items-center px-3 py-1 text-xs font-medium rounded-lg transition-all ${activeRightTab === 'telemetry' ? 'bg-surface-container-high/50 text-on-surface border border-outline-variant/50' : 'text-on-surface-variant/60 hover:text-on-surface'}`}
              >
                <Terminal className="w-3.5 h-3.5 mr-1.5" /> telemetry
              </button>
              <button
                onClick={() => setActiveRightTab('documents')}
                className={`flex items-center px-3 py-1 text-xs font-medium rounded-lg transition-all ${activeRightTab === 'documents' ? 'bg-surface-container-high/50 text-on-surface border border-outline-variant/50' : 'text-on-surface-variant/60 hover:text-on-surface'}`}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> documents ({documents.length})
              </button>
            </div>
            
            {activeRightTab === 'documents' && conversationId && (
              <button
                onClick={() => { setNewDocTitle(""); setShowNewDocModal(true); }}
                disabled={isSavingDoc}
                className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50 mr-1"
                title="Create manual document"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeRightTab === 'telemetry' ? (
              <div className="p-4 font-mono text-[10px] leading-relaxed">
                {telemetry.map((log, idx) => (
                  <div key={idx} className={`${
                    log.includes('[ERROR]') ? 'text-rose-500' :
                    log.includes('[SYSTEM]') ? 'text-sky-500' :
                    log.includes('Prism') ? 'text-emerald-500' :
                    log.includes('Atlas') ? 'text-amber-500' :
                    log.includes('Nexus') ? 'text-indigo-500' :
                    'text-on-surface-variant'
                  } mb-1.5 opacity-90`}>
                    {log}
                  </div>
                ))}
                <div ref={telemetryEndRef} />
              </div>
            ) : activeRightTab === 'documents' ? (
              <div className="p-3 space-y-2">
                {documents.length === 0 ? (
                  <div className="text-[11px] text-on-surface-variant/70 text-center py-8">
                    No documents created for this project yet. Use "+ New File" or ask agents to draft one.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <button
                       key={doc._id}
                       onClick={() => setEditingDoc(doc)}
                       className={`w-full text-left p-3 rounded-lg border border-outline-variant hover:border-on-surface-variant/30 hover:bg-surface-container-high transition-all flex items-start gap-2.5 ${editingDoc?._id === doc._id ? 'border-emerald-500 bg-emerald-500/5' : ''}`}
                    >
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-on-surface truncate">{doc.title}</div>
                        <div className="text-[10px] text-on-surface-variant truncate opacity-70">
                          {doc.content.replace(/[#*`\n]/g, '').slice(0, 50)}...
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </div>

      {/* New Document Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowNewDocModal(false)}>
          <div className="bg-surface border border-outline-variant rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-on-surface mb-1">Create New Document</h3>
            <p className="text-xs text-on-surface-variant mb-4">Enter a title for your new document.</p>
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateDocument(); if (e.key === 'Escape') setShowNewDocModal(false); }}
              autoFocus
              placeholder="e.g. Q3 Market Entry Plan"
              className="w-full bg-surface-container border border-outline-variant rounded-lg py-2.5 px-4 text-sm text-on-surface focus:outline-none focus:border-emerald-500 transition-colors mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNewDocModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDocument}
                disabled={!newDocTitle.trim() || isSavingDoc}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                {isSavingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Sub-component for Agent Cards
const AgentStatusCard = memo(function AgentStatusCard({ name, role, state, icon, color }: { name: string, role: string, state: AgentState, icon: React.ReactNode, color: string }) {
  const getStateColor = () => {
    switch(state) {
      case "Analyzing": return "text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse";
      case "Synthesizing": return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      case "Complete": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-on-surface-variant bg-surface-container border-outline-variant";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-3 rounded-xl border transition-all duration-500 overflow-hidden ${state !== 'Idle' ? 'border-outline/50 shadow-sm bg-surface-container-high/60' : 'border-outline-variant/40 bg-surface-container/50'}`}
    >
      {/* Background glow when active */}
      {state === 'Analyzing' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none"
        />
      )}
      {state === 'Synthesizing' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"
        />
      )}
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div 
          className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, #${color}, #${color}cc)` }}
        >
           {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-on-surface">{name}</h4>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-bold ${getStateColor()}`}>
              {state}
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{role}</p>
        </div>
      </div>
      
      {state !== 'Idle' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-2 bg-surface-container-highest p-1.5 rounded relative z-10"
        >
          <ArrowRight className="w-3 h-3 shrink-0" />
          <span className="truncate">{state === 'Analyzing' ? 'Generating documents & analyzing...' : state === 'Synthesizing' ? 'Synthesizing results...' : '✓ Task complete.'}</span>
        </motion.div>
      )}
    </motion.div>
  );
});

const MessageBubble = memo(function MessageBubble({ msg }: { msg: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {msg.role === 'user' ? 'You' : msg.agent}
        </span>
      </div>
      <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
        msg.role === 'user' 
          ? 'bg-on-surface text-surface-container-lowest rounded-tr-sm shadow-sm' 
          : 'bg-surface-container border border-outline-variant text-on-surface rounded-tl-sm shadow-sm'
      }`}>
        {msg.role === 'user' ? (
          msg.content
        ) : (
          <div className="markdown-content [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h1]:mt-4 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:mt-3 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>h3]:mt-2 [&>pre]:bg-surface-container-highest [&>pre]:p-3 [&>pre]:rounded-md [&>pre]:overflow-x-auto [&>code]:bg-surface-container-highest [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-on-surface-variant">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content || "…"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
});
