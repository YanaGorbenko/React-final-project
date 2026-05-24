export interface GameIdea {
  id: string;
  genre: string;
  title: string;
  description: string;
  votes: number;
  createdAt: string;
  userName: string;
}

export type CreateGameIdea = Omit<GameIdea, 'id'>;
