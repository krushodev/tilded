import { FastifyInstance } from 'fastify';
import * as taskController from '@/controllers/task.controller';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', taskController.getAll);
  fastify.post('/', taskController.create);
  fastify.patch('/:id', taskController.update);
  fastify.delete('/:id', taskController.remove);
}
