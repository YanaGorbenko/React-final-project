export interface IdeaAuthor {
  _id: string;
  name: string;
  email?: string;
  photo?: string;
}

export interface GameIdea {
  _id: string;
  title: string;
  genre: string;
  description: string;
  votes: number;
  voters: string[];
  authorId: IdeaAuthor | string;
}

export type CreateGameIdea = {
  title: string;
  genre: string;
  description: string;
};

export type UpdateGameIdea = {
  title?: string;
  genre?: string;
  description?: string;
};
