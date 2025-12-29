import { FastifyInstance } from 'fastify';
import * as userController from '@/controllers/user.controller';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/me', userController.getMe);
  fastify.patch('/me', userController.updateMe);
}

