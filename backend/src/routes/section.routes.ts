import { FastifyInstance } from 'fastify';
import * as sectionController from '@/controllers/section.controller';

export default async function sectionRoutes(server: FastifyInstance) {
  server.get('/project/:projectId', {
    onRequest: [server.authenticate]
  }, sectionController.getByProject);

  server.get('/:id', {
    onRequest: [server.authenticate]
  }, sectionController.getById);

  server.post('/', {
    onRequest: [server.authenticate]
  }, sectionController.create);

  server.patch('/:id', {
    onRequest: [server.authenticate]
  }, sectionController.update);

  server.delete('/:id', {
    onRequest: [server.authenticate]
  }, sectionController.remove);

  server.post('/reorder', {
    onRequest: [server.authenticate]
  }, sectionController.reorder);
}

