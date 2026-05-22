import axios from 'axios';
import { type Game } from '../types/game';

axios.defaults.baseURL = 'https://69e4843acfa9394db8da25af.mockapi.io/api';

export const getGames = async () => {
  const url = new URL('/games', axios.defaults.baseURL);

  const { data } = await axios.get<Game[]>(url.toString());

  return data;
};
