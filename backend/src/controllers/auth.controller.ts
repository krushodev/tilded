import { FastifyReply, FastifyRequest } from 'fastify';
import * as authService from '@/services/auth.service';

export const register = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await authService.registerUser(email, password);
    return reply.code(201).send(user);
  } catch (error: any) {
    return reply.code(400).send({ message: error.message });
  }
};

export const login = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await authService.validateUser(email, password);
    const token = await reply.jwtSign({ id: user.id, email: user.email });
    return { token };
  } catch (error: any) {
    return reply.code(401).send({ message: error.message });
  }
};
