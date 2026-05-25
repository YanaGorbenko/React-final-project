import { useCallback, useState } from 'react';
import Select from 'react-select';
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

const titleSortOptions = [
  { value: 'not', label: 'Не сортувати' },
  { value: 'asc', label: 'Від А до Z ↑' },
  { value: 'desc', label: 'Від Z до А ↓' },
];

const ratingSortOptions = [
  { value: 'not', label: 'Не сортувати' },
  { value: 'desc', label: 'За спаданням (високі перші) ⭐' },
  { value: 'asc', label: 'За зростанням (низькі перші) ⭐' },
];

const genreOptions = GENRES.map(genre => ({
  value: genre.name,
  label: `${genre.icon} ${genre.name}`,
}));

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    background: '#0a0a0a',
    borderColor: state.isFocused ? '#e63946' : '#2a2a2a',
    borderRadius: '10px',
    padding: '2px',
    boxShadow: state.isFocused ? '0 0 0 1px #e63946' : 'none',
    '&:hover': { borderColor: '#e63946' },
  }),
  menu: (base: any) => ({
    ...base,
    background: '#1a1a1a',
    borderRadius: '10px',
    overflow: 'hidden',
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
    '&::-webkit-scrollbar': { width: '8px' },
    '&::-webkit-scrollbar-track': { background: '#0a0a0a' },
    '&::-webkit-scrollbar-thumb': {
      background: '#e63946',
      borderRadius: '4px',
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? '#e63946' : '#1a1a1a',
    color: state.isFocused ? 'white' : '#e5e7eb',
    cursor: 'pointer',
  }),
  singleValue: (base: any) => ({ ...base, color: 'white' }),
  input: (base: any) => ({ ...base, color: 'white' }),
  placeholder: (base: any) => ({ ...base, color: '#6c757d' }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? '#e63946' : '#9ca3af',
    '&:hover': { color: '#e63946' },
  }),
  multiValue: (base: any) => ({
    ...base,
    background: 'rgba(230, 57, 70, 0.2)',
    borderRadius: '6px',
  }),
  multiValueLabel: (base: any) => ({ ...base, color: '#e63946' }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: '#e63946',
    '&:hover': { background: '#e63946', color: 'white' },
  }),
};

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
    (option: any) => {
      if (option) {
        functions.changeTitleSort(option.value);
        functions.changeRatingSort('not');
      }
    },
    [functions],
  );

  const handleRatingSortChange = useCallback(
    (option: any) => {
      if (option) {
        functions.changeRatingSort(option.value);
        functions.changeTitleSort('not');
      }
    },
    [functions],
  );

  const handleGenreChange = useCallback(
    (selectedOptions: any) => {
      const selectedGenres = selectedOptions
        ? selectedOptions.map((opt: any) => opt.value)
        : [];
      functions.changeGenres(selectedGenres);
    },
    [functions],
  );

  const currentTitleSort =
    titleSortOptions.find(opt => opt.value === params.sortTitle) ||
    titleSortOptions[0];
  const currentRatingSort =
    ratingSortOptions.find(opt => opt.value === params.sortRating) ||
    ratingSortOptions[0];
  const currentGenres = genreOptions.filter(opt =>
    params.genres.includes(opt.value),
  );

  const handleReset = () => {
    functions.changeSearch('');
    functions.changeTitleSort('not');
    functions.changeRatingSort('not');
    functions.changeGenres([]);
    setLocalSearchWord('');
  };

  return (
    <form className={css.form}>
      <div className={css.filtersRow}>
        <div className={css.filterGroup}>
          <h3 className={css.sectionTitle}>🔍 Пошук</h3>
          <input
            type="text"
            className={css.searchInput}
            placeholder="Пошук по назві..."
            value={localSearchWord}
            onChange={handleInputChange}
          />
        </div>

        <div className={css.filterGroup}>
          <h3 className={css.sectionTitle}>📂 Сортування за назвою</h3>
          <Select
            instanceId="sort-title"
            options={titleSortOptions}
            value={currentTitleSort}
            onChange={handleTitleSortChange}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>

        <div className={css.filterGroup}>
          <h3 className={css.sectionTitle}>⭐ Сортування за рейтингом</h3>
          <Select
            instanceId="game-genre"
            options={ratingSortOptions}
            value={currentRatingSort}
            onChange={handleRatingSortChange}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>

        <div className={css.filterGroup}>
          <h3 className={css.sectionTitle}>🎮 Жанри</h3>
          <Select
            instanceId="filter-genres"
            options={genreOptions}
            value={currentGenres}
            onChange={handleGenreChange}
            styles={customSelectStyles}
            isMulti
            isSearchable
            placeholder="Оберіть жанри..."
          />
        </div>
      </div>

      <button type="button" className={css.resetButton} onClick={handleReset}>
        Скинути всі фільтри
      </button>
    </form>
  );
};
