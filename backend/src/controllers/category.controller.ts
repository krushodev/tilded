import { FastifyReply, FastifyRequest } from 'fastify';
import * as categoryService from '@/services/category.service';
import { Category } from '@/entities/Category';

export const getAll = async (req: FastifyRequest, reply: FastifyReply) => {
  const categories = await categoryService.getCategories(req.user.id);
  return categories;
};

export const getById = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    const category = await categoryService.getCategoryById(req.user.id, (req.params as { id: string }).id);
    if (!category) {
      return reply.code(404).send({ message: 'Category not found' });
    }
    return category;
  } catch (e) {
    return reply.code(404).send({ message: 'Category not found' });
  }
};

export const create = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { name, color } = req.body as { name: string; color?: string };
    const category = await categoryService.createCategory(req.user.id, name, color);
    return reply.code(201).send(category);
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

export const update = async (req: FastifyRequest<{ Params: any; Body: any }>, reply: FastifyReply) => {
  try {
    const category = await categoryService.updateCategory(req.user.id, (req.params as { id: string }).id, req.body as Partial<Category>);
    return category;
  } catch (e: any) {
    return reply.code(400).send({ message: e.message || 'Category not found' });
  }
};

export const remove = async (req: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
  try {
    await categoryService.deleteCategory(req.user.id, (req.params as { id: string }).id);
    return reply.code(204).send();
  } catch (e: any) {
    return reply.code(400).send({ message: e.message || 'Category not found' });
  }
};

