import { Error } from '../../components/Error/Error';
import { GamesFilters } from '../../components/GamesFilters/GamesFilters';
import { GamesList } from '../../components/GamesList/GamesList';
import { Loader } from '../../components/Loader/Loader';
import {
  selectError,
  selectFilteredSelectedGames,
  selectIsLoading,
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
  const isLoading = useGamesStore(selectIsLoading);
  const isError = useGamesStore(selectError);

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
        <h1 className={css.title}>Обрані ігри</h1>
        <h2 className={css.subtitle}>
          Ваша персональна колекція улюблених ігор
        </h2>

        <Loader isLoading={isLoading} />

        {!isLoading && !isError && (
          <div className={css.content}>
            <div className={css.filtersSection}>
              <GamesFilters params={params} functions={functions} />
            </div>

            <div className={css.gamesSection}>
              <GamesList games={games} />
            </div>
          </div>
        )}

        {isError && <Error error={isError} />}
      </div>
    </div>
  );
};
