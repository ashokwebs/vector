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
    if (!pool) throw new Error("Database not connected");

    const numericId = id.replace('db-', '');
    if (!numericId || isNaN(Number(numericId))) {
      return NextResponse.json({ documents: [] });
    }

    const result = await pool.query(
      'SELECT summary_markdown, architecture_markdown, marketing_markdown, finance_markdown FROM projects WHERE id = $1',
      [numericId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ documents: [] });
    }

    const p = result.rows[0];
    const documents = [];

    // The UI expects documents to have _id, title, and content. We map our db fields to this.
    if (p.summary_markdown) documents.push({ _id: "doc-1", title: "Executive Summary", content: p.summary_markdown });
    if (p.architecture_markdown) documents.push({ _id: "doc-2", title: "Architecture Spec", content: p.architecture_markdown });
    if (p.marketing_markdown) documents.push({ _id: "doc-3", title: "GTM Strategy", content: p.marketing_markdown });
    if (p.finance_markdown) documents.push({ _id: "doc-4", title: "Financial Model", content: p.finance_markdown });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Failed to load documents from InsForge:", error);
    return NextResponse.json({ documents: [] });
  }
}

// We ignore POST requests for manual document creation in the hackathon demo,
// but keep the route to prevent 404s if the UI tries to save.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ success: true, message: "Document creation mocked for InsForge persistence demo." });
}
