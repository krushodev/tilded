import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';

// Paleta de colores de la aplicación
const AVATAR_COLORS = ['2d3142', '4f5d75', 'ef8354', 'bfc0c0', 'f5a882'];

export const generateAvatar = (seed: string): string => {
  const avatar = createAvatar(shapes, {
    seed: seed,
    size: 128,
    backgroundColor: AVATAR_COLORS,
  });

  return avatar.toDataUri();
};

export const generateDefaultAvatar = (userId: string): string => {
  return generateAvatar(userId);
};

