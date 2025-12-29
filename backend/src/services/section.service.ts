import { AppDataSource } from '@/config/data-source';
import { Section } from '@/entities/Section';

const sectionRepo = AppDataSource.getRepository(Section);

export const getSectionsByProject = async (projectId: string) => {
  const sections = await sectionRepo.find({
    where: { projectId },
    relations: ['tasks', 'tasks.tags', 'tasks.project'],
    order: { order: 'ASC' }
  });

  // Ordenar las tareas dentro de cada sección por fecha de creación
  sections.forEach(section => {
    if (section.tasks) {
      section.tasks.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    }
  });

  return sections;
};

export const getSectionById = async (sectionId: string) => {
  return await sectionRepo.findOne({
    where: { id: sectionId },
    relations: ['tasks', 'tasks.tags']
  });
};

export const createSection = async (projectId: string, name: string) => {
  const maxOrder = await sectionRepo
    .createQueryBuilder('section')
    .select('MAX(section.order)', 'max')
    .where('section.projectId = :projectId', { projectId })
    .getRawOne();

  const section = sectionRepo.create({
    name,
    projectId,
    order: (maxOrder?.max ?? -1) + 1
  });

  return await sectionRepo.save(section);
};

export const updateSection = async (sectionId: string, data: Partial<Section>) => {
  const section = await sectionRepo.findOneBy({ id: sectionId });
  if (!section) throw new Error('Section not found');

  Object.assign(section, data);
  return await sectionRepo.save(section);
};

export const deleteSection = async (sectionId: string) => {
  const result = await sectionRepo.delete({ id: sectionId });
  if (result.affected === 0) throw new Error('Section not found');
  return true;
};

export const reorderSections = async (projectId: string, sectionOrders: { id: string; order: number }[]) => {
  const sections = await sectionRepo.find({ where: { projectId } });
  
  for (const sectionOrder of sectionOrders) {
    const section = sections.find(s => s.id === sectionOrder.id);
    if (section) {
      section.order = sectionOrder.order;
      await sectionRepo.save(section);
    }
  }

  return await getSectionsByProject(projectId);
};

