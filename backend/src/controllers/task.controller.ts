import { FastifyReply, FastifyRequest } from 'fastify';
import * as taskService from '@/services/task.service';
import { Task } from '@/entities/Task';

export const getAll = async (req: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
  const { projectId, dueDate } = req.query as { projectId?: string; dueDate?: string };
  const parsedProjectId = projectId === 'null' ? null : projectId;
  const tasks = await taskService.getTasks(req.user.id, parsedProjectId, dueDate);
  return tasks;
};

export const create = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { title, description, projectId, tagIds, dueDate, priority, sectionId } = req.body as {
      title: string;
      description?: string;
      projectId?: string;
      tagIds?: string[];
      dueDate?: Date | string | null;
      priority?: string | null;
      sectionId?: string | null;
    };
    const task = await taskService.createTask(req.user.id, title, description, projectId, tagIds, dueDate, priority, sectionId);
    return reply.code(201).send(task);
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

export const update = async (req: FastifyRequest<{ Params: any; Body: any }>, reply: FastifyReply) => {
  try {
    const task = await taskService.updateTask(req.user.id, (req.params as { id: string }).id, req.body as Partial<Task> & { tagIds?: string[] });
    return task;
  } catch (e: any) {
    return reply.code(404).send({ message: e.message || 'Task not found' });
  }
};

export const remove = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    await taskService.deleteTask(req.user.id, (req.params as { id: string }).id);
    return reply.code(204).send();
  } catch (e: any) {
    return reply.code(404).send({ message: e.message || 'Task not found' });
  }
};
