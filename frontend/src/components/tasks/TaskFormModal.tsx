import { useState, useEffect, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem } from '@heroui/react';
import { FlagIcon, CalendarIcon, TagIcon, XMarkIcon, CheckIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useTagStore } from '@/store/tag.store';
import { useProjectStore } from '@/store/project.store';
import { useSectionStore } from '@/store/section.store';
import { useCategoryStore } from '@/store/category.store';
import { DatePicker } from './DatePicker';
import { getDateLocale } from '@/i18n/languages';
import type { Task } from '@/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    projectId?: string | null;
    sectionId?: string | null;
    dueDate?: string | null;
    priority?: string | null;
    tagIds?: string[];
  }) => Promise<void>;
  initialProjectId?: string | null;
  task?: Task | null;
}

export const TaskFormModal = ({ isOpen, onClose, onSubmit, initialProjectId, task }: TaskFormModalProps) => {
  const { t, i18n } = useTranslation();
  const { tags, fetchTags } = useTagStore();
  const { projects, fetchProjects } = useProjectStore();
  const { sections, fetchSections } = useSectionStore();
  const { categories, fetchCategories } = useCategoryStore();

  const PRIORITY_OPTIONS = [
    { value: 'low', label: t('priority.low'), color: 'text-blue-500' },
    { value: 'medium', label: t('priority.medium'), color: 'text-yellow-500' },
    { value: 'high', label: t('priority.high'), color: 'text-red-500' }
  ];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
        setShowTagDropdown(false);
        setShowPriorityDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      fetchProjects();
      fetchCategories();

      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setSelectedProjectId(task.projectId || null);
        setSelectedSectionId(task.sectionId || null);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null);
        setPriority(task.priority || null);
        setSelectedTagIds(task.tags?.map(t => t.id) || []);

        // Cargar secciones si hay un proyecto
        if (task.projectId) {
          fetchSections(task.projectId);
        }
      } else {
        setTitle('');
        setDescription('');
        setSelectedProjectId(initialProjectId || null);
        setSelectedSectionId(null);
        setDueDate(null);
        setPriority(null);
        setSelectedTagIds([]);

        // Cargar secciones si hay un proyecto inicial
        if (initialProjectId) {
          fetchSections(initialProjectId);
        }
      }
    }
  }, [isOpen, task, initialProjectId, fetchTags, fetchProjects, fetchCategories, fetchSections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      projectId: selectedProjectId,
      sectionId: selectedSectionId,
      dueDate: dueDate || null,
      priority: priority || null,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined
    });

    onClose();
  };

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    setSelectedSectionId(null); // Reset section cuando cambia el proyecto
    if (projectId) {
      fetchSections(projectId);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => (prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]));
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDueDate(today);
  };

  const clearDueDate = () => {
    setDueDate(null);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedTags = tags.filter(t => selectedTagIds.includes(t.id));
  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-bg-dark',
        backdrop: 'bg-black/50',
        wrapper: 'z-[100]',
        body: 'text-txt-light',
        header: 'text-txt-light border-b border-silver/10'
      }}
    >
      <ModalContent className="bg-bg-dark">
        {onClose => (
          <>
            <ModalHeader className="text-txt-light border-b border-silver/10">{task ? t('task.editTask') : t('task.newTask')}</ModalHeader>
            <ModalBody className="pb-6 text-txt-light" style={{ overflow: 'visible' }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={t('task.taskName')}
                    className="w-full px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light placeholder:text-txt-muted focus:outline-none focus:border-primary"
                    autoFocus
                  />
                </div>

                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={t('task.description')}
                  className="w-full px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light placeholder:text-txt-muted focus:outline-none focus:border-primary resize-none"
                  rows={3}
                />

                <div className="flex items-center gap-2 flex-wrap" ref={dropdownRef}>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50 transition-colors"
                    >
                      <FlagIcon className={`w-4 h-4 ${selectedPriority ? selectedPriority.color : 'text-txt-muted'}`} />
                      <span className="text-sm text-txt-light">{selectedPriority ? selectedPriority.label : t('task.priority')}</span>
                    </button>
                    {showPriorityDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-10 min-w-[150px]">
                        {PRIORITY_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setPriority(opt.value);
                              setShowPriorityDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 flex items-center gap-2 text-txt-light"
                          >
                            <FlagIcon className={`w-4 h-4 ${opt.color}`} />
                            {opt.label}
                          </button>
                        ))}
                        {priority && (
                          <button
                            type="button"
                            onClick={() => {
                              setPriority(null);
                              setShowPriorityDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 text-txt-muted border-t border-silver/10"
                          >
                            {t('task.noPriority')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={datePickerRef}>
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        dueDate ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50'
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm">{dueDate ? new Date(dueDate).toLocaleDateString(getDateLocale(i18n.language), { day: 'numeric', month: 'short' }) : t('date.today')}</span>
                      {dueDate && (
                        <XMarkIcon
                          className="w-3 h-3 ml-1"
                          onClick={e => {
                            e.stopPropagation();
                            clearDueDate();
                          }}
                        />
                      )}
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 mt-2 z-[100]">
                        <DatePicker
                          value={dueDate}
                          onChange={date => {
                            setDueDate(date);
                            setShowDatePicker(false);
                          }}
                          onClose={() => setShowDatePicker(false)}
                          theme="dark"
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50 transition-colors"
                    >
                      <TagIcon className="w-4 h-4" />
                      <span className="text-sm">{t('task.labels')}</span>
                      {selectedTags.length > 0 && <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">{selectedTags.length}</span>}
                    </button>
                    {showTagDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-10 min-w-[200px] max-h-60 overflow-y-auto">
                        {tags.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-txt-muted">{t('task.noTags')}</div>
                        ) : (
                          tags.map(tag => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 flex items-center gap-2 text-txt-light"
                            >
                              {selectedTagIds.includes(tag.id) && <CheckIcon className="w-4 h-4 text-primary" />}
                              <span>{tag.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
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
                        portalContainer: document.body,
                        style: {
                          zIndex: 9999
                        }
                      }}
                      classNames={{
                        trigger: 'bg-bg-dark min-h-unit-10 hover:bg-bg-dark data-[hover=true]:bg-bg-dark',
                        value: 'text-white text-sm',
                        popoverContent: 'bg-bg-dark z-[9999] border-0',
                        listbox: 'bg-bg-dark',
                        base: 'max-w-full',
                        mainWrapper: 'text-white',
                        label: 'text-txt-muted text-xs font-medium mb-2',
                        innerWrapper: 'text-white',
                        selectorIcon: 'text-white'
                      }}
                      renderValue={() => (
                        <span className="text-white text-sm">{selectedProjectId ? projects.find(project => project.id === selectedProjectId)?.name ?? t('task.noSection') : t('sidebar.inbox')}</span>
                      )}
                    >
                      <>
                        <SelectItem
                          key="inbox"
                          textValue={t('sidebar.inbox')}
                          classNames={{
                            base: 'text-white hover:bg-silver/10 data-[hover=true]:bg-silver/10 data-[hover=true]:text-white data-[selectable=true]:focus:bg-silver/10 data-[selectable=true]:focus:text-white',
                            title: 'text-white'
                          }}
                        >
                          {t('sidebar.inbox')}
                        </SelectItem>
                        {projects.map(project => (
                          <SelectItem
                            key={project.id}
                            textValue={project.name}
                            classNames={{
                              base: 'text-white hover:bg-silver/10 data-[hover=true]:bg-silver/10 data-[hover=true]:text-white data-[selectable=true]:focus:bg-silver/10 data-[selectable=true]:focus:text-white',
                              title: 'text-white'
                            }}
                          >
                            {project.name}
                          </SelectItem>
                        ))}
                      </>
                    </Select>
                  </div>

                  {/* Section selector - solo si hay un proyecto seleccionado */}
                  {selectedProjectId && sections.length > 0 && (
                    <div className="relative flex-1">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light hover:border-primary/50 transition-colors"
                        >
                          <RectangleStackIcon className="w-4 h-4" />
                          <span className="text-sm">{selectedSectionId ? sections.find(s => s.id === selectedSectionId)?.name || t('task.noSection') : t('task.noSection')}</span>
                        </button>
                        {showSectionDropdown && (
                          <div className="absolute top-full left-0 mt-1 bg-bg-dark border border-silver/30 rounded-lg shadow-lg z-10 min-w-[200px]">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSectionId(null);
                                setShowSectionDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 text-txt-light"
                            >
                              {t('task.noSection')}
                            </button>
                            {sections.map(section => (
                              <button
                                key={section.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSectionId(section.id);
                                  setShowSectionDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-silver/10 text-txt-light"
                              >
                                {section.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="ghost" onClick={onClose} type="button">
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" color="primary">
                    {task ? t('common.save') : t('task.addTask')}
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
