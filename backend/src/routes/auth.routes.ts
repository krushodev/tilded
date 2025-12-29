import { FastifyInstance } from 'fastify';
import * as authController from '@/controllers/auth.controller';

export default async function (fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        }
      }
    },
    authController.register
  );

  fastify.post('/login', authController.login);
}
