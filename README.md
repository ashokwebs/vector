<div align="center">
  <img src="./assets/logo.png" alt="Crayon Logo" width="120" />
  <h1>Crayon OS</h1>
  <p>The Autonomous Enterprise Command Center.</p>
  <p>
    <a href="https://crayon-os.vercel.app"><img src="https://img.shields.io/badge/Deploy_to-Vercel-black?style=flat-square&logo=vercel" alt="Deploy to Vercel"></a>
    <img src="https://img.shields.io/badge/Next.js-16.2.7-black?style=flat-square&logo=next.js" alt="Next.js">
    <a href="https://aicoo.dev"><img src="https://aicoo.dev/badge-made-with-aicoo-dark.svg" alt="Made with Aicoo" height="20"></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License">
  </p>
  <p>Engineered by <strong>Team OSPRED (Ashok P)</strong></p>
</div>

---

**Crayon OS** is a state-of-the-art multi-agent SaaS platform designed to act as your enterprise AI executive council. Whether you need startup ideation, zero-trust cloud architecture, fintech modeling, or viral go-to-market strategies, Crayon puts a full AI C-suite at your fingertips, allowing you to architect entire tech ecosystems in seconds.

Built with a lightning-fast **Next.js 16** frontend, powered by **Google Gemini 2.5 Flash**, and natively integrated with 🚀 **AICOO PostgreSQL** 🚀 for persistent, secure memory.

## ✨ The Executive Council

- 🧠 **Prism (Lead Architect)**: The master orchestrator. Prism analyzes your requests, delegates tasks, and synthesizes the outputs of the council.
- 💼 **Atlas (CEO)**: Focuses on business strategy, seed-round pitch decks, startup valuation, and enterprise sales motions.
- 💻 **Nexus (CTO)**: Architects zero-trust cloud infrastructure, telemetry pipelines, and scalable database schemas.
- 📢 **Vanguard (Marketing)**: Designs cinematic brand positioning, influencer outreach, and viral gamified engagement loops.
- 📈 **Ledger (Finance)**: Builds fintech monetization models, Stripe subscription architectures, and cloud cost optimization plans.

## 🚀 Key Features

- **Instantaneous Cinematic UI**: A premium, glassmorphism dashboard featuring highly reactive agent status cards, buttery-smooth Framer Motion staggered animations, and zero-latency document rendering.
- **Autonomous Project Architecting**: The AI automatically generates crisp, contextual titles and builds massive, production-ready markdown documents (Executive Summaries, Architecture Specs, GTM Plans) seamlessly stored in the database.
- 🧠 **Agent-Native Memory (Powered by AICOO)**: Natively integrated with **AICOO PostgreSQL** utilizing `pgvector`. Chat histories, massive project hierarchies, and contextual embeddings are permanently saved across sessions using AICOO's robust infrastructure.
- **Zero-Trust Data Scrubbing**: Built for enterprise. Strict context routing ensures that the Finance agent doesn't overwrite the CTO's architecture notes.

## 🛠 Tech Stack

**Frontend & Orchestration Engine**
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS, Framer Motion, Cinematic UI Tokens
- **AI Engine**: Google Gemini 2.5 Flash (`@google/generative-ai`)
- **Database & Memory**: 🚀 **AICOO PostgreSQL** 🚀 (pgvector for RAG)
- **Deployment**: Vercel

---

## 💻 Local Setup

Built to be completely serverless. Engineered for immediate deployment.

### Prerequisites
- Node.js 18+
- PostgreSQL Database (via **AICOO**)
- Google Gemini API Key

### 1. Installation
Install the required Next.js dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory. **Never commit this file to version control:**
```env
# Database connection for Project & Chat Memory
POSTGRES_URL="postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require"

# Gemini AI Integration
GEMINI_API_KEY="<YOUR_GEMINI_API_KEY>"
```

### 3. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
Visit `http://localhost:3000` and enter the Board Room to initialize your first project!

---

## ☁️ Deploying to Vercel

The platform is completely serverless and fully optimized for zero-configuration Vercel deployment.

1. Push your code to a GitHub repository (ensure `.env.local` is listed in your `.gitignore`).
2. Go to your Vercel Dashboard and click **Add New... > Project**.
3. Import your GitHub repository.
4. Add your Environment Variables (`POSTGRES_URL` and `GEMINI_API_KEY`).
5. Click **Deploy**!

## 📄 License & Team

This project is proprietary software developed and engineered entirely by **Team OSPRED (Ashok P)**. All rights reserved.
