import { NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

let dbInitialized = false;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const pool = getDbPool();
    if (!pool) {
      throw new Error("Database not connected");
    }

    // Parse the numeric ID from 'db-1', 'db-2', etc.
    const numericId = id.replace('db-', '');
    
    if (!numericId || isNaN(Number(numericId))) {
      return NextResponse.json({
        messages: [{ role: 'assistant', content: "Invalid project ID." }]
      });
    }

    const result = await pool.query(
      'SELECT title, description, chat_history, summary_markdown, architecture_markdown, marketing_markdown, finance_markdown FROM projects WHERE id = $1',
      [numericId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        messages: [{ role: 'assistant', content: "Project not found in InsForge database." }]
      });
    }

    const p = result.rows[0];

    // Reconstruct the chat history from the saved data or fallback
    let messages = p.chat_history;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      messages = [
        { role: "user", content: p.description || "Start a project..." },
        { role: "assistant", content: `I have restored the **${p.title}** project from the InsForge database. All generated documents are available below.` }
      ];
    }

    // Reconstruct the documents so the UI can render them
    const documents = [];
    if (p.summary_markdown) documents.push({ title: "Executive Summary", content: p.summary_markdown });
    if (p.architecture_markdown) documents.push({ title: "Architecture Spec", content: p.architecture_markdown });
    if (p.marketing_markdown) documents.push({ title: "GTM Strategy", content: p.marketing_markdown });
    if (p.finance_markdown) documents.push({ title: "Financial Model", content: p.finance_markdown });

    return NextResponse.json({
      title: p.title,
      messages: messages,
      documents: documents
    });

  } catch (error) {
    console.error("Failed to load project from InsForge:", error);
    return NextResponse.json({
      messages: [{ role: 'assistant', content: "Failed to connect to InsForge database." }]
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { title } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const pool = getDbPool();
    if (!pool) throw new Error("Database not connected");

    const numericId = id.replace('db-', '');
    if (!numericId || isNaN(Number(numericId))) {
      return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
    }

    await pool.query('UPDATE projects SET title = $1 WHERE id = $2', [title, numericId]);

    return NextResponse.json({ success: true, title });
  } catch (error) {
    console.error("Failed to rename project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
