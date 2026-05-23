import { GamesFilters } from '../../components/GamesFilters/GamesFilters';
import { GamesList } from '../../components/GamesList/GamesList';
import {
  selectAllGenresFilter,
  selectAllSearchWord,
  selectAllSortByRating,
  selectAllSortByTitle,
  selectFilteredAllGames,
  selectSetAllGenresFilter,
  selectSetAllSearchWord,
  selectSetAllSortByRating,
  selectSetAllSortByTitle,
  useGamesStore,
} from '../../store/gameStore';
import css from './AllGamesPage.module.css';

export const AllGamesPage = () => {
  const games = useGamesStore(selectFilteredAllGames);
  const search = useGamesStore(selectAllSearchWord);
  const sortTitle = useGamesStore(selectAllSortByTitle);
  const sortRating = useGamesStore(selectAllSortByRating);
  const genres = useGamesStore(selectAllGenresFilter);
  const changeSearch = useGamesStore(selectSetAllSearchWord);
  const changeTitleSort = useGamesStore(selectSetAllSortByTitle);
  const changeRatingSort = useGamesStore(selectSetAllSortByRating);
  const changeGenres = useGamesStore(selectSetAllGenresFilter);

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
          <GamesList games={games} /> {/* ← ПЕРШИЙ - буде зліва */}
          <GamesFilters params={params} functions={functions} />{' '}
          {/* ← ДРУГИЙ - буде справа */}
        </div>
      </div>
    </div>
  );
};
