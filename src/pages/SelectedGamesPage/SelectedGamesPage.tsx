import { GamesFilters } from '../../components/GamesFilters/GamesFilters';
import { GamesList } from '../../components/GamesList/GamesList';
import {
  selectFilteredSelectedGames,
  selectSelectedGenresFilter,
  selectSelectedSearchWord,
  selectSelectedSortByRating,
  selectSelectedSortByTitle,
  selectSetSelectedGenresFilter,
  selectSetSelectedSearchWord,
  selectSetSelectedSortByRating,
  selectSetSelectedSortByTitle,
  useGamesStore,
} from '../../store/gameStore';
import css from './SelectedGamesPage.module.css';

export const SelectedGamesPage = () => {
  const games = useGamesStore(selectFilteredSelectedGames);
  const search = useGamesStore(selectSelectedSearchWord);
  const sortTitle = useGamesStore(selectSelectedSortByTitle);
  const sortRating = useGamesStore(selectSelectedSortByRating);
  const genres = useGamesStore(selectSelectedGenresFilter);
  const changeSearch = useGamesStore(selectSetSelectedSearchWord);
  const changeTitleSort = useGamesStore(selectSetSelectedSortByTitle);
  const changeRatingSort = useGamesStore(selectSetSelectedSortByRating);
  const changeGenres = useGamesStore(selectSetSelectedGenresFilter);

  const params = { search, sortTitle, sortRating, genres };
  const functions = {
    changeSearch,
    changeTitleSort,
    changeRatingSort,
    changeGenres,
  };

  return (
    <div className={css.page}>
      <div className={css.container}>
        <h1 className={css.title}>Усі ігри</h1>
        <h2 className={css.subtitle}>
          Відкрийте для себе нашу повну колекцію ігор
        </h2>
        <div className={css.content}>
          <GamesList games={games} />
          <GamesFilters params={params} functions={functions} />{' '}
        </div>
      </div>
    </div>
  );
};
