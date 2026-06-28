import { api } from './api';
import {
  type CreateGameIdea,
  type GameIdea,
  type UpdateGameIdea,
} from '../types/gameIdea';

interface IdeasResponse {
  ideas: GameIdea[];
  totalCount: number;
  totalPages: number;
}

export const getMyIdeas = async (page: number = 1): Promise<IdeasResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '20');

    const response = await api.get<IdeasResponse>(
      `/ideas?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения идей:', error);
    return { ideas: [], totalCount: 0, totalPages: 0 };
  }
};

export const addMyIdea = async (
  ideaData: CreateGameIdea,
): Promise<GameIdea | null> => {
  try {
    const response = await api.post<GameIdea>('/ideas', ideaData);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка добавления идеи:', error);
    return null;
  }
};

export const updateMyIdea = async (
  id: string,
  ideaData: Partial<UpdateGameIdea>,
): Promise<GameIdea | null> => {
  try {
    const response = await api.patch<GameIdea>(`/ideas/${id}`, ideaData);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка обновления идеи:', error);
    return null;
  }
};

export const deleteMyIdea = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/ideas/${id}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка удаления идеи:', error);
    return false;
  }
};
