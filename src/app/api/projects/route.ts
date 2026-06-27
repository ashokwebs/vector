import { NextResponse } from "next/server";
import { getDbPool, initDb } from "@/lib/db";

let dbInitialized = false;

export async function GET() {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ projects: [] }); // Graceful fallback
    }

    const result = await pool.query(`
      SELECT * FROM projects 
      ORDER BY created_at DESC 
      LIMIT 50
    `);

    return NextResponse.json({ projects: result.rows });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}
