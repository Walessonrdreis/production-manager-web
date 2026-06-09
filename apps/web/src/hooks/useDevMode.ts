import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DevModeState {
  isDevMode: boolean;
  toggleDevMode: () => void;
  setDevMode: (state: boolean) => void;
}

export const useDevMode = create<DevModeState>()(
  persist(
    (set) => ({
      // Initially, we can read from an env var, or default to false
      isDevMode: import.meta.env.VITE_ENABLE_DEV_BOUNDARIES === 'true',
      toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
      setDevMode: (state) => set({ isDevMode: state }),
    }),
    {
      name: 'dev-mode-storage', // saves to localStorage
    }
  )
);
