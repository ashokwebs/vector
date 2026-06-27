import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDbPool, initDb } from "@/lib/db";

let dbInitialized = false;

export async function POST(req: Request) {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure it's a text-like file (txt, md, csv, etc.)
    const textContent = await file.text();
    
    // We want to limit the size to avoid token overflow for now
    if (textContent.length > 50000) {
      return NextResponse.json({ error: "File too large. Please keep under 50,000 characters for demo." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    let embeddingString = "";

    if (apiKey && apiKey !== "<YOUR_GEMINI_API_KEY>") {
      // 1. Generate Embeddings using real Gemini API
      const genAI = new GoogleGenerativeAI(apiKey);
      const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
      const result = await embeddingModel.embedContent(textContent);
      const rawValues = result.embedding.values;
      const finalValues = rawValues.length > 768 ? rawValues.slice(0, 768) : rawValues;
      embeddingString = `[${finalValues.join(',')}]`;
    } else {
      // 1b. Hackathon Demo Fallback: Generate a fake 768-d vector if no API key is present
      const fakeVector = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
      embeddingString = `[${fakeVector.join(',')}]`;
    }

    // 3. Save to InsForge Postgres
    await pool.query(
      `INSERT INTO knowledge_base (filename, content, embedding) VALUES ($1, $2, $3)`,
      [file.name, textContent, embeddingString]
    );

    return NextResponse.json({ 
      success: true, 
      message: "File embedded and stored successfully",
      filename: file.name
    });

  } catch (error: any) {
    console.error("Knowledge Upload API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process upload" },
      { status: 500 }
    );
  }
}

// Simple GET route to fetch currently uploaded files
export async function GET() {
  const baseDate = Date.now();
  const mockFiles = [
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

  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const pool = getDbPool();
    if (!pool) return NextResponse.json({ files: mockFiles });

    // Select the content along with metadata
    const result = await pool.query(
      `SELECT id, filename, content, created_at FROM knowledge_base ORDER BY created_at DESC LIMIT 50`
    );

    // Merge the real database files with the mock files so both are always visible
    const allFiles = [...result.rows, ...mockFiles];

    return NextResponse.json({ files: allFiles });
  } catch (error) {
    console.error("Failed to fetch knowledge base:", error);
    return NextResponse.json({ files: mockFiles });
  }
}
