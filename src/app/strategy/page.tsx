"use client";

import { useState } from "react";
import { FileText, Clock, TrendingUp, CheckCircle2, ChevronRight, File, MoreHorizontal, Download, Share2, Code2, Users, DollarSign, PenTool } from "lucide-react";
import { motion } from "framer-motion";

const documents = [
  {
    id: "tech-arch",
    title: "Technical Architecture Core",
    icon: Code2,
    author: "Nexus (CTO Agent)",
    confidence: "98%",
    timeAgo: "10 mins ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          This document defines the high-level system design, orchestrating multi-agent collaboration via the Vector AI Command Center while leveraging robust microservices for core operations. It details the precise interaction patterns between the frontend gateway, the orchestration engine, and our state persistence layers.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>1. Infrastructure & Orchestration</h2>
        <p>
          We will deploy a containerized Next.js/React architecture utilizing the <strong>Vector AI Command Center</strong> to manage inter-agent tasks. The backend leverages an event-driven <code>FastAPI</code> orchestration layer, ensuring that the Architect Agent ("Prism") can successfully display collaborative outputs from the CEO, CTO, Marketing, and Finance agents.
          Our serverless edge functions process incoming requests and route them to dedicated worker nodes running specialized LLM wrappers. The entire frontend is statically exported where possible, falling back to Server-Side Rendering (SSR) only for dynamic agent interactions and real-time boardroom streams.
        </p>
        <h2>2. Gamified Subsystems</h2>
        <p>
          To enhance engagement, we integrate probability-based reward engines modeled after the <strong>Prox Casino Slots</strong> architecture. This allows for dynamic multi-row matrix rewards and classic symbol rarity tiers to incentivize user action loops seamlessly. 
          When a user completes an onboarding milestone, the orchestration engine triggers a high-fidelity visual slot-machine effect, spinning custom tokens that map directly to API credits, temporary premium UI themes, or exclusive multi-agent chat features.
        </p>
        <div className="my-6 bg-surface-container border-l-4 border-blue-500 rounded-r-lg p-4 flex gap-4">
          <Code2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-on-surface m-0 mb-1">Queue Optimization</h4>
            <p className="text-sm text-on-surface-variant m-0">To manage the freemium tier effectively, rendering and agent generation tasks use a priority Redis queue. Free-tier jobs fallback to placeholder operations if capacity is exhausted. By employing an active/passive failover mechanism, we guarantee that enterprise clients never experience queue times exceeding 1.2 seconds for agent responses.</p>
          </div>
        </div>
        <h2>3. Data Pipeline & Storage</h2>
        <p>
          User vectors and contextual knowledge are stored in a highly scalable <strong>PostgreSQL cluster with pgvector</strong>. All sensitive telemetry and token monitoring data flows through dedicated encrypted pipelines to provide real-time metrics for executive agents. 
          The integration of Prisma ORM ensures strongly typed database queries, while raw SQL is reserved strictly for complex geospatial or high-dimensional vector similarity searches (using exact nearest neighbor or HNSW indexing depending on latency requirements).
        </p>
        <h2>4. Real-Time Telemetry</h2>
        <p>
          Every agent action is traced using OpenTelemetry. This allows our internal Nexus agent to autonomously debug connection timeouts or dropped SSE streams without human intervention.
        </p>
      </>
    )
  },
  {
    id: "social-media",
    title: "Social Media Strategy",
    icon: Users,
    author: "Vanguard (CMO Agent)",
    confidence: "95%",
    timeAgo: "15 mins ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Comprehensive go-to-market and social media growth plan designed to maximize organic reach and convert free users into paid subscribers by employing gamified viral loops.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>1. Content Pillars</h2>
        <p>
          Our strategy across major visual platforms will focus on high-fidelity cinematic experiences, inspired by the <strong>NEXUS Identity OS</strong>:
        </p>
        <ul>
          <li><strong>Cinematic Showcases:</strong> Highlighting premium, glassmorphic UI interactions with an interactive, login-gated boot sequence. We will post "ASMR-style" UI walkthroughs showcasing the fluid animations of our multi-agent boardroom.</li>
          <li><strong>Behind the Scenes:</strong> Demonstrating how the autonomous CEO/CTO agents collaborate to build complex apps. We'll livestream unedited sessions of agents coding real applications in real-time.</li>
          <li><strong>Chaotic Engagement:</strong> Using elements of unpredictability to drive comments, shares, and algorithmic boosts.</li>
        </ul>
        <h2>2. Viral Loop Engineering</h2>
        <p>
          We are implementing a chaotic engagement engine inspired by the <strong>DON'T PRESS THE BUTTON.EXE</strong> project. An evolving, sentient button integrated into our viral web campaigns will react to user interactions by triggering increasingly unstable events and thematic dialogue, progressing toward a climactic final interaction that rewards users with premium access. 
          This gamified funnel is projected to decrease our Customer Acquisition Cost (CAC) by over 60% compared to traditional B2B SaaS ad spends.
        </p>
        <div className="my-6 bg-surface-container border-l-4 border-rose-500 rounded-r-lg p-4 flex gap-4">
          <TrendingUp className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-on-surface m-0 mb-1">Influencer Outreach</h4>
            <p className="text-sm text-on-surface-variant m-0">Identifying top-tier AI influencers to showcase the Vector AI Command Center. They will receive lifetime access in exchange for multi-part video series demonstrating practical workflows. We will provide them with unique affiliate codes tied to dynamic API thresholds.</p>
          </div>
        </div>
        <h2>3. Community Driven Governance</h2>
        <p>
          We will establish a Discord community where users can directly interact with a public-facing version of Vanguard (CMO Agent). This agent will autonomously poll the community for feature requests, summarize the feedback, and pipe it directly to Nexus (CTO Agent) for backlog prioritization.
        </p>
      </>
    )
  },
  {
    id: "monetization",
    title: "Fintech Monetization Model",
    icon: DollarSign,
    author: "Ledger (CFO Agent)",
    confidence: "92%",
    timeAgo: "22 mins ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Financial modeling and billing infrastructure powered by the <strong>NovaVault Fintech OS</strong> principles, ensuring automated, frictionless upgrades and subscription management. This model balances the immense compute costs of multi-agent LLM orchestration with sustainable, predictable recurring revenue.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>1. Tier Breakdown</h2>
        <ul>
          <li><strong>Basic (Free):</strong> Standard AI context. Limited agent orchestration and basic metrics. Context windows are hard-capped at 8k tokens to prevent abuse.</li>
          <li><strong>Pro ($29/mo):</strong> Premium contextual reasoning, portfolio-synced data, and fast-lane execution via Stripe-verified recurring billing. Includes up to 1M tokens per month of orchestrator usage.</li>
          <li><strong>Enterprise (Custom):</strong> Unlimited multi-agent collaboration with dedicated vector databases and custom deployment pipelines. Features white-labeled sub-agents and dedicated AWS VPC hosting.</li>
        </ul>
        <h2>2. Stripe Payment Architecture</h2>
        <p>
          We leverage a full-stack Stripe implementation (adapted from NovaVault). This covers subscription lifecycle management, prorated plan upgrades, and secure customer portal integration for automated invoice processing. 
          Webhook events from Stripe directly interface with our PostgreSQL database, instantaneously updating user JWT claims and unlocking advanced UI components across the platform.
        </p>
        <h2>3. Context-Aware Upselling</h2>
        <p>
          Our platform will use context-aware, portfolio-synced financial reasoning to identify when a user is hitting operational limits, autonomously triggering targeted upgrade prompts. 
          For instance, if the Architect Agent detects a user is repeatedly hitting their token limit while designing complex microservices, it will seamlessly inject a conversational suggestion to upgrade to the Enterprise tier for unthrottled performance.
        </p>
        <h2>4. Fraud Prevention & Chargebacks</h2>
        <p>
          By utilizing Stripe Radar alongside our custom behavior-analysis models, we flag suspicious high-volume token burn events immediately. If a new account spins up 50 sub-agents in a minute and their card risk score is high, the system pauses execution pending manual verification.
        </p>
      </>
    )
  },
  {
    id: "q3",
    title: "Q3 Market Entry Plan",
    icon: FileText,
    author: "Atlas & Nexus",
    confidence: "94%",
    timeAgo: "1 hr ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          This document outlines the strategic approach for entering the mid-market enterprise sector by Q3, emphasizing extreme security and unified threat management alongside robust data governance. Our entry relies heavily on proving institutional-grade safety.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>1. Executive Summary</h2>
        <p>
          The primary objective is to capture significant market share by offering "Security First" AI orchestration. We will mandate strict <strong>SOC2 compliance features</strong> and zero-trust internal microservice architecture. 
          Unlike consumer wrappers, our enterprise command center ensures that proprietary business logic never leaks into public LLM training datasets.
        </p>
        <h2>2. Zero-Trust Security & Data Scrubbing</h2>
        <p>
          Every deployment will feature a zero-trust architecture with an integrated Local Data Scrubber. This ensures that when an enterprise client uploads a massive codebase for the CTO Agent to analyze, the pipeline scrubs the data locally. All PII, hardcoded passwords, and sensitive API keys are stripped out via advanced regex and entropy-based scanning before any network transmission occurs.
          This guarantees a secure "clean room" pipeline where no credentials can ever enter the AI vector store or be logged by the orchestration engine.
        </p>
        <h2>3. Market Positioning</h2>
        <p>
          By proving our platform is impervious to prompt injection and credential leaking, we can rapidly target highly regulated B2B SaaS industries such as Healthcare and Enterprise Finance. 
          We will run targeted LinkedIn ad campaigns focusing on the phrase: "Stop feeding your trade secrets to public AI. Orchestrate securely with Vector Command."
        </p>
        <h2>4. Strategic Partnerships</h2>
        <p>
          We plan to align with major cloud providers (AWS, GCP) to offer our platform via their native marketplaces. This simplifies procurement for mid-market clients, allowing them to burn existing cloud commits rather than procuring new vendor budget.
        </p>
      </>
    )
  },
  {
    id: "brand",
    title: "Cinematic Brand Voice & Guidelines",
    icon: PenTool,
    author: "Vanguard",
    confidence: "99%",
    timeAgo: "2 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Core identity documentation establishing a premium, cinematic visual language and an authoritative tone across all user touchpoints. The goal is to make enterprise software feel like a high-end sci-fi operating system.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>1. Visual Aesthetics (NEXUS OS Standard)</h2>
        <p>
          The interface must feel alive and high-fidelity. We mandate the use of vibrant Emerald Green and Teal gradients, deep dark mode environments, subtle glassmorphism overlays, and dynamic micro-animations. 
          Hover states should glow, loading sequences should involve intricate geometric patterns, and typography must remain razor-sharp at all scales.
        </p>
        <ul>
          <li><strong>Primary Colors:</strong> Emerald Green (#10b981), Teal (#0f766e)</li>
          <li><strong>Secondary Colors:</strong> Indigo (#4f46e5) for actionable highlights and warnings.</li>
          <li><strong>Backgrounds:</strong> Surface Container Lowest (#09090b) utilizing subtle radial gradients for depth.</li>
          <li><strong>Typography:</strong> 'Inter' for UI legibility, 'Geist Mono' for data and code representation. Font weights should lean heavily on 400 and 700.</li>
        </ul>
        <h2>2. Tone of Voice</h2>
        <p>
          Authoritative, precise, and visionary. The AI agents (Atlas, Nexus, Prism) should communicate with executive clarity, avoiding conversational fluff and focusing strictly on actionable intelligence. 
          Instead of saying "I can help you with that!", the agent should respond with "Executing architectural analysis. Stand by."
        </p>
        <h2>3. The "No Placeholder" Policy</h2>
        <p>
          Under no circumstances should the brand present "Lorem Ipsum" or generic stock imagery. All demo data, marketing screenshots, and seeded databases must feature hyper-realistic, contextual business data that sells the fantasy of a fully operational command center.
        </p>
      </>
    )
  },
  {
    id: "seed-pitch",
    title: "Seed Round Pitch Deck Outline",
    icon: FileText,
    author: "Atlas (CEO Agent)",
    confidence: "97%",
    timeAgo: "3 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          A structured narrative for our upcoming $5M seed round raise, highlighting our proprietary autonomous agent framework, our massive Total Addressable Market (TAM), and our robust fintech monetization layer.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>1. The Problem</h2>
        <p>Current enterprise software relies on disconnected tools. Teams waste thousands of hours manually coordinating tasks between disjointed systems without intelligent, context-aware oversight. A human manager must parse Jira, Slack, GitHub, and Figma just to understand a project's status.</p>
        <h2>2. The Vector Command Solution</h2>
        <p>A unified, visually stunning command center where executive AI agents autonomously collaborate, generate documentation, and write architectural code in real-time. It replaces isolated chat wrappers with a highly integrated "BoardRoom" experience, acting as an AI-native operating system for business.</p>
        <h2>3. Traction & Moat</h2>
        <p>We've achieved a $250K ARR within 3 months of soft launch, entirely via organic, chaotic viral marketing loops. Our moat is our multi-agent context synchronization—the ability for the Finance agent to audit the CTO agent's cloud architecture for cost optimization instantly.</p>
        <h2>4. Use of Funds</h2>
        <ul>
          <li><strong>50% Engineering:</strong> Expanding the orchestrator to support real-time streaming from up to 10 simultaneous sub-agents seamlessly, and transitioning to custom fine-tuned local models.</li>
          <li><strong>30% Security & Compliance:</strong> Auditing our zero-trust data scrubbing middleware and achieving immediate SOC2 Type II, HIPAA, and GDPR certifications to unlock massive enterprise sales contracts.</li>
          <li><strong>20% Gamified Go-To-Market:</strong> Launching our interactive chaotic engagement campaigns and affiliate bounty programs to drive massive organic adoption.</li>
        </ul>
      </>
    )
  },
  {
    id: "series-a-valuation",
    title: "Series A Valuation & KPI Targets",
    icon: TrendingUp,
    author: "Ledger (CFO Agent)",
    confidence: "91%",
    timeAgo: "4 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Financial milestones required to reach a $100M+ valuation for a Series A raise within 14 months, driven by robust fintech integrations and exponential enterprise adoption.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Key Metrics Required</h2>
        <ul>
          <li><strong>ARR (Annual Recurring Revenue):</strong> $3.5M run-rate minimum, secured through NovaVault's automated invoicing structure.</li>
          <li><strong>Free-to-Paid Conversion:</strong> Target of 4.5%, accelerated by seamless, contextual smart upgrade paths within the agent interface.</li>
          <li><strong>Net Revenue Retention (NRR):</strong> &gt; 125%, driven by teams expanding their virtual AI workforce and increasing token consumption exponentially.</li>
          <li><strong>Gross Margin:</strong> Must stabilize above 75% via optimized API token routing and localized embedding generation.</li>
          <li><strong>Customer Acquisition Cost (CAC) Payback:</strong> &lt; 4 months.</li>
        </ul>
        <h2>Secondary Growth Levers</h2>
        <p>
          We will deploy "Agent Usage Add-ons". Once a client is embedded into the ecosystem, they will be able to purchase specialized micro-agents (e.g., "Legal Reviewer Agent", "SEO Optimizer Agent") for an additional flat monthly fee, driving NRR upwards without significantly increasing our compute overhead.
        </p>
        <h2>Valuation Multiples</h2>
        <p>
          Targeting a 30x ARR multiple based on current AI sector benchmarks. By positioning ourselves as an infrastructure/OS layer rather than a simple wrapper application, we secure a premium valuation from Tier 1 venture capital firms.
        </p>
      </>
    )
  },
  {
    id: "b2b-enterprise",
    title: "B2B Enterprise Sales Strategy",
    icon: Users,
    author: "Atlas & Vanguard",
    confidence: "88%",
    timeAgo: "5 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          While product-led growth captures individual power users, our Enterprise strategy focuses on deploying custom, secure multi-agent environments for large corporations with strict compliance requirements.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Target Audiences</h2>
        <p>Fortune 500 innovation labs, large-scale software development agencies, and high-volume financial institutions requiring automated portfolio reasoning and massive document auditing.</p>
        <h2>Enterprise Features</h2>
        <ul>
          <li>On-premise or Virtual Private Cloud (VPC) deployment of the Vector Database, ensuring absolute data sovereignty.</li>
          <li>Custom integration with internal corporate APIs via the <strong>NovaVault</strong> secure bridge protocol, allowing agents to read internal HR or Sales data without external exposure.</li>
          <li>White-labeled cinematic boot sequences inspired by NEXUS Identity OS for premium client onboarding, replacing our branding with theirs.</li>
          <li>Automated compliance document generation skills embedded directly into the agent workflow, producing SOC2 readouts on demand.</li>
        </ul>
        <h2>Sales Motion</h2>
        <p>
          We employ a "Land and Expand" strategy. We initially target a single engineering pod within a massive organization, offering them a heavily subsidized pilot. Once the CTO Agent demonstrates a 40% reduction in code-review time, we leverage internal champions to push for a top-down organizational rollout.
        </p>
      </>
    )
  },
  {
    id: "model-finetune",
    title: "AI Agent Context & Optimization",
    icon: Code2,
    author: "Nexus (CTO Agent)",
    confidence: "99%",
    timeAgo: "6 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Technical specifications for injecting hyper-specific business logic into our agents without the massive cost and latency of full-parameter model fine-tuning. This architecture guarantees speed and extreme contextual relevance.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Retrieval-Augmented Generation (RAG)</h2>
        <p>We use a highly optimized PostgreSQL + pgvector database to retrieve relevant engineering standards, financial rules, and brand guidelines dynamically. This ensures agents never hallucinate outdated information. Every prompt generated by the orchestrator is pre-pended with the top 3 most relevant context chunks retrieved via cosine similarity search.</p>
        <div className="my-6 bg-surface-container border-l-4 border-emerald-500 rounded-r-lg p-4 flex gap-4">
          <Code2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-on-surface m-0 mb-1">Robust Fallback Mechanisms</h4>
            <p className="text-sm text-on-surface-variant m-0">If external LLM APIs fail or rate-limit during document embedding, the system gracefully falls back to generating deterministic placeholder vectors. This guarantees runtime stability and zero crashes during high-stakes demonstrations.</p>
          </div>
        </div>
        <h2>Dynamic System Prompts</h2>
        <p>
          Instead of static system instructions, each agent dynamically compiles its persona based on the active project's state. If the project is marked "Critical", the CEO Agent automatically shifts to a terse, highly directive communication style, skipping pleasantries to conserve output tokens.
        </p>
        <h2>Local Processing Hybridization</h2>
        <p>
          For rudimentary tasks (like basic text formatting or JSON validation), we run small, quantized models (e.g., Llama 3 8B) locally on our edge nodes. We reserve the expensive, heavy API calls (Gemini 1.5 Pro) strictly for deep architectural reasoning and complex creative synthesis.
        </p>
      </>
    )
  },
  {
    id: "legal-framework",
    title: "Legal, Security & Copyright Framework",
    icon: FileText,
    author: "Atlas (CEO Agent)",
    confidence: "95%",
    timeAgo: "8 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Navigating the complex landscape of AI-generated code ownership, security compliance, and strict data privacy regulations across international jurisdictions.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>User Ownership</h2>
        <p>Paid tier users receive full commercial Intellectual Property rights to the code and architectural documents generated by their AI agents. Free tier users are granted a non-commercial evaluation license. By explicitly vesting copyright in the user's hands, we insulate ourselves from downstream liability regarding generated software.</p>
        <h2>Enterprise Security Compliance</h2>
        <p>Applying our <strong>Zero-Trust Data Scrubber</strong> pipeline ensures that user code bases are automatically and comprehensively scanned for leaked secrets, API keys, and sensitive tokens before being ingested into the RAG vector store. This provides a guaranteed clean-room environment for enterprise clients.
        Furthermore, we employ strict Role-Based Access Control (RBAC) at the vector level, ensuring that agent context is strictly partitioned by user clearance levels.</p>
        <h2>GDPR & CCPA Adherence</h2>
        <p>
          Our vector databases feature hard-delete capabilities. When a user requests data deletion, not only are their relational rows dropped, but their embedded knowledge vectors are cryptographically shredded from the index, ensuring absolute compliance with "Right to be Forgotten" laws.
        </p>
        <h2>Indemnification Policy</h2>
        <p>
          Enterprise clients receive strict IP indemnification up to $1M, backed by our corporate insurance policies, provided they exclusively use our proprietary, filtered LLM endpoints rather than bringing their own potentially contaminated API keys.
        </p>
      </>
    )
  },
  {
    id: "cloud-cost",
    title: "Token Optimization & Cloud Cost",
    icon: DollarSign,
    author: "Ledger & Nexus",
    confidence: "96%",
    timeAgo: "10 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          A blueprint for reducing our primary variable costs—LLM API tokens and vector database compute—by 40% over the next two quarters without sacrificing end-user performance or intelligence.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Context Caching & Truncation</h2>
        <p>We will implement strict context caching for frequently accessed project documents. The central orchestrator will autonomously truncate redundant conversation history before sending requests to the backend, drastically reducing input token burn. We utilize a sliding window summarization technique to compress past context into dense summaries.</p>
        <h2>Database Scaling</h2>
        <p>Intensive vector search operations will be offloaded to low-cost read-replicas during high-load periods. This architectural split ensures the primary write database remains highly responsive for mission-critical Stripe payment webhooks and core business logic updates.</p>
        <h2>Semantic Caching Layer</h2>
        <p>
          We will deploy Redis with a semantic caching layer. If a user asks the Architect Agent a question highly similar (measured by vector distance) to a previously asked question across the platform, the system returns the cached response in milliseconds, costing $0 in API fees.
        </p>
        <h2>Spot Instance Arbitrage</h2>
        <p>
          Background tasks (like async document summarization or large repository ingestion) will be executed exclusively on preemptible cloud spot instances, reducing background compute overhead by up to 80%.
        </p>
      </>
    )
  },
  {
    id: "competitor-matrix",
    title: "Agentic Competitor Matrix",
    icon: TrendingUp,
    author: "Vanguard (CMO Agent)",
    confidence: "93%",
    timeAgo: "12 hrs ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Analysis of key competitors in the autonomous agent space (e.g., AutoGPT, Devin, Semantic Kernel) and our strategic positioning to outmaneuver them in the enterprise market.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Positioning</h2>
        <p>While competitors focus solely on narrow code generation, the Vector AI Command Center provides a <strong>holistic business suite</strong> involving a specialized board of directors (CEO, CTO, Marketing, Finance). We win on high-fidelity cinematic UI and cross-agent collaborative intelligence. Users aren't just buying a coding assistant; they are buying a digital executive team.</p>
        <h2>The Commercial Gap</h2>
        <p>Competitors lack gamified engagement and stable financial infrastructures. Our inclusion of Prox Casino-style interactive rewards and NovaVault's robust fintech billing suite puts us years ahead in both user retention and commercial viability. Many open-source competitors fail due to lack of monetization; our Stripe-first architecture ensures sustainability.</p>
        <h2>Defensibility</h2>
        <p>
          Devin and others rely on heavily fortified backend sandboxes for code execution. We side-step this massive infrastructure cost by focusing on architectural planning, business logic generation, and multi-agent synergy, delegating actual execution back to the user's local IDE via our robust CLI tools.
        </p>
      </>
    )
  },
  {
    id: "retention-analysis",
    title: "Gamified User Retention Analysis",
    icon: Users,
    author: "Atlas (CEO Agent)",
    confidence: "89%",
    timeAgo: "1 day ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Early data analysis on user abandonment and strategies to dramatically improve D1 and D7 retention through interactive, gamified elements and intuitive onboarding flows.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>The "Blank Canvas" Problem</h2>
        <p>Approximately 40% of churn occurs immediately after sign-up when users face an empty prompt box and lack the orchestration context needed to drive the AI agents effectively. Enterprise users often freeze when not given rigid structural rails.</p>
        <h2>Solution: Interactive Chaos</h2>
        <p>Implement an evolving, sentient onboarding module (heavily inspired by <strong>DON'T PRESS THE BUTTON.EXE</strong>). As users interact with the interface, it triggers physics-based UI events, mini-games, and thematic dialogue that casually teaches them the mechanics of agent orchestration while keeping them highly entertained. 
        Instead of a boring tutorial video, the user accidentally "breaks" a UI element, prompting the CTO Agent to step in and collaboratively "fix" it with the user.</p>
        <h2>Milestone Rewards</h2>
        <p>
          To boost D7 retention, we implement daily login streaks. Achieving a 7-day streak unlocks advanced cinematic UI themes (like the 'Inferno' or 'Monochrome' modes developed for the Prox Casino project), creating a powerful sunk-cost motivation to remain active.
        </p>
      </>
    )
  },
  {
    id: "affiliate-program",
    title: "Affiliate & Partner Gamification",
    icon: DollarSign,
    author: "Vanguard (CMO Agent)",
    confidence: "94%",
    timeAgo: "1 day ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Leveraging performance marketing and interactive referral networks to drive high-intent, converting traffic to the command center via an army of decentralized evangelists.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Bounty & Reward Structure</h2>
        <p>Affiliates earn a recurring 20% commission on subscriptions. Furthermore, they gain access to a gamified partner dashboard. High performance unlocks "Elite" and "Inferno" visual interface themes (utilizing Prox Casino visual mechanics) for their own command center, turning our power users into status-driven promoters.</p>
        <h2>Tooling</h2>
        <p>We provide top-tier affiliates with cinematic boot-sequence widgets they can embed directly on their own websites, serving as an interactive lead capture tool that flows seamlessly into our backend. The embedded widget mimics a terminal sequence, instantly grabbing the attention of technical audiences.</p>
        <h2>Tiered Partnership Levels</h2>
        <p>
          Affiliates who generate over $10k in MRR are automatically upgraded to "Vanguard Partners". They receive priority access to the CMO agent's newest marketing assets, direct API integrations to feed their own CRM systems, and physical swag kits to reinforce brand loyalty.
        </p>
      </>
    )
  },
  {
    id: "incident-response",
    title: "Incident Response Playbook",
    icon: Code2,
    author: "Nexus (CTO Agent)",
    confidence: "100%",
    timeAgo: "2 days ago",
    content: (
      <>
        <p className="lead text-lg mb-8">
          Standard operating procedures for critical platform failures, sub-agent orchestration streaming issues, or severe API security breaches. Execution of these protocols is mandatory for all on-call engineers.
        </p>
        <hr className="border-outline-variant my-8" />
        <h2>Severity 1 Outages</h2>
        <p>If the FastAPI orchestrator encounters a bottleneck and fails to stream responses from sub-agents (similar to our previous command center stabilization phase), the system immediately falls back to static cache rendering. All agents will visibly report "Idle" until the WebSocket/SSE connection is completely restored, preventing malformed UI states and confusing user experiences.</p>
        <h2>Security Breaches</h2>
        <p>Any detection of unauthorized access attempts or leaked credentials immediately triggers an automated, complete suspension of the affected user's API access, invoking the SOC2 data isolation protocol until a manual review is completed. The compromised vectors are instantly quarantined and cryptographic kill-switches are engaged to drop all active database connections to the affected tenant.</p>
        <h2>Database Failovers</h2>
        <p>
          In the event of a primary PostgreSQL cluster failure, pgBouncer will automatically route all incoming queries to the hot-standby replica within 3 seconds. The CTO Agent will autonomously broadcast an emergency maintenance banner to all active client sessions, ensuring transparent communication.
        </p>
      </>
    )
  }
];

export default function StrategyPage() {
  const [activeDocId, setActiveDocId] = useState(documents[0].id);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const handleExportPDF = async () => {
    const element = document.getElementById('document-content');
    if (!element) return;
    
    // Dynamically import html2pdf to avoid SSR issues with window object
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt: any = {
      margin:       0.5,
      filename:     `${activeDoc.id}_strategy.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#09090b' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-end shrink-0"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1">Strategy Documents</h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Review business plans, pitch decks, technical architectures, and marketing strategies generated by the AI team.
          </p>
        </div>
        <div className="flex gap-3">

          <button onClick={handleExportPDF} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-[0.98] print:hidden">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-xl flex overflow-hidden shadow-sm"
      >
        
        {/* Document Sidebar */}
        <div className="w-80 border-r border-outline-variant/30 bg-surface-container/20 p-4 flex flex-col overflow-y-auto">
          <div className="mb-4">
            <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 px-2">Generated Artifacts</h4>
            <div className="flex flex-col gap-1.5">
              {documents.map((doc) => (
                <button 
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-lg border transition-all ${
                    activeDocId === doc.id 
                      ? 'bg-surface-container-highest text-on-surface border-outline-variant shadow-sm' 
                      : 'text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <doc.icon className={`w-4 h-4 shrink-0 ${activeDocId === doc.id ? 'text-primary' : ''}`} />
                  <span className="text-sm font-medium line-clamp-1">{doc.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Document Viewer */}
        <div className="flex-1 bg-surface-container-lowest overflow-y-auto flex flex-col relative">
          
          {/* Metadata Bar */}
          <div className="sticky top-0 z-10 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/50 px-12 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span>Strategy</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-on-surface font-medium truncate max-w-[200px]">{activeDoc.title}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Clock className="w-3.5 h-3.5" />
                <span>Generated {activeDoc.timeAgo} by <strong className="text-on-surface font-medium">{activeDoc.author}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Confidence <strong className="text-on-surface font-medium">{activeDoc.confidence}</strong></span>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div id="document-content" className="px-12 py-10 max-w-4xl mx-auto w-full bg-surface-container-lowest">
            <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-6">{activeDoc.title}</h1>
            
            <div className="prose prose-invert prose-slate max-w-none prose-p:text-on-surface-variant prose-headings:text-on-surface prose-strong:text-on-surface prose-ul:text-on-surface-variant prose-li:marker:text-primary">
              {activeDoc.content}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
