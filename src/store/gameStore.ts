import { create } from 'zustand';
import { type Game } from '../types/game';
import { getGames } from '../services/games';

interface GamesStore {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  getTopRatedGame: () => Game | undefined;
  getTopEightRatedGames: () => Game[];
  getFiveNewestGames: () => Game[];
}

export const useGamesStore = create<GamesStore>((set, get) => ({
  games: [],
  isLoading: false,
  error: null,
  fetchGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const games = await getGames();
      set({ games, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
      });
    }
  },
  getTopRatedGame: () => {
    const { games } = get();
    if (games.length === 0) return undefined;

    return games.reduce((top, current) =>
      current.rating > top.rating ? current : top,
    );
  },

  getTopEightRatedGames: () => {
    const { games } = get();
    return [...games].sort((a, b) => b.rating - a.rating).slice(0, 8);
  },

  getFiveNewestGames: () => {
    const { games } = get();
    return [...games]
      .sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      )
      .slice(0, 5);
  },
}));

export const selectAllGames = (state: GamesStore) => state.games;
export const selectIsLoading = (state: GamesStore) => state.isLoading;
export const selectError = (state: GamesStore) => state.error;
export const selectFetchGames = (state: GamesStore) => state.fetchGames;
export const selectGetTopRatedGame = (state: GamesStore) =>
  state.getTopRatedGame;
export const selectGetTopEightRatedGames = (state: GamesStore) =>
  state.getTopEightRatedGames;
export const selectGetFiveNewestGames = (state: GamesStore) =>
  state.getFiveNewestGames;
