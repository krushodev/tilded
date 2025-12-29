import { useState, useCallback } from 'react';
import { Modal, ModalContent, ModalBody, Button } from '@heroui/react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ConfirmDialog {
  id: string;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

let toastId = 0;
let confirmId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration = 3000) => {
    const id = `toast-${toastId++}`;
    const newToast: Toast = { id, type, title, message, duration };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    const id = `confirm-${confirmId++}`;
    setConfirmDialog({ id, title, message, onConfirm, onCancel });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmDialog) {
      confirmDialog.onConfirm();
      setConfirmDialog(null);
    }
  }, [confirmDialog]);

  const handleCancel = useCallback(() => {
    if (confirmDialog) {
      confirmDialog.onCancel?.();
      setConfirmDialog(null);
    }
  }, [confirmDialog]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getToastBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500';
      case 'error':
        return 'bg-red-50 border-red-500';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500';
      case 'info':
        return 'bg-blue-50 border-blue-500';
    }
  };

  const getToastTextColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
    }
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[99999] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getToastBgColor(toast.type)} ${getToastTextColor(
            toast.type
          )} border-2 rounded-lg p-4 min-w-[300px] max-w-[400px] shadow-lg flex items-start gap-3 animate-in slide-in-from-right`}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.message && <p className="text-xs opacity-80 mt-1">{toast.message}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const ConfirmModal = () => (
    <Modal
      isOpen={!!confirmDialog}
      onClose={handleCancel}
      placement="center"
      classNames={{
        base: 'bg-bg-dark',
        backdrop: 'bg-black/50',
        wrapper: 'z-[99998]',
        body: 'text-txt-light',
        header: 'text-txt-light border-b border-silver/10'
      }}
    >
      <ModalContent className="bg-bg-dark">
        {onClose => (
          <>
            <ModalBody className="pb-6 text-txt-light">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-txt mb-2">{confirmDialog?.title}</h3>
                  <p className="text-sm text-txt-muted">{confirmDialog?.message}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCancel} className="text-txt-light">
                    Cancelar
                  </Button>
                  <Button color="danger" onClick={handleConfirm}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return {
    showToast,
    showConfirm,
    ToastContainer,
    ConfirmModal
  };
};
