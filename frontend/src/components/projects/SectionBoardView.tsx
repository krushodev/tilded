import { useState, useEffect, useRef } from 'react';
import type { Section, Task } from '@/types';
import { TaskItem } from '@/components/tasks/TaskItem';
import { QuickTaskInput } from '@/components/tasks/QuickTaskInput';
import { PlusIcon, EllipsisVerticalIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useSectionStore } from '@/store/section.store';
import { useToast } from '@/hooks/useToast';

interface SectionBoardViewProps {
  sections: Section[];
  onToggleTask: (taskId: string, isCompleted: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
  onRefreshTasks: () => void;
  projectId: string;
}

export function SectionBoardView({ sections, onToggleTask, onDeleteTask, onTaskClick, onRefreshTasks, projectId }: SectionBoardViewProps) {
  const [showQuickInputForSection, setShowQuickInputForSection] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const [showSectionMenu, setShowSectionMenu] = useState<string | null>(null);
  const { updateSection, deleteSection, fetchSections } = useSectionStore();
  const { showConfirm, showToast, ToastContainer, ConfirmModal } = useToast();
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSectionNameSubmit = async (sectionId: string) => {
    if (editingSectionName.trim()) {
      await updateSection(sectionId, { name: editingSectionName.trim() });
      setEditingSectionId(null);
      await fetchSections(projectId);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const taskCount = section.tasks?.length || 0;
    const message =
      taskCount > 0 
        ? `Se eliminarán ${taskCount} tarea${taskCount !== 1 ? 's' : ''} junto con esta sección.` 
        : 'Esta acción no se puede deshacer.';

    showConfirm(
      '¿Eliminar sección?',
      message,
      async () => {
        // Eliminar las tareas de esta sección del UI inmediatamente
        const taskIdsToDelete = section.tasks?.map(t => t.id) || [];
        taskIdsToDelete.forEach(taskId => onDeleteTask(taskId));

        // Eliminar la sección del backend
        await deleteSection(sectionId);

        // Refrescar las secciones y tareas
        await fetchSections(projectId);
        await onRefreshTasks();

        showToast('success', 'Sección eliminada', `La sección "${section.name}" fue eliminada correctamente.`);
        setShowSectionMenu(null);
      }
    );
  };

  const handleEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditingSectionName(section.name);
    setShowSectionMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutsideAll = Object.values(menuRefs.current).every(ref => !ref || !ref.contains(event.target as Node));
      if (clickedOutsideAll) {
        setShowSectionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <ToastContainer />
      <ConfirmModal />
      {sections.map(section => (
        <div key={section.id} className="flex-shrink-0 w-80 bg-bg-secondary rounded-lg p-4 border border-silver/20">
          <div className="flex items-center justify-between mb-3 group">
            {editingSectionId === section.id ? (
              <input
                type="text"
                value={editingSectionName}
                onChange={e => setEditingSectionName(e.target.value)}
                onBlur={() => handleSectionNameSubmit(section.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSectionNameSubmit(section.id);
                  if (e.key === 'Escape') {
                    setEditingSectionId(null);
                    setEditingSectionName('');
                  }
                }}
                className="bg-transparent border-b-2 border-primary focus:outline-none text-base font-bold text-txt flex-1"
                autoFocus
              />
            ) : (
              <h3 className="text-base font-bold text-txt cursor-pointer hover:text-txt-muted transition-colors flex-1" onClick={() => handleEditSection(section)}>
                {section.name}
              </h3>
            )}

            <div
              className="relative"
              ref={el => {
                menuRefs.current[section.id] = el;
              }}
            >
              <button onClick={() => setShowSectionMenu(showSectionMenu === section.id ? null : section.id)} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-bg rounded transition-all">
                <EllipsisVerticalIcon className="w-5 h-5 text-txt-muted" />
              </button>

              {showSectionMenu === section.id && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-silver/30 rounded-lg shadow-lg z-10">
                  <button onClick={() => handleEditSection(section)} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-txt-dark hover:bg-silver/5 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                    Editar nombre
                  </button>
                  <button onClick={() => handleDeleteSection(section.id)} className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-silver/5 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                    Eliminar sección
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 min-h-[200px]">
            {section.tasks &&
              section.tasks.length > 0 &&
              section.tasks.filter(task => !task.isCompleted).map(task => (
                <div key={task.id} className="bg-bg rounded-lg">
                  <TaskItem task={task} onToggle={onToggleTask} onDelete={onDeleteTask} onClick={onTaskClick} />
                </div>
              ))}

            {showQuickInputForSection === section.id ? (
              <div className="mb-2">
                <QuickTaskInput
                  projectId={projectId}
                  sectionId={section.id}
                  onRefreshTasks={async () => {
                    await onRefreshTasks();
                  }}
                  onTaskCreated={() => {
                    setShowQuickInputForSection(null);
                  }}
                  onCancel={() => setShowQuickInputForSection(null)}
                  placeholder="Nombre de la tarea"
                />
              </div>
            ) : (
              <button
                onClick={() => setShowQuickInputForSection(section.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-txt-muted hover:text-txt transition-colors text-sm w-full hover:bg-bg rounded-lg"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Añadir tarea</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
