import { useState, useMemo } from 'react';
import { getLocalTimeZone, today, CalendarDate, isSameDay } from '@internationalized/date';
import { Calendar as HeroUICalendar } from '@heroui/react';
import { TaskItem } from '@/components/tasks/TaskItem';
import type { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onToggleTask: (id: string, isCompleted: boolean) => void;
  onDeleteTask: (id: string) => void;
  view: 'month' | 'week' | 'day';
}

export const CalendarView = ({ tasks, onToggleTask, onDeleteTask, view }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(today(getLocalTimeZone()));

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = task.dueDate.split('T')[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const getTasksForDate = (date: CalendarDate): Task[] => {
    const dateKey = date.toDate(getLocalTimeZone()).toISOString().split('T')[0];
    return tasksByDate[dateKey] || [];
  };

  const getWeekDates = (date: CalendarDate): CalendarDate[] => {
    const dates: CalendarDate[] = [];
    const startOfWeek = date.subtract({ days: date.dayOfWeek - 1 });
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.add({ days: i }));
    }
    return dates;
  };

  const weekDates = view === 'week' ? getWeekDates(selectedDate) : [];

  if (view === 'day') {
    const dayTasks = getTasksForDate(selectedDate);
    return (
      <div className="space-y-4">
        <div className="bg-bg border border-silver/30 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-txt">
            {selectedDate.toDate(getLocalTimeZone()).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <div className="space-y-1">
            {dayTasks.length === 0 ? (
              <p className="text-sm text-txt-muted">No hay tareas para este día</p>
            ) : (
              dayTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </div>
        </div>
        <HeroUICalendar
          value={selectedDate}
          onChange={setSelectedDate}
          classNames={{
            base: "w-full bg-bg shadow-lg rounded-lg border border-silver/30 p-6",
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
      </div>
    );
  }

  if (view === 'week') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isToday = isSameDay(date, today(getLocalTimeZone()));
            const isSelected = isSameDay(date, selectedDate);
            
            return (
              <div
                key={index}
                className={`border rounded-lg p-2 min-h-[200px] ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-silver/30 bg-bg'
                }`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-primary' : 'text-txt'
                }`}>
                  {date.toDate(getLocalTimeZone()).toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className="text-xs p-1 rounded bg-primary/20 text-txt truncate"
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-txt-muted">
                      +{dayTasks.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-bg border border-silver/30 rounded-lg p-6">
          <HeroUICalendar
            value={selectedDate}
            onChange={setSelectedDate}
            classNames={{
              base: "w-full",
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
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <HeroUICalendar
        value={selectedDate}
        onChange={setSelectedDate}
        classNames={{
          base: "w-full bg-bg shadow-lg rounded-lg border border-silver/30 p-6",
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
      {selectedDate && (
        <div className="bg-bg border border-silver/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-txt">
            {selectedDate.toDate(getLocalTimeZone()).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className="space-y-1">
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-txt-muted">No hay tareas para este día</p>
            ) : (
              getTasksForDate(selectedDate).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

