import axios from 'axios';
import { type Game } from '../types/game';

axios.defaults.baseURL = 'https://69e4843acfa9394db8da25af.mockapi.io/api';
interface Props {
  searchWord?: string;
  sortByTitle?: 'not' | 'asc' | 'desc';
  sortByRating?: 'not' | 'asc' | 'desc';
}

export const getGames = async ({
  searchWord,
  sortByTitle,
  sortByRating,
}: Props): Promise<Game[]> => {
  const url = new URL('/games', axios.defaults.baseURL);
  if (searchWord && searchWord.trim()) {
    url.searchParams.append('search', searchWord.trim());
  }

  if (sortByTitle === 'asc') {
    url.searchParams.append('sortBy', 'title');
    url.searchParams.append('order', 'asc');
  } else if (sortByTitle === 'desc') {
    url.searchParams.append('sortBy', 'title');
    url.searchParams.append('order', 'desc');
  }

  if (sortByRating === 'asc') {
    url.searchParams.append('sortBy', 'rating');
    url.searchParams.append('order', 'asc');
  } else if (sortByRating === 'desc') {
    url.searchParams.append('sortBy', 'rating');
    url.searchParams.append('order', 'desc');
  }
  try {
    const response = await axios.get<Game[]>(url.toString(), {
      headers: { 'content-type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error);

    return [];
  }
};

export const changeIsFavorite = async (
  game: Game,
  isFavorite: boolean,
): Promise<Game> => {
  const updatedGame = { ...game, isFavorite };
  const { data } = await axios.put(`/games/${game.id}`, updatedGame);
  return data;
};
