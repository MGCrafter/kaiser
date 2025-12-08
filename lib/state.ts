import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => {
        set({ token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('directus_token');
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;