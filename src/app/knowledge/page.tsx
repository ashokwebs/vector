"use client";

import { useState, useEffect } from "react";
import { Database, Shield, Cpu, Save, UploadCloud, FileText, Search, Loader2, Eye, X } from "lucide-react";
import { motion } from "framer-motion";

const baseDate = Date.now();
const initialMockFiles = [
    { 
      id: 1, 
      filename: "NexusRed_Zero_Trust_Architecture.md", 
      content: "# NexusRed Zero-Trust Architecture\n\n## 1. Gateway Security\nAll incoming requests must pass through the Edge Gateway. We are enforcing strict mTLS (Mutual TLS) and verifying the device posture.\n\n## 2. Authentication\nOAuth2 with mandatory hardware security keys (FIDO2). Tokens expire every 15 minutes.\n\n## 3. Database Encryption\nData is encrypted at rest using AES-256-GCM. We use Google Cloud KMS for key rotation.",
      created_at: new Date(baseDate - 100000000).toISOString() 
    },
    { 
      id: 2, 
      filename: "NovaVault_Financial_Reasoning_Specs.pdf", 
      content: "NOVA_VAULT FINANCIAL REASONING ENGINE SPECS\n\n- Model: Gemini 1.5 Pro for massive context window analysis.\n- Input: Real-time SEC EDGAR filings (10-K, 10-Q) + Live Yahoo Finance data streams.\n- Reasoning Logic: Cross-reference user's local portfolio (via Plaid API) with macro-economic indicators.\n- Guardrails: The AI must never execute a trade autonomously without explicit 2FA user confirmation.",
      created_at: new Date(baseDate - 80000000).toISOString() 
    },
    { 
      id: 3, 
      filename: "Gengen_Cinematic_Boot_Sequence.txt", 
      content: "[INITIATING BOOT SEQUENCE]\nLOADING NEXUS OS...\nMounting encrypted partitions... OK\nEstablishing secure uplink... OK\n\nDesign notes: The boot sequence must feel tactile. Use Framer Motion for the glitch effect on the logo. The user must type 'ACCESS' into the terminal to bypass the login gate. Audio should include a low-frequency hum.",
      created_at: new Date(baseDate - 60000000).toISOString() 
    },
    { 
      id: 4, 
      filename: "QuantumLedger_HFT_Engine_Notes.md", 
      content: "# QuantumLedger High-Frequency Trading Engine\n\n## Latency Requirements\n- Target: < 500 microseconds (tick-to-trade).\n- Implementation: Bare-metal Rust. No garbage collection.\n- Networking: Solarflare NICs with kernel-bypass (OpenOnload).\n\n## Arbitrage Strategy\nFocus strictly on triangular arbitrage between stablecoins (USDT/USDC/DAI) across Binance and OKX.",
      created_at: new Date(baseDate - 40000000).toISOString() 
    },
    { 
      id: 5, 
      filename: "Button_Viral_Game_Mechanics.csv", 
      content: "Level,Interaction,Event_Trigger,Audio_File\n1,Click,Button gets slightly smaller,pop.wav\n2,Click,Screen shakes,rumble.mp3\n3,Hover,Button runs away from cursor,slide.wav\n4,Click,Button spawns 10 fake buttons,glitch.wav\n5,Wait 10s,Button whispers 'please don't',whisper.mp3\n6,Click,Browser tab attempts to close,scream.wav",
      created_at: new Date(baseDate - 20000000).toISOString() 
    },
    {
      id: 6,
      filename: "SOC2_Compliance_Checklist.md",
      content: "# SOC2 Compliance Requirements\n\n1. All user data must be encrypted at rest using AES-256.\n2. Access to production databases requires MFA and a VPN connection.\n3. Audit logs must be retained for at least 365 days.\n4. Zero-trust architecture is mandatory for all internal microservices.",
      created_at: new Date(baseDate - 5000000).toISOString()
    },
    {
      id: 7,
      filename: "Engineering_Handbook.txt",
      content: "Vector AI Command Center Engineering Standards:\n- Backend: Next.js App Router (Node.js/Edge)\n- Database: InsForge PostgreSQL with pgvector\n- Styling: Tailwind CSS with emerald/teal gradients\n- Architecture: Event-driven microservices\nAll code must be reviewed by the Nexus agent before deployment.",
      created_at: new Date(baseDate - 3000000).toISOString()
    },
    {
      id: 8,
      filename: "Brand_Guidelines_2026.md",
      content: "# Brand Guidelines\n\n**Voice:** Professional, authoritative, and concise.\n**Primary Colors:** Emerald Green (#10b981), Teal (#0f766e)\n**Secondary Colors:** Indigo (#4f46e5)\n**Font:** Inter for UI, Fira Code for code blocks.\nNever use the word 'Fake' in any public-facing materials.",
      created_at: new Date(baseDate - 1000000).toISOString()
    }
];

export default function KnowledgeBasePage() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{id: number, filename: string, created_at: string, content?: string}[]>(initialMockFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<typeof files[0] | null>(null);

  useEffect(() => {
    fetch("/api/knowledge")
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .catch(console.error);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Success: " + data.message);
        fetch("/api/knowledge").then(r => r.json()).then(d => setFiles(d.files || []));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSeedDocuments = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/knowledge/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetch("/api/knowledge").then(r => r.json()).then(d => setFiles(d.files || []));
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to seed documents");
    } finally {
      setSeeding(false);
    }
  };

  const filteredFiles = files.filter(f => f.filename.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            Knowledge Base
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl mt-2">
            Upload company documents, playbooks, and guidelines. Prism uses RAG (Retrieval-Augmented Generation) via InsForge pgvector to read these before executing orchestrations.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-3">
          <button
            onClick={handleSeedDocuments}
            disabled={seeding || uploading}
            className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 border border-indigo-500/20 px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            {seeding ? "Seeding..." : "Add Sample Data"}
          </button>
          
          <div className="relative group flex-1 md:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-on-surface-variant group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full md:w-64 pl-10 pr-3 py-2 border border-outline-variant rounded-lg leading-5 bg-surface-container placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-500" /> Upload Context
              </h3>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center bg-surface-container-lowest hover:bg-surface-container/50 transition-colors h-[250px] flex flex-col items-center justify-center group cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  id="fileUpload" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept=".txt,.md,.csv" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                />
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Save className="w-8 h-8" />}
                </div>
                <span className="text-base font-bold text-on-surface mb-2">
                  {uploading ? "Vectorizing Document..." : "Click or Drag to Upload"}
                </span>
                <span className="text-xs text-on-surface-variant">Supports .txt, .md, .csv (Max 5MB)</span>
              </div>

              <div className="mt-6 bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Security Note
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Documents uploaded here are embedded using Gemini text-embedding-004 and securely stored in the InsForge PostgreSQL vector database. Row-level security guarantees data isolation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden min-h-[450px]">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-500" /> Vectorized Database
              </h3>
              <span className="text-xs font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {files.length} Vectors
              </span>
            </div>

            <div className="p-0 h-[400px] overflow-y-auto">
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-on-surface-variant/50">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Database Empty</p>
                  <p className="text-sm mt-1">Upload files to populate the vector space.</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant/70 text-sm">
                  No documents found matching "{searchQuery}".
                </div>
              ) : (
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 z-10 bg-surface-container-low">
                    <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant shadow-sm">
                      <th className="px-6 py-4">Document Name</th>
                      <th className="px-6 py-4">Embedded Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredFiles.map((file, idx) => (
                      <tr key={`${file.id}-${idx}`} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-semibold text-on-surface">{file.filename}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-on-surface-variant">
                            {new Date(file.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            <Cpu className="w-3 h-3" /> Indexed
                          </span>
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="p-1.5 text-on-surface-variant/50 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-md transition-colors"
                            title="View Content"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Document View Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface border border-outline-variant rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface leading-none">{selectedFile.filename}</h3>
                  <p className="text-xs text-on-surface-variant mt-1.5">
                    Indexed on {new Date(selectedFile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-surface flex-1">
              {selectedFile.content ? (
                <div className="whitespace-pre-wrap text-sm text-on-surface-variant font-mono bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-xl leading-relaxed">
                  {selectedFile.content}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-on-surface-variant/50">
                  <Database className="w-8 h-8 mb-3 opacity-50" />
                  <p>Content is vectorized and not available in plaintext.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold rounded-lg transition-colors text-sm border border-outline-variant"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
