import '@/utils/reflect-init';
import { DataSource } from 'typeorm';
import { User } from '@/entities/User';
import { Task } from '@/entities/Task';
import { Project } from '@/entities/Project';
import { Tag } from '@/entities/Tag';
import { Category } from '@/entities/Category';
import { Section } from '@/entities/Section';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  synchronize: true,
  logging: false,
  entities: [User, Task, Project, Tag, Category, Section],
  subscribers: [],
  migrations: []
});
