// Type definitions for the application

export interface User {
  id: string;
  email: string;
}

export interface Section {
  id: string;
  name: string;
  order: number;
  projectId: string;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
  isFavorite: boolean;
  userId: string;
  tasks?: Task[];
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  isDefault: boolean;
  userId: string;
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string | null;
  priority?: string | null;
  userId: string;
  projectId?: string;
  sectionId?: string | null;
  project?: Project;
  section?: Section | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
}
