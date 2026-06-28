import type { Game } from '../../types/game';
import { GameItem } from '../GameItem/GameItem';
import css from './GamesList.module.css';

interface Props {
  games: Game[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  currentCount?: number;
}

export const GamesList = ({
  games,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  totalCount,
  currentCount,
}: Props) => {
  if (games.length === 0 && !isLoading) {
    return (
      <div className={css.container}>
        <div className={css.emptyState}>
          <h3>🎮 Ігор не знайдено</h3>
          <p>Спробуйте змінити параметри фільтрації або пошуку</p>
        </div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      {totalCount && currentCount && (
        <div className={css.counter}>
          Показано {currentCount} з {totalCount} ігор
        </div>
      )}

      <ul className={css.grid}>
        {games.map(game => (
          <li key={game._id} className={css.gridItem}>
            <GameItem game={game} />
          </li>
        ))}
      </ul>

      {isLoading && (
        <div className={css.loadingState}>
          <div className={css.spinner}></div>
          <p>Завантаження ігор...</p>
        </div>
      )}

      {!isLoading && hasMore && onLoadMore && (
        <div className={css.loadMoreContainer}>
          <button className={css.loadMoreButton} onClick={onLoadMore}>
            Завантажити ще
          </button>
          {totalCount && currentCount && (
            <span className={css.loadMoreInfo}>
              ({currentCount} з {totalCount})
            </span>
          )}
        </div>
      )}

      {!isLoading && !hasMore && games.length > 0 && (
        <div className={css.allLoaded}>
          <p>✅ Всі ігри завантажені ({games.length})</p>
        </div>
      )}
    </div>
  );
};
