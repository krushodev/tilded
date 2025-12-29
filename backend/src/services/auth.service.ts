import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/User';
import bcrypt from 'bcrypt';
import * as categoryService from '@/services/category.service';
import { generateDefaultAvatar } from '@/utils/avatar';

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (email: string, pass: string) => {
  const existing = await userRepository.findOneBy({ email });
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(pass, 10);
  const user = userRepository.create({ 
    email, 
    password: hashedPassword,
    language: 'en' // Idioma por defecto
  });
  await userRepository.save(user);

  // Generar avatar por defecto
  const defaultAvatar = generateDefaultAvatar(user.id);
  user.avatar = defaultAvatar;
  await userRepository.save(user);

  return { id: user.id, email: user.email };
};

export const validateUser = async (email: string, pass: string) => {
  const user = await userRepository.findOne({
    where: { email },
    select: ['id', 'email', 'password']
  });

  if (!user || !(await bcrypt.compare(pass, user.password))) {
    throw new Error('Invalid credentials');
  }
  return { id: user.id, email: user.email };
};
