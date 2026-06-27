# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
from dotenv import load_dotenv
load_dotenv()

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import google.auth
from a2a.server.apps import A2AFastAPIApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import AgentCapabilities, AgentCard
from a2a.utils.constants import (
    AGENT_CARD_WELL_KNOWN_PATH,
    EXTENDED_AGENT_CARD_PATH,
)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from google.adk.a2a.executor.a2a_agent_executor import A2aAgentExecutor
from google.adk.a2a.utils.agent_card_builder import AgentCardBuilder
from google.adk.artifacts import GcsArtifactService, InMemoryArtifactService
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.cloud import logging as google_cloud_logging

from app.agent import app as adk_app
from app.app_utils.telemetry import setup_telemetry
from app.app_utils.typing import Feedback

try:
    setup_telemetry()
except Exception:
    pass

try:
    _, project_id = google.auth.default()
except Exception:
    project_id = "local-dev"



import logging
try:
    logging_client = google_cloud_logging.Client()
    logger = logging_client.logger(__name__)
except Exception:
    logger = logging.getLogger(__name__)
    logging.basicConfig(level=logging.INFO)


# Artifact bucket for ADK (created by Terraform, passed via env var)
logs_bucket_name = os.environ.get("LOGS_BUCKET_NAME")
artifact_service = (
    GcsArtifactService(bucket_name=logs_bucket_name)
    if logs_bucket_name
    else InMemoryArtifactService()
)

runner = Runner(
    app=adk_app,
    artifact_service=artifact_service,
    session_service=InMemorySessionService(),
)

request_handler = DefaultRequestHandler(
    agent_executor=A2aAgentExecutor(runner=runner), task_store=InMemoryTaskStore()
)

A2A_RPC_PATH = f"/a2a/{adk_app.name}"

# MongoDB Setup
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.get_database("vector_db")
projects_collection = db.get_collection("projects")
sessions_collection = db.get_collection("sessions")
conversations_collection = db.get_collection("conversations")
documents_collection = db.get_collection("documents")

# In-memory store of active ADK session IDs per conversation
_active_sessions: dict[str, str] = {}

class HistoryMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class OrchestrateRequest(BaseModel):
    project_id: str
    idea: str
    conversation_id: str | None = None
    history: list[HistoryMessage] | None = None
    stream: bool = True

async def build_dynamic_agent_card() -> AgentCard:
    """Builds the Agent Card dynamically from the root_agent."""
    agent_card_builder = AgentCardBuilder(
        agent=adk_app.root_agent,
        capabilities=AgentCapabilities(streaming=True),
        rpc_url=f"{os.getenv('APP_URL', 'http://0.0.0.0:8000')}{A2A_RPC_PATH}",
        agent_version=os.getenv("AGENT_VERSION", "0.1.0"),
    )
    agent_card = await agent_card_builder.build()
    return agent_card


@asynccontextmanager
async def lifespan(app_instance: FastAPI) -> AsyncIterator[None]:
    agent_card = await build_dynamic_agent_card()
    a2a_app = A2AFastAPIApplication(agent_card=agent_card, http_handler=request_handler)
    a2a_app.add_routes_to_app(
        app_instance,
        agent_card_url=f"{A2A_RPC_PATH}{AGENT_CARD_WELL_KNOWN_PATH}",
        rpc_url=A2A_RPC_PATH,
        extended_agent_card_url=f"{A2A_RPC_PATH}{EXTENDED_AGENT_CARD_PATH}",
    )
    yield


app = FastAPI(
    title="mcp-server",
    description="API for interacting with the Agent mcp-server",
    lifespan=lifespan,
)


@app.post("/feedback")
def collect_feedback(feedback: Feedback) -> dict[str, str]:
    """Collect and log feedback."""
    logger.log_struct(feedback.model_dump(), severity="INFO")
    return {"status": "success"}

from fastapi.responses import StreamingResponse
from fastapi import HTTPException
import json
import uuid
import datetime

class DocumentModel(BaseModel):
    title: str
    content: str
    conversation_id: str

@app.get("/api/conversations/{conv_id}/documents")
async def get_documents(conv_id: str):
    docs = await documents_collection.find({"conversation_id": conv_id}).to_list(100)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return {"documents": docs}

@app.post("/api/conversations/{conv_id}/documents")
async def create_document(conv_id: str, doc: DocumentModel):
    doc_dict = doc.model_dump()
    doc_dict["conversation_id"] = conv_id
    doc_dict["created_at"] = datetime.datetime.utcnow()
    doc_dict["updated_at"] = doc_dict["created_at"]
    
    # Check if a document with this title already exists in the conversation
    existing = await documents_collection.find_one({"conversation_id": conv_id, "title": doc.title})
    if existing:
        await documents_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {"content": doc.content, "updated_at": doc_dict["updated_at"]}}
        )
        return {"status": "success", "message": "Document updated", "id": str(existing["_id"])}

    result = await documents_collection.insert_one(doc_dict)
    return {"status": "success", "id": str(result.inserted_id)}

@app.put("/api/documents/{doc_id}")
async def update_document(doc_id: str, doc: DocumentModel):
    from bson.objectid import ObjectId
    try:
        oid = ObjectId(doc_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid document ID")
        
    result = await documents_collection.update_one(
        {"_id": oid},
        {"$set": {"content": doc.content, "title": doc.title, "updated_at": datetime.datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "success"}

@app.post("/api/orchestrate")
async def orchestrate_agents(request: OrchestrateRequest):
    """
    Trigger the Architecture Agent with conversation memory.
    Reuses ADK sessions per conversation_id so Prism remembers context.
    """
    try:
        import uuid
        from google.genai.types import Content, Part

        conv_id = request.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
        prompt = request.idea

        # Check if we already have an ADK session for this conversation
        session_id = _active_sessions.get(conv_id)
        if not session_id:
            session_id = f"session_{conv_id}"
            await runner.session_service.create_session(
                app_name=adk_app.name,
                user_id="vector_user",
                session_id=session_id
            )
            _active_sessions[conv_id] = session_id

        # Generate/retrieve title
        existing = await conversations_collection.find_one({"conversation_id": conv_id})
        title = None
        if existing and "title" in existing:
            title = existing["title"]

        if not title:
            try:
                from google import genai
                client_genai = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
                response = client_genai.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=f"Generate a concise 3-4 word project/chat title for this startup/project idea: {prompt}. Return ONLY the title text itself without formatting, quotes, or markdown.",
                )
                title = response.text.strip().replace('"', '').replace("'", "")
            except Exception as gen_err:
                logger.warning(f"Failed to generate title with Gemini: {gen_err}")
                title = " ".join(prompt.split()[:4]) + "..."

        # Save to MongoDB (non-blocking)
        try:
            await conversations_collection.update_one(
                {"conversation_id": conv_id},
                {
                    "$setOnInsert": {
                        "conversation_id": conv_id, 
                        "created_at": __import__('datetime').datetime.utcnow()
                    },
                    "$set": {"title": title},
                    "$push": {"messages": {"role": "user", "content": prompt, "timestamp": __import__('datetime').datetime.utcnow()}},
                },
                upsert=True
            )
        except Exception as db_err:
            logger.warning(f"MongoDB save failed (non-fatal): {db_err}")

        if request.stream:
            async def generate_events():
                import asyncio as _asyncio
                final_text = ""
                max_retries = 3
                current_session = session_id
                
                # Map internal agent names to friendly names for telemetry
                agent_display_names = {
                    "Architecture_Agent": "Prism",
                    "ceo_agent": "Atlas (CEO)",
                    "cto_agent": "Nexus (CTO)",
                    "marketing_agent": "Vanguard (Marketing)",
                    "finance_agent": "Ledger (Finance)",
                }
                
                # Track which agents are active for frontend status cards
                active_agents = set()
                
                for attempt in range(max_retries):
                    try:
                        for event in runner.run(
                            user_id="vector_user",
                            session_id=current_session,
                            new_message=Content(role="user", parts=[Part.from_text(text=f"[CONVERSATION_ID: {conv_id}]\n[SYSTEM CONTEXT: The current project conversation_id is '{conv_id}'. You MUST use this conversation_id when calling write_project_document or read_project_document. All sub-agents also receive this same conversation_id.]\n\nUser Request:\n{prompt}")])
                        ):
                            agent_name = getattr(event, "author", "Architecture_Agent") or "Architecture_Agent"
                            display_name = agent_display_names.get(agent_name, agent_name)
                            
                            # Track active agent
                            if agent_name not in active_agents and agent_name != "Architecture_Agent":
                                active_agents.add(agent_name)
                                yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] activated and working on task...'})}\n\n"
                            
                            # Check for tool invocations
                            func_calls = getattr(event, "get_function_calls", lambda: [])()
                            for fc in func_calls:
                                fc_args = getattr(fc, "args", {})
                                # Truncate content field in args to avoid huge telemetry
                                display_args = {}
                                for k, v in fc_args.items():
                                    if k == "content":
                                        display_args[k] = f"[{len(str(v))} chars of document content]"
                                    else:
                                        display_args[k] = v
                                tool_display = fc.name
                                if fc.name == "write_project_document":
                                    title = fc_args.get("title", "document")
                                    tool_display = f'write_project_document("{title}")'
                                yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] 📝 invoking `{tool_display}`'})}\n\n"

                            # Check for tool responses
                            func_resps = getattr(event, "get_function_responses", lambda: [])()
                            for fr in func_resps:
                                fr_resp = getattr(fr, "response", {})
                                resp_str = str(fr_resp)[:200]
                                if fr.name == "write_project_document":
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] ✅ Document created/updated successfully'})}\n\n"
                                else:
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] tool `{fr.name}` returned: {resp_str}'})}\n\n"

                            # Check for agent handoff/escalate
                            actions = getattr(event, "actions", None)
                            if actions:
                                if getattr(actions, "transfer_to_agent", None):
                                    target = actions.transfer_to_agent
                                    target_display = agent_display_names.get(target, target)
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] → delegating to {target_display}...'})}\n\n"
                                if getattr(actions, "escalate", None):
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] ↑ returning control to Prism...'})}\n\n"
                                if getattr(actions, "end_of_agent", None):
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] ✓ completed assignment.'})}\n\n"

                            # Extract text content
                            event_text = ""
                            content = getattr(event, "content", None)
                            if content and hasattr(content, "parts") and content.parts:
                                for part in content.parts:
                                    part_text = getattr(part, "text", None)
                                    if part_text:
                                        event_text += part_text

                            if event_text:
                                # Stream ALL agent text as content — Prism orchestrates and synthesizes
                                # so all visible text from any agent should be shown to user
                                if agent_name == "Architecture_Agent":
                                    # Root agent (Prism) text goes directly to chat
                                    final_text += event_text
                                    yield f"data: {json.dumps({'event': 'content', 'data': event_text})}\n\n"
                                else:
                                    # Sub-agent text: send to telemetry as activity indicator
                                    truncated = event_text[:300].replace('\n', ' ').strip()
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] working: {truncated}...'})}\n\n"
                            else:
                                if not func_calls and not func_resps:
                                    yield f"data: {json.dumps({'event': 'telemetry', 'agent': agent_name, 'message': f'[{display_name}] analyzing and generating...'})}\n\n"
                        
                        break
                        
                    except Exception as stream_err:
                        error_str = str(stream_err)
                        is_503 = "503" in error_str or "UNAVAILABLE" in error_str or "high demand" in error_str.lower()
                        
                        if is_503 and attempt < max_retries - 1:
                            wait_secs = (attempt + 1) * 2
                            yield f"data: {json.dumps({'event': 'telemetry', 'agent': 'Architecture_Agent', 'message': f'[SYSTEM] Gemini API busy, retrying in {wait_secs}s (attempt {attempt+2}/{max_retries})...'})}\n\n"
                            await _asyncio.sleep(wait_secs)
                            retry_session = f"{session_id}_r{attempt+1}"
                            await runner.session_service.create_session(
                                app_name=adk_app.name,
                                user_id="vector_user",
                                session_id=retry_session
                            )
                            current_session = retry_session
                            continue
                        else:
                            logger.error(f"Stream error: {stream_err}")
                            yield f"data: {json.dumps({'event': 'error', 'data': f'AI model error: {error_str}'})}\n\n"
                            break

                # Send conversation_id back so the frontend can track it
                yield f"data: {json.dumps({'event': 'meta', 'conversation_id': conv_id})}\n\n"
                yield f"data: {json.dumps({'event': 'done', 'conversation_id': conv_id, 'data': 'Complete.'})}\n\n"
                
                # Save assistant response to MongoDB
                try:
                    await conversations_collection.update_one(
                        {"conversation_id": conv_id},
                        {"$push": {"messages": {"role": "assistant", "content": final_text, "timestamp": __import__('datetime').datetime.utcnow()}}}
                    )
                except Exception:
                    pass

            return StreamingResponse(generate_events(), media_type="text/event-stream")
        else:
            # Non-streaming mode (for dashboard workspace compatibility)
            import asyncio as _asyncio
            final_text = ""
            max_retries = 3
            current_session = session_id
            error_msg = None
            
            for attempt in range(max_retries):
                try:
                    for event in runner.run(
                        user_id="vector_user",
                        session_id=current_session,
                        new_message=Content(role="user", parts=[Part.from_text(text=f"[CONVERSATION_ID: {conv_id}]\n[SYSTEM CONTEXT: The current project conversation_id is '{conv_id}'. You MUST use this conversation_id when calling write_project_document or read_project_document. All sub-agents also receive this same conversation_id.]\n\nUser Request:\n{prompt}")])
                    ):
                        agent_name = getattr(event, "author", "Architecture_Agent") or "Architecture_Agent"
                        
                        event_text = ""
                        content = getattr(event, "content", None)
                        if content and hasattr(content, "parts") and content.parts:
                            for part in content.parts:
                                part_text = getattr(part, "text", None)
                                if part_text:
                                    event_text += part_text

                        if event_text and agent_name == "Architecture_Agent":
                            final_text += event_text
                    break
                except Exception as run_err:
                    error_str = str(run_err)
                    is_503 = "503" in error_str or "UNAVAILABLE" in error_str or "high demand" in error_str.lower()
                    if is_503 and attempt < max_retries - 1:
                        wait_secs = (attempt + 1) * 2
                        await _asyncio.sleep(wait_secs)
                        retry_session = f"{session_id}_r{attempt+1}"
                        await runner.session_service.create_session(
                            app_name=adk_app.name,
                            user_id="vector_user",
                            session_id=retry_session
                        )
                        current_session = retry_session
                        continue
                    else:
                        error_msg = error_str
                        break

            if error_msg:
                return {"error": error_msg}

            # Save assistant response to MongoDB
            try:
                await conversations_collection.update_one(
                    {"conversation_id": conv_id},
                    {"$push": {"messages": {"role": "assistant", "content": final_text, "timestamp": __import__('datetime').datetime.utcnow()}}}
                )
            except Exception:
                pass

            return {
                "strategy": final_text or "Strategy compiled.",
                "conversation_id": conv_id,
                "title": title,
                "agents": {
                    "CEO": "Strategy generated and aligned with business goals.",
                    "CTO": "Technical architecture mapped and feasibility validated."
                }
            }

    except Exception as e:
        logger.error(f"Orchestration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions")
async def get_sessions():
    """Fetch all saved orchestration sessions from MongoDB."""
    try:
        cursor = sessions_collection.find().sort("_id", -1).limit(50)
        sessions = await cursor.to_list(length=50)
        # Convert ObjectId to string for JSON serialization
        for session in sessions:
            session["_id"] = str(session["_id"])
        return {"sessions": sessions}
    except Exception as e:
        logger.error(f"Error fetching sessions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/conversations")
async def get_conversations():
    """Fetch all saved conversations from MongoDB."""
    try:
        cursor = conversations_collection.find().sort("created_at", -1).limit(50)
        conversations = await cursor.to_list(length=50)
        for conv in conversations:
            conv["_id"] = str(conv["_id"])
            if "created_at" in conv:
                conv["created_at"] = conv["created_at"].isoformat()
            if "messages" in conv:
                for msg in conv["messages"]:
                    if "timestamp" in msg:
                        msg["timestamp"] = msg["timestamp"].isoformat()
            conv["documents_count"] = await documents_collection.count_documents({"conversation_id": conv["conversation_id"]})
        return {"conversations": conversations}
    except Exception as e:
        logger.error(f"Error fetching conversations: {str(e)}")
        return {"conversations": []}

@app.get("/api/conversations/{conv_id}")
async def get_conversation(conv_id: str):
    """Fetch a single conversation with its history."""
    try:
        conv = await conversations_collection.find_one({"conversation_id": conv_id})
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        conv["_id"] = str(conv["_id"])
        if "created_at" in conv:
            conv["created_at"] = conv["created_at"].isoformat()
        if "messages" in conv:
            for msg in conv["messages"]:
                if "timestamp" in msg:
                    msg["timestamp"] = msg["timestamp"].isoformat()
        return conv
    except Exception as e:
        logger.error(f"Error fetching conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Main execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
