import { NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

let dbInitialized = false;

export async function GET() {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ conversations: [] });
    }

    const result = await pool.query(
      'SELECT id, title, description, created_at, chat_history FROM projects ORDER BY created_at DESC'
    );

    const conversations = result.rows.map(row => {
      let messages = [];
      try {
        messages = typeof row.chat_history === 'string' 
          ? JSON.parse(row.chat_history) 
          : (row.chat_history || []);
      } catch (e) {
        // ignore fallback
      }

      return {
        conversation_id: `db-${row.id}`,
        title: row.title,
        created_at: row.created_at,
        messages: messages
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Failed to load conversations from InsForge DB:", error);
    return NextResponse.json({ conversations: [] });
  }
}
