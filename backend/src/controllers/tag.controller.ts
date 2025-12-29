import { FastifyReply, FastifyRequest } from 'fastify';
import * as tagService from '@/services/tag.service';
import { Tag } from '@/entities/Tag';

export const getAll = async (req: FastifyRequest, reply: FastifyReply) => {
  const tags = await tagService.getTags(req.user.id);
  return tags;
};

export const getById = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    const tag = await tagService.getTagById(req.user.id, (req.params as { id: string }).id);
    if (!tag) {
      return reply.code(404).send({ message: 'Tag not found' });
    }
    return tag;
  } catch (e) {
    return reply.code(404).send({ message: 'Tag not found' });
  }
};

export const create = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { name, color } = req.body as { name: string; color?: string };
    const tag = await tagService.createTag(req.user.id, name, color);
    return reply.code(201).send(tag);
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

export const update = async (req: FastifyRequest<{ Params: any; Body: any }>, reply: FastifyReply) => {
  try {
    const tag = await tagService.updateTag(req.user.id, (req.params as { id: string }).id, req.body as Partial<Tag>);
    return tag;
  } catch (e: any) {
    return reply.code(404).send({ message: e.message || 'Tag not found' });
  }
};

export const remove = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    await tagService.deleteTag(req.user.id, (req.params as { id: string }).id);
    return reply.code(204).send();
  } catch (e: any) {
    return reply.code(404).send({ message: e.message || 'Tag not found' });
  }
};

