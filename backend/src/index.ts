import '@/utils/reflect-init';
import fastify from 'fastify';
import { AppDataSource } from '@/config/data-source';
import jwtPlugin from '@/plugins/jwt';
import authRoutes from '@/routes/auth.routes';
import taskRoutes from '@/routes/task.routes';
import tagRoutes from '@/routes/tag.routes';
import projectRoutes from '@/routes/project.routes';
import categoryRoutes from '@/routes/category.routes';
import userRoutes from '@/routes/user.routes';
import sectionRoutes from '@/routes/section.routes';
import cors from '@fastify/cors';

const server = fastify({ logger: true });

server.register(jwtPlugin);

server.register(authRoutes, { prefix: '/api/auth' });
server.register(taskRoutes, { prefix: '/api/tasks' });
server.register(tagRoutes, { prefix: '/api/tags' });
server.register(projectRoutes, { prefix: '/api/projects' });
server.register(categoryRoutes, { prefix: '/api/categories' });
server.register(userRoutes, { prefix: '/api/users' });
server.register(sectionRoutes, { prefix: '/api/sections' });

server.register(cors, {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});

server.get('/ping', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log('📦 DB Connected');

    const port = Number(process.env.PORT) || 8080;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
