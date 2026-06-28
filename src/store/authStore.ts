import type { User } from '../types/auth';
import { create } from 'zustand';
import { useGameIdeasStore } from './gameIdeasStore';
import { useMyIdeasStore } from './myIdeasStore';

interface AuthStore {
  isAuth: boolean;
  isFetchingUser: boolean;
  user: User | null;
  error: string | null;

  setUser: (user: User) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setIsFetching: (isFetching: boolean) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuth: false,
  isFetchingUser: false,
  user: null,
  error: null,

  setUser: user => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuth: true, error: null });
  },

  clearAuth: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuth: false, error: null });
  },

  setError: error => set({ error }),
  setIsFetching: isFetchingUser => set({ isFetchingUser }),

  updateUser: user => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuth: true, error: null });

    setTimeout(() => {
      const { fetchGamesIdeas } = useGameIdeasStore.getState();
      const { fetchMyIdeas } = useMyIdeasStore.getState();

      fetchGamesIdeas(1);
      fetchMyIdeas(1);
    }, 100);
  },
}));

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuth = (state: AuthStore) => state.isAuth;
export const selectIsFetching = (state: AuthStore) => state.isFetchingUser;
export const selectError = (state: AuthStore) => state.error;

export const selectSetUser = (state: AuthStore) => state.setUser;
export const selectClearAuth = (state: AuthStore) => state.clearAuth;
export const selectSetError = (state: AuthStore) => state.setError;
export const selectSetIsFetching = (state: AuthStore) => state.setIsFetching;
export const selectUpdateUser = (state: AuthStore) => state.updateUser;
