import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useSelectedStore,
  selectToggleSelected,
  selectSelectedIds,
} from '../../store/selectedStore';
import { useAuthStore, selectIsAuth } from '../../store/authStore';
import type { Game } from '../../types/game';
import css from './GameItem.module.css';

interface Props {
  game: Game;
}

export const GameItem = ({ game }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSelected = useSelectedStore(selectToggleSelected);
  const selectedIds = useSelectedStore(selectSelectedIds);
  const isAuth = useAuthStore(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);

  const isFavorite = selectedIds.includes(game._id);

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
      <img className={css.image} src={game.imageURL} alt={game.title} />
      <div className={css.content}>
        <h4 className={css.title}>{game.title}</h4>
        <div className={css.info}>
          <span className={css.label}>Жанр:</span>
          <span className={css.value}>{game.genre}</span>
        </div>
        <div className={css.rating}>
          <span className={css.label}>Рейтинг:</span>
          <span className={css.ratingValue}>⭐ {game.rating}/10</span>
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

        <button
          className={css.button}
          onClick={() =>
            navigate(`/${game._id}/details`, {
              state: { from: location.pathname },
            })
          }
        >
          Детальніше →
        </button>
      </div>
    </div>
  );
};
