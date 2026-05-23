import { create } from 'zustand';
import { type Game } from '../types/game';
import { changeIsFavorite, getGames } from '../services/gamesApi';
import { filterAndSortGames } from '../utils/filterUtils';

interface GamesStore {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  allFilters: {
    searchWord: string;
    sortByTitle: 'not' | 'asc' | 'desc';
    sortByRating: 'not' | 'asc' | 'desc';
    genresFilter: string[];
  };

  selectedFilters: {
    searchWord: string;
    sortByTitle: 'not' | 'asc' | 'desc';
    sortByRating: 'not' | 'asc' | 'desc';
    genresFilter: string[];
  };

  filteredAllGames: Game[];
  filteredSelectedGames: Game[];
  top8RatedGames: Game[];

  newGames: Game[];
  top3GamesByGenre: { [genre: string]: Game[] };
  getTop3GamesByGenre: (genre: string) => Game[];
  updateTop3GamesByGenre: () => void;

  setAllSearchWord: (word: string) => void;
  setAllSortByTitle: (sort: 'asc' | 'desc' | 'not') => void;
  setAllSortByRating: (sort: 'asc' | 'desc' | 'not') => void;
  setAllGenresFilter: (genres: string[]) => void;
  applyAllFilters: () => void;

  setSelectedSearchWord: (word: string) => void;
  setSelectedSortByTitle: (sort: 'asc' | 'desc' | 'not') => void;
  setSelectedSortByRating: (sort: 'asc' | 'desc' | 'not') => void;
  setSelectedGenresFilter: (genres: string[]) => void;
  applySelectedFilters: () => void;

  fetchGames: () => Promise<void>;
  toggleFavorite: (gameId: string) => Promise<void>;
  getTopRatedGame: () => Game | undefined;
}

export const useGamesStore = create<GamesStore>((set, get) => ({
  games: [],
  isLoading: false,
  error: null,

  // Початкові стани фільтрів
  allFilters: {
    searchWord: '',
    sortByTitle: 'not',
    sortByRating: 'not',
    genresFilter: [],
  },

  selectedFilters: {
    searchWord: '',
    sortByTitle: 'not',
    sortByRating: 'not',
    genresFilter: [],
  },

  filteredAllGames: [],
  filteredSelectedGames: [],
  top8RatedGames: [],
  top3GamesByGenre: {},
  newGames: [],
  getTop3GamesByGenre: (genre: string) => {
    const { top3GamesByGenre } = get();
    return top3GamesByGenre[genre] || [];
  },

  // Оновлює топ-3 для всіх жанрів на основі поточних ігор
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
        .filter(game => game.genre.toLowerCase() === genre.toLowerCase())
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      top3ByGenre[genre] = genreGames;
    });

    set({ top3GamesByGenre: top3ByGenre });
  },

  fetchGames: async () => {
    set({ isLoading: true, error: null });

    try {
      const games = await getGames();
      const topGames = [...games]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      const newGames = [...games]
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime(),
        )
        .slice(0, 5);
      set({
        games,
        isLoading: false,
        filteredAllGames: games,
        filteredSelectedGames: games.filter(g => g.isFavorite),
        top8RatedGames: topGames,
        newGames,
      });
      get().updateTop3GamesByGenre();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
      });
    }
  },

  toggleFavorite: async (gameId: string) => {
    const { games } = get();

    const game = games.find(g => g.id === gameId);
    if (!game) return;

    try {
      const updatedGame = await changeIsFavorite(game, !game.isFavorite);

      const updatedGames = games.map(g => (g.id === gameId ? updatedGame : g));
      const topGames = [...updatedGames]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      const newGames = [...updatedGames]
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime(),
        )
        .slice(0, 5);

      set({ games: updatedGames, top8RatedGames: topGames, newGames });
      get().applyAllFilters();
      get().applySelectedFilters();
      get().updateTop3GamesByGenre();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  },

  // Методи для "Всі ігри"
  setAllSearchWord: word => {
    set({ allFilters: { ...get().allFilters, searchWord: word } });
    get().applyAllFilters();
  },

  setAllSortByTitle: sort => {
    set({ allFilters: { ...get().allFilters, sortByTitle: sort } });
    get().applyAllFilters();
  },

  setAllSortByRating: sort => {
    set({ allFilters: { ...get().allFilters, sortByRating: sort } });
    get().applyAllFilters();
  },

  setAllGenresFilter: genres => {
    set({ allFilters: { ...get().allFilters, genresFilter: genres } });
    get().applyAllFilters();
  },

  applyAllFilters: () => {
    const { games, allFilters } = get();
    const filtered = filterAndSortGames(games, {
      searchWord: allFilters.searchWord,
      sortByTitle: allFilters.sortByTitle,
      sortByRating: allFilters.sortByRating,
      genresFilter: allFilters.genresFilter,
    });
    set({ filteredAllGames: filtered });
  },

  // Методи для "Обрані ігри"
  setSelectedSearchWord: word => {
    set({ selectedFilters: { ...get().selectedFilters, searchWord: word } });
    get().applySelectedFilters();
  },

  setSelectedSortByTitle: sort => {
    set({ selectedFilters: { ...get().selectedFilters, sortByTitle: sort } });
    get().applySelectedFilters();
  },

  setSelectedSortByRating: sort => {
    set({ selectedFilters: { ...get().selectedFilters, sortByRating: sort } });
    get().applySelectedFilters();
  },

  setSelectedGenresFilter: genres => {
    set({
      selectedFilters: { ...get().selectedFilters, genresFilter: genres },
    });
    get().applySelectedFilters();
  },

  applySelectedFilters: () => {
    const { games, selectedFilters } = get();
    const selectedGames = games.filter(game => game.isFavorite);
    const filtered = filterAndSortGames(selectedGames, {
      searchWord: selectedFilters.searchWord,
      sortByTitle: selectedFilters.sortByTitle,
      sortByRating: selectedFilters.sortByRating,
      genresFilter: selectedFilters.genresFilter,
    });
    set({ filteredSelectedGames: filtered });
  },

  // Інші методи без змін...
  getTopRatedGame: () => {
    const { games } = get();
    if (games.length === 0) return undefined;
    return games.reduce((top, current) =>
      current.rating > top.rating ? current : top,
    );
  },
}));

// Селектори для "Всі ігри"
export const selectFilteredAllGames = (state: GamesStore) =>
  state.filteredAllGames;
export const selectAllSearchWord = (state: GamesStore) =>
  state.allFilters.searchWord;
export const selectAllSortByTitle = (state: GamesStore) =>
  state.allFilters.sortByTitle;
export const selectAllSortByRating = (state: GamesStore) =>
  state.allFilters.sortByRating;
export const selectAllGenresFilter = (state: GamesStore) =>
  state.allFilters.genresFilter;

export const selectSetAllSearchWord = (state: GamesStore) =>
  state.setAllSearchWord;
export const selectSetAllSortByTitle = (state: GamesStore) =>
  state.setAllSortByTitle;
export const selectSetAllSortByRating = (state: GamesStore) =>
  state.setAllSortByRating;
export const selectSetAllGenresFilter = (state: GamesStore) =>
  state.setAllGenresFilter;

// Селектори для "Обрані ігри"
export const selectFilteredSelectedGames = (state: GamesStore) =>
  state.filteredSelectedGames;
export const selectSelectedSearchWord = (state: GamesStore) =>
  state.selectedFilters.searchWord;
export const selectSelectedSortByTitle = (state: GamesStore) =>
  state.selectedFilters.sortByTitle;
export const selectSelectedSortByRating = (state: GamesStore) =>
  state.selectedFilters.sortByRating;
export const selectSelectedGenresFilter = (state: GamesStore) =>
  state.selectedFilters.genresFilter;

export const selectSetSelectedSearchWord = (state: GamesStore) =>
  state.setSelectedSearchWord;
export const selectSetSelectedSortByTitle = (state: GamesStore) =>
  state.setSelectedSortByTitle;
export const selectSetSelectedSortByRating = (state: GamesStore) =>
  state.setSelectedSortByRating;
export const selectSetSelectedGenresFilter = (state: GamesStore) =>
  state.setSelectedGenresFilter;

// Загальні селектори (для Hero, TopGames, NewGames)
export const selectAllGames = (state: GamesStore) => state.games;
export const selectIsLoading = (state: GamesStore) => state.isLoading;
export const selectError = (state: GamesStore) => state.error;
export const selectFetchGames = (state: GamesStore) => state.fetchGames;

// Селектори для методів (вони не змінюються, тому їх можна так і лишити)
export const selectGetTopRatedGame = (state: GamesStore) =>
  state.getTopRatedGame;
export const selectTopEightRatedGames = (state: GamesStore) =>
  state.top8RatedGames;
export const selectFiveNewestGames = (state: GamesStore) => state.newGames;

// Додаткові селектори, якщо потрібні
export const selectToggleFavorite = (state: GamesStore) => state.toggleFavorite;
export const selectTop3GamesByGenre = (state: GamesStore) =>
  state.top3GamesByGenre;
