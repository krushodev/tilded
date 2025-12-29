import { AppDataSource } from '@/config/data-source';
import { Tag } from '@/entities/Tag';
import { In } from 'typeorm';

const tagRepo = AppDataSource.getRepository(Tag);

export const getTags = async (userId: string) => {
  return await tagRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
};

export const getTagById = async (userId: string, tagId: string) => {
  return await tagRepo.findOne({ where: { id: tagId, userId } });
};

export const createTag = async (userId: string, name: string, color?: string) => {
  const tag = tagRepo.create({ name, color, userId });
  return await tagRepo.save(tag);
};

export const updateTag = async (userId: string, tagId: string, data: Partial<Tag>) => {
  const tag = await tagRepo.findOneBy({ id: tagId, userId });
  if (!tag) throw new Error('Tag not found');

  Object.assign(tag, data);
  return await tagRepo.save(tag);
};

export const deleteTag = async (userId: string, tagId: string) => {
  const result = await tagRepo.delete({ id: tagId, userId });
  if (result.affected === 0) throw new Error('Tag not found');
  return true;
};

export const getTagsByIds = async (tagIds: string[], userId?: string) => {
  if (!tagIds || tagIds.length === 0) return [];
  const where: any = { id: In(tagIds) };
  if (userId) {
    where.userId = userId;
  }
  return await tagRepo.find({ where });
};

