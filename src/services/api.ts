import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://gamesdb.onrender.com';
  }
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});
