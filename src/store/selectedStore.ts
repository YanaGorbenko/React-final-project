import { create } from 'zustand';
import type { Game } from '../types/game';
import {
  getSelectedGames,
  addSelectedGame,
  removeSelectedGame,
} from '../services/selectedApi';

interface SelectedFilters {
  searchWord: string;
  sortByTitle: 'not' | 'asc' | 'desc';
  sortByRating: 'not' | 'asc' | 'desc';
  genresFilter: string[];
}

interface SelectedStore {
  games: Game[];
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
    limit: number;
  };
  filters: SelectedFilters;

  fetchSelected: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  toggleSelected: (gameId: string) => Promise<boolean>;
  isSelected: (gameId: string) => boolean;

  setSearchWord: (word: string) => void;
  setSortByTitle: (sort: 'asc' | 'desc' | 'not') => void;
  setSortByRating: (sort: 'asc' | 'desc' | 'not') => void;
  setGenresFilter: (genres: string[]) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const initialFilters: SelectedFilters = {
  searchWord: '',
  sortByTitle: 'not',
  sortByRating: 'not',
  genresFilter: [],
};

export const useSelectedStore = create<SelectedStore>((set, get) => ({
  games: [],
  selectedIds: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
    limit: 20,
  },
  filters: initialFilters,

  fetchSelected: async (page: number = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();

      let sortBy = 'title';
      let sortOrder: 'asc' | 'desc' = 'asc';

      if (filters.sortByTitle !== 'not') {
        sortBy = 'title';
        sortOrder = filters.sortByTitle;
      } else if (filters.sortByRating !== 'not') {
        sortBy = 'rating';
        sortOrder = filters.sortByRating;
      }

      const response = await getSelectedGames({
        page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        search: filters.searchWord,
        genres: filters.genresFilter,
      });

      const ids = response.games.map(game => game._id);

      const allGames =
        page === 1 ? response.games : [...get().games, ...response.games];
      const allIds = page === 1 ? ids : [...get().selectedIds, ...ids];

      set({
        games: allGames,
        selectedIds: allIds,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(response.total / pagination.limit),
          totalCount: response.total,
          hasMore: page < Math.ceil(response.total / pagination.limit),
          limit: pagination.limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch selected games', isLoading: false });
    }
  },

  loadMore: async () => {
    const { pagination, games, selectedIds } = get();

    if (!pagination.hasMore) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const nextPage = pagination.currentPage + 1;
      const { filters } = get();

      let sortBy = 'title';
      let sortOrder: 'asc' | 'desc' = 'asc';

      if (filters.sortByTitle !== 'not') {
        sortBy = 'title';
        sortOrder = filters.sortByTitle;
      } else if (filters.sortByRating !== 'not') {
        sortBy = 'rating';
        sortOrder = filters.sortByRating;
      }

      const response = await getSelectedGames({
        page: nextPage,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        search: filters.searchWord,
        genres: filters.genresFilter,
      });

      const newIds = response.games.map(game => game._id);

      set({
        games: [...games, ...response.games],
        selectedIds: [...selectedIds, ...newIds],
        pagination: {
          currentPage: nextPage,
          totalPages: Math.ceil(response.total / pagination.limit),
          totalCount: response.total,
          hasMore: nextPage < Math.ceil(response.total / pagination.limit),
          limit: pagination.limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to load more selected games', isLoading: false });
    }
  },

  toggleSelected: async (gameId: string): Promise<boolean> => {
    const { selectedIds } = get();
    const isCurrentlySelected = selectedIds.includes(gameId);

    try {
      let games: Game[];
      let newIds: string[];

      if (isCurrentlySelected) {
        games = await removeSelectedGame(gameId);
        newIds = games.map(g => g._id);
        set({ selectedIds: newIds, games });
      } else {
        games = await addSelectedGame(gameId);
        newIds = games.map(g => g._id);
        set({ selectedIds: newIds, games });
      }

      return !isCurrentlySelected;
    } catch (error) {
      console.error('❌ Ошибка изменения избранного:', error);
      return isCurrentlySelected;
    }
  },

  isSelected: (gameId: string): boolean => {
    return get().selectedIds.includes(gameId);
  },

  setSearchWord: (searchWord: string) => {
    set(state => ({
      filters: { ...state.filters, searchWord },
    }));
    get().fetchSelected(1);
  },

  setSortByTitle: (sortByTitle: 'asc' | 'desc' | 'not') => {
    set(state => ({
      filters: {
        ...state.filters,
        sortByTitle,
        sortByRating: 'not',
      },
    }));
    get().fetchSelected(1);
  },

  setSortByRating: (sortByRating: 'asc' | 'desc' | 'not') => {
    set(state => ({
      filters: {
        ...state.filters,
        sortByRating,
        sortByTitle: 'not',
      },
    }));
    get().fetchSelected(1);
  },

  setGenresFilter: (genresFilter: string[]) => {
    set(state => ({
      filters: { ...state.filters, genresFilter },
    }));
    get().fetchSelected(1);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchSelected(1);
  },

  applyFilters: () => {
    get().fetchSelected(1);
  },
}));

export const selectGames = (state: SelectedStore) => state.games;
export const selectSelectedIds = (state: SelectedStore) => state.selectedIds;
export const selectIsLoading = (state: SelectedStore) => state.isLoading;
export const selectError = (state: SelectedStore) => state.error;
export const selectPagination = (state: SelectedStore) => state.pagination;
export const selectHasMore = (state: SelectedStore) => state.pagination.hasMore;
export const selectTotalCount = (state: SelectedStore) =>
  state.pagination.totalCount;
export const selectFilters = (state: SelectedStore) => state.filters;

export const selectFetchSelected = (state: SelectedStore) =>
  state.fetchSelected;
export const selectLoadMore = (state: SelectedStore) => state.loadMore;
export const selectToggleSelected = (state: SelectedStore) =>
  state.toggleSelected;
export const selectIsSelected = (state: SelectedStore) => state.isSelected;

export const selectSearchWord = (state: SelectedStore) =>
  state.filters.searchWord;
export const selectSortByTitle = (state: SelectedStore) =>
  state.filters.sortByTitle;
export const selectSortByRating = (state: SelectedStore) =>
  state.filters.sortByRating;
export const selectGenresFilter = (state: SelectedStore) =>
  state.filters.genresFilter;

export const selectSetSearchWord = (state: SelectedStore) =>
  state.setSearchWord;
export const selectSetSortByTitle = (state: SelectedStore) =>
  state.setSortByTitle;
export const selectSetSortByRating = (state: SelectedStore) =>
  state.setSortByRating;
export const selectSetGenresFilter = (state: SelectedStore) =>
  state.setGenresFilter;
export const selectResetFilters = (state: SelectedStore) => state.resetFilters;
export const selectApplyFilters = (state: SelectedStore) => state.applyFilters;
