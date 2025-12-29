import { useState } from 'react';
import { HashtagIcon, PlusIcon, TrashIcon, StarIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { IconButton } from '@/components/ui/IconButton';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { useToastContext } from '@/contexts/ToastContext';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
}

export const ProjectList = ({
  projects,
  selectedProjectId,
  onProjectSelect
}: ProjectListProps) => {
  const { createProject, updateProject, deleteProject, toggleFavorite, fetchProjects } = useProjectStore();
  const { tasks } = useTaskStore();
  const { showConfirm } = useToastContext();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await createProject(newProjectName.trim());
    setNewProjectName('');
    setShowNewProjectForm(false);
    fetchProjects();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSubmit = async (data: { name: string }) => {
    if (editingProject) {
      await updateProject(editingProject.id, { name: data.name });
    } else {
      await createProject(data.name);
    }
    setIsModalOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    showConfirm(
      'Eliminar proyecto',
      '¿Estás seguro de eliminar este proyecto?',
      async () => {
        await deleteProject(projectId);
        fetchProjects();
      }
    );
  };

  const handleToggleFavorite = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    await toggleFavorite(projectId);
    fetchProjects();
  };

  const getTaskCount = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId).length;
  };

  return (
    <div className="space-y-1">
      {projects.map(project => {
        const taskCount = getTaskCount(project.id);
        return (
          <div key={project.id} className="group flex items-center gap-1">
            <button
              onClick={() => onProjectSelect(project.id)}
              className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors text-left ${
                selectedProjectId === project.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
              }`}
            >
              <HashtagIcon className="w-4 h-4 text-primary" />
              <span className="flex-1">{project.name}</span>
              {taskCount > 0 && (
                <span className="text-xs text-txt-muted">{taskCount}</span>
              )}
            </button>
            <button
              onClick={(e) => handleToggleFavorite(e, project.id)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-silver/10 rounded transition-all"
            >
              {project.isFavorite ? (
                <StarIconSolid className="w-4 h-4 text-primary" />
              ) : (
                <StarIcon className="w-4 h-4 text-txt-muted" />
              )}
            </button>
            <IconButton
              icon={<PencilIcon className="w-3 h-3" />}
              variant="ghost"
              size="sm"
              onClick={() => handleEditProject(project)}
              className="opacity-0 group-hover:opacity-100"
            />
            <IconButton
              icon={<TrashIcon className="w-3 h-3" />}
              variant="danger"
              size="sm"
              onClick={() => handleDeleteProject(project.id)}
              className="opacity-0 group-hover:opacity-100"
            />
          </div>
        );
      })}
      
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleProjectSubmit}
        project={editingProject}
      />
    </div>
  );
};

