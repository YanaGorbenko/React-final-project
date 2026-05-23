import type { Game } from '../types/game';

export interface FilterOptions {
  searchWord: string;
  genresFilter: string[];
  sortByTitle: 'not' | 'asc' | 'desc';
  sortByRating: 'not' | 'asc' | 'desc';
}

export const filterAndSortGames = (games: Game[], options: FilterOptions) => {
  let result = [...games];
  if (options.searchWord.trim()) {
    const lowerSearch = options.searchWord.toLowerCase();
    result = result.filter(game =>
      game.title.toLowerCase().includes(lowerSearch),
    );
  }

  if (options.genresFilter.length > 0) {
    result = result.filter(game => {
      // Приводимо genre гри до такого ж формату як в GENRES
      const gameGenre = game.genre; // наприклад, "rpg" або "RPG"
      const isMatch = options.genresFilter.some(
        filterGenre => filterGenre.toLowerCase() === gameGenre.toLowerCase(),
      );
      return isMatch;
    });
  }

  if (options.sortByTitle === 'asc') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (options.sortByTitle === 'desc') {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (options.sortByRating === 'asc') {
    result.sort((a, b) => a.rating - b.rating);
  } else if (options.sortByRating === 'desc') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
};
