import { api } from './api';
import { type GameIdea } from '../types/gameIdea';

interface IdeasResponse {
  ideas: GameIdea[];
  totalCount: number;
  totalPages: number;
}

export const getAllGamesIdeas = async (
  page: number = 1,
): Promise<IdeasResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '20');

    const response = await api.get<IdeasResponse>(
      `/ideas/all?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения идей:', error);
    return { ideas: [], totalCount: 0, totalPages: 0 };
  }
};

export const voteForIdea = async (ideaId: string): Promise<GameIdea | null> => {
  try {
    const response = await api.post<{ data: GameIdea }>(
      `/ideas/${ideaId}/vote`,
    );
    return response.data.data;
  } catch (error) {
    console.error('❌ Ошибка голосования:', error);
    return null;
  }
};

export const unvoteForIdea = async (
  ideaId: string,
): Promise<GameIdea | null> => {
  try {
    const response = await api.delete<{ data: GameIdea }>(
      `/ideas/${ideaId}/vote`,
    );
    return response.data.data;
  } catch (error) {
    console.error('❌ Ошибка отмены голоса:', error);
    return null;
  }
};
