import { FastifyReply, FastifyRequest } from 'fastify';
import * as projectService from '@/services/project.service';
import { Project } from '@/entities/Project';

export const getAll = async (req: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
  const { isFavorite } = req.query as { isFavorite?: string };
  const favorite = isFavorite === 'true' ? true : isFavorite === 'false' ? false : undefined;
  const projects = await projectService.getProjects(req.user.id, favorite);
  return projects;
};

export const getById = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    const project = await projectService.getProjectById(req.user.id, (req.params as { id: string }).id);
    if (!project) {
      return reply.code(404).send({ message: 'Project not found' });
    }
    return project;
  } catch (e) {
    return reply.code(404).send({ message: 'Project not found' });
  }
};

export const create = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { name, color } = req.body as { name: string; color?: string };
    const project = await projectService.createProject(req.user.id, name, color);
    return reply.code(201).send(project);
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

export const update = async (req: FastifyRequest<{ Params: any; Body: any }>, reply: FastifyReply) => {
  try {
    const project = await projectService.updateProject(req.user.id, (req.params as { id: string }).id, req.body as Partial<Project>);
    return project;
  } catch (e: any) {
    return reply.code(400).send({ message: e.message || 'Project not found' });
  }
};

export const remove = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    await projectService.deleteProject(req.user.id, (req.params as { id: string }).id);
    return reply.code(204).send();
  } catch (e: any) {
    return reply.code(400).send({ message: e.message || 'Project not found' });
  }
};
