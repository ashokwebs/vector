import type { ProjectMemoryEntry, MemoryCategory } from './types';
import { getDbPool } from '../db';
import { v4 as uuidv4 } from 'uuid';

export class MemoryService {
  /**
   * Add a new entry to the project memory.
   */
  async addEntry(params: Omit<ProjectMemoryEntry, 'id' | 'createdAt'>): Promise<ProjectMemoryEntry> {
    const entry: ProjectMemoryEntry = {
      ...params,
      id: uuidv4(),
      createdAt: Date.now(),
    };

    try {
      const pool = getDbPool();
      if (!pool) throw new Error("Database pool not initialized");

      await pool.query(
        `INSERT INTO project_memory 
         (id, project_id, category, agent_id, agent_name, title, content, created_at, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          entry.id, 
          entry.projectId, 
          entry.category, 
          entry.agentId || null, 
          entry.agentName || null, 
          entry.title, 
          entry.content, 
          new Date(entry.createdAt).toISOString(),
          entry.metadata ? JSON.stringify(entry.metadata) : null
        ]
      );
    } catch (e) {
      console.warn("Failed to persist memory entry to DB, falling back to in-memory/simulated", e);
    }
    
    return entry;
  }

  /**
   * Retrieve all memory entries for a project.
   */
  async getProjectMemory(projectId: string): Promise<ProjectMemoryEntry[]> {
    try {
      const pool = getDbPool();
      if (!pool) return [];

      const res = await pool.query(
        `SELECT * FROM project_memory WHERE project_id = $1 ORDER BY created_at ASC`,
        [projectId]
      );
      
      return res.rows.map(row => ({
        id: row.id,
        projectId: row.project_id,
        category: row.category as MemoryCategory,
        agentId: row.agent_id,
        agentName: row.agent_name,
        title: row.title,
        content: row.content,
        createdAt: new Date(row.created_at).getTime(),
        metadata: row.metadata,
      }));
    } catch (e) {
      console.warn("Failed to fetch memory from DB, returning empty array", e);
      return [];
    }
  }

  /**
   * Summarize the project context for the AI prompt.
   * Compiles mission, goals, and recent decisions into a text block.
   */
  async getContextPrompt(projectId: string): Promise<string> {
    const entries = await this.getProjectMemory(projectId);
    if (entries.length === 0) return "No prior project context.";

    const mission = entries.find(e => e.category === 'mission');
    const decisions = entries.filter(e => e.category === 'decision').slice(-5);
    const documents = entries.filter(e => e.category === 'document');

    let context = "--- PROJECT CONTEXT ---\n";
    if (mission) {
      context += `Mission: ${mission.content}\n\n`;
    }

    if (decisions.length > 0) {
      context += "Recent Decisions:\n";
      decisions.forEach(d => {
        context += `- [${d.agentName || 'System'}]: ${d.content}\n`;
      });
      context += "\n";
    }

    if (documents.length > 0) {
      context += "Generated Documents:\n";
      documents.forEach(d => {
        context += `- ${d.title}\n`;
      });
      context += "\n";
    }

    return context;
  }
}

export const memoryService = new MemoryService();
