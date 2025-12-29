import { FastifyInstance } from 'fastify';
import * as projectController from '@/controllers/project.controller';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', projectController.getAll);
  fastify.get('/:id', projectController.getById);
  fastify.post('/', projectController.create);
  fastify.patch('/:id', projectController.update);
  fastify.delete('/:id', projectController.remove);
}

