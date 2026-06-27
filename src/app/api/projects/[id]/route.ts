import { NextResponse } from 'next/server';
import { getDbPool, initDb } from '@/lib/db';

let dbInitialized = false;

export async function DELETE(
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
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Protect the original 6 seed projects
    if (Number(numericId) <= 6) {
      return NextResponse.json({ error: "Cannot delete built-in demo projects." }, { status: 403 });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [numericId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
