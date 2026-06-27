require('dotenv').config({ path: '../.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const seedProjects = [
  {
    title: "Quantum AI — SaaS Analytics Platform",
    description: "Build a SaaS analytics platform powered by AI that provides real-time business intelligence dashboards for startups.",
    summary_markdown: "## Executive Summary\n\nQuantum AI is a next-generation SaaS analytics platform that leverages machine learning to deliver real-time business intelligence. Target market: Series A–B startups needing actionable insights without a dedicated data team."
  },
  {
    title: "Nexus Pay — Fintech Super App",
    description: "Design a fintech super app combining payments, investments, and budgeting with AI-driven financial advice.",
    summary_markdown: "## Executive Summary\nNexus Pay is a comprehensive financial super app..."
  },
  {
    title: "Vanguard Learn — AI Tutoring Platform",
    description: "Create an AI-powered adaptive tutoring platform for K-12 students with personalized learning paths.",
    summary_markdown: "## Executive Summary\nVanguard Learn brings hyper-personalized tutoring..."
  },
  {
    title: "Atlas Health — Remote Patient Monitoring",
    description: "Build a remote patient monitoring platform integrating IoT wearables with AI diagnostics for chronic disease management.",
    summary_markdown: "## Executive Summary\nAtlas Health leverages IoT and AI to drastically reduce readmission rates..."
  },
  {
    title: "Prism DevKit — AI Developer Tools",
    description: "Create an AI-powered developer toolkit that automates code review, generates documentation, and provides intelligent debugging assistance.",
    summary_markdown: "## Executive Summary\nPrism DevKit gives every engineering team a 10x multiplier..."
  },
  {
    title: "Ledger Estates — AI Property Valuation",
    description: "Design a proptech platform that uses AI for real-time property valuation, market prediction, and investment portfolio optimization.",
    summary_markdown: "## Executive Summary\nLedger Estates revolutionizes commercial and residential proptech..."
  }
];

async function seed() {
  await pool.query(`
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

  for (const p of seedProjects) {
    await pool.query(
      `INSERT INTO projects (title, description, summary_markdown) VALUES ($1, $2, $3)`,
      [p.title, p.description, p.summary_markdown]
    );
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
