import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDbPool, initDb } from "@/lib/db";

let dbInitialized = false;

const MOCK_DOCS = [
  {
    filename: "SOC2_Compliance_Checklist.md",
    content: "# SOC2 Compliance Requirements\n\n1. All user data must be encrypted at rest using AES-256.\n2. Access to production databases requires MFA and a VPN connection.\n3. Audit logs must be retained for at least 365 days.\n4. Zero-trust architecture is mandatory for all internal microservices."
  },
  {
    filename: "Engineering_Handbook.txt",
    content: "Vector AI Command Center Engineering Standards:\n- Backend: Next.js App Router (Node.js/Edge)\n- Database: InsForge PostgreSQL with pgvector\n- Styling: Tailwind CSS with emerald/teal gradients\n- Architecture: Event-driven microservices\nAll code must be reviewed by the Nexus agent before deployment."
  },
  {
    filename: "Brand_Guidelines_2026.md",
    content: "# Brand Guidelines\n\n**Voice:** Professional, authoritative, and concise.\n**Primary Colors:** Emerald Green (#10b981), Teal (#0f766e)\n**Secondary Colors:** Indigo (#4f46e5)\n**Font:** Inter for UI, Fira Code for code blocks.\nNever use the word 'Fake' in any public-facing materials."
  }
];

export async function POST() {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    let genAI = null;
    let embeddingModel = null;
    if (apiKey && apiKey !== "<YOUR_GEMINI_API_KEY>") {
      genAI = new GoogleGenerativeAI(apiKey);
      embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    }

    let count = 0;
    for (const doc of MOCK_DOCS) {
      // Check if it already exists
      const check = await pool.query('SELECT id FROM knowledge_base WHERE filename = $1', [doc.filename]);
      if (check.rows.length === 0) {
        let embeddingString = "";
        
        if (embeddingModel) {
          const result = await embeddingModel.embedContent(doc.content);
          const rawValues = result.embedding.values;
          const finalValues = rawValues.length > 768 ? rawValues.slice(0, 768) : rawValues;
          embeddingString = `[${finalValues.join(',')}]`;
        } else {
          const fakeVector = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
          embeddingString = `[${fakeVector.join(',')}]`;
        }

        await pool.query(
          `INSERT INTO knowledge_base (filename, content, embedding) VALUES ($1, $2, $3)`,
          [doc.filename, doc.content, embeddingString]
        );
        count++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${count} sample documents.`
    });

  } catch (error: any) {
    console.error("Knowledge Seed API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed knowledge base" },
      { status: 500 }
    );
  }
}
