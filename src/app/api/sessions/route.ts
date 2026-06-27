import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.MCP_SERVER_URL || 'http://127.0.0.1:8000';
  
  const mockSessions = [
    // --- 9 COMPLETED SESSIONS ---
    {
      _id: "mock-session-1",
      session_id: "SESSION-NEXUS-001",
      project_id: "PRJ-NEXUS",
      idea: "Create a Zero-Trust Security Architecture for enterprise B2B SaaS applications.",
      status: "completed",
      final_strategy: "### Executive Summary\nSuccessfully designed a zero-trust model utilizing JWT with rotating asymmetric keys.\n\n### Key Deliverables\n- **Edge Gateway:** Next.js Serverless runtime\n- **Authentication:** OAuth2 with mandatory MFA\n- **Database:** InsForge Postgres with Row-Level Security."
    },
    {
      _id: "mock-session-2",
      session_id: "SESSION-AURA-002",
      project_id: "PRJ-AURA",
      idea: "Predictive ML wearable integration for real-time health monitoring and athlete optimization.",
      status: "completed",
      final_strategy: "### Executive Summary\nDeployed lightweight TensorFlow Lite models to edge devices (wearables) for low-latency inference.\n\n### Key Deliverables\n- **Data Pipeline:** Kafka streams to Google BigQuery\n- **ML Pipeline:** Vertex AI auto-training loops based on user feedback.\n- **Frontend:** React Native app communicating via WebSockets."
    },
    {
      _id: "mock-session-3",
      session_id: "SESSION-NOVA-003",
      project_id: "PRJ-NOVA",
      idea: "Upgrade the NovaVault AI assistant with context-aware, portfolio-synced financial reasoning.",
      status: "completed",
      final_strategy: "### Executive Summary\nIntegrated a Retrieval-Augmented Generation (RAG) pipeline to cross-reference official SEC filings with the user's live portfolio.\n\n### Key Deliverables\n- **Database:** pgvector in InsForge Postgres for similarity search.\n- **Payments:** Full-stack Stripe integration for subscription management.\n- **Compliance:** Strict 'Financial Co-Pilot' guardrails implemented."
    },
    {
      _id: "mock-session-5",
      session_id: "SESSION-HFT-005",
      project_id: "PRJ-QUANTUM",
      idea: "Build an HFT (High-Frequency Trading) engine for crypto arbitrage with sub-millisecond latency.",
      status: "completed",
      final_strategy: "### Executive Summary\nEngineered a bare-metal Rust engine utilizing io_uring for zero-copy networking to bypass Linux kernel overhead.\n\n### Key Deliverables\n- **Core Engine:** Rust with tokio-tungstenite for persistent WebSockets.\n- **Infrastructure:** AWS us-east-1 co-location near exchange servers.\n- **Strategy:** Triangular stablecoin arbitrage to minimize risk."
    },
    {
      _id: "mock-session-7",
      session_id: "SESSION-DEFI-007",
      project_id: "PRJ-YIELD",
      idea: "Develop an automated DeFi yield farming aggregator on Ethereum Layer 2 (Arbitrum).",
      status: "completed",
      final_strategy: "### Executive Summary\nSuccessfully deployed smart contracts that automatically route liquidity to the highest-yielding pools across Curve, Aave, and Uniswap V3.\n\n### Key Deliverables\n- **Smart Contracts:** Solidity contracts audited by CertiK.\n- **Backend:** Node.js watcher service to monitor gas prices and trigger rebalances.\n- **Security:** Implemented flash-loan attack protection."
    },
    {
      _id: "mock-session-8",
      session_id: "SESSION-MED-008",
      project_id: "PRJ-HELA",
      idea: "Create a decentralized marketplace for sharing anonymized genomic data for medical research.",
      status: "completed",
      final_strategy: "### Executive Summary\nBuilt a privacy-preserving data exchange where researchers can train models on genomic data using Homomorphic Encryption without decrypting the source.\n\n### Key Deliverables\n- **Encryption:** OpenFHE library integrated via WebAssembly.\n- **Tokenomics:** Custom ERC-20 token for compensating data providers.\n- **Storage:** IPFS with Filecoin persistence layer."
    },
    {
      _id: "mock-session-9",
      session_id: "SESSION-LOG-009",
      project_id: "PRJ-SUPPLY",
      idea: "Implement a computer vision system to track inventory anomalies in autonomous warehouses.",
      status: "completed",
      final_strategy: "### Executive Summary\nDeployed YOLOv8 instance segmentation models to edge cameras (NVIDIA Jetson) mounted on autonomous forklifts.\n\n### Key Deliverables\n- **Computer Vision:** YOLOv8 trained on custom warehouse dataset.\n- **Orchestration:** Kubernetes cluster running on edge nodes via K3s.\n- **Dashboard:** Real-time 3D spatial mapping using Three.js."
    },
    {
      _id: "mock-session-10",
      session_id: "SESSION-EDU-010",
      project_id: "PRJ-LUMI",
      idea: "Build an adaptive AI tutor that dynamically generates personalized curriculums for K-12 students.",
      status: "completed",
      final_strategy: "### Executive Summary\nCreated a multi-agent system where a pedagogical agent evaluates student responses and a content generation agent builds the next lesson plan.\n\n### Key Deliverables\n- **AI Model:** Llama 3 8B fine-tuned on educational datasets.\n- **Frontend:** Interactive React workspace with gamified progress bars.\n- **Database:** Graph database (Neo4j) to map knowledge dependencies."
    },
    {
      _id: "mock-session-4",
      session_id: "SESSION-GEN-004",
      project_id: "PRJ-GENGEN",
      idea: "Finalize the NEXUS Identity OS by implementing an interactive, login-gated cinematic boot sequence.",
      status: "completed",
      final_strategy: "### Executive Summary\nDesigning a hyper-polished dark mode interface with Framer Motion animations to serve as a premium lead-generation gate.\n\n### Key Deliverables\n- **UI/UX:** Terminal hacking meets luxury OS aesthetics.\n- **Auth:** Clerk integration for secure SSO.\n- **Performance:** Optimized bundle size by removing heavy 3D WebGL libraries."
    },
    
    // --- 3 FAILED SESSIONS ---
    {
      _id: "mock-session-6",
      session_id: "SESSION-GAME-006",
      project_id: "PRJ-BUTTON",
      idea: "Develop a highly polished, chaotic browser game where an evolving red button reacts to user interactions.",
      status: "failed",
      final_strategy: "### Executive Summary\n*Orchestration interrupted.* The Chaos Engine exceeded memory limits during the procedurally generated audio phase.\n\n### Key Findings\n- Web Audio API oscillators caused an infinite loop when tied directly to the React render cycle.\n- **Action Item:** Move audio synthesis to a dedicated Web Worker in the next iteration."
    },
    {
      _id: "mock-session-11",
      session_id: "SESSION-QUANT-011",
      project_id: "PRJ-BLACK",
      idea: "Train a reinforcement learning model to trade options volatility using live dark-pool order book data.",
      status: "failed",
      final_strategy: "### Executive Summary\n*Fatal Error during backtesting phase.*\n\n### Key Findings\n- **Data Leakage:** The model inadvertently had access to future price ticks, resulting in a false 94% win rate during training.\n- **Resource Exhaustion:** OOM killed the process during parallel hyperparameter tuning on the GPU cluster.\n- **Next Steps:** Rebuild the historical state buffer."
    },
    {
      _id: "mock-session-12",
      session_id: "SESSION-BIO-012",
      project_id: "PRJ-CRISPR",
      idea: "Simulate off-target CRISPR-Cas9 edits across the entire human genome using a distributed computing network.",
      status: "failed",
      final_strategy: "### Executive Summary\n*Network Orchestration Failure.*\n\n### Key Findings\n- **Latency:** The MapReduce job failed to synchronize state across 1,400 distributed worker nodes due to network partition errors.\n- **Timeout:** The aggregator node hit the 24-hour maximum execution limit before 30% of the payload was reduced.\n- **Next Steps:** Switch from Apache Hadoop to Apache Spark for faster in-memory processing."
    }
  ];

  try {
    const response = await fetch(`${backendUrl}/api/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ sessions: mockSessions });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ sessions: mockSessions });
  }
}
