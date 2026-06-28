import { useState } from 'react';
import { selectIsAuth, useAuthStore } from '../../store/authStore';
import {
  selectToggleSelected,
  selectSelectedIds,
  useSelectedStore,
} from '../../store/selectedStore';
import type { Game } from '../../types/game';
import css from './GameDetails.module.css';

interface Props {
  game: Game;
}

export const GameDetails = ({ game }: Props) => {
  const toggleSelected = useSelectedStore(selectToggleSelected);
  const selectedIds = useSelectedStore(selectSelectedIds);
  const isAuth = useAuthStore(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);

  const isFavorite = selectedIds.includes(game._id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuth) {
      alert('Будь ласка, увійдіть, щоб додати гру в обране');
      return;
    }

    setIsLoading(true);
    await toggleSelected(game._id);
    setIsLoading(false);
  };

  return (
    <div className={css.card}>
      <div className={css.content}>
        <div className={css.imageSection}>
          <img className={css.image} src={game.imageURL} alt={game.title} />
        </div>

        <div className={css.infoSection}>
          <h2 className={css.title}>{game.title}</h2>

          <div className={css.infoList}>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Жанр:</span>
              <span className={css.genreBadge}>{game.genre}</span>
            </div>

            <div className={css.infoItem}>
              <span className={css.infoLabel}>Рейтинг:</span>
              <span className={css.ratingValue}>⭐ {game.rating}/10</span>
            </div>

            <div className={css.infoItem}>
              <span className={css.infoLabel}>Дата релізу:</span>
              <span className={css.releaseDate}>
                {formatDate(game.releaseDate)}
              </span>
            </div>
          </div>

          <div className={css.description}>
            <p className={css.descriptionText}>{game.description}</p>
          </div>

          {isAuth && (
            <div className={css.favorite}>
              <button
                className={`${css.favoriteBtn} ${isFavorite ? css.favoriteTrue : css.favoriteFalse}`}
                onClick={handleToggleFavorite}
                disabled={isLoading}
              >
                {isLoading
                  ? '⏳'
                  : isFavorite
                    ? '❤️ Прибрати з обраного'
                    : '♡ Додати в обране'}
              </button>
            </div>
          )}

          {!isAuth && (
            <div className={css.favoriteHint}>
              🔒 Увійдіть, щоб додати в обране
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
