import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getDbPool, initDb } from "@/lib/db";
import { memoryService } from "@/lib/memory/service";
import { AGENTS, getArchitect } from "@/lib/agents/registry";

const agentNamesList = AGENTS.map(a => `"${a.name}" (${a.title})`).join(', ');
const agentNamesJsonEnum = AGENTS.map(a => `"${a.name}"`).join(' | ');

const SYSTEM_PROMPT = `You are Prism, the Lead Architect AI agent at Vector AI Command Center. You are intelligent, strategic, and articulate.

PERSONALITY:
- Professional yet approachable. You speak with confidence and clarity.
- You use concise, actionable language. No fluff.
- You have a team of 18 other executive agents at your disposal: ${agentNamesList}.

BEHAVIOR RULES:
1. For NORMAL CONVERSATION (greetings, questions, advice, general discussion):
   - Respond naturally and helpfully as Prism the architect.
   - Do NOT generate documents or delegate to agents.
   - Keep responses concise (2-4 paragraphs max).
   - Set "mode" to "chat" in your response.

2. For PLANNING REQUESTS (when user asks to "make a plan", "build a strategy", "analyze this idea", etc.):
   - Set "mode" to "plan" in your response.
   - Provide a brief strategic overview in "message" (2-3 paragraphs about what you see and what the council will do).
   - Generate up to 6 documents from appropriate agents in the "documents" array.
   - Assign tasks to agents in the "tasks" array (create 4-8 tasks).
   - Each document should be substantial (at least 300 words) with proper markdown formatting.

RESPONSE FORMAT (you MUST respond in valid JSON):
{
  "mode": "chat" | "plan",
  "title": "A short, 2-5 word name for this chat/project (e.g., 'Retro TV SaaS')",
  "message": "Your conversational response as Prism",
  "documents": [
    {
      "title": "Document Title",
      "agent": ${agentNamesJsonEnum},
      "content": "Full markdown content of the document"
    }
  ],
  "tasks": [
    {
      "agent": ${agentNamesJsonEnum},
      "task": "Description of the assigned task",
      "priority": "high" | "medium" | "low"
    }
  ]
}

IMPORTANT: Always respond with ONLY valid JSON. No markdown code fences. No extra text outside the JSON.`;

let dbInitialized = false;

export async function POST(req: Request) {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const { message, history, conversation_id } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // --- 1. Project Memory Context ---
    let extraContext = "";
    if (conversation_id && conversation_id.startsWith('db-')) {
      const projectId = conversation_id.replace('db-', '');
      extraContext = await memoryService.getContextPrompt(projectId);
    }
    
    // --- 2. INSFORGE RAG PIPELINE (Knowledge Retrieval) ---
    try {
      const pool = getDbPool();
      if (pool) {
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embedResult = await embeddingModel.embedContent(message);
        const promptVector = `[${embedResult.embedding.values.join(',')}]`;

        const searchRes = await pool.query(`
          SELECT filename, content, 1 - (embedding <=> $1) AS similarity 
          FROM knowledge_base 
          ORDER BY embedding <=> $1 
          LIMIT 2
        `, [promptVector]);

        if (searchRes.rows.length > 0) {
          extraContext += "\n\nCRITICAL CONTEXT FROM COMPANY KNOWLEDGE BASE:\n";
          searchRes.rows.forEach(row => {
            if (row.similarity > 0.5) {
              extraContext += `\n--- Document: ${row.filename} ---\n${row.content}\n`;
            }
          });
        }
      }
    } catch (ragError) {
      console.error("❌ RAG Pipeline failed (Skipping context injection):", ragError);
    }

    const dynamicSystemPrompt = SYSTEM_PROMPT + (extraContext ? "\n\n" + extraContext : "");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System instructions: " + dynamicSystemPrompt }] },
        { role: "model", parts: [{ text: JSON.stringify({ mode: "chat", message: "Understood. I am Prism, ready to help.", documents: [], tasks: [] }) }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { mode: "chat", message: text, documents: [], tasks: [] };
    }

    parsed.mode = parsed.mode || "chat";
    parsed.message = parsed.message || "";
    parsed.documents = parsed.documents || [];
    parsed.tasks = parsed.tasks || [];

    // --- 3. Update DB & Project Memory ---
    try {
      const pool = getDbPool();
      if (pool) {
        const updatedHistory = [
          ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
          { role: "assistant", content: parsed.message || "Working on it..." }
        ];

        let projectId = "";
        
        if (conversation_id && conversation_id.startsWith('db-')) {
          projectId = conversation_id.replace('db-', '');
          
          let updateQuery = `UPDATE projects SET chat_history = $1`;
          let values: any[] = [JSON.stringify(updatedHistory)];
          
          if (parsed.mode === "plan" && parsed.documents.length > 0) {
            // Pick out legacy 4 docs if present for backwards compatibility on projects page
            const atlasDoc = parsed.documents.find((d: any) => d.agent === 'Atlas')?.content || '';
            const nexusDoc = parsed.documents.find((d: any) => d.agent === 'Nexus')?.content || '';
            const vanguardDoc = parsed.documents.find((d: any) => d.agent === 'Vanguard')?.content || '';
            const ledgerDoc = parsed.documents.find((d: any) => d.agent === 'Ledger')?.content || '';
            
            updateQuery += `, summary_markdown = $2, architecture_markdown = $3, marketing_markdown = $4, finance_markdown = $5`;
            values.push(atlasDoc, nexusDoc, vanguardDoc, ledgerDoc);
            updateQuery += ` WHERE id = $6`;
            values.push(projectId);
          } else {
            updateQuery += ` WHERE id = $2`;
            values.push(projectId);
          }

          await pool.query(updateQuery, values);
          parsed.conversation_id = conversation_id;
        } else {
          // INSERT NEW PROJECT
          let title = parsed.title || (message.length > 50 ? message.substring(0, 47) + "..." : message);
          let atlasDoc = '', nexusDoc = '', vanguardDoc = '', ledgerDoc = '';
          if (parsed.mode === "plan" && parsed.documents.length > 0) {
            atlasDoc = parsed.documents.find((d: any) => d.agent === 'Atlas')?.content || '';
            nexusDoc = parsed.documents.find((d: any) => d.agent === 'Nexus')?.content || '';
            vanguardDoc = parsed.documents.find((d: any) => d.agent === 'Vanguard')?.content || '';
            ledgerDoc = parsed.documents.find((d: any) => d.agent === 'Ledger')?.content || '';
          }
          
          const dbResult = await pool.query(
            `INSERT INTO projects (title, description, summary_markdown, architecture_markdown, marketing_markdown, finance_markdown, chat_history)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [title, message, atlasDoc, nexusDoc, vanguardDoc, ledgerDoc, JSON.stringify(updatedHistory)]
          );
          
          if (dbResult.rows.length > 0) {
            projectId = String(dbResult.rows[0].id);
            parsed.conversation_id = `db-${projectId}`;
          }
        }

        // Add to Project Memory
        if (projectId && parsed.mode === "plan") {
          const architect = getArchitect();
          
          // Add goal
          await memoryService.addEntry({
            projectId,
            category: 'goal',
            agentId: architect.id,
            agentName: architect.name,
            title: parsed.title || 'New Goal',
            content: message
          });
          
          // Add generated documents to memory
          for (const doc of parsed.documents) {
            await memoryService.addEntry({
              projectId,
              category: 'document',
              agentName: doc.agent,
              title: doc.title,
              content: doc.content
            });
          }
        }
      }
    } catch (dbError) {
      console.error("❌ Failed to save project/memory to DB:", dbError);
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
