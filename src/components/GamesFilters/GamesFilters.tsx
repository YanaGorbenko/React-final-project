import { useCallback, useState } from 'react';
import { GENRES } from '../../data/genres';
import { useDebouncedCallback } from 'use-debounce';
import css from './GemesFilters.module.css';

interface Props {
  params: {
    search: string;
    sortTitle: 'not' | 'asc' | 'desc';
    sortRating: 'not' | 'asc' | 'desc';
    genres: string[];
  };
  functions: {
    changeSearch: (word: string) => void;
    changeTitleSort: (sort: 'asc' | 'desc' | 'not') => void;
    changeRatingSort: (sort: 'asc' | 'desc' | 'not') => void;
    changeGenres: (genres: string[]) => void;
  };
}

export const GamesFilters = ({ params, functions }: Props) => {
  const [localSearchWord, setLocalSearchWord] = useState(params.search);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    functions.changeSearch(value);
  }, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearchWord(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleTitleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as 'not' | 'asc' | 'desc';
      functions.changeTitleSort(value);
      functions.changeRatingSort('not');
    },
    [],
  );

  const handleRatingSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as 'not' | 'asc' | 'desc';
      functions.changeRatingSort(value);
      functions.changeTitleSort('not');
    },
    [],
  );

  const handleGenreToggle = (genreValue: string) => {
    const newGenres = params.genres.includes(genreValue)
      ? params.genres.filter(g => g !== genreValue)
      : [...params.genres, genreValue];
    functions.changeGenres(newGenres);
  };

  return (
    <form className={css.form}>
      <h3 className={css.sectionTitle}>🔍 Пошук</h3>
      <input
        type="text"
        className={css.searchInput}
        placeholder="Пошук по назві..."
        value={localSearchWord}
        onChange={handleInputChange}
      />

      <h3 className={css.sectionTitle}>📂 Сортування за назвою</h3>
      <select
        className={css.select}
        value={params.sortTitle}
        onChange={handleTitleSortChange}
      >
        <option value="not">Не сортувати</option>
        <option value="asc">Від А до Z</option>
        <option value="desc">Від Z до А</option>
      </select>

      <h3 className={css.sectionTitle}>⭐ Сортування за рейтингом</h3>
      <select
        className={css.select}
        value={params.sortRating}
        onChange={handleRatingSortChange}
      >
        <option value="not">Не сортувати</option>
        <option value="desc">За спаданням (високі перші)</option>
        <option value="asc">За зростанням (низькі перші)</option>
      </select>

      <h3 className={css.sectionTitle}>🎮 Фільтр за жанрами</h3>
      <div className={css.genresList}>
        {GENRES.map(genre => (
          <label key={genre.name} className={css.genreLabel}>
            <input
              type="checkbox"
              className={css.genreCheckbox}
              checked={params.genres.includes(genre.name)}
              onChange={() => handleGenreToggle(genre.name)}
            />
            {genre.name}
          </label>
        ))}
      </div>

      {/* <button type="button" className={css.resetButton} onClick={handleReset}>
        Скинути всі фільтри
      </button> */}
    </form>
  );
};
