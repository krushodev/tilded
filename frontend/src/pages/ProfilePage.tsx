import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/user.store';
import { useProjectStore } from '@/store/project.store';
import { useTagStore } from '@/store/tag.store';
import { useAuthStore } from '@/store/auth.store';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@/i18n/languages';
import { 
  UserCircleIcon, 
  TagIcon,
  FolderIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToastContext } from '@/contexts/ToastContext';
import { Avatar } from '@/components/avatar/Avatar';
import { AvatarSelector } from '@/components/avatar/AvatarSelector';
import { Sidebar } from '@/components/sidebar/Sidebar';

type ViewType = 'today' | 'inbox' | 'upcoming' | null;

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { currentUser, fetchCurrentUser, updateCurrentUser } = useUserStore();
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const { tags, fetchTags, createTag, deleteTag } = useTagStore();
  const { logout } = useAuthStore();
  const { showToast, showConfirm } = useToastContext();
  const [, setLocation] = useLocation();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'labels' | 'projects'>('profile');
  const [name, setName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchProjects();
    fetchTags();
  }, [fetchCurrentUser, fetchProjects, fetchTags]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    try {
      await updateCurrentUser({ name });
      showToast('success', t('settings.profileUpdated'), t('settings.profileUpdatedSuccess'));
    } catch {
      showToast('error', t('common.error'), t('common.error'));
    }
  };

  const handleAvatarSelect = async (avatar: string) => {
    try {
      await updateCurrentUser({ avatar });
      showToast('success', t('settings.profileUpdated'), t('settings.profileUpdatedSuccess'));
      setShowAvatarSelector(false);
    } catch {
      showToast('error', t('common.error'), t('common.error'));
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    try {
      await createTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor('#3B82F6');
      fetchTags();
      showToast('success', t('settings.labelCreated'), t('settings.labelCreatedSuccess'));
    } catch {
      showToast('error', t('common.error'), t('common.error'));
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    showConfirm(
      t('settings.deleteLabel'),
      t('settings.deleteLabelConfirm'),
      async () => {
        await deleteTag(tagId);
        fetchTags();
        showToast('success', t('settings.labelDeleted'));
      }
    );
  };

  const handleDeleteProject = async (projectId: string) => {
    showConfirm(
      t('settings.deleteProject'),
      t('settings.deleteProjectConfirm'),
      async () => {
        await deleteProject(projectId);
        fetchProjects();
        showToast('success', t('settings.projectDeleted'));
      }
    );
  };

  const handleViewChange = (view: ViewType) => {
    // Navegar a la página principal con la vista seleccionada
    setLocation('/');
  };

  const handleProjectSelect = (projectId: string | null) => {
    // Navegar a la página principal con el proyecto seleccionado
    setLocation('/');
  };

  const handleAddTaskClick = () => {
    // Navegar a la página principal para agregar tarea
    setLocation('/');
  };

  return (
    <div className="flex h-screen bg-bg-secondary">
      <Sidebar
        selectedView={null}
        selectedProjectId={null}
        onViewChange={handleViewChange}
        onProjectSelect={handleProjectSelect}
        onAddTaskClick={handleAddTaskClick}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto bg-bg">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-txt mb-2">{t('settings.settings')}</h1>
            <p className="text-txt-muted">{t('settings.manageAccount')}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-silver/20 mb-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-primary'
                  : 'text-txt-muted hover:text-txt'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5" />
                <span>{t('settings.profile')}</span>
              </div>
              {activeTab === 'profile' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('labels')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'labels'
                  ? 'text-primary'
                  : 'text-txt-muted hover:text-txt'
              }`}
            >
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5" />
                <span>{t('settings.labels')}</span>
              </div>
              {activeTab === 'labels' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'projects'
                  ? 'text-primary'
                  : 'text-txt-muted hover:text-txt'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5" />
                <span>{t('settings.projects')}</span>
              </div>
              {activeTab === 'projects' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-bg-secondary border border-silver/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-txt mb-4">{t('settings.profileInformation')}</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Avatar
                        avatar={currentUser?.avatar}
                        userId={currentUser?.id}
                        name={currentUser?.name}
                        size="lg"
                      />
                      <button
                        onClick={() => setShowAvatarSelector(true)}
                        className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-lg hover:bg-primary-hover transition-colors"
                        title="Cambiar avatar"
                      >
                        <UserCircleIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-txt">{currentUser?.name || currentUser?.email}</p>
                      <p className="text-xs text-txt-muted">{currentUser?.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-txt mb-2">
                      {t('settings.email')}
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full px-3 py-2 rounded-lg border border-silver/30 bg-bg text-txt-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-txt-muted mt-1">
                      {t('settings.emailCannotChange')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-txt mb-2">
                      {t('settings.name')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('settings.yourName')}
                      className="w-full px-3 py-2 rounded-lg border border-silver/30 bg-bg text-txt placeholder:text-txt-muted focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleUpdateProfile} color="primary">
                      {t('settings.saveChanges')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'labels' && (
            <div className="space-y-6">
              {/* Create Label Form */}
              <div className="bg-bg-secondary border border-silver/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-txt mb-4">{t('settings.createNewLabel')}</h2>
                
                <form onSubmit={handleCreateTag} className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-txt mb-2">
                      {t('settings.labelName')}
                    </label>
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder={t('settings.labelName')}
                      className="w-full px-3 py-2 rounded-lg border border-silver/30 bg-bg text-txt placeholder:text-txt-muted focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-txt mb-2">
                      {t('settings.color')}
                    </label>
                    <div className="relative">
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div 
                        className="w-12 h-10 rounded-lg border border-silver/30 cursor-pointer transition-all hover:border-primary"
                        style={{ backgroundColor: newTagColor }}
                      />
                    </div>
                  </div>

                  <Button type="submit" color="primary">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    {t('settings.create')}
                  </Button>
                </form>
              </div>

              {/* Labels List */}
              <div className="bg-bg-secondary border border-silver/10 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-txt mb-4">{t('settings.yourLabels')}</h2>
                
                {tags.length === 0 ? (
                  <div className="text-center py-8 text-txt-muted">
                    <TagIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('settings.noLabels')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tags.map(tag => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-silver/10 hover:bg-bg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="text-txt">{tag.name}</span>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-red-500/10 text-red-500 transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-bg-secondary border border-silver/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-txt mb-4">{t('settings.yourProjects')}</h2>
              
              {projects.length === 0 ? (
                <div className="text-center py-12 text-txt-muted">
                  <FolderIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-base font-medium">{t('settings.noProjects')}</p>
                  <p className="text-sm mt-1">{t('settings.createFirstProject')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(project => (
                    <div
                      key={project.id}
                      className="relative p-5 rounded-lg border border-silver/10 bg-bg hover:bg-bg-secondary transition-all group hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FolderIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-txt text-lg">{project.name}</h3>
                            {project.description && (
                              <p className="text-xs text-txt-muted mt-0.5 line-clamp-2">{project.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-txt-muted">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{project.isFavorite ? t('settings.favorite') : t('settings.project')}</span>
                        </div>
                        {project.createdAt && (
                          <div>
                            {t('settings.created')} {new Date(project.createdAt).toLocaleDateString(getDateLocale(i18n.language), { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={currentUser?.avatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
}

