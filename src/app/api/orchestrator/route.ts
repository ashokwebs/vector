import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idea, projectName, conversation_id, stream } = body;

    if (!idea) {
      return NextResponse.json({ error: "Missing 'idea' in request body." }, { status: 400 });
    }

    const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://127.0.0.1:8000';
    
    // Default stream to true if not explicitly false
    const shouldStream = stream !== false;

    const mcpResponse = await fetch(`${MCP_SERVER_URL}/api/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: projectName || "boardroom",
        idea: idea,
        conversation_id: conversation_id || null,
        stream: shouldStream
      }),
    });

    if (!mcpResponse.ok) {
      const errText = await mcpResponse.text();
      throw new Error(`Backend error ${mcpResponse.status}: ${errText}`);
    }

    if (shouldStream) {
      // Forward the SSE stream directly to the client
      return new Response(mcpResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Return normal JSON response from the backend
      const data = await mcpResponse.json();
      return NextResponse.json(data);
    }

  } catch (error: any) {
    console.error("Orchestrator API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
