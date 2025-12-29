import { AppDataSource } from '@/config/data-source';
import { Task } from '@/entities/Task';
import * as tagService from '@/services/tag.service';
import * as projectService from '@/services/project.service';

const taskRepo = AppDataSource.getRepository(Task);

export const getTasks = async (userId: string, projectId?: string | null, dueDate?: Date | string) => {
  const queryBuilder = taskRepo.createQueryBuilder('task')
    .leftJoinAndSelect('task.tags', 'tags')
    .leftJoinAndSelect('task.project', 'project')
    .leftJoinAndSelect('task.section', 'section')
    .where('task.userId = :userId', { userId });

  if (projectId !== undefined) {
    if (projectId === null || projectId === 'null') {
      queryBuilder.andWhere('task.projectId IS NULL');
    } else {
      queryBuilder.andWhere('task.projectId = :projectId', { projectId });
    }
  }

  if (dueDate) {
    // Normalizar la fecha a string YYYY-MM-DD para comparar correctamente
    const dateStr = typeof dueDate === 'string' ? dueDate : dueDate.toISOString().split('T')[0];
    queryBuilder.andWhere('DATE(task.dueDate) = :date', { date: dateStr });
  }

  queryBuilder.orderBy('task.createdAt', 'DESC');

  return await queryBuilder.getMany();
};

export const createTask = async (userId: string, title: string, description?: string, projectId?: string, tagIds?: string[], dueDate?: Date | string | null, priority?: string | null, sectionId?: string | null) => {
  const task = taskRepo.create({
    title,
    description,
    userId,
    projectId,
    sectionId: sectionId || null,
    dueDate: dueDate ? (typeof dueDate === 'string' ? dueDate : new Date(dueDate)) : null,
    priority: priority || null
  });

  if (tagIds && tagIds.length > 0) {
    const tags = await tagService.getTagsByIds(tagIds, userId);
    task.tags = tags;
  }

  const savedTask = await taskRepo.save(task);
  return await taskRepo.findOne({
    where: { id: savedTask.id },
    relations: ['tags', 'project', 'section']
  });
};

export const updateTask = async (userId: string, taskId: string, data: Partial<Task> & { tagIds?: string[] }) => {
  const task = await taskRepo.findOne({
    where: { id: taskId, userId },
    relations: ['tags', 'project', 'section']
  });
  if (!task) throw new Error('Task not found');

  const { tagIds, ...taskData } = data;

  if (tagIds !== undefined) {
    if (tagIds.length === 0) {
      task.tags = [];
    } else {
      const tags = await tagService.getTagsByIds(tagIds, userId);
      task.tags = tags;
    }
  }

  Object.assign(task, taskData);
  const savedTask = await taskRepo.save(task);
  return await taskRepo.findOne({
    where: { id: savedTask.id },
    relations: ['tags', 'project', 'section']
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const result = await taskRepo.delete({ id: taskId, userId });
  if (result.affected === 0) throw new Error('Task not found');
  return true;
};
