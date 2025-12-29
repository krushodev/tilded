import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import type { ToastType } from '@/hooks/useToast';

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { showToast, showConfirm, ToastContainer, ConfirmModal } = useToast();

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}
      <ToastContainer />
      <ConfirmModal />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};
