import { useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AvatarSelectorProps {
  currentAvatar?: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

// Paleta de colores de la aplicación
const AVATAR_COLORS = ['2d3142', '4f5d75', 'ef8354', 'bfc0c0', 'f5a882'];

export const AvatarSelector = ({ currentAvatar, onSelect, onClose }: AvatarSelectorProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const generateAvatarOptions = () => {
    const options: string[] = [];
    for (let i = 0; i < 20; i++) {
      const seed = `avatar-${i}-${Date.now()}`;
      const avatar = createAvatar(shapes, {
        seed: seed,
        size: 128,
        backgroundColor: AVATAR_COLORS,
      });
      options.push(avatar.toDataUri());
    }
    return options;
  };

  const avatarOptions = generateAvatarOptions();

  const handleSelect = (avatar: string, index: number) => {
    setSelectedIndex(index);
    onSelect(avatar);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-txt-dark">Seleccionar Avatar</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-silver/10 text-txt-muted transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4 max-h-96 overflow-y-auto">
          {avatarOptions.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handleSelect(avatar, index)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20 scale-105'
                  : 'border-silver/30 hover:border-primary/50'
              }`}
            >
              <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-silver/30 hover:bg-silver/10 text-txt-dark transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (selectedIndex !== null) {
                onSelect(avatarOptions[selectedIndex]);
                onClose();
              }
            }}
            disabled={selectedIndex === null}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

