import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabId = 'overview' | 'integrations' | 'analytics' | 'settings' | 'chats' | 'knowledge-base' | 'support' | 'logs' | 'channels';

interface SidebarState {
  isCollapsed: boolean;
  width: number;
  collapsedWidth: number;
  expandedWidth: number;
  minWidth: number;
  maxWidth: number;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setWidth: (width: number) => void;
  resetWidth: () => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      width: 250,
      collapsedWidth: 70,
      expandedWidth: 250,
      minWidth: 180,
      maxWidth: 400,
      isMobileOpen: false,
      toggleCollapsed: () => set((state) => {
        const newCollapsed = !state.isCollapsed;
        return { 
          isCollapsed: newCollapsed,
          width: newCollapsed ? state.collapsedWidth : state.expandedWidth
        };
      }),
      setCollapsed: (collapsed) => set((state) => ({ 
        isCollapsed: collapsed,
        width: collapsed ? state.collapsedWidth : state.expandedWidth
      })),
      setWidth: (width) => set((state) => {
        if (state.isCollapsed) return state;
        
        // Clamp width between min and max values
        const clampedWidth = Math.max(state.minWidth, Math.min(state.maxWidth, width));
        return { 
          width: clampedWidth,
          expandedWidth: clampedWidth
        };
      }),
      resetWidth: () => set({ 
        width: 250,
        expandedWidth: 250
      }),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
      toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
    }),
    {
      name: 'sidebar-storage',
      skipHydration: true, // Skip hydration to prevent flicker on load
    }
  )
); 