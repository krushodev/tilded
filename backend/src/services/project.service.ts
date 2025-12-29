import { AppDataSource } from '@/config/data-source';
import { Project } from '@/entities/Project';

const projectRepo = AppDataSource.getRepository(Project);

export const getProjects = async (userId: string, isFavorite?: boolean) => {
  const where: any = { userId };
  if (isFavorite !== undefined) {
    where.isFavorite = isFavorite;
  }
  return await projectRepo.find({
    where,
    relations: ['tasks', 'sections'],
    order: { createdAt: 'DESC' }
  });
};

export const getProjectById = async (userId: string, projectId: string) => {
  return await projectRepo.findOne({
    where: { id: projectId, userId },
    relations: ['tasks', 'sections']
  });
};

export const createProject = async (userId: string, name: string, color?: string) => {
  const project = projectRepo.create({ name, color, userId });
  return await projectRepo.save(project);
};

export const updateProject = async (userId: string, projectId: string, data: Partial<Project>) => {
  const project = await projectRepo.findOneBy({ id: projectId, userId });
  if (!project) throw new Error('Project not found');

  Object.assign(project, data);
  return await projectRepo.save(project);
};

export const deleteProject = async (userId: string, projectId: string) => {
  const result = await projectRepo.delete({ id: projectId, userId });
  if (result.affected === 0) throw new Error('Project not found');
  return true;
};
