import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { useCategoryStore } from '@/store/category.store';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  CalendarIcon,
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  HashtagIcon,
  ChevronDownIcon,
  BellIcon,
  Squares2X2Icon,
  StarIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { ProjectList } from './ProjectList';
import { CreateProjectButton } from './CreateProjectButton';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { Avatar } from '@/components/avatar/Avatar';

type ViewType = 'today' | 'inbox' | 'upcoming' | null;

interface SidebarProps {
  selectedView: ViewType;
  selectedProjectId: string | null;
  onViewChange: (view: ViewType) => void;
  onProjectSelect: (projectId: string | null) => void;
  onAddTaskClick: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({
  selectedView,
  selectedProjectId,
  onViewChange,
  onProjectSelect,
  onAddTaskClick,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) => {
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategoryStore();
  const { projects, fetchProjects, toggleFavorite } = useProjectStore();
  const { tasks } = useTaskStore();
  const { logout } = useAuthStore();
  const { currentUser, fetchCurrentUser } = useUserStore();
  const [, setLocation] = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProjects();
    fetchCurrentUser();
  }, [fetchCategories, fetchProjects, fetchCurrentUser]);

  const favoriteProjects = projects.filter(p => p.isFavorite);
  const otherCategories = categories.filter(c => !c.isDefault);

  const getTaskCount = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId).length;
  };

  const handleToggleFavorite = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    await toggleFavorite(projectId);
    fetchProjects();
  };

  return (
    <div className="relative flex h-screen">
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-bg-dark text-txt-light flex flex-col h-screen transition-all duration-300 overflow-hidden border-r border-silver/10`}>
      {/* Header con toggle */}
      <div className="p-3 border-b border-silver/10 flex items-center justify-between">
        {!isCollapsed && (
          <button
            onClick={() => setLocation('/settings')}
            className="flex items-center gap-2 flex-1 hover:bg-silver/5 rounded px-2 py-1 transition-colors"
          >
            <Avatar
              avatar={currentUser?.avatar}
              userId={currentUser?.id}
              name={currentUser?.name}
              size="sm"
            />
            <span className="text-sm font-medium text-txt-light truncate">
              {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}
            </span>
          </button>
        )}
        {isCollapsed && (
          <button
            onClick={() => setLocation('/settings')}
            className="flex items-center justify-center hover:bg-silver/5 rounded p-1 transition-colors"
          >
            <Avatar
              avatar={currentUser?.avatar}
              userId={currentUser?.id}
              name={currentUser?.name}
              size="sm"
              className="flex-shrink-0"
            />
          </button>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-silver/10 rounded transition-colors flex-shrink-0"
            title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-txt-muted" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-txt-muted" />
            )}
          </button>
        )}
      </div>

      {/* Botón Add Task */}
      <div className="p-2 border-b border-silver/10">
        <button
          onClick={onAddTaskClick}
          className={`w-full bg-primary hover:bg-primary-hover text-txt-light font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${isCollapsed ? 'px-2' : ''}`}
          title={isCollapsed ? t('sidebar.addTask') : undefined}
        >
          <PlusIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{t('sidebar.addTask')}</span>}
        </button>
      </div>

      {/* Navegación rápida */}
      <div className="p-2 border-b border-silver/10">
        <nav className="space-y-1">
          <button
            onClick={() => onViewChange('inbox')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg transition-colors text-sm ${
              selectedView === 'inbox'
                ? 'bg-primary/20 text-primary'
                : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
            }`}
            title={isCollapsed ? t('sidebar.inbox') : undefined}
          >
            <InboxIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{t('sidebar.inbox')}</span>}
          </button>

          <button
            onClick={() => onViewChange('today')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg transition-colors text-sm ${
              selectedView === 'today'
                ? 'bg-primary/20 text-primary'
                : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
            }`}
            title={isCollapsed ? t('sidebar.today') : undefined}
          >
            <CalendarIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{t('sidebar.today')}</span>}
          </button>

          <button
            onClick={() => onViewChange('upcoming')}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg transition-colors text-sm ${
              selectedView === 'upcoming'
                ? 'bg-primary/20 text-primary'
                : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
            }`}
            title={isCollapsed ? t('sidebar.upcoming') : undefined}
          >
            <CalendarDaysIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{t('sidebar.upcoming')}</span>}
          </button>
        </nav>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Favorites */}
        {!isCollapsed && (
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-txt-muted uppercase tracking-wider">
              {t('sidebar.favorites')}
            </div>
            {favoriteProjects.length > 0 ? (
              <div className="space-y-1">
                {favoriteProjects.map(project => {
                  const taskCount = getTaskCount(project.id);
                  return (
                    <div
                      key={project.id}
                      className="group flex items-center gap-1"
                    >
                      <button
                        onClick={() => {
                          onProjectSelect(project.id);
                        }}
                        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm text-left ${
                          selectedProjectId === project.id && selectedView === null
                            ? 'bg-primary/20 text-primary'
                            : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
                        }`}
                      >
                        <HashtagIcon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="flex-1 truncate">{project.name}</span>
                        {taskCount > 0 && (
                          <span className="text-xs text-txt-muted">{taskCount}</span>
                        )}
                      </button>
                      <button
                        onClick={(e) => handleToggleFavorite(e, project.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-silver/10 rounded transition-all"
                      >
                        <StarIconSolid className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-3 py-2 text-xs text-txt-muted">
                {t('sidebar.noFavorites')}
              </div>
            )}
          </div>
        )}

        {/* Favorites colapsado - solo iconos */}
        {isCollapsed && favoriteProjects.length > 0 && (
          <div className="p-2 space-y-1">
            {favoriteProjects.map(project => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectSelect(project.id);
                }}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                  selectedProjectId === project.id && selectedView === null
                    ? 'bg-primary/20 text-primary'
                    : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
                }`}
                title={project.name}
              >
                <HashtagIcon className="w-5 h-5" />
              </button>
            ))}
          </div>
        )}

        {/* My Projects */}
        {!isCollapsed && (
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-xs font-semibold text-txt-muted uppercase tracking-wider">
                {t('sidebar.myProjects')}
              </div>
              <CreateProjectButton />
            </div>
            <ProjectList
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={(projectId) => {
                onProjectSelect(projectId);
              }}
            />
          </div>
        )}

        {/* My Projects colapsado - solo iconos */}
        {isCollapsed && (
          <div className="p-2 space-y-1">
            {projects.slice(0, 5).map(project => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectSelect(project.id);
                }}
                className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                  selectedProjectId === project.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-txt-muted hover:bg-silver/10 hover:text-txt-light'
                }`}
                title={project.name}
              >
                <HashtagIcon className="w-5 h-5" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer con selector de idioma y logout */}
      <div className="p-2 border-t border-silver/10 space-y-1">
        <LanguageSelector isCollapsed={isCollapsed} />
        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 rounded-lg text-sm text-txt-muted hover:bg-silver/10 hover:text-txt-light transition-colors`}
          title={isCollapsed ? t('common.logout') : undefined}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{t('common.logout')}</span>}
        </button>
      </div>
      </aside>
    </div>
  );
};

