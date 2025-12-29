import { generateDefaultAvatar } from '@/utils/avatar';

interface AvatarProps {
  avatar?: string;
  userId?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export const Avatar = ({ avatar, userId, name, size = 'md', className = '' }: AvatarProps) => {
  const avatarSrc = avatar || (userId ? generateDefaultAvatar(userId) : undefined);
  const sizeClass = sizeClasses[size];

  if (avatarSrc) {
    return (
      <img
        src={avatarSrc}
        alt={name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div
      className={`${sizeClass} rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
};

