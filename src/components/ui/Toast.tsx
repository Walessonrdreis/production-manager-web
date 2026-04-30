import { toast } from 'sonner';

export const useToast = () => {
  return {
    success: (message: string, title?: string) => {
      toast.success(title || message, {
        description: title ? message : undefined,
      });
    },
    error: (message: string, title?: string) => {
      toast.error(title || message, {
        description: title ? message : undefined,
      });
    },
    info: (message: string, title?: string) => {
      toast.info(title || message, {
        description: title ? message : undefined,
      });
    },
    addToast: (t: { message: string, title?: string, type: 'success' | 'error' | 'info' }) => {
      const fn = t.type === 'success' ? toast.success : t.type === 'error' ? toast.error : toast.info;
      fn(t.title || t.message, {
        description: t.title ? t.message : undefined,
      });
    }
  };
};

export const useToastStore = {
  setState: () => {},
  getState: () => ({ toasts: [] }),
  subscribe: () => () => {},
};

export function ToastContainer() {
  return null; // Managed by Providers via Toaster
}

