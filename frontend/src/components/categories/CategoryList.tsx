import { FolderIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCategoryStore } from '@/store/category.store';
import { useProjectStore } from '@/store/project.store';
import { IconButton } from '@/components/ui/IconButton';
import { useToastContext } from '@/contexts/ToastContext';
import type { Category } from '@/types';
import { useState, useEffect } from 'react';

interface CategoryListProps {
  onSelectProject?: (projectId: string) => void;
}

export const CategoryList = ({ onSelectProject }: CategoryListProps) => {
  const { categories, selectedCategoryId, setSelectedCategory, fetchCategories, createCategory, deleteCategory } = useCategoryStore();
  const { projects, fetchProjects, selectedProjectId, setSelectedProject, createProject, deleteProject } = useProjectStore();
  const { showConfirm } = useToastContext();
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0 && expandedCategories.size === 0) {
      const defaultCategory = categories.find(c => c.isDefault);
      if (defaultCategory) {
        setExpandedCategories(new Set([defaultCategory.id]));
        setSelectedCategory(defaultCategory.id);
        fetchProjects(defaultCategory.id);
      }
    }
  }, [categories, expandedCategories.size, setSelectedCategory, fetchProjects]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
      if (selectedCategoryId !== categoryId) {
        setSelectedCategory(categoryId);
        fetchProjects(categoryId);
      }
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await createCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowNewCategoryForm(false);
    fetchCategories();
  };

  const handleCreateProject = async (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await createProject(categoryId, newProjectName.trim());
    setNewProjectName('');
    setShowNewProjectForm(null);
    fetchProjects(categoryId);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    showConfirm(
      'Eliminar categoría',
      '¿Estás seguro de eliminar esta categoría? Se eliminarán todos los proyectos dentro.',
      async () => {
        await deleteCategory(categoryId);
        fetchCategories();
      }
    );
  };

  const handleDeleteProject = async (projectId: string, categoryId: string) => {
    showConfirm(
      'Eliminar proyecto',
      '¿Estás seguro de eliminar este proyecto? Se eliminarán todas las tareas dentro.',
      async () => {
        await deleteProject(projectId);
        fetchProjects(categoryId);
      }
    );
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    onSelectProject?.(projectId);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-txt-secondary text-xs font-semibold uppercase tracking-wider px-3">
          Categorías
        </div>
        <IconButton
          icon={<PlusIcon className="w-4 h-4" />}
          variant="ghost"
          size="sm"
          onClick={() => setShowNewCategoryForm(true)}
        />
      </div>

      {showNewCategoryForm && (
        <form onSubmit={handleCreateCategory} className="px-3 mb-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Nueva categoría..."
            className="w-full px-2 py-1 text-sm rounded border border-silver/30 bg-bg-dark text-txt-light placeholder:text-txt-muted focus:outline-none focus:border-primary"
            autoFocus
            onBlur={() => {
              if (!newCategoryName.trim()) setShowNewCategoryForm(false);
            }}
          />
        </form>
      )}

      <div className="space-y-1">
        {categories.map((category: Category) => {
          const isExpanded = expandedCategories.has(category.id);
          const categoryProjects = projects.filter(p => p.categoryId === category.id);

          return (
            <div key={category.id}>
              <div className="group flex items-center gap-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-silver/10 text-txt-secondary'
                  }`}
                >
                  <FolderIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium">{category.name}</span>
                  {categoryProjects.length > 0 && (
                    <span className="text-xs text-txt-muted">{categoryProjects.length}</span>
                  )}
                </button>
                {!category.isDefault && (
                  <IconButton
                    icon={<TrashIcon className="w-3 h-3" />}
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="opacity-0 group-hover:opacity-100"
                  />
                )}
              </div>

              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {categoryProjects.map(project => (
                    <div
                      key={project.id}
                      className="group flex items-center gap-1"
                    >
                      <button
                        onClick={() => handleSelectProject(project.id)}
                        className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors text-left ${
                          selectedProjectId === project.id
                            ? 'bg-primary/20 text-primary font-medium'
                            : 'text-txt-secondary hover:bg-silver/5'
                        }`}
                      >
                        {project.name}
                      </button>
                      <IconButton
                        icon={<TrashIcon className="w-3 h-3" />}
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id, category.id)}
                        className="opacity-0 group-hover:opacity-100"
                      />
                    </div>
                  ))}
                  <div className="px-3">
                    {showNewProjectForm === category.id ? (
                      <form
                        onSubmit={e => handleCreateProject(e, category.id)}
                        className="flex items-center gap-1"
                      >
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={e => setNewProjectName(e.target.value)}
                          placeholder="Nuevo proyecto..."
                          className="flex-1 px-2 py-1 text-xs rounded border border-silver/30 bg-bg text-txt focus:outline-none focus:border-primary"
                          autoFocus
                          onBlur={() => {
                            if (!newProjectName.trim()) setShowNewProjectForm(null);
                          }}
                        />
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setShowNewProjectForm(category.id);
                          setNewProjectName('');
                        }}
                        className="w-full px-2 py-1 text-xs text-txt-muted hover:text-primary hover:bg-silver/5 rounded transition-colors flex items-center gap-1"
                      >
                        <PlusIcon className="w-3 h-3" />
                        <span>Nuevo proyecto</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

