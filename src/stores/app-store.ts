import { createStore } from 'zustand/vanilla';

export interface AppState {
  sidebarOpen: boolean;
}

export interface AppActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export type AppStore = AppState & AppActions;

export const defaultAppState: AppState = {
  sidebarOpen: false,
};

export const createAppStore = (initState: AppState = defaultAppState) =>
  createStore<AppStore>()((set) => ({
    ...initState,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
  }));
