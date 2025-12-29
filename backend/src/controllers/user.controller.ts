import { FastifyReply, FastifyRequest } from 'fastify';
import * as userService from '@/services/user.service';

export const getMe = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }
    return user;
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

export const updateMe = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { name, avatar, language } = req.body as { name?: string; avatar?: string; language?: string };
    const user = await userService.updateUser(req.user.id, { name, avatar, language });
    return user;
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
};

