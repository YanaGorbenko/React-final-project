import { useEffect } from 'react';
import {
  useSelectedStore,
  selectGames,
  selectIsLoading,
  selectHasMore,
  selectTotalCount,
  selectFetchSelected,
  selectLoadMore,
  selectSearchWord,
  selectSortByTitle,
  selectSortByRating,
  selectGenresFilter,
  selectSetSearchWord,
  selectSetSortByTitle,
  selectSetSortByRating,
  selectSetGenresFilter,
} from '../../store/selectedStore';
import { GameItem } from '../../components/GameItem/GameItem';
import { GamesFilters } from '../../components/GamesFilters/GamesFilters';
import css from './FavoritesTab.module.css';

export const FavoritesTab = () => {
  const games = useSelectedStore(selectGames);
  const isLoading = useSelectedStore(selectIsLoading);
  const hasMore = useSelectedStore(selectHasMore);
  const totalCount = useSelectedStore(selectTotalCount);

  const search = useSelectedStore(selectSearchWord);
  const sortByTitle = useSelectedStore(selectSortByTitle);
  const sortByRating = useSelectedStore(selectSortByRating);
  const genres = useSelectedStore(selectGenresFilter);

  const fetchSelected = useSelectedStore(selectFetchSelected);
  const loadMore = useSelectedStore(selectLoadMore);

  const setSearch = useSelectedStore(selectSetSearchWord);
  const setSortByTitle = useSelectedStore(selectSetSortByTitle);
  const setSortByRating = useSelectedStore(selectSetSortByRating);
  const setGenres = useSelectedStore(selectSetGenresFilter);

  useEffect(() => {
    fetchSelected(1);
  }, []);

  const params = {
    search,
    sortTitle: sortByTitle,
    sortRating: sortByRating,
    genres,
  };

  const functions = {
    changeSearch: setSearch,
    changeTitleSort: setSortByTitle,
    changeRatingSort: setSortByRating,
    changeGenres: setGenres,
  };

  if (isLoading && games.length === 0) {
    return (
      <div className={css.loading}>
        <div className={css.spinner}></div>
        <p>⏳ Завантаження обраних ігор...</p>
      </div>
    );
  }

  return (
    <div className={css.favorites}>
      <div className={css.header}>
        <h2>❤️ Обрані ігри</h2>
        <span className={css.count}>
          {totalCount > 0 ? `${games.length} з ${totalCount}` : 'Немає ігор'}
        </span>
      </div>

      <GamesFilters params={params} functions={functions} />

      {games.length === 0 && !isLoading ? (
        <div className={css.empty}>
          <h3>❤️ Немає обраних ігор</h3>
          <p>Додайте ігри в обране, щоб вони з'явилися тут</p>
        </div>
      ) : (
        <>
          <div className={css.grid}>
            {games.map(game => (
              <GameItem key={game._id} game={game} />
            ))}
          </div>

          {hasMore && (
            <div className={css.loadMoreContainer}>
              <button
                className={css.loadMoreButton}
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Завантаження...' : '📥 Завантажити ще'}
              </button>
              <span className={css.loadMoreInfo}>
                ({games.length} з {totalCount})
              </span>
            </div>
          )}

          {!hasMore && games.length > 0 && (
            <div className={css.allLoaded}>
              <p>✅ Всі обрані ігри завантажені ({games.length})</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
