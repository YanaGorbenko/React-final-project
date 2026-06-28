import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  useSelectedStore,
  selectToggleSelected,
  selectSelectedIds,
} from '../../store/selectedStore';
import { useAuthStore, selectIsAuth } from '../../store/authStore';
import type { Game } from '../../types/game';
import css from './NewGameItem.module.css';

interface Props {
  game: Game;
}

export const NewGameItem = ({ game }: Props) => {
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
      <div className={css.imageSide}>
        <img className={css.image} src={game.imageURL} alt={game.title} />
      </div>
      <div className={css.contentSide}>
        <div className={css.badge}>НОВИНКА</div>
        <h2 className={css.title}>{game.title}</h2>
        <div className={css.meta}>
          <span className={css.rating}>⭐ {game.rating}/10</span>
          <span className={css.genre}>🎮 {game.genre}</span>
        </div>
        <p className={css.description}>
          {game.description.length > 150
            ? game.description.substring(0, 150) + '...'
            : game.description}
        </p>
        <div className={css.footer}>
          {isAuth && (
            <button
              className={`${css.favoriteBtn} ${isFavorite ? css.favoriteActive : css.favoriteInactive}`}
              onClick={handleToggleFavorite}
              disabled={isLoading}
            >
              {isLoading
                ? '⏳'
                : isFavorite
                  ? '❤️ Прибрати з обраного'
                  : '♡ Додати в обране'}
            </button>
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
    </div>
  );
};
