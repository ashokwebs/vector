import asyncio, os
os.environ.setdefault("GOOGLE_GENAI_USE_VERTEXAI", "False")
from dotenv import load_dotenv
load_dotenv()
from google.genai.types import Content, Part
from app.agent import app as adk_app
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.artifacts import InMemoryArtifactService

runner = Runner(
    app=adk_app,
    artifact_service=InMemoryArtifactService(),
    session_service=InMemorySessionService(),
)

async def main():
    sess = await runner.session_service.create_session(app_name=adk_app.name, user_id="test", session_id="dbg_001")
    print(f"Session created: {sess}")
    for event in runner.run(user_id="test", session_id="dbg_001", new_message=Content(role="user", parts=[Part.from_text(text="hello, who are you?")])):
        print("---EVENT---")
        print(f"  type: {type(event).__name__}")
        for attr in ['author', 'content', 'actions', 'error_code', 'error_message', 'interrupted', 'invocation_id', 'long_running_tool_ids', 'partial', 'server_content', 'usage_metadata', 'custom_metadata', 'id']:
            val = getattr(event, attr, 'N/A')
            if val != 'N/A' and val is not None:
                # Truncate long strings
                s = str(val)
                if len(s) > 200:
                    s = s[:200] + "..."
                print(f"  {attr}: {s}")

asyncio.run(main())
