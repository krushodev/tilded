import { FastifyInstance } from 'fastify';
import * as tagController from '@/controllers/tag.controller';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', tagController.getAll);
  fastify.get('/:id', tagController.getById);
  fastify.post('/', tagController.create);
  fastify.patch('/:id', tagController.update);
  fastify.delete('/:id', tagController.remove);
}

