import { PlusIcon } from '@heroicons/react/24/outline';
import { useDisclosure } from '@heroui/react';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { useProjectStore } from '@/store/project.store';

export const CreateProjectButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createProject, fetchProjects } = useProjectStore();

  const handleSubmit = async (data: { name: string }) => {
    await createProject(data.name);
    fetchProjects();
    onClose();
  };

  return (
    <>
      <button onClick={onOpen} className="p-1.5 hover:bg-silver/10 rounded transition-all" title="Crear nuevo proyecto">
        <PlusIcon className="w-4 h-4 text-txt-muted" />
      </button>
      <ProjectFormModal isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
    </>
  );
};
