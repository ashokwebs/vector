import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool() {
  if (!pool) {
    // Determine the correct connection string based on where it's running
    // The user put .env.local in the parent dir, but Next.js usually looks in its root.
    // For safety, we use process.env.POSTGRES_URL directly
    const connectionString = process.env.POSTGRES_URL;
    
    if (!connectionString) {
      console.warn("⚠️ POSTGRES_URL is not set in environment variables. Database features will fail silently.");
      return null;
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for many managed Postgres services like Supabase/InsForge
      }
    });
  }
  return pool;
}

export async function initDb() {
  const p = getDbPool();
  if (!p) return;

  try {
    // 1. Enable pgvector extension (must be done before creating vector columns)
    await p.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // 2. Create the projects table
    await p.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        summary_markdown TEXT,
        architecture_markdown TEXT,
        marketing_markdown TEXT,
        finance_markdown TEXT
      );
    `);

    // 3. Create the knowledge_base table for RAG
    await p.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(768),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create project_memory table
    await p.query(`
      CREATE TABLE IF NOT EXISTS project_memory (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        agent_id VARCHAR(100),
        agent_name VARCHAR(100),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      );
    `);

    // 5. Create agent_tasks table
    await p.query(`
      CREATE TABLE IF NOT EXISTS agent_tasks (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL,
        agent_id VARCHAR(100) NOT NULL,
        agent_name VARCHAR(100),
        task_desc TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'pending',
        dependencies JSONB,
        output TEXT,
        external_route_org VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 6. Create aicoo_messages table
    await p.query(`
      CREATE TABLE IF NOT EXISTS aicoo_messages (
        id VARCHAR(255) PRIMARY KEY,
        from_agent_id VARCHAR(100),
        from_agent_name VARCHAR(100),
        from_org VARCHAR(255),
        to_agent_id VARCHAR(100),
        to_agent_name VARCHAR(100),
        to_org VARCHAR(255),
        content TEXT,
        type VARCHAR(50),
        timestamp BIGINT,
        metadata JSONB
      );
    `);

    console.log("✅ Database initialized successfully (including pgvector, memory, and tasks)");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
  }
}
