import { FastifyReply, FastifyRequest } from 'fastify';
import * as sectionService from '@/services/section.service';
import { Section } from '@/entities/Section';

export const getByProject = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    const sections = await sectionService.getSectionsByProject((req.params as { projectId: string }).projectId);
    return sections;
  } catch (e) {
    return reply.code(500).send({ message: 'Error fetching sections' });
  }
};

export const getById = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    const section = await sectionService.getSectionById((req.params as { id: string }).id);
    if (!section) {
      return reply.code(404).send({ message: 'Section not found' });
    }
    return section;
  } catch (e) {
    return reply.code(404).send({ message: 'Section not found' });
  }
};

export const create = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { name, projectId } = req.body as { name: string; projectId: string };
    const section = await sectionService.createSection(projectId, name);
    return reply.code(201).send(section);
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

export const update = async (req: FastifyRequest<{ Params: any; Body: any }>, reply: FastifyReply) => {
  try {
    const section = await sectionService.updateSection((req.params as { id: string }).id, req.body as Partial<Section>);
    return section;
  } catch (e: any) {
    return reply.code(400).send({ message: e.message || 'Section not found' });
  }
};

export const remove = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    await sectionService.deleteSection((req.params as { id: string }).id);
    return reply.code(204).send();
  } catch (e: any) {
    return reply.code(400).send({ message: e.message || 'Section not found' });
  }
};

export const reorder = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { projectId, sectionOrders } = req.body as { projectId: string; sectionOrders: { id: string; order: number }[] };
    const sections = await sectionService.reorderSections(projectId, sectionOrders);
    return sections;
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

