import { selectToggleFavorite, useGamesStore } from '../../store/gameStore';
import type { Game } from '../../types/game';
import css from './NewGameItem.module.css';
import { useNavigate, useLocation } from 'react-router';

interface Props {
  game: Game;
}

export const NewGameItem = ({ game }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleFavorite = useGamesStore(selectToggleFavorite);
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
          <div
            className={`${css.favorite} ${game.isFavorite ? css.favoriteActive : css.favoriteInactive}`}
            onClick={() => toggleFavorite(game.id)}
          >
            {game.isFavorite ? '★ В обраному' : '☆ Додати в обране'}
          </div>
          <button
            className={css.button}
            onClick={() =>
              navigate(`/${game.id}/details`, {
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
