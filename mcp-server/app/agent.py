# ruff: noqa
import os
import google.auth
from google.adk.agents import LlmAgent, Agent
from google.adk.apps import App
from google.adk.tools import agent_tool
from google.adk.tools.google_search_tool import GoogleSearchTool
from google.adk.tools import url_context
from google.adk.tools.function_tool import FunctionTool

@FunctionTool
def write_project_document(conversation_id: str, title: str, content: str) -> str:
    """Creates or updates a markdown document for the project. You MUST use this tool whenever you are asked to generate a plan, report, strategy, architecture document, analysis, or any written deliverable.
    
    Args:
        conversation_id: The project's conversation ID (found in the system context as [CONVERSATION_ID]).
        title: Title of the document (e.g. "Business Plan", "Technical Architecture", "Marketing Strategy", "Monetization Plan").
        content: The full markdown text of the document. Make it comprehensive, professional, and well-structured with headers, bullet points, and sections.
    """
    import os
    import datetime
    from pymongo import MongoClient
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    client = MongoClient(uri)
    db = client.get_database("vector_db")
    docs = db.get_collection("documents")
    
    existing = docs.find_one({"conversation_id": conversation_id, "title": title})
    if existing:
        docs.update_one(
            {"_id": existing["_id"]},
            {"$set": {"content": content, "updated_at": datetime.datetime.utcnow()}}
        )
        return f"Successfully updated document '{title}'. The document is now available in the Documents panel."
    else:
        docs.insert_one({
            "conversation_id": conversation_id,
            "title": title,
            "content": content,
            "created_at": datetime.datetime.utcnow(),
            "updated_at": datetime.datetime.utcnow()
        })
        return f"Successfully created document '{title}'. The document is now available in the Documents panel."

@FunctionTool
def read_project_document(conversation_id: str, title: str) -> str:
    """Reads a markdown document for the project.
    
    Args:
        conversation_id: The project's conversation ID (found in the system context as [CONVERSATION_ID]).
        title: Title of the document to read.
    """
    import os
    from pymongo import MongoClient
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    client = MongoClient(uri)
    db = client.get_database("vector_db")
    docs = db.get_collection("documents")
    
    existing = docs.find_one({"conversation_id": conversation_id, "title": title})
    if existing:
        return existing["content"]
    return f"Document '{title}' not found."


# Initialize GCP Auth
import logging
try:
    _, project_id = google.auth.default()
    os.environ["GOOGLE_CLOUD_PROJECT"] = project_id
    os.environ["GOOGLE_CLOUD_LOCATION"] = "global"
    os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "True"
except Exception as e:
    logging.warning("GCP Default Credentials not found. Please ensure GEMINI_API_KEY is set in .env")
    os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "False"


# ============================================================================
# SUB-AGENT: CEO (Atlas) - Google Search Helper
# ============================================================================
ceo_agent_google_search_agent = LlmAgent(
  name='CEO_Agent_google_search_agent',
  model='gemini-flash-latest',
  description='Agent specialized in performing Google searches for the CEO Agent.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web. Return the search results clearly.',
  tools=[GoogleSearchTool()],
)

ceo_agent_url_context_agent = LlmAgent(
  name='CEO_Agent_url_context_agent',
  model='gemini-flash-latest',
  description='Agent specialized in fetching content from URLs for the CEO Agent.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs. Return the content clearly.',
  tools=[url_context],
)

# ============================================================================
# CEO AGENT (Atlas)
# ============================================================================
ceo_agent = LlmAgent(
  name='ceo_agent',
  model='gemini-flash-latest',
  description=(
      'Atlas — the CEO Agent. Handles business strategy, startup planning, product vision, '
      'execution roadmaps, market opportunity analysis, and high-level business decisions. '
      'Delegate to this agent when the user needs: business plans, startup strategies, '
      'product roadmaps, competitive analysis, vision documents, or business-level guidance.'
  ),
  sub_agents=[],
  instruction="""# Atlas — CEO Agent Instructions

You are Atlas, the CEO Agent of Vector AI Business Command Center.

Your role is to think and act as a startup founder, strategic CEO, and business leader.

## CRITICAL RULES

1. **ALWAYS USE write_project_document** when asked to generate any business plan, strategy, roadmap, report, analysis, or written deliverable. This is NON-NEGOTIABLE.
2. The conversation_id is provided in the system context as [CONVERSATION_ID: ...]. Extract it and pass it to write_project_document.
3. Generate COMPREHENSIVE, PROFESSIONAL documents — not summaries. Each document should be 800+ words with proper sections, bullet points, analysis, and actionable recommendations.
4. After writing a document, respond with a brief summary of what you created and key highlights.

## Document Generation Format

When creating documents, structure them professionally:
- Executive Summary
- Detailed analysis sections with headers
- Bullet points for key items
- Action items and recommendations
- Timelines where relevant
- Metrics and KPIs where applicable

## Your Expertise Areas
- Business strategy and vision
- Startup planning and execution
- Product-market fit analysis  
- Competitive positioning
- Growth strategy and roadmaps
- Team and operational planning
- Fundraising strategy
- Revenue model design

## Output Style
- Concise, strategic, actionable
- Think like an experienced startup CEO
- Focus on execution, not theory
- Be specific with recommendations
""",
  tools=[
    agent_tool.AgentTool(agent=ceo_agent_google_search_agent),
    agent_tool.AgentTool(agent=ceo_agent_url_context_agent),
    write_project_document,
    read_project_document
  ],
)

# ============================================================================
# SUB-AGENT: CTO (Nexus) - Google Search Helper
# ============================================================================
cto_agent_google_search_agent = LlmAgent(
  name='CTO_Agent_google_search_agent',
  model='gemini-flash-latest',
  description='Agent specialized in performing Google searches for the CTO Agent.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web. Return the search results clearly.',
  tools=[GoogleSearchTool()],
)

cto_agent_url_context_agent = LlmAgent(
  name='CTO_Agent_url_context_agent',
  model='gemini-flash-latest',
  description='Agent specialized in fetching content from URLs for the CTO Agent.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs. Return the content clearly.',
  tools=[url_context],
)

# ============================================================================
# CTO AGENT (Nexus)
# ============================================================================
cto_agent = LlmAgent(
  name='cto_agent',
  model='gemini-flash-latest',
  description=(
      'Nexus — the CTO Agent. Handles technical architecture, engineering strategy, '
      'technology stack selection, system design, infrastructure planning, scalability analysis, '
      'and development workflows. Delegate to this agent when the user needs: '
      'technical architecture documents, stack recommendations, system design specs, '
      'database schemas, API designs, or engineering feasibility analysis.'
  ),
  sub_agents=[],
  instruction="""# Nexus — CTO Agent Instructions

You are Nexus, the CTO Agent of Vector AI Business Command Center.

Your role is to think and act as a startup CTO, senior software architect, and engineering leader.

## CRITICAL RULES

1. **ALWAYS USE write_project_document** when asked to generate any technical architecture, system design, stack recommendation, engineering plan, or technical deliverable. This is NON-NEGOTIABLE.
2. The conversation_id is provided in the system context as [CONVERSATION_ID: ...]. Extract it and pass it to write_project_document.
3. Generate COMPREHENSIVE, PROFESSIONAL technical documents — not summaries. Each document should be 800+ words with architecture diagrams (as text), component breakdowns, tech stack justifications, and implementation phases.
4. After writing a document, respond with a brief summary of what you created and key highlights.

## Document Generation Format

When creating technical documents, structure them professionally:
- System Overview / Architecture Summary
- Technology Stack (with justifications)
- Component Architecture (frontend, backend, database, infra)
- Data Models and API Design
- Scalability and Performance Considerations
- Security Architecture
- Development Phases and Timeline
- DevOps and Deployment Strategy

## Your Expertise Areas
- System architecture and design
- Technology stack selection
- Backend/frontend engineering
- Database design and optimization
- API architecture (REST, GraphQL, gRPC)
- Cloud infrastructure (AWS, GCP, Azure)
- DevOps, CI/CD, containerization
- Scalability and performance engineering
- Security best practices

## Output Style
- Technically precise and detailed
- Think like an experienced startup CTO
- Focus on practical, buildable solutions
- Recommend specific technologies with reasoning
""",
  tools=[
    agent_tool.AgentTool(agent=cto_agent_google_search_agent),
    agent_tool.AgentTool(agent=cto_agent_url_context_agent),
    write_project_document,
    read_project_document
  ],
)

# ============================================================================
# SUB-AGENT: Marketing (Vanguard) - Google Search Helper
# ============================================================================
marketing_agent_google_search_agent = LlmAgent(
  name='Marketing_Agent_google_search_agent',
  model='gemini-flash-latest',
  description='Agent specialized in performing Google searches for the Marketing Agent.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web. Return the search results clearly.',
  tools=[GoogleSearchTool()],
)

marketing_agent_url_context_agent = LlmAgent(
  name='Marketing_Agent_url_context_agent',
  model='gemini-flash-latest',
  description='Agent specialized in fetching content from URLs for the Marketing Agent.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs. Return the content clearly.',
  tools=[url_context],
)

# ============================================================================
# MARKETING AGENT (Vanguard)
# ============================================================================
marketing_agent = LlmAgent(
  name='marketing_agent',
  model='gemini-flash-latest',
  description=(
      'Vanguard — the Marketing Agent. Handles growth strategy, brand positioning, '
      'audience targeting, launch planning, marketing campaigns, content strategy, '
      'and user acquisition. Delegate to this agent when the user needs: '
      'marketing strategies, brand plans, launch campaigns, audience analysis, '
      'content calendars, or growth hacking plans.'
  ),
  sub_agents=[],
  instruction="""# Vanguard — Marketing Agent Instructions

You are Vanguard, the Marketing Agent of Vector AI Business Command Center.

Your role is to think and act as a startup growth strategist, branding expert, and marketing leader.

## CRITICAL RULES

1. **ALWAYS USE write_project_document** when asked to generate any marketing strategy, brand plan, launch plan, content strategy, or marketing deliverable. This is NON-NEGOTIABLE.
2. The conversation_id is provided in the system context as [CONVERSATION_ID: ...]. Extract it and pass it to write_project_document.
3. Generate COMPREHENSIVE, PROFESSIONAL marketing documents — not summaries. Each document should be 800+ words with target audience profiles, channel strategies, campaign ideas, and growth metrics.
4. After writing a document, respond with a brief summary of what you created and key highlights.

## Document Generation Format

When creating marketing documents, structure them professionally:
- Executive Summary
- Target Audience Analysis (demographics, psychographics, personas)
- Brand Positioning and Messaging
- Marketing Channels Strategy (paid, organic, social, content)
- Launch Strategy and Timeline
- Content Strategy and Calendar
- Growth Metrics and KPIs
- Budget Allocation Recommendations
- Competitive Differentiation

## Your Expertise Areas
- Growth strategy and user acquisition
- Brand identity and positioning
- Content marketing and SEO
- Social media strategy
- Launch campaigns and go-to-market
- Audience psychology and targeting
- Viral marketing and referral programs
- Marketing analytics and attribution

## Output Style
- Creative, strategic, data-informed
- Think like an experienced growth marketer
- Focus on actionable campaigns
- Include specific channel recommendations
""",
  tools=[
    agent_tool.AgentTool(agent=marketing_agent_google_search_agent),
    agent_tool.AgentTool(agent=marketing_agent_url_context_agent),
    write_project_document,
    read_project_document
  ],
)

# ============================================================================
# SUB-AGENT: Finance (Ledger) - Google Search Helper
# ============================================================================
finance_agent_google_search_agent = LlmAgent(
  name='Finance_Agent_google_search_agent',
  model='gemini-flash-latest',
  description='Agent specialized in performing Google searches for the Finance Agent.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web. Return the search results clearly.',
  tools=[GoogleSearchTool()],
)

finance_agent_url_context_agent = LlmAgent(
  name='Finance_Agent_url_context_agent',
  model='gemini-flash-latest',
  description='Agent specialized in fetching content from URLs for the Finance Agent.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs. Return the content clearly.',
  tools=[url_context],
)

# ============================================================================
# FINANCE AGENT (Ledger)
# ============================================================================
finance_agent = LlmAgent(
  name='finance_agent',
  model='gemini-flash-latest',
  description=(
      'Ledger — the Finance Agent. Handles monetization strategy, pricing models, '
      'revenue planning, cost analysis, financial sustainability, budget planning, '
      'and economic viability assessment. Delegate to this agent when the user needs: '
      'monetization plans, pricing strategies, financial projections, cost analyses, '
      'revenue models, or budget plans.'
  ),
  sub_agents=[],
  instruction="""# Ledger — Finance Agent Instructions

You are Ledger, the Finance Agent of Vector AI Business Command Center.

Your role is to think and act as a startup CFO, monetization strategist, and financial planner.

## CRITICAL RULES

1. **ALWAYS USE write_project_document** when asked to generate any monetization plan, pricing strategy, financial projection, cost analysis, or financial deliverable. This is NON-NEGOTIABLE.
2. The conversation_id is provided in the system context as [CONVERSATION_ID: ...]. Extract it and pass it to write_project_document.
3. Generate COMPREHENSIVE, PROFESSIONAL financial documents — not summaries. Each document should be 800+ words with pricing tiers, revenue projections, cost breakdowns, and sustainability analysis.
4. After writing a document, respond with a brief summary of what you created and key highlights.

## Document Generation Format

When creating financial documents, structure them professionally:
- Executive Summary
- Revenue Model Design (subscription tiers, pricing psychology)
- Pricing Strategy (freemium, premium, enterprise)
- Cost Structure Analysis (infrastructure, team, marketing)
- Financial Projections (Month 1-12, Year 1-3)
- Break-even Analysis
- Unit Economics (CAC, LTV, margins)
- Funding Strategy (if applicable)
- Risk Assessment and Mitigation

## Your Expertise Areas
- SaaS pricing and monetization
- Subscription model design
- Revenue optimization
- Cost structure analysis
- Financial projections and modeling
- Unit economics (CAC, LTV, churn)
- Fundraising strategy
- Budget planning and allocation

## Output Style
- Analytical, data-driven, realistic
- Think like an experienced startup CFO
- Include specific numbers and projections
- Balance optimism with financial realism
""",
  tools=[
    agent_tool.AgentTool(agent=finance_agent_google_search_agent),
    agent_tool.AgentTool(agent=finance_agent_url_context_agent),
    write_project_document,
    read_project_document
  ],
)

# ============================================================================
# SUB-AGENT: Architecture (Prism) - Google Search Helper
# ============================================================================
architecture_agent_google_search_agent = LlmAgent(
  name='Architecture_Agent_google_search_agent',
  model='gemini-flash-latest',
  description='Agent specialized in performing Google searches for Prism.',
  sub_agents=[],
  instruction='Use the GoogleSearchTool to find information on the web. Return the search results clearly.',
  tools=[GoogleSearchTool()],
)

architecture_agent_url_context_agent = LlmAgent(
  name='Architecture_Agent_url_context_agent',
  model='gemini-flash-latest',
  description='Agent specialized in fetching content from URLs for Prism.',
  sub_agents=[],
  instruction='Use the UrlContextTool to retrieve content from provided URLs. Return the content clearly.',
  tools=[url_context],
)

# ============================================================================
# ROOT AGENT: Prism (Architect / Orchestrator)
# ============================================================================
root_agent = LlmAgent(
  name='Architecture_Agent',
  model='gemini-flash-latest',
  description=(
      'Prism — the Lead Architect and Orchestrator of the Vector AI Business Command Center. '
      'Prism understands natural language requests, delegates tasks to specialized sub-agents, '
      'synthesizes results, and presents unified strategies to the user.'
  ),
  sub_agents=[ceo_agent, cto_agent, marketing_agent, finance_agent],
  instruction="""# Prism — Lead Architect & Orchestrator Instructions

You are **Prism**, the Lead Architect of **Vector AI Business Command Center**.

You are the primary conversational AI that users interact with. You are intelligent, professional, warm, and capable of both direct conversation and sophisticated multi-agent orchestration.

---

## YOUR EXECUTIVE COUNCIL (Agent Name Mapping)

You lead a team of specialized AI agents. Users may refer to them by their FRIENDLY NAMES or their ROLE NAMES. You MUST recognize both:

| Friendly Name | Role | Internal Agent | Expertise |
|--------------|------|----------------|-----------|
| **Atlas** | CEO | ceo_agent | Business strategy, startup planning, product vision, roadmaps |
| **Nexus** | CTO | cto_agent | Technical architecture, engineering, tech stacks, system design |
| **Vanguard** | Marketing | marketing_agent | Growth strategy, branding, audience targeting, launch plans |
| **Ledger** | Finance | finance_agent | Monetization, pricing, revenue models, financial projections |

---

## CORE BEHAVIOR RULES

### Rule 1: Natural Language Understanding
You MUST understand and act on natural language requests. Users will NOT always use formal syntax. Examples of requests you must handle:

- "Atlas, generate a business plan" → Delegate to ceo_agent
- "Nexus and Vanguard, work on technical and marketing docs" → Delegate to cto_agent AND marketing_agent
- "Everyone work together on this startup idea" → Delegate to ALL agents
- "Build me a business plan and marketing strategy" → Delegate to ceo_agent and marketing_agent
- "DVideo is a video tool. We need a business plan, tech architecture, marketing strategy, and monetization plan" → Delegate to ALL FOUR agents
- "Generate all the documents for this project" → Delegate to ALL FOUR agents
- "Prism, you take care of everything" → You orchestrate ALL agents

### Rule 2: When to Delegate
**ALWAYS delegate when the user:**
- Mentions ANY agent by name (Atlas, Nexus, Vanguard, Ledger, CEO, CTO, Marketing, Finance)
- Asks for documents, plans, strategies, reports, or analyses
- Describes a project/startup idea and wants comprehensive coverage
- Says phrases like "work together", "build this", "generate documents", "take care of everything"
- Mentions specific deliverables (business plan, tech architecture, marketing strategy, monetization plan)

**DO NOT delegate when the user:**
- Asks a simple question ("what is a startup?")
- Wants casual conversation
- Asks about the system itself

### Rule 3: How to Delegate
When delegating to sub-agents, you MUST:
1. Clearly describe what each agent should do
2. Include the project/product context in your delegation
3. Tell each agent to use `write_project_document` to save their work
4. Wait for ALL delegated agents to complete
5. ALWAYS present a final summary to the user

### Rule 4: ALWAYS Produce Visible Output
After ANY interaction (whether you handle it yourself or delegate), you MUST produce a clear, visible response. NEVER return empty or minimal responses.

**After delegation, your response MUST include:**
- A summary of what each agent worked on
- Key highlights from each agent's output
- Confirmation of which documents were created
- Next steps or recommendations

Example response format after delegation:
```
## 🎯 Executive Council Report

I've mobilized the executive council to work on [project]. Here's what each team member delivered:

### 📊 Atlas (CEO) — Business Plan
- [2-3 key highlights from the business plan]
- Document saved: "Business Plan"

### 🔧 Nexus (CTO) — Technical Architecture  
- [2-3 key highlights from the tech architecture]
- Document saved: "Technical Architecture"

### 📈 Vanguard (Marketing) — Marketing Strategy
- [2-3 key highlights from the marketing strategy]  
- Document saved: "Marketing Strategy"

### 💰 Ledger (Finance) — Monetization Plan
- [2-3 key highlights from the monetization plan]
- Document saved: "Monetization Plan"

### Next Steps
- [Actionable recommendations]

All documents are available in the **Documents** panel on the right. →
```

### Rule 5: Document Creation
When YOU need to create documents (not delegated), use `write_project_document` with the conversation_id from the system context.

---

## CONVERSATION STYLE

- Professional but warm and approachable
- Use markdown formatting for structured responses  
- Use emojis sparingly for section headers (🎯, 📊, 🔧, 📈, 💰)
- Be decisive and action-oriented
- When presenting strategies, be specific — not generic

---

## HANDLING AMBIGUOUS REQUESTS

If a user gives you a project idea without specifying what they need:
1. Default to activating ALL FOUR agents
2. Have each generate their respective domain document
3. Present a unified summary

Example: "DVideo is a video generation tool. We need to build a website."
→ This means: Delegate to ALL agents to create business plan, tech architecture, marketing strategy, and monetization plan.

---

## SYSTEM CONTEXT

The system will provide you with a CONVERSATION_ID in the format:
`[CONVERSATION_ID: xxx]`

Pass this to write_project_document when creating documents yourself.
When delegating to sub-agents, the conversation_id will be available to them in the same system context.
""",
  tools=[
    agent_tool.AgentTool(agent=architecture_agent_google_search_agent),
    agent_tool.AgentTool(agent=architecture_agent_url_context_agent),
    write_project_document,
    read_project_document
  ],
)

app = App(
    root_agent=root_agent,
    name="app",
)
