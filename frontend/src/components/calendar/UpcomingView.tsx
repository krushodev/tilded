import { useState, useMemo } from 'react';
import { getLocalTimeZone, today, CalendarDate, parseDate } from '@internationalized/date';
import { Calendar as HeroUICalendar } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { QuickTaskInput } from '@/components/tasks/QuickTaskInput';
import { useDisclosure } from '@heroui/react';
import { useTaskStore } from '@/store/task.store';
import { useTranslation } from 'react-i18next';
import { getDateLocale, getCalendarLocale } from '@/i18n/languages';
import type { Task } from '@/types';

interface UpcomingViewProps {
  tasks: Task[];
  onToggleTask: (id: string, isCompleted: boolean) => void;
  onDeleteTask: (id: string) => void;
}

export const UpcomingView = ({ tasks, onToggleTask, onDeleteTask }: UpcomingViewProps) => {
  const { t, i18n } = useTranslation();
  const { addTask, updateTask, fetchTasks } = useTaskStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentViewDate, setCurrentViewDate] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDateForTask, setSelectedDateForTask] = useState<CalendarDate>(today(getLocalTimeZone()));
  const [showQuickInputForDate, setShowQuickInputForDate] = useState<string | null>(null);

  // Helper para convertir CalendarDate a string YYYY-MM-DD sin problemas de zona horaria
  const calendarDateToString = (date: CalendarDate): string => {
    const year = date.year;
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(task => task.dueDate) // Mostrar todas las tareas con fecha
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasks]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    upcomingTasks.forEach(task => {
      if (task.dueDate) {
        // Normalizar la fecha a YYYY-MM-DD sin importar el formato que venga
        let dateKey: string;
        if (task.dueDate.includes('T')) {
          // Si viene con hora (ISO string), tomar solo la fecha
          dateKey = task.dueDate.split('T')[0];
        } else {
          // Si ya es solo fecha
          dateKey = task.dueDate;
        }
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [upcomingTasks]);

  const daysToShow = useMemo(() => {
    const days: CalendarDate[] = [];
    const todayDate = today(getLocalTimeZone());
    
    // Si la fecha actual es anterior a hoy, comenzar desde hoy
    const startDate = currentViewDate.compare(todayDate) < 0 ? todayDate : currentViewDate;
    
    for (let i = 0; i < 3; i++) {
      days.push(startDate.add({ days: i }));
    }
    return days;
  }, [currentViewDate]);

  const getTasksForDate = (date: CalendarDate): Task[] => {
    const dateKey = calendarDateToString(date);
    return tasksByDate[dateKey] || [];
  };

  const formatDateHeader = (date: CalendarDate): string => {
    const jsDate = date.toDate(getLocalTimeZone());
    const todayDate = today(getLocalTimeZone());
    const tomorrow = todayDate.add({ days: 1 });
    
    const dayNumber = jsDate.getDate();
    const month = jsDate.toLocaleDateString(getDateLocale(i18n.language), { month: 'short' });
    const weekday = jsDate.toLocaleDateString(getDateLocale(i18n.language), { weekday: 'long' });
    
    if (date.compare(todayDate) === 0) {
      return `${dayNumber} ${month} · ${t('date.today')}`;
    } else if (date.compare(tomorrow) === 0) {
      return `${dayNumber} ${month} · ${t('date.tomorrow')}`;
    } else {
      return `${dayNumber} ${month} · ${weekday}`;
    }
  };

  const handleAddTask = (date: CalendarDate) => {
    const dateKey = calendarDateToString(date);
    setShowQuickInputForDate(dateKey);
    setSelectedDateForTask(date);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    onOpen();
  };

  const handleTaskSubmit = async (data: {
    title: string;
    description?: string;
    projectId?: string | null;
    dueDate?: string | null;
    priority?: string | null;
    tagIds?: string[];
  }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      const dateStr = calendarDateToString(selectedDateForTask);
      await addTask(
        data.title,
        data.projectId || undefined,
        data.description,
        data.tagIds,
        dateStr,
        data.priority
      );
    }
    // Refrescar las tareas después de crear/editar
    await fetchTasks();
    onClose();
    setEditingTask(null);
  };

  const navigateToToday = () => {
    const todayDate = today(getLocalTimeZone());
    setCurrentViewDate(todayDate);
    setShowCalendar(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const todayDate = today(getLocalTimeZone());
    if (direction === 'prev') {
      const newDate = currentViewDate.subtract({ days: 1 });
      // No permitir navegar antes de hoy
      if (newDate.compare(todayDate) < 0) {
        setCurrentViewDate(todayDate);
      } else {
        setCurrentViewDate(newDate);
      }
    } else {
      setCurrentViewDate(currentViewDate.add({ days: 1 }));
    }
  };

  const currentMonthYear = currentViewDate.toDate(getLocalTimeZone()).toLocaleDateString(getDateLocale(i18n.language), { 
    month: 'long', 
    year: 'numeric' 
  });

  // Verificar si estamos en el día de hoy
  const isToday = currentViewDate.compare(today(getLocalTimeZone())) === 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header con navegación */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-txt mb-1">{t('calendar.upcoming')}</h1>
          <div className="relative inline-block">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-1 text-sm text-txt-muted hover:text-txt transition-colors"
            >
              <span className="capitalize">{currentMonthYear}</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-silver/30">
                <I18nProvider locale={getCalendarLocale(i18n.language)}>
                <HeroUICalendar
                  value={currentViewDate}
                  onChange={(date) => {
                    setCurrentViewDate(date);
                    setShowCalendar(false);
                  }}
                  classNames={{
                    base: "w-full bg-white p-4",
                    content: "bg-transparent",
                    calendar: "bg-transparent",
                    calendarHeader: "text-txt mb-4",
                    calendarTitle: "text-txt text-lg font-semibold",
                    prevButton: "text-txt hover:bg-silver/10",
                    nextButton: "text-txt hover:bg-silver/10",
                    cell: "text-txt data-[selected=true]:bg-primary data-[selected=true]:text-txt-light data-[hover=true]:bg-primary/20",
                    headerCell: "text-txt-muted text-sm font-medium",
                    cellButton: "text-txt hover:bg-silver/10 data-[selected=true]:bg-primary data-[selected=true]:text-txt-light rounded-md",
                    monthCell: "text-txt",
                    yearCell: "text-txt"
                  }}
                />
                </I18nProvider>
              </div>
            )}
          </div>
        </div>
        
        {/* Botones de navegación */}
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg border border-silver/30 bg-bg text-txt hover:bg-silver/10 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={navigateToToday}
            className="px-3 py-2 rounded-lg border border-silver/30 bg-bg text-txt hover:bg-silver/10 transition-colors text-sm"
          >
            {t('date.today')}
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg border border-silver/30 bg-bg text-txt hover:bg-silver/10 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Board de columnas */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-h-0 h-full">
          {daysToShow.map((date, index) => {
            const dayTasks = getTasksForDate(date).filter(task => !task.isCompleted);
            const dateKey = calendarDateToString(date);
            
            return (
              <div key={index} className="flex-shrink-0 w-80 flex flex-col">
                {/* Header de columna */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-txt capitalize">
                    {formatDateHeader(date)}
                  </h3>
                  <span className="text-xs text-txt-muted">{dayTasks.length}</span>
                </div>
                
                {/* Contenedor de tareas - se apilan como cards */}
                <div className="flex flex-col gap-2 min-h-[100px]">
                  {/* Lista de tareas apiladas */}
                  {dayTasks.length > 0 && dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="bg-white rounded-lg border border-silver/30 hover:border-primary/30 hover:shadow-sm transition-all overflow-hidden"
                    >
                      <TaskItem
                        task={task}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                        onClick={handleEditTask}
                      />
                    </div>
                  ))}
                  
                  {/* Input rápido */}
                  {showQuickInputForDate === dateKey && (
                    <QuickTaskInput
                      dueDate={dateKey}
                      onRefreshTasks={async () => {
                        await fetchTasks();
                      }}
                      onTaskCreated={async () => {
                        await fetchTasks();
                        setShowQuickInputForDate(null);
                      }}
                      onCancel={() => setShowQuickInputForDate(null)}
                      placeholder={t('task.taskName')}
                    />
                  )}
                  
                  {/* Botón agregar */}
                  {!showQuickInputForDate && (
                    <button
                      onClick={() => handleAddTask(date)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-txt-muted hover:text-txt transition-colors text-sm rounded-lg hover:bg-bg-secondary"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>{t('task.addTask')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskFormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        initialProjectId={null}
      />
    </div>
  );
};

