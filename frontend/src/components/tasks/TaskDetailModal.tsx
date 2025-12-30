import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalBody, Select, SelectItem } from '@heroui/react';
import { FlagIcon, CalendarIcon, XMarkIcon, TrashIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/store/task.store';
import { useTagStore } from '@/store/tag.store';
import { useProjectStore } from '@/store/project.store';
import { useSectionStore } from '@/store/section.store';
import { DatePicker } from './DatePicker';
import { getDateLocale } from '@/i18n/languages';
import type { Task } from '@/types';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onDelete: (id: string) => void;
}

export const TaskDetailModal = ({ isOpen, onClose, task, onDelete }: TaskDetailModalProps) => {
  const { t, i18n } = useTranslation();
  const { updateTask } = useTaskStore();
  const { tags, fetchTags } = useTagStore();
  const { projects, fetchProjects } = useProjectStore();
  const { sections, fetchSections } = useSectionStore();

  const PRIORITY_OPTIONS = [
    { value: 'low', label: t('priority.p4'), color: 'text-blue-500' },
    { value: 'medium', label: t('priority.p3'), color: 'text-yellow-500' },
    { value: 'high', label: t('priority.p2'), color: 'text-orange-500' },
    { value: 'urgent', label: t('priority.p1'), color: 'text-red-500' }
  ];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

  // Sincronizar estado local con las props del task cuando se abre el modal
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen && task) {
      fetchTags();
      fetchProjects();
      setTitle(task.title);
      setDescription(task.description || '');
      setSelectedProjectId(task.projectId || null);
      setSelectedSectionId(task.sectionId || null);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null);
      setPriority(task.priority || 'low');
      setSelectedTagIds(task.tags?.map(t => t.id) || []);

      // Cargar secciones si hay un proyecto
      if (task.projectId) {
        fetchSections(task.projectId);
      }
    }
  }, [isOpen, task]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDatePicker && !target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
      if (showPriorityDropdown && !target.closest('.priority-dropdown-container')) {
        setShowPriorityDropdown(false);
      }
      if (showSectionDropdown && !target.closest('.section-dropdown-container')) {
        setShowSectionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker, showPriorityDropdown, showSectionDropdown]);

  const handleUpdate = async (field: string, value: unknown) => {
    await updateTask(task.id, { [field]: value });
  };

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      handleUpdate('title', title.trim());
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      handleUpdate('description', description.trim() || undefined);
    }
  };

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    setSelectedSectionId(null); // Reset section cuando cambia proyecto
    handleUpdate('projectId', projectId);
    handleUpdate('sectionId', null);
    if (projectId) {
      fetchSections(projectId);
    }
  };

  const handleSectionChange = (sectionId: string | null) => {
    setSelectedSectionId(sectionId);
    setShowSectionDropdown(false);
    handleUpdate('sectionId', sectionId);
  };

  const handleDueDateChange = (date: string | null) => {
    setDueDate(date);
    setShowDatePicker(false);
    handleUpdate('dueDate', date);
  };

  const handlePriorityChange = (newPriority: string | null) => {
    setPriority(newPriority);
    setShowPriorityDropdown(false);
    handleUpdate('priority', newPriority);
  };

  const toggleTag = async (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    await handleUpdate('tagIds', tagIds);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority);

  // Verificar si la fecha es anterior a hoy
  const isOverdue = () => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate + 'T00:00:00');
    return taskDate < today;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      placement="center"
      scrollBehavior="outside"
      hideCloseButton
      classNames={{
        base: 'bg-bg-secondary max-w-full mx-4',
        backdrop: 'bg-black/50',
        wrapper: 'z-[50] overflow-y-auto p-0 sm:p-4',
        body: 'p-0'
      }}
    >
      <ModalContent className="bg-bg-secondary my-4 sm:my-8 max-h-[90vh] sm:max-h-[85vh]">
        <ModalBody className="p-0 overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
          <div className="flex flex-col md:flex-row">
            {/* Main content - Left side */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 bg-bg-dark">
              {/* Task checkbox and title */}
              <div className="flex items-start gap-3 mb-4">
                <button
                  onClick={() => handleUpdate('isCompleted', !task.isCompleted)}
                  className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    task.isCompleted ? 'bg-primary border-primary' : 'border-txt-muted hover:border-primary'
                  }`}
                >
                  {task.isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    className={`w-full text-lg sm:text-xl md:text-2xl font-semibold bg-transparent border-none focus:outline-none text-txt-light touch-manipulation ${task.isCompleted ? 'line-through text-txt-muted' : ''}`}
                    placeholder={t('task.taskName')}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder={t('task.description')}
                  className="w-full min-h-[80px] px-0 py-2 bg-transparent border-none focus:outline-none text-txt-light placeholder:text-txt-muted resize-none text-base sm:text-sm touch-manipulation"
                />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="w-full md:w-72 bg-bg-dark border-t md:border-t-0 md:border-l border-silver/10 p-4 md:p-6">
              <div className="space-y-4">
                {/* Project */}
                <div>
                  <div className="text-xs font-medium text-txt-muted mb-2">{t('task.project')}</div>
                  <Select
                    selectedKeys={selectedProjectId ? [selectedProjectId] : ['inbox']}
                    onSelectionChange={keys => {
                      const selected = Array.from(keys)[0] as string;
                      handleProjectChange(selected === 'inbox' ? null : selected);
                    }}
                    placeholder={t('task.selectProject')}
                    defaultSelectedKeys={['inbox']}
                    popoverProps={{
                      placement: 'bottom-start',
                      classNames: {
                        content: 'bg-bg-dark text-white z z-[99999] border-0 shadow-lg'
                      },
                      portalContainer: typeof document !== 'undefined' ? document.body : undefined,
                      style: {
                        zIndex: 9999
                      }
                    }}
                    classNames={{
                      trigger: 'bg-bg-dark min-h-unit-10 hover:bg-bg-dark data-[hover=true]:bg-bg-dark border-silver/30',
                      value: 'text-txt-light text-sm',
                      popoverContent: 'bg-bg-dark z-[9999] border-0',
                      listbox: 'bg-bg-dark',
                      base: 'max-w-full',
                      mainWrapper: 'text-txt-light',
                      label: 'text-txt-muted text-xs font-medium mb-2',
                      innerWrapper: 'text-txt-light',
                      selectorIcon: 'text-txt-light'
                    }}
                    renderValue={() => (
                      <span className="text-txt-light text-sm">{selectedProjectId ? projects.find(project => project.id === selectedProjectId)?.name ?? t('task.noSection') : t('sidebar.inbox')}</span>
                    )}
                  >
                    <>
                      <SelectItem
                        key="inbox"
                        textValue={t('sidebar.inbox')}
                        classNames={{
                          base: 'text-txt-light hover:bg-silver/10 text-sm data-[hover=true]:bg-silver/10 data-[hover=true]:text-txt-light data-[selectable=true]:focus:bg-silver/10 data-[selectable=true]:focus:text-txt-light',
                          title: 'text-txt-light text-sm'
                        }}
                      >
                        {t('sidebar.inbox')}
                      </SelectItem>
                      {projects.map(project => (
                        <SelectItem
                          key={project.id}
                          textValue={project.name}
                          classNames={{
                            base: 'text-txt-light hover:bg-silver/10 text-sm data-[hover=true]:bg-silver/10 data-[hover=true]:text-txt-light data-[selectable=true]:focus:bg-silver/10 data-[selectable=true]:focus:text-txt-light',
                            title: 'text-txt-light text-sm'
                          }}
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                    </>
                  </Select>
                </div>

                {/* Section - solo si hay un proyecto seleccionado con secciones */}
                {selectedProjectId && sections.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-txt-muted mb-2">{t('task.section')}</div>
                    <div className="relative section-dropdown-container">
                      <button
                        onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50 transition-colors text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <RectangleStackIcon className="w-4 h-4" />
                          <span className="text-sm">{selectedSectionId ? sections.find(s => s.id === selectedSectionId)?.name || t('task.noSection') : t('task.noSection')}</span>
                        </div>
                      </button>
                      {showSectionDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-[200]">
                          <button onClick={() => handleSectionChange(null)} className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 text-txt-light first:rounded-t-lg">
                            {t('task.noSection')}
                          </button>
                          {sections.map(section => (
                            <button key={section.id} onClick={() => handleSectionChange(section.id)} className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 text-txt-light last:rounded-b-lg">
                              {section.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div>
                  <div className="text-xs font-medium text-txt-muted mb-2">{t('task.dueDate')}</div>
                  <div className="relative date-picker-container">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors text-sm ${
                        dueDate
                          ? isOverdue()
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{dueDate ? new Date(dueDate).toLocaleDateString(getDateLocale(i18n.language), { day: 'numeric', month: 'short' }) : t('task.addDate')}</span>
                      </div>
                      {dueDate && (
                        <XMarkIcon
                          className="w-4 h-4"
                          onClick={e => {
                            e.stopPropagation();
                            handleDueDateChange(null);
                          }}
                        />
                      )}
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 mt-2 z-[200]">
                        <DatePicker value={dueDate} onChange={handleDueDateChange} onClose={() => setShowDatePicker(false)} theme="dark" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <div className="text-xs font-medium text-txt-muted mb-2">{t('task.priority')}</div>
                  <div className="relative priority-dropdown-container">
                    <button
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FlagIcon className={`w-4 h-4 ${selectedPriority?.color || 'text-txt-muted'}`} />
                        <span className="text-sm">{selectedPriority ? selectedPriority.label : t('task.priority')}</span>
                      </div>
                    </button>
                    {showPriorityDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-[200]">
                        {PRIORITY_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handlePriorityChange(opt.value)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 flex items-center gap-2 text-txt-light first:rounded-t-lg"
                          >
                            <FlagIcon className={`w-4 h-4 ${opt.color}`} />
                            {opt.label}
                          </button>
                        ))}
                        {priority && (
                          <button onClick={() => handlePriorityChange(null)} className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 text-txt-muted border-t border-silver/10 rounded-b-lg">
                            {t('task.noPriority')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <div className="text-xs font-medium text-txt-muted mb-2">{t('task.labels')}</div>
                  <Select
                    selectionMode="multiple"
                    selectedKeys={selectedTagIds}
                    onSelectionChange={keys => {
                      const tagIds = Array.from(keys) as string[];
                      toggleTag(tagIds);
                    }}
                    placeholder={t('task.selectLabels')}
                    size="sm"
                    classNames={{
                      trigger: 'bg-bg-dark min-h-unit-9 hover:bg-bg-dark data-[hover=true]:bg-bg-dark border-silver/30',
                      value: 'text-txt-light text-sm',
                      popoverContent: 'bg-bg-dark border-silver/30',
                      listbox: 'bg-bg-dark',
                      innerWrapper: 'text-txt-light',
                      selectorIcon: 'text-txt-light'
                    }}
                    renderValue={items => {
                      if (items.length === 0) return <span className="text-txt-muted text-sm">{t('task.selectLabels')}</span>;
                      return (
                        <div className="flex flex-wrap gap-1">
                          {items.map(item => {
                            const tag = tags.find(t => t.id === item.key);
                            return (
                              <span
                                key={item.key}
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: tag?.color ? `${tag.color}20` : '#e5e7eb20',
                                  color: tag?.color || '#6b7280',
                                  border: `1px solid ${tag?.color ? `${tag.color}40` : '#e5e7eb40'}`
                                }}
                              >
                                {tag?.name}
                              </span>
                            );
                          })}
                        </div>
                      );
                    }}
                  >
                    <>
                      {tags.map(tag => (
                        <SelectItem
                          key={tag.id}
                          textValue={tag.name}
                          classNames={{
                            base: 'text-txt-light hover:bg-silver/10 text-sm data-[hover=true]:bg-silver/10 data-[hover=true]:text-txt-light data-[selectable=true]:focus:bg-silver/10 data-[selectable=true]:focus:text-txt-light',
                            title: 'text-txt-light text-sm'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color || '#6b7280' }} />
                            <span>{tag.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-silver/10 space-y-2">
                <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm">
                  <TrashIcon className="w-4 h-4" />
                  <span>{t('task.deleteTask')}</span>
                </button>

                <button onClick={onClose} className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition-colors text-sm">
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
