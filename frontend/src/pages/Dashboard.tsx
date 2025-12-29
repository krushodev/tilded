import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/task.store';
import type { Task } from '@/types';
import { useCategoryStore } from '@/store/category.store';
import { useProjectStore } from '@/store/project.store';
import { useSectionStore } from '@/store/section.store';
import { PlusIcon, EyeIcon, EyeSlashIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { QuickTaskInput } from '@/components/tasks/QuickTaskInput';
import { UpcomingView } from '@/components/calendar/UpcomingView';
import { SectionListView } from '@/components/projects/SectionListView';
import { SectionBoardView } from '@/components/projects/SectionBoardView';
import { useDisclosure } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type ViewType = 'today' | 'inbox' | 'upcoming' | null;
type DisplayMode = 'list' | 'board';

export default function Dashboard() {
  const { t } = useTranslation();
  const { tasks, fetchTasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { projects, fetchProjects, selectedProjectId, setSelectedProject } = useProjectStore();
  const { sections, fetchSections, addSection } = useSectionStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [selectedView, setSelectedView] = useState<ViewType>('today');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [projectNameValue, setProjectNameValue] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) : null;

  useEffect(() => {
    // Prioridad: si hay proyecto seleccionado, mostrar sus tareas
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    } else if (selectedView === 'inbox') {
      fetchTasks(null);
    } else if (selectedView === 'today') {
      const today = new Date().toISOString().split('T')[0];
      fetchTasks(undefined, today);
    } else if (selectedView === 'upcoming') {
      fetchTasks();
    } else if (selectedView === null && !selectedProjectId) {
      // Si no hay vista ni proyecto, mostrar todas las tareas
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedView, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId && selectedProject) {
      setProjectNameValue(selectedProject.name);
      setEditingProjectName(false);
      fetchSections(selectedProjectId);
    }
  }, [selectedProjectId, selectedProject, fetchSections]);

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
    setSelectedProject(null);
  };

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId);
    setSelectedView(null);
    // Cargar tareas inmediatamente cuando se selecciona un proyecto
    if (projectId) {
      fetchTasks(projectId);
    }
  };

  const handleAddTaskClick = () => {
    onOpen();
  };

  const handleTaskSubmit = async (data: {
    title: string;
    description?: string;
    projectId?: string | null;
    sectionId?: string | null;
    dueDate?: string | null;
    priority?: string | null;
    tagIds?: string[];
  }) => {
    const { updateTask } = useTaskStore.getState();
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await addTask(
        data.title,
        data.projectId || undefined,
        data.description,
        data.tagIds,
        data.dueDate,
        data.priority,
        data.sectionId || undefined
      );
    }
    onClose();
    
    // Refrescar según el contexto
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
      fetchSections(selectedProjectId);
    } else if (selectedView) {
      if (selectedView === 'inbox') {
        fetchTasks(null);
      } else if (selectedView === 'today') {
        const today = new Date().toISOString().split('T')[0];
        fetchTasks(undefined, today);
      }
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    onOpen();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Filtrar tareas según el estado de completado
  const displayedTasks = showCompleted 
    ? tasks 
    : tasks.filter(task => !task.isCompleted);

  const completedCount = tasks.filter(task => task.isCompleted).length;

  const handleProjectNameSubmit = async () => {
    if (selectedProject && projectNameValue.trim()) {
      await useProjectStore.getState().updateProject(selectedProject.id, { name: projectNameValue.trim() });
      setEditingProjectName(false);
      fetchProjects();
    }
  };

  const handleProjectNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleProjectNameSubmit();
    } else if (e.key === 'Escape') {
      setEditingProjectName(false);
      setProjectNameValue(selectedProject?.name || '');
    }
  };

  const handleAddSection = async () => {
    if (newSectionName.trim() && selectedProjectId) {
      await addSection(selectedProjectId, newSectionName.trim());
      setNewSectionName('');
      setShowAddSection(false);
      await fetchSections(selectedProjectId);
    }
  };

  const getViewTitle = () => {
    // Si hay un proyecto seleccionado, siempre mostrar su nombre (editable)
    if (selectedProjectId && selectedProject) {
      if (editingProjectName) {
        return (
          <input
            type="text"
            value={projectNameValue}
            onChange={e => setProjectNameValue(e.target.value)}
            onBlur={handleProjectNameSubmit}
            onKeyDown={handleProjectNameKeyDown}
            className="bg-transparent border-b-2 border-primary focus:outline-none text-3xl font-semibold text-txt w-full"
            autoFocus
          />
        );
      }
      return (
        <input
          type="text"
          value={selectedProject.name}
          onClick={() => {
            setEditingProjectName(true);
            setProjectNameValue(selectedProject.name);
          }}
          onFocus={() => {
            setEditingProjectName(true);
            setProjectNameValue(selectedProject.name);
          }}
          readOnly
          className="bg-transparent border-b-2 border-transparent hover:border-primary/30 focus:border-primary focus:outline-none text-3xl font-semibold text-txt cursor-text transition-colors w-full"
        />
      );
    }
    // Si no hay proyecto, mostrar la vista seleccionada (no editable)
    if (selectedView === 'today') return <span className="text-3xl font-semibold text-txt">{t('sidebar.today')}</span>;
    if (selectedView === 'inbox') return <span className="text-3xl font-semibold text-txt">{t('sidebar.inbox')}</span>;
    if (selectedView === 'upcoming') return <span className="text-3xl font-semibold text-txt">{t('sidebar.upcoming')}</span>;
    return null; // No mostrar nada si no hay vista ni proyecto
  };

  return (
    <div className="flex h-screen bg-bg-secondary">
      <Sidebar
        selectedView={selectedView}
        selectedProjectId={selectedProjectId}
        onViewChange={handleViewChange}
        onProjectSelect={handleProjectSelect}
        onAddTaskClick={handleAddTaskClick}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto bg-bg">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {selectedView === 'upcoming' ? (
            <UpcomingView
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          ) : (
            <>
              {(selectedProjectId || selectedView) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {getViewTitle()}
                    {selectedProjectId && sections.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDisplayMode('list')}
                          className={`p-2 rounded-lg transition-colors ${
                            displayMode === 'list'
                              ? 'bg-primary/10 text-primary'
                              : 'text-txt-muted hover:bg-bg-secondary'
                          }`}
                          title="Vista de lista"
                        >
                          <ListBulletIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDisplayMode('board')}
                          className={`p-2 rounded-lg transition-colors ${
                            displayMode === 'board'
                              ? 'bg-primary/10 text-primary'
                              : 'text-txt-muted hover:bg-bg-secondary'
                          }`}
                          title="Vista de tablero"
                        >
                          <Squares2X2Icon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedProjectId && sections.length > 0 && displayMode === 'board' ? (
                <>
                  <SectionBoardView
                    sections={sections}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onTaskClick={handleTaskClick}
                    onRefreshTasks={() => fetchSections(selectedProjectId)}
                    projectId={selectedProjectId}
                  />
                  
                   <div className="mt-6">
                     {showAddSection ? (
                       <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg">
                         <input
                           type="text"
                           value={newSectionName}
                           onChange={e => setNewSectionName(e.target.value)}
                           onKeyDown={e => {
                             if (e.key === 'Enter') handleAddSection();
                             if (e.key === 'Escape') {
                               setShowAddSection(false);
                               setNewSectionName('');
                             }
                           }}
                           placeholder={t('project.sectionName')}
                           className="flex-1 bg-transparent border-none focus:outline-none text-txt"
                           autoFocus
                         />
                         <button
                           onClick={handleAddSection}
                           className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                         >
                           {t('common.add')}
                         </button>
                         <button
                           onClick={() => {
                             setShowAddSection(false);
                             setNewSectionName('');
                           }}
                           className="px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm"
                         >
                           {t('common.cancel')}
                         </button>
                       </div>
                     ) : (
                       <button
                         onClick={() => setShowAddSection(true)}
                         className="flex items-center gap-2 px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm rounded-md hover:bg-bg-secondary w-full"
                       >
                         <PlusIcon className="w-5 h-5" />
                         <span>{t('project.addSection')}</span>
                       </button>
                     )}
                   </div>
                </>
              ) : selectedProjectId && sections.length > 0 ? (
                <>
                  <SectionListView
                    sections={sections}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onTaskClick={handleTaskClick}
                    onRefreshTasks={() => fetchSections(selectedProjectId)}
                    projectId={selectedProjectId}
                  />
                  
                  {/* Tareas sin sección */}
                  {displayedTasks.filter(t => !t.sectionId).length > 0 && (
                    <div className="mt-8 border-t border-silver/20 pt-6">
                      <h3 className="text-base font-bold text-txt mb-3">{t('task.otherTasks')}</h3>
                      <div className="space-y-1">
                        {displayedTasks.filter(t => !t.sectionId).map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onClick={handleTaskClick}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 border-t border-silver/20 pt-6">
                    {showAddSection ? (
                      <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg">
                        <input
                          type="text"
                          value={newSectionName}
                          onChange={e => setNewSectionName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddSection();
                            if (e.key === 'Escape') {
                              setShowAddSection(false);
                              setNewSectionName('');
                            }
                          }}
                          placeholder={t('project.sectionName')}
                          className="flex-1 bg-transparent border-none focus:outline-none text-txt"
                          autoFocus
                        />
                        <button
                          onClick={handleAddSection}
                          className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                        >
                          Añadir
                        </button>
                        <button
                          onClick={() => {
                            setShowAddSection(false);
                            setNewSectionName('');
                          }}
                          className="px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddSection(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm rounded-md hover:bg-bg-secondary w-full"
                      >
                        <PlusIcon className="w-5 h-5" />
                        <span>Añadir sección</span>
                      </button>
                    )}
                  </div>
                </>
              ) : selectedProjectId && sections.length === 0 ? (
                <>
                  {/* Proyecto sin secciones - mostrar tareas normales */}
                  <div className="space-y-1 mb-6">
                    {displayedTasks.length === 0 && !showQuickInput ? (
                      <div className="text-center py-12 text-txt-muted">
                        <p className="text-sm">No hay tareas aún</p>
                        <p className="text-xs mt-1">Agrega una tarea para comenzar</p>
                      </div>
                    ) : (
                      <>
                        {completedCount > 0 && (
                          <button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="flex items-center gap-2 px-3 py-2 mb-4 text-txt-muted hover:text-txt transition-colors text-sm"
                          >
                            {showCompleted ? (
                              <>
                                <EyeSlashIcon className="w-4 h-4" />
                                <span>Ocultar {completedCount} completada{completedCount !== 1 ? 's' : ''}</span>
                              </>
                            ) : (
                              <>
                                <EyeIcon className="w-4 h-4" />
                                <span>Ver {completedCount} completada{completedCount !== 1 ? 's' : ''}</span>
                              </>
                            )}
                          </button>
                        )}
                        
                        {displayedTasks.map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onClick={handleTaskClick}
                          />
                        ))}
                        
                        {showQuickInput && (
                          <div className="mb-2">
                            <QuickTaskInput
                              projectId={selectedProjectId}
                              onRefreshTasks={() => fetchTasks(selectedProjectId)}
                              onTaskCreated={() => setShowQuickInput(false)}
                              onCancel={() => setShowQuickInput(false)}
                              placeholder="Nombre de la tarea"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {!showQuickInput && (
                      <button
                        onClick={() => setShowQuickInput(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg border border-silver/30 bg-bg hover:border-primary/30 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full"
                      >
                        <PlusIcon className="w-5 h-5 text-txt-muted flex-shrink-0" />
                        <span className="text-sm text-txt-muted">Añadir tarea...</span>
                      </button>
                    )}
                  </div>

                   {/* Opción para crear sección */}
                   <div className="mt-8 pt-6 border-t border-silver/20">
                     {showAddSection ? (
                       <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg">
                         <input
                           type="text"
                           value={newSectionName}
                           onChange={e => setNewSectionName(e.target.value)}
                           onKeyDown={e => {
                             if (e.key === 'Enter') handleAddSection();
                             if (e.key === 'Escape') {
                               setShowAddSection(false);
                               setNewSectionName('');
                             }
                           }}
                           placeholder={t('project.sectionName')}
                           className="flex-1 bg-transparent border-none focus:outline-none text-txt"
                           autoFocus
                         />
                         <button
                           onClick={handleAddSection}
                           className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
                         >
                           {t('common.add')}
                         </button>
                         <button
                           onClick={() => {
                             setShowAddSection(false);
                             setNewSectionName('');
                           }}
                           className="px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm"
                         >
                           {t('common.cancel')}
                         </button>
                       </div>
                     ) : (
                       <button
                         onClick={() => setShowAddSection(true)}
                         className="flex items-center gap-2 px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm rounded-md hover:bg-bg-secondary w-full"
                       >
                         <PlusIcon className="w-5 h-5" />
                         <span>{t('project.addSection')}</span>
                       </button>
                     )}
                   </div>
                </>
              ) : (
                <div className="space-y-1 mb-6">
                  {displayedTasks.length === 0 && !showQuickInput ? (
                    <div className="text-center py-12 text-txt-muted">
                      <p className="text-sm">
                        {showCompleted 
                          ? t('task.noTasks')
                          : t('task.noTasks')
                        }
                      </p>
                      <p className="text-xs mt-1">
                        {!showCompleted && (selectedProjectId 
                          ? t('task.addTaskToStart')
                          : t('task.addTaskToStart')
                        )}
                      </p>
                    </div>
                  ) : (
                    <>
                      {completedCount > 0 && (
                        <button
                          onClick={() => setShowCompleted(!showCompleted)}
                          className="flex items-center gap-2 px-3 py-2 mb-4 text-txt-muted hover:text-txt transition-colors text-sm"
                        >
                          {showCompleted ? (
                            <>
                              <EyeSlashIcon className="w-4 h-4" />
                              <span>{t('task.hide')} {completedCount} {t('task.completed')}{completedCount !== 1 ? 's' : ''}</span>
                            </>
                          ) : (
                            <>
                              <EyeIcon className="w-4 h-4" />
                              <span>{t('task.show')} {completedCount} {t('task.completed')}{completedCount !== 1 ? 's' : ''}</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {displayedTasks.map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                          onClick={handleTaskClick}
                        />
                      ))}
                      
                      {showQuickInput && (
                        <div className="mb-2">
                          <QuickTaskInput
                            projectId={selectedView === 'inbox' ? null : selectedProjectId}
                            dueDate={selectedView === 'today' ? new Date().toISOString().split('T')[0] : undefined}
                            onRefreshTasks={async () => {
                              if (selectedView === 'inbox') {
                                await fetchTasks(null);
                              } else if (selectedView === 'today') {
                                const today = new Date().toISOString().split('T')[0];
                                await fetchTasks(undefined, today);
                              } else if (selectedProjectId) {
                                await fetchTasks(selectedProjectId);
                              } else {
                                await fetchTasks();
                              }
                            }}
                            onTaskCreated={() => {
                              setShowQuickInput(false);
                            }}
                            onCancel={() => setShowQuickInput(false)}
                              placeholder={t('task.taskName')}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {!showQuickInput && (
                    <button
                      onClick={() => setShowQuickInput(true)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border border-silver/30 bg-bg hover:border-primary/30 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 w-full"
                    >
                      <PlusIcon className="w-5 h-5 text-txt-muted flex-shrink-0" />
                      <span className="text-sm text-txt-muted">{t('task.addTask')}...</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <TaskFormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        initialProjectId={selectedProjectId}
        task={editingTask}
      />

      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
