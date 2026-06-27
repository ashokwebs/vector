import { v4 as uuidv4 } from 'uuid';
import type { TaskAssignment, TaskPriority, TaskStatus } from '../agents/types';

export class TaskGraph {
  tasks: Map<string, TaskAssignment> = new Map();
  
  createTask(
    projectId: string,
    agentId: string,
    agentName: string,
    taskDesc: string,
    dependencies: string[] = [],
    priority: TaskPriority = 'medium'
  ): TaskAssignment {
    const task: TaskAssignment = {
      id: uuidv4(),
      projectId,
      agentId,
      agentName,
      task: taskDesc,
      priority,
      status: 'pending',
      dependencies,
      createdAt: Date.now(),
    };
    
    this.tasks.set(task.id, task);
    return task;
  }

  updateTaskStatus(taskId: string, status: TaskStatus, output?: string) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    
    task.status = status;
    if (output) task.output = output;
    if (status === 'completed' || status === 'failed') {
      task.completedAt = Date.now();
    }
  }

  getExecutableTasks(): TaskAssignment[] {
    return Array.from(this.tasks.values()).filter(t => 
      t.status === 'pending' && 
      t.dependencies.every(depId => this.tasks.get(depId)?.status === 'completed')
    );
  }

  getProjectTasks(projectId: string): TaskAssignment[] {
    return Array.from(this.tasks.values()).filter(t => t.projectId === projectId);
  }
}

// Global instance for now; in a full real system this might be backed by Redis or PG completely.
export const globalTaskGraph = new TaskGraph();
