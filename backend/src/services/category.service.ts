import { AppDataSource } from '@/config/data-source';
import { Category } from '@/entities/Category';

const categoryRepo = AppDataSource.getRepository(Category);

export const getCategories = async (userId: string) => {
  return await categoryRepo.find({
    where: { userId },
    order: { createdAt: 'DESC' }
  });
};

export const getCategoryById = async (userId: string, categoryId: string) => {
  return await categoryRepo.findOne({
    where: { id: categoryId, userId }
  });
};

export const createCategory = async (userId: string, name: string, color?: string) => {
  const category = categoryRepo.create({ name, color, userId, isDefault: false });
  return await categoryRepo.save(category);
};

export const updateCategory = async (userId: string, categoryId: string, data: Partial<Category>) => {
  const category = await categoryRepo.findOneBy({ id: categoryId, userId });
  if (!category) throw new Error('Category not found');

  if (category.isDefault && data.isDefault === false) {
    throw new Error('Cannot modify default category');
  }

  if (data.isDefault !== undefined && !category.isDefault) {
    throw new Error('Cannot set isDefault on non-default categories');
  }

  Object.assign(category, data);
  return await categoryRepo.save(category);
};

export const deleteCategory = async (userId: string, categoryId: string) => {
  const category = await categoryRepo.findOneBy({ id: categoryId, userId });
  if (!category) throw new Error('Category not found');

  if (category.isDefault) {
    throw new Error('Cannot delete default category');
  }

  const result = await categoryRepo.delete({ id: categoryId, userId });
  if (result.affected === 0) throw new Error('Category not found');
  return true;
};

export const createDefaultCategory = async (userId: string) => {
  const existing = await categoryRepo.findOne({ where: { userId, isDefault: true } });
  if (existing) return existing;

  const category = categoryRepo.create({
    name: 'Favoritos',
    userId,
    isDefault: true,
    color: '#dc4c3e'
  });
  return await categoryRepo.save(category);
};

export const getDefaultCategory = async (userId: string) => {
  return await categoryRepo.findOne({ where: { userId, isDefault: true } });
};

