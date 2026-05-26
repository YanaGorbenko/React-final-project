import { Error } from '../../components/Error/Error';
import { GamesFilters } from '../../components/GamesFilters/GamesFilters';
import { GamesList } from '../../components/GamesList/GamesList';
import { Loader } from '../../components/Loader/Loader';
import {
  selectAllGenresFilter,
  selectAllSearchWord,
  selectAllSortByRating,
  selectAllSortByTitle,
  selectError,
  selectFilteredAllGames,
  selectIsLoading,
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
        <h1 className={css.title}>Усі ігри</h1>
        <h2 className={css.subtitle}>
          Відкрийте для себе нашу повну колекцію ігор
        </h2>

        <Loader isLoading={isLoading} />

        {!isLoading && !isError && (
          <>
            <div className={css.filtersSection}>
              <GamesFilters params={params} functions={functions} />
            </div>

            <div className={css.gamesSection}>
              <GamesList games={games} />
            </div>
          </>
        )}

        {isError && <Error error={isError} />}
      </div>
    </div>
  );
};
