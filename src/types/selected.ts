import type { Game } from './game';

export interface SelectedGamesResponse {
  selected: {
    games: Game[];
    totalCount: number;
    totalPages: number;
  };
  total: number;
}

export interface SelectedActionResponse {
  message: string;
  selected: Game[];
}
