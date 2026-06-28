import { api } from './api';
import { type Game } from '../types/game';
import type { Genre } from '../types/genre';

interface GamesResponse {
  games: Game[];
  totalCount: number;
  totalPages: number;
}

interface Props {
  searchWord?: string;
  sortByTitle?: 'not' | 'asc' | 'desc';
  sortByRating?: 'not' | 'asc' | 'desc';
  genres?: Genre['name'][];
  page?: number;
  limit?: number;
}

export const getAllGames = async (): Promise<Game[]> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', '1000');

    const response = await api.get<GamesResponse>(
      `/games?${params.toString()}`,
    );

    return response.data.games;
  } catch (error) {
    console.error('❌ Ошибка получения всех игр:', error);
    return [];
  }
};

export const getGamesWithPagination = async ({
  searchWord,
  sortByTitle,
  sortByRating,
  genres,
  page = 1,
  limit = 20,
}: Props): Promise<GamesResponse> => {
  try {
    const params = new URLSearchParams();

    params.append('page', String(page));
    params.append('limit', String(limit));

    if (searchWord?.trim()) {
      params.append('search', searchWord.trim());
    }

    if (genres?.length) {
      params.append('genres', genres.join(','));
    }

    if (sortByTitle === 'asc') {
      params.append('sortBy', 'title');
      params.append('sortOrder', 'asc');
    } else if (sortByTitle === 'desc') {
      params.append('sortBy', 'title');
      params.append('sortOrder', 'desc');
    }

    if (sortByRating === 'asc') {
      params.append('sortBy', 'rating');
      params.append('sortOrder', 'asc');
    } else if (sortByRating === 'desc') {
      params.append('sortBy', 'rating');
      params.append('sortOrder', 'desc');
    }

    const response = await api.get<GamesResponse>(
      `/games?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения игр с пагинацией:', error);
    return { games: [], totalCount: 0, totalPages: 0 };
  }
};
