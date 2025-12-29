import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/User';

const userRepository = AppDataSource.getRepository(User);

export const getUserById = async (userId: string) => {
  return await userRepository.findOne({ where: { id: userId } });
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  await userRepository.update(userId, data);
  return await getUserById(userId);
};

