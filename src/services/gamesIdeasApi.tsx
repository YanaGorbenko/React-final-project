import axios from 'axios';
import { type CreateGameIdea, type GameIdea } from '../types/gameIdea';

axios.defaults.baseURL = 'https://69e4843acfa9394db8da25af.mockapi.io/api';

export const getGameIdeas = async (): Promise<GameIdea[]> => {
  const url = new URL('/gameIdeas', axios.defaults.baseURL);

  const { data } = await axios.get<GameIdea[]>(url.toString());

  return data;
};

export const addGameIdeas = async (
  newIdea: CreateGameIdea,
): Promise<GameIdea> => {
  const { data } = await axios.post<GameIdea>(`/gameIdeas`, newIdea);
  return data;
};

export const changeVotes = async (idea: GameIdea): Promise<GameIdea> => {
  const { data } = await axios.put(`/gameIdeas/${idea.id}`, idea);
  return data;
};
