import { create } from 'zustand';
import { type Game } from '../types/game';
import { getAllGames, getGamesWithPagination } from '../services/gamesApi';

interface GamesStore {
  games: Game[];
  filteredGames: Game[];
  isLoading: boolean;
  error: string | null;

  Filters: {
    searchWord: string;
    sortByTitle: 'not' | 'asc' | 'desc';
    sortByRating: 'not' | 'asc' | 'desc';
    genresFilter: string[];
  };

  top8RatedGames: Game[];
  newGames: Game[];
  top3GamesByGenre: { [genre: string]: Game[] };

  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
    limit: number;
  };

  fetchAllGames: () => Promise<void>;
  fetchGamesPage: (page: number) => Promise<void>;
  loadMoreGames: () => Promise<void>;
  resetGames: () => void;

  setSearchWord: (word: string) => void;
  setSortByTitle: (sort: 'asc' | 'desc' | 'not') => void;
  setSortByRating: (sort: 'asc' | 'desc' | 'not') => void;
  setGenresFilter: (genres: string[]) => void;

  getTopRatedGame: () => Game | undefined;
  updateTop3GamesByGenre: () => void;
}

export const useGamesStore = create<GamesStore>((set, get) => ({
  games: [],
  filteredGames: [],
  isLoading: false,
  error: null,

  Filters: {
    searchWord: '',
    sortByTitle: 'not',
    sortByRating: 'not',
    genresFilter: [],
  },

  top8RatedGames: [],
  newGames: [],
  top3GamesByGenre: {},

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: true,
    limit: 20,
  },

  updateTop3GamesByGenre: () => {
    const { games } = get();
    const genres = [
      'RPG',
      'Shooter',
      'Strategy',
      'Adventure',
      'Simulation',
      'Puzzle',
      'Horror',
      'Racing',
      'Action',
    ];

    const top3ByGenre: { [genre: string]: Game[] } = {};

    genres.forEach(genre => {
      const genreGames = games
        .filter(game => game.genre?.toLowerCase() === genre.toLowerCase())
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      top3ByGenre[genre] = genreGames;
    });

    set({ top3GamesByGenre: top3ByGenre });
  },

  fetchAllGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const allGames = await getAllGames();

      const top8RatedGames = [...allGames]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

      const newGames = [...allGames]
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime(),
        )
        .slice(0, 5);

      const limit = 20;
      const firstBatch = allGames.slice(0, limit);

      set({
        games: allGames,
        filteredGames: firstBatch,
        isLoading: false,
        top8RatedGames,
        newGames,
        pagination: {
          currentPage: 1,
          totalPages: Math.ceil(allGames.length / limit),
          totalCount: allGames.length,
          hasMore: allGames.length > limit,
          limit: limit,
        },
      });

      get().updateTop3GamesByGenre();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
      });
    }
  },

  fetchGamesPage: async (page: number) => {
    set({ isLoading: true, error: null });
    try {
      const { Filters, pagination } = get();

      const response = await getGamesWithPagination({
        searchWord: Filters.searchWord,
        sortByTitle: Filters.sortByTitle,
        sortByRating: Filters.sortByRating,
        genres: Filters.genresFilter,
        page: page,
        limit: pagination.limit,
      });

      set({
        filteredGames: response.games,
        pagination: {
          currentPage: page,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          hasMore: page < response.totalPages,
          limit: pagination.limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch games page',
        isLoading: false,
      });
    }
  },

  loadMoreGames: async () => {
    const { filteredGames, pagination, Filters } = get();

    if (!pagination.hasMore) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const nextPage = pagination.currentPage + 1;
      const limit = pagination.limit;

      const response = await getGamesWithPagination({
        searchWord: Filters.searchWord,
        sortByTitle: Filters.sortByTitle,
        sortByRating: Filters.sortByRating,
        genres: Filters.genresFilter,
        page: nextPage,
        limit: limit,
      });

      const allFilteredGames = [...filteredGames, ...response.games];

      const { games } = get();
      const hasMore = allFilteredGames.length < games.length;

      set({
        filteredGames: allFilteredGames,
        pagination: {
          currentPage: nextPage,
          totalPages: response.totalPages,
          totalCount: response.totalCount,
          hasMore: hasMore,
          limit: limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load more games',
        isLoading: false,
      });
    }
  },

  resetGames: () => {
    set({
      games: [],
      filteredGames: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasMore: true,
        limit: 20,
      },
    });
    get().fetchAllGames();
  },

  setSearchWord: word => {
    set({ Filters: { ...get().Filters, searchWord: word } });
    get().fetchGamesPage(1);
  },

  setSortByTitle: sort => {
    set({
      Filters: {
        ...get().Filters,
        sortByTitle: sort,
        sortByRating: 'not',
      },
    });
    get().fetchGamesPage(1);
  },

  setSortByRating: sort => {
    set({
      Filters: {
        ...get().Filters,
        sortByRating: sort,
        sortByTitle: 'not',
      },
    });
    get().fetchGamesPage(1);
  },

  setGenresFilter: genres => {
    set({ Filters: { ...get().Filters, genresFilter: genres } });
    get().fetchGamesPage(1);
  },

  getTopRatedGame: () => {
    const { games } = get();
    if (games.length === 0) return undefined;
    return games.reduce((top, current) =>
      current.rating > top.rating ? current : top,
    );
  },
}));

export const selectGames = (state: GamesStore) => state.games;
export const selectAllGames = (state: GamesStore) => state.games;
export const selectFetchAllGames = (state: GamesStore) => state.fetchAllGames;

export const selectFilteredGames = (state: GamesStore) => state.filteredGames;
export const selectFilteredAllGames = (state: GamesStore) =>
  state.filteredGames;
export const selectFetchGamesPage = (state: GamesStore) => state.fetchGamesPage;
export const selectLoadMoreGames = (state: GamesStore) => state.loadMoreGames;
export const selectPagination = (state: GamesStore) => state.pagination;
export const selectHasMore = (state: GamesStore) => state.pagination.hasMore;
export const selectTotalCount = (state: GamesStore) =>
  state.pagination.totalCount;
export const selectCurrentPage = (state: GamesStore) =>
  state.pagination.currentPage;

export const selectTopEightRatedGames = (state: GamesStore) =>
  state.top8RatedGames;
export const selectFiveNewestGames = (state: GamesStore) => state.newGames;
export const selectTop3GamesByGenre = (state: GamesStore) =>
  state.top3GamesByGenre;
export const selectGetTopRatedGame = (state: GamesStore) =>
  state.getTopRatedGame;

export const selectIsLoading = (state: GamesStore) => state.isLoading;
export const selectError = (state: GamesStore) => state.error;
export const selectResetGames = (state: GamesStore) => state.resetGames;

export const selectAllSearchWord = (state: GamesStore) =>
  state.Filters.searchWord;
export const selectAllSortByTitle = (state: GamesStore) =>
  state.Filters.sortByTitle;
export const selectAllSortByRating = (state: GamesStore) =>
  state.Filters.sortByRating;
export const selectAllGenresFilter = (state: GamesStore) =>
  state.Filters.genresFilter;

export const selectSetAllSearchWord = (state: GamesStore) =>
  state.setSearchWord;
export const selectSetAllSortByTitle = (state: GamesStore) =>
  state.setSortByTitle;
export const selectSetAllSortByRating = (state: GamesStore) =>
  state.setSortByRating;
export const selectSetAllGenresFilter = (state: GamesStore) =>
  state.setGenresFilter;
