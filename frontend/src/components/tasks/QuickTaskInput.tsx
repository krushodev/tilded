import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FlagIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Select, SelectItem } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/store/task.store';
import { useProjectStore } from '@/store/project.store';
import { DatePicker } from './DatePicker';
import { getDateLocale } from '@/i18n/languages';

interface QuickTaskInputProps {
  projectId?: string | null | undefined;
  sectionId?: string | null;
  dueDate?: string | null;
  onTaskCreated?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  onRefreshTasks?: () => void;
}

export const QuickTaskInput = ({ projectId: initialProjectId, sectionId, dueDate: initialDueDate, onTaskCreated, onCancel, placeholder = 'Task name', onRefreshTasks }: QuickTaskInputProps) => {
  const { t, i18n } = useTranslation();
  const { addTask } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  const PRIORITY_OPTIONS = [
    { value: 'low', label: t('priority.p4'), color: 'text-blue-500' },
    { value: 'medium', label: t('priority.p3'), color: 'text-yellow-500' },
    { value: 'high', label: t('priority.p2'), color: 'text-orange-500' },
    { value: 'urgent', label: t('priority.p1'), color: 'text-red-500' }
  ];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Usar siempre el proyecto inicial si está disponible, no permitir cambiar
  const [selectedProjectId] = useState<string | null>(initialProjectId || null);
  const [dueDate, setDueDate] = useState<string | null>(initialDueDate !== undefined ? initialDueDate : null);
  const [priority, setPriority] = useState<string | null>(null);
  const [showExpanded, setShowExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [priorityDropdownPosition, setPriorityDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);
  const priorityButtonRef = useRef<HTMLButtonElement>(null);

  // Solo cargar proyectos si no hay un proyecto inicial (para mostrar el selector)
  useEffect(() => {
    if (!initialProjectId && !selectedProjectId) {
      fetchProjects();
    }
  }, [fetchProjects, initialProjectId, selectedProjectId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (datePickerRef.current && !datePickerRef.current.contains(target) && dateButtonRef.current && !dateButtonRef.current.contains(target)) {
        setShowDatePicker(false);
        setDatePickerPosition(null);
      }
      if (priorityRef.current && !priorityRef.current.contains(target) && priorityButtonRef.current && !priorityButtonRef.current.contains(target)) {
        setShowPriorityDropdown(false);
        setPriorityDropdownPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDatePickerToggle = () => {
    if (!showDatePicker && dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      setDatePickerPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
    setShowDatePicker(!showDatePicker);
    if (showDatePicker) {
      setDatePickerPosition(null);
    }
  };

  const handlePriorityToggle = () => {
    if (!showPriorityDropdown && priorityButtonRef.current) {
      const rect = priorityButtonRef.current.getBoundingClientRect();
      setPriorityDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
    setShowPriorityDropdown(!showPriorityDropdown);
    if (showPriorityDropdown) {
      setPriorityDropdownPosition(null);
    }
  };

  const isOverdue = () => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate + 'T00:00:00');
    return taskDate < today;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      if (onCancel) onCancel();
      return;
    }

    await addTask(title.trim(), selectedProjectId || undefined, description.trim() || undefined, undefined, dueDate, priority, sectionId || undefined);

    setTitle('');
    setDescription('');
    setDueDate(initialDueDate !== undefined ? initialDueDate : null);
    setPriority(null);
    setShowExpanded(false);

    if (onRefreshTasks) {
      await onRefreshTasks();
    }

    if (onTaskCreated) {
      await onTaskCreated();
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      if (onCancel) onCancel();
      setTitle('');
      setDescription('');
      setShowExpanded(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-silver/40 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start gap-2">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowExpanded(true)}
            placeholder={placeholder}
            className="flex-1 px-0 py-1 bg-transparent text-txt-dark placeholder:text-txt-muted focus:outline-none text-sm"
          />
          {onCancel && (
            <button type="button" onClick={onCancel} className="p-1 rounded hover:bg-silver/10 text-txt-muted transition-colors flex-shrink-0">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {showExpanded && (
          <>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('task.description')}
              className="w-full px-0 py-1 bg-transparent text-txt-dark placeholder:text-txt-muted focus:outline-none resize-none text-sm"
              rows={2}
            />

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-silver/20">
              <div className="relative">
                <button
                  ref={priorityButtonRef}
                  type="button"
                  onClick={handlePriorityToggle}
                  className={`flex items-center justify-center w-8 h-8 rounded-md border transition-colors ${
                    priority ? 'border-primary/30 bg-primary/10 text-primary' : 'border-silver/30 hover:border-primary/30 hover:bg-silver/10'
                  }`}
                >
                  <FlagIcon className={`w-4 h-4 ${priority ? 'text-primary' : 'text-txt-muted'}`} />
                </button>
                {showPriorityDropdown &&
                  priorityDropdownPosition &&
                  typeof document !== 'undefined' &&
                  createPortal(
                    <div
                      ref={priorityRef}
                      className="fixed bg-white border border-silver/30 rounded-lg shadow-lg z-[99999] min-w-[120px]"
                      style={{
                        top: `${priorityDropdownPosition.top}px`,
                        left: `${priorityDropdownPosition.left}px`
                      }}
                    >
                      {PRIORITY_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setPriority(opt.value);
                            setShowPriorityDropdown(false);
                            setPriorityDropdownPosition(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-silver/5 flex items-center gap-2 text-txt-dark"
                        >
                          <span className={opt.color}>●</span>
                          {opt.label}
                        </button>
                      ))}
                      {priority && (
                        <button
                          type="button"
                          onClick={() => {
                            setPriority(null);
                            setShowPriorityDropdown(false);
                            setPriorityDropdownPosition(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-silver/5 text-txt-muted border-t border-silver/10"
                        >
                          {t('task.noPriority')}
                        </button>
                      )}
                    </div>,
                    document.body
                  )}
              </div>

              <div className="relative">
                <button
                  ref={dateButtonRef}
                  type="button"
                  onClick={handleDatePickerToggle}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-colors text-sm ${
                    dueDate
                      ? isOverdue()
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-green-50 border-green-200 text-green-700'
                      : 'border-silver/30 hover:border-primary/30 hover:bg-silver/10 text-txt-muted'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {dueDate && (
                    <>
                      <span className="text-xs font-medium">{new Date(dueDate).toLocaleDateString(getDateLocale(i18n.language), { day: 'numeric', month: 'short' })}</span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setDueDate(null);
                        }}
                        className={`ml-1 p-0.5 rounded ${isOverdue() ? 'hover:bg-red-200/50' : 'hover:bg-green-200/50'}`}
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </button>
                {showDatePicker &&
                  datePickerPosition &&
                  typeof document !== 'undefined' &&
                  createPortal(
                    <div
                      ref={datePickerRef}
                      className="fixed z-[99999]"
                      style={{
                        top: `${datePickerPosition.top}px`,
                        left: `${datePickerPosition.left}px`
                      }}
                    >
                      <DatePicker
                        value={dueDate}
                        onChange={date => {
                          setDueDate(date);
                          setShowDatePicker(false);
                          setDatePickerPosition(null);
                        }}
                        onClose={() => {
                          setShowDatePicker(false);
                          setDatePickerPosition(null);
                        }}
                      />
                    </div>,
                    document.body
                  )}
              </div>

              {/* No mostrar el selector de proyecto si hay un proyecto inicial (null para inbox, string para proyecto) */}
              {initialProjectId === undefined && (
                <div className="relative">
                  <Select
                    selectedKeys={selectedProjectId ? [selectedProjectId] : ['inbox']}
                    placeholder={t('task.selectProject')}
                    defaultSelectedKeys={['inbox']}
                    size="sm"
                    popoverProps={{
                      placement: 'bottom-start',
                      classNames: {
                        content: 'bg-white border-silver/30 z-[99999] min-w-[220px]'
                      },
                      portalContainer: typeof document !== 'undefined' ? document.body : undefined,
                      style: {
                        zIndex: 99999,
                        minWidth: 220
                      }
                    }}
                    classNames={{
                      trigger: 'w-full bg-white border-silver/30 min-h-unit-8 h-10 hover:bg-white data-[hover=true]:bg-white rounded-xl px-4 shadow-none flex items-center',
                      value: 'text-txt-dark text-sm truncate',
                      popoverContent: 'bg-white border-silver/30 z-[99999] min-w-[220px]',
                      listbox: 'bg-white',
                      base: 'w-full max-w-full',
                      mainWrapper: 'w-full text-txt-dark',
                      label: 'text-txt-muted',
                      innerWrapper: 'text-txt-dark',
                      selectorIcon: 'text-txt-dark'
                    }}
                  >
                    <>
                      <SelectItem
                        key="inbox"
                        textValue={t('sidebar.inbox')}
                        classNames={{
                          base: 'text-txt-dark hover:bg-silver/5 data-[hover=true]:bg-silver/5 data-[hover=true]:text-txt-dark data-[selectable=true]:focus:bg-silver/5 data-[selectable=true]:focus:text-txt-dark',
                          title: 'text-txt-dark'
                        }}
                      >
                        {t('sidebar.inbox')}
                      </SelectItem>
                      {projects.map(project => (
                        <SelectItem
                          key={project.id}
                          textValue={project.name}
                          classNames={{
                            base: 'text-txt-dark hover:bg-silver/5 data-[hover=true]:bg-silver/5 data-[hover=true]:text-txt-dark data-[selectable=true]:focus:bg-silver/5 data-[selectable=true]:focus:text-txt-dark',
                            title: 'text-txt-dark'
                          }}
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                    </>
                  </Select>
                </div>
              )}

              {title && (
                <button type="submit" className="ml-auto px-4 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white font-medium transition-colors flex items-center gap-2 text-sm">
                  {t('task.addTask')}
                </button>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};
