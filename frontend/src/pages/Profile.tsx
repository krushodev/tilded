import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useCategoryStore } from '@/store/category.store';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { Bars3Icon } from '@heroicons/react/24/outline';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      <Sidebar
        selectedView={selectedView}
        selectedProjectId={selectedProjectId}
        onViewChange={handleViewChange}
        onProjectSelect={handleProjectSelect}
        onAddTaskClick={() => setLocation('/')}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto bg-bg safe-area-inset-top safe-area-inset-bottom">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-50 bg-bg border-b border-silver/10 px-4 py-3 flex items-center justify-between safe-area-inset-top">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-bg-secondary transition-colors touch-manipulation"
            aria-label="Abrir menú"
          >
            <Bars3Icon className="w-6 h-6 text-txt" />
          </button>
          <h1 className="text-lg font-semibold text-txt truncate flex-1 text-center px-4">
            Perfil
          </h1>
          <div className="w-10" /> {/* Spacer para centrar el título */}
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-txt">Perfil</h1>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-bg border border-silver/30 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-txt">Información del Usuario</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-2">
                    Email
                  </label>
                  <Input
                    value={token ? 'Usuario autenticado' : ''}
                    disabled
                    classNames={{
                      input: 'text-txt-light text-sm sm:text-base',
                      inputWrapper: 'bg-bg-secondary border-silver/30'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-bg border border-silver/30 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-txt">Estadísticas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-bg-secondary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalTasks}</div>
                  <div className="text-xs sm:text-sm text-txt-muted">Total Tareas</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.completedTasks}</div>
                  <div className="text-xs sm:text-sm text-txt-muted">Completadas</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalProjects}</div>
                  <div className="text-xs sm:text-sm text-txt-muted">Proyectos</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.favoriteProjects}</div>
                  <div className="text-xs sm:text-sm text-txt-muted">Favoritos</div>
                </div>
                <div className="bg-bg-secondary rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalCategories}</div>
                  <div className="text-xs sm:text-sm text-txt-muted">Categorías</div>
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
                className="w-full sm:w-auto"
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

