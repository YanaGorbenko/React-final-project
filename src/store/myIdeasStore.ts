import { create } from 'zustand';
import { type GameIdea, type CreateGameIdea } from '../types/gameIdea';
import {
  getMyIdeas,
  addMyIdea,
  updateMyIdea,
  deleteMyIdea,
} from '../services/myIdeasApi';
import { useGameIdeasStore } from './gameIdeasStore';

interface MyIdeasStore {
  myIdeas: GameIdea[];
  isLoading: boolean;
  error: string | null;

  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };

  fetchMyIdeas: (page?: number) => Promise<void>;
  loadMoreMyIdeas: () => Promise<void>;
  addIdea: (ideaData: CreateGameIdea) => Promise<void>;
  updateIdea: (id: string, ideaData: Partial<CreateGameIdea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
}

export const useMyIdeasStore = create<MyIdeasStore>((set, get) => ({
  myIdeas: [],
  isLoading: false,
  error: null,

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: true,
  },

  fetchMyIdeas: async (page: number = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getMyIdeas(page);
      set({
        myIdeas: response.ideas,
        isLoading: false,
        pagination: {
          currentPage: page,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          hasMore: page < response.totalPages,
        },
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch ideas',
        isLoading: false,
      });
    }
  },

  loadMoreMyIdeas: async () => {
    const { myIdeas, pagination } = get();
    if (!pagination.hasMore) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const nextPage = pagination.currentPage + 1;
      const response = await getMyIdeas(nextPage);
      set({
        myIdeas: [...myIdeas, ...response.ideas],
        isLoading: false,
        pagination: {
          currentPage: nextPage,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          hasMore: nextPage < response.totalPages,
        },
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load more ideas',
        isLoading: false,
      });
    }
  },

  addIdea: async (ideaData: CreateGameIdea) => {
    set({ isLoading: true, error: null });
    try {
      await addMyIdea(ideaData);

      await get().fetchMyIdeas(get().pagination.currentPage);

      const { fetchGamesIdeas } = useGameIdeasStore.getState();
      await fetchGamesIdeas(1);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add idea',
        isLoading: false,
      });
    }
  },

  updateIdea: async (id: string, ideaData: Partial<CreateGameIdea>) => {
    set({ isLoading: true, error: null });
    try {
      await updateMyIdea(id, ideaData);

      await get().fetchMyIdeas(get().pagination.currentPage);

      const { fetchGamesIdeas } = useGameIdeasStore.getState();
      await fetchGamesIdeas(1);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update idea',
        isLoading: false,
      });
    }
  },

  deleteIdea: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteMyIdea(id);

      await get().fetchMyIdeas(get().pagination.currentPage);

      const { fetchGamesIdeas } = useGameIdeasStore.getState();
      await fetchGamesIdeas(1);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete idea',
        isLoading: false,
      });
    }
  },
}));

export const selectMyIdeas = (state: MyIdeasStore) => state.myIdeas;
export const selectIsLoadingMyIdeas = (state: MyIdeasStore) => state.isLoading;
export const selectErrorMyIdeas = (state: MyIdeasStore) => state.error;
export const selectMyPagination = (state: MyIdeasStore) => state.pagination;
export const selectMyHasMore = (state: MyIdeasStore) =>
  state.pagination.hasMore;
export const selectMyTotalCount = (state: MyIdeasStore) =>
  state.pagination.totalCount;

export const selectFetchMyIdeas = (state: MyIdeasStore) => state.fetchMyIdeas;
export const selectLoadMoreMyIdeas = (state: MyIdeasStore) =>
  state.loadMoreMyIdeas;
export const selectAddMyIdea = (state: MyIdeasStore) => state.addIdea;
export const selectUpdateMyIdea = (state: MyIdeasStore) => state.updateIdea;
export const selectDeleteMyIdea = (state: MyIdeasStore) => state.deleteIdea;
