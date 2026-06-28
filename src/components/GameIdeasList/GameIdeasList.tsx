import {
  selectGamesIdeas,
  selectHasMore,
  selectIsLoadingIdeas,
  selectLoadMoreIdeas,
  selectTotalCount,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import { GameIdeasItem } from '../GameIdeasItem/GameIdeasItem';
import css from './GameIdeasList.module.css';

export const GameIdeasList = () => {
  const gameIdeas = useGameIdeasStore(selectGamesIdeas);
  const isLoading = useGameIdeasStore(selectIsLoadingIdeas);
  const hasMore = useGameIdeasStore(selectHasMore);
  const totalCount = useGameIdeasStore(selectTotalCount);
  const loadMoreIdeas = useGameIdeasStore(selectLoadMoreIdeas);

  if (gameIdeas.length === 0 && !isLoading) {
    return (
      <div className={css.emptyState}>
        <div className={css.emptyIcon}>💭</div>
        <h3 className={css.emptyTitle}>Ідей не знайдено</h3>
        <p className={css.emptyText}>Додайте першу ідею для гри через форму</p>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h2 className={css.listTitle}>
          💡 Усі ідеї{' '}
          <span className={css.count}>
            ({gameIdeas.length} з {totalCount})
          </span>
        </h2>
      </div>

      <ul className={css.list}>
        {gameIdeas.map(idea => (
          <li key={idea._id} className={css.listItem}>
            <GameIdeasItem idea={idea} />
          </li>
        ))}
      </ul>

      {isLoading && (
        <div className={css.loadingState}>
          <div className={css.spinner}></div>
          <p>Завантаження ідей...</p>
        </div>
      )}

      {!isLoading && hasMore && (
        <div className={css.loadMoreContainer}>
          <button className={css.loadMoreButton} onClick={loadMoreIdeas}>
            Завантажити ще
          </button>
          <span className={css.loadMoreInfo}>
            ({gameIdeas.length} з {totalCount})
          </span>
        </div>
      )}

      {!isLoading && !hasMore && gameIdeas.length > 0 && (
        <div className={css.allLoaded}>
          <p>✅ Всі ідеї завантажені ({totalCount})</p>
        </div>
      )}
    </div>
  );
};
