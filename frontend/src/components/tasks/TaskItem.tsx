import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@/components/ui/IconButton';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onClick?: (task: Task) => void;
}

export const TaskItem = ({ task, onToggle, onDelete, onClick }: TaskItemProps) => {
  // Verificar si la tarea está vencida
  const isOverdue = () => {
    if (!task.dueDate || task.isCompleted) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalizar la fecha de la tarea
    const taskDateStr = task.dueDate.includes('T') ? task.dueDate.split('T')[0] : task.dueDate;

    const taskDate = new Date(taskDateStr + 'T00:00:00');

    return taskDate < today;
  };

  // Formatear fecha para mostrar
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr.includes('T') ? dateStr.split('T')[0] + 'T00:00:00' : dateStr + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    return `${day} ${month}`;
  };

  // Truncar descripción
  const truncateDescription = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="group flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-bg transition-colors">
      <button
        onClick={() => onToggle(task.id, !task.isCompleted)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          task.isCompleted ? 'bg-primary border-primary' : 'border-silver hover:border-primary/50'
        }`}
      >
        {task.isCompleted && <CheckIcon className="w-3 h-3 text-txt-light" />}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <button onClick={() => onClick?.(task)} className={`text-left text-sm truncate ${task.isCompleted ? 'text-txt-muted line-through' : 'text-txt'} hover:text-primary transition-colors`}>
            {task.title}
          </button>

          {/* Mostrar fecha si la tarea está vencida */}
          {isOverdue() && task.dueDate && <span className="text-xs font-medium text-red-500 whitespace-nowrap">{formatDueDate(task.dueDate)}</span>}
        </div>

        {/* Mostrar descripción si existe */}
        {task.description && <p className="text-xs text-txt-muted truncate">{truncateDescription(task.description)}</p>}
      </div>

      {/* Mostrar labels si existen */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb20',
                color: tag.color || '#6b7280',
                border: `1px solid ${tag.color ? `${tag.color}40` : '#e5e7eb40'}`
              }}
            >
              {tag.name}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-txt-muted">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      <IconButton icon={<TrashIcon className="w-4 h-4" />} variant="danger" size="sm" onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100" />
    </div>
  );
};
