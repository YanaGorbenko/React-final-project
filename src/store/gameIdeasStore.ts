import { create } from 'zustand';
import { type CreateGameIdea, type GameIdea } from '../types/gameIdea';
import {
  addGameIdeas,
  changeVotes,
  getGameIdeas,
} from '../services/gamesIdeasApi';

interface GameIdeasStore {
  ideas: GameIdea[];
  isLoading: boolean;
  error: string | null;
  fetchGamesIdeas: () => Promise<void>;
  addNewIdea: (idea: CreateGameIdea) => Promise<void>;
  changeIdeaVotes: (id: GameIdea['id']) => Promise<void>;
}

export const useGameIdeasStore = create<GameIdeasStore>((set, get) => ({
  ideas: [],
  isLoading: false,
  error: null,
  fetchGamesIdeas: async () => {
    set({ isLoading: true, error: null });

    try {
      const ideas = await getGameIdeas();

      set({
        ideas,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch gameIdeas',
        isLoading: false,
      });
    }
  },

  addNewIdea: async idea => {
    set({ isLoading: true, error: null });
    const { ideas } = get();
    try {
      const newIdea = await addGameIdeas(idea);
      const newIdeas = [...ideas, newIdea];
      set({
        ideas: newIdeas,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
      });
    }
  },
  changeIdeaVotes: async id => {
    set({ isLoading: true, error: null });
    const { ideas } = get();

    try {
      const ideaToUpdate = ideas.find(idea => idea.id === id);

      if (!ideaToUpdate) {
        throw new Error('Idea not found');
      }
      const updatedIdea = {
        ...ideaToUpdate,
        votes: ideaToUpdate.votes + 1,
      };

      const newIdea = await changeVotes(updatedIdea);

      const newIdeas = ideas.map(idea => (idea.id === id ? newIdea : idea));

      set({
        ideas: newIdeas,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to change votes',
        isLoading: false,
      });
    }
  },
}));

export const selectGamesIdeas = (state: GameIdeasStore) => state.ideas;
export const selectFetchGamesIdeas = (state: GameIdeasStore) =>
  state.fetchGamesIdeas;
export const selectAddNewIdea = (state: GameIdeasStore) => state.addNewIdea;
export const selectChangeIdeasVotes = (state: GameIdeasStore) =>
  state.changeIdeaVotes;
export const selectIsLoadingIdeas = (state: GameIdeasStore) => state.isLoading;
export const selectErrorIdeas = (state: GameIdeasStore) => state.error;
