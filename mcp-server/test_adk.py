import asyncio
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
    await runner.session_service.create_session(app_name=adk_app.name, user_id="test", session_id="123")
    for event in runner.run(user_id="test", session_id="123", new_message=Content(role="user", parts=[Part.from_text(text="hello")])):
        print("EVENT TYPE:", type(event))
        print("EVENT ATTRS:", dir(event))
        if hasattr(event, "message"):
            print("MESSAGE:", event.message)
        if hasattr(event, "content"):
            print("CONTENT:", event.content)

asyncio.run(main())
