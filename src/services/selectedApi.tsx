import { api } from './api';
import type { Game } from '../types/game';
import type {
  SelectedGamesResponse,
  SelectedActionResponse,
} from '../types/selected';

interface GetSelectedParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  genres?: string[];
}
export const getSelectedGames = async ({
  page = 1,
  limit = 20,
  sortBy = 'title',
  sortOrder = 'asc',
  search,
  genres,
}: GetSelectedParams = {}): Promise<{ games: Game[]; total: number }> => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);

    if (search?.trim()) {
      params.append('search', search.trim());
    }
    if (genres?.length) {
      params.append('genres', genres.join(','));
    }

    const response = await api.get<SelectedGamesResponse>(
      `/selected?${params.toString()}`,
    );

    const games = response.data.selected.games || [];
    const total = response.data.selected.totalCount || 0;

    return { games, total };
  } catch (error) {
    console.error('❌ Ошибка получения избранных игр:', error);
    return { games: [], total: 0 };
  }
};

export const addSelectedGame = async (gameId: string): Promise<Game[]> => {
  try {
    const response = await api.post<SelectedActionResponse>(
      `/selected/${gameId}`,
    );
    return response.data.selected || [];
  } catch (error) {
    console.error('❌ Ошибка добавления в избранное:', error);
    return [];
  }
};

export const removeSelectedGame = async (gameId: string): Promise<Game[]> => {
  try {
    const response = await api.delete<SelectedActionResponse>(
      `/selected/${gameId}`,
    );
    return response.data.selected || [];
  } catch (error) {
    console.error('❌ Ошибка удаления из избранного:', error);
    return [];
  }
};
