import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const backendUrl = process.env.MCP_SERVER_URL || 'http://127.0.0.1:8000';
  const { id } = await params;

  try {
    const body = await request.json();
    const response = await fetch(`${backendUrl}/api/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying document update for ${id} from MCP server:`, error);
    return NextResponse.json({ error: `Failed to update document ${id} on backend.` }, { status: 500 });
  }
}
