import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  project?: Project | null;
}

export const ProjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  project
}: ProjectFormModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setName(project.name);
      } else {
        setName('');
      }
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSubmit({
      name: name.trim()
    });

    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      placement="center"
      classNames={{
        base: "bg-bg-dark",
        backdrop: "bg-black/50",
        wrapper: "z-[100]",
        body: "text-txt-light",
        header: "text-txt-light border-b border-silver/10"
      }}
    >
      <ModalContent className="bg-bg-dark">
        {(onClose) => (
          <>
            <ModalHeader className="text-txt-light border-b border-silver/10">
              {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </ModalHeader>
            <ModalBody className="pb-6 text-txt-light">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nombre del proyecto"
                  className="w-full px-3 py-2 rounded-lg border border-silver/30 bg-bg-dark text-txt-light placeholder:text-txt-muted focus:outline-none focus:border-primary"
                  autoFocus
                />

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={onClose} type="button">
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary">
                    {project ? 'Guardar' : 'Crear'}
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

