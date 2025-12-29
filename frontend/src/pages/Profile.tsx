import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useCategoryStore } from '@/store/category.store';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';

type ViewType = 'today' | 'inbox' | 'upcoming' | null;

export default function Profile() {
  const { logout, token } = useAuthStore();
  const [, setLocation] = useLocation();
  const { categories, fetchCategories } = useCategoryStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [selectedView, setSelectedView] = useState<ViewType>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProjects();
    fetchTasks();
  }, [fetchCategories, fetchProjects, fetchTasks]);

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
    setSelectedProjectId(null);
  };

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    setSelectedView(null);
  };

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.isCompleted).length,
    totalProjects: projects.length,
    favoriteProjects: projects.filter(p => p.isFavorite).length,
    totalCategories: categories.length
  };

  return (
    <div className="flex h-screen bg-bg-secondary">
      <Sidebar
        selectedView={selectedView}
        selectedProjectId={selectedProjectId}
        onViewChange={handleViewChange}
        onProjectSelect={handleProjectSelect}
        onAddTaskClick={() => setLocation('/')}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto bg-bg">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <h1 className="text-3xl font-semibold mb-8 text-txt">Perfil</h1>

          <div className="space-y-6">
            <div className="bg-bg border border-silver/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-txt">Información del Usuario</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-2">
                    Email
                  </label>
                  <Input
                    value={token ? 'Usuario autenticado' : ''}
                    disabled
                    classNames={{
                      input: 'text-txt-light',
                      inputWrapper: 'bg-bg-secondary border-silver/30'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-bg border border-silver/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-txt">Estadísticas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
                  <div className="text-sm text-txt-muted">Total Tareas</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-500">{stats.completedTasks}</div>
                  <div className="text-sm text-txt-muted">Completadas</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{stats.totalProjects}</div>
                  <div className="text-sm text-txt-muted">Proyectos</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-500">{stats.favoriteProjects}</div>
                  <div className="text-sm text-txt-muted">Favoritos</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{stats.totalCategories}</div>
                  <div className="text-sm text-txt-muted">Categorías</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="danger"
                onClick={() => {
                  logout();
                  setLocation('/login');
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

