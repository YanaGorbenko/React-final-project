import { create } from 'zustand';
import { type GameIdea } from '../types/gameIdea';
import {
  getAllGamesIdeas,
  unvoteForIdea,
  voteForIdea,
} from '../services/gamesIdeasApi';
import { useAuthStore } from './authStore';

interface GameIdeasStore {
  ideas: GameIdea[];
  isLoading: boolean;
  error: string | null;

  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };

  fetchGamesIdeas: (page?: number) => Promise<void>;
  loadMoreIdeas: () => Promise<void>;

  toggleVote: (ideaId: string) => Promise<boolean>;
}

export const useGameIdeasStore = create<GameIdeasStore>((set, get) => ({
  ideas: [],
  isLoading: false,
  error: null,

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: true,
  },

  fetchGamesIdeas: async (page: number = 1) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllGamesIdeas(page);

      set({
        ideas: response.ideas,
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
        error:
          error instanceof Error ? error.message : 'Failed to fetch game ideas',
        isLoading: false,
      });
    }
  },

  loadMoreIdeas: async () => {
    const { ideas, pagination } = get();

    if (!pagination.hasMore) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const nextPage = pagination.currentPage + 1;
      const response = await getAllGamesIdeas(nextPage);

      set({
        ideas: [...ideas, ...response.ideas],
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

  toggleVote: async (ideaId: string): Promise<boolean> => {
    const { ideas } = get();
    const ideaIndex = ideas.findIndex(i => i._id === ideaId);

    if (ideaIndex === -1) {
      console.error('❌ Идея не найдена');
      return false;
    }

    const idea = ideas[ideaIndex];
    const currentUser = useAuthStore.getState().user;

    const userId = currentUser?._id || null;

    const getAuthorId = (author: any): string => {
      if (!author) return '';
      if (typeof author === 'object') return author._id || '';
      return String(author);
    };

    const authorId = getAuthorId(idea.authorId);

    if (userId === authorId) {
      console.warn('⚠️ Нельзя голосовать за свою идею');
      return false;
    }

    try {
      let updatedIdea: GameIdea | null;

      const hasVoted =
        userId && idea.voters ? idea.voters.includes(userId) : false;

      if (hasVoted) {
        updatedIdea = await unvoteForIdea(ideaId);
      } else {
        updatedIdea = await voteForIdea(ideaId);
      }

      if (updatedIdea) {
        const updatedIdeas = [...ideas];
        updatedIdeas[ideaIndex] = updatedIdea;
        set({ ideas: updatedIdeas });
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Ошибка изменения голоса:', error);
      return false;
    }
  },
}));

export const selectGamesIdeas = (state: GameIdeasStore) => state.ideas;
export const selectIsLoadingIdeas = (state: GameIdeasStore) => state.isLoading;
export const selectErrorIdeas = (state: GameIdeasStore) => state.error;

export const selectPagination = (state: GameIdeasStore) => state.pagination;
export const selectHasMore = (state: GameIdeasStore) =>
  state.pagination.hasMore;
export const selectTotalCount = (state: GameIdeasStore) =>
  state.pagination.totalCount;
export const selectCurrentPage = (state: GameIdeasStore) =>
  state.pagination.currentPage;

export const selectFetchGamesIdeas = (state: GameIdeasStore) =>
  state.fetchGamesIdeas;
export const selectLoadMoreIdeas = (state: GameIdeasStore) =>
  state.loadMoreIdeas;
export const selectToggleVote = (state: GameIdeasStore) => state.toggleVote;
