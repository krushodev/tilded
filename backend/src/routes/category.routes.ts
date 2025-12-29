import { FastifyInstance } from 'fastify';
import * as categoryController from '@/controllers/category.controller';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', categoryController.getAll);
  fastify.get('/:id', categoryController.getById);
  fastify.post('/', categoryController.create);
  fastify.patch('/:id', categoryController.update);
  fastify.delete('/:id', categoryController.remove);
}

