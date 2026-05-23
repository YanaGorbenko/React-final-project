import { selectToggleFavorite, useGamesStore } from '../../store/gameStore';
import type { Game } from '../../types/game';
import css from './GameItem.module.css';

interface Props {
  game: Game;
}

export const GameItem = ({ game }: Props) => {
  const toggleFavorite = useGamesStore(selectToggleFavorite);

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

        <div className={css.favorite}>
          <button
            className={`${css.favoriteBtn} ${game.isFavorite ? css.favoriteTrue : css.favoriteFalse}`}
            onClick={() => toggleFavorite(game.id)}
          >
            {game.isFavorite ? '❤️ Прибрати з обраного' : '♡ Додати в обране'}
          </button>
        </div>

        <button className={css.button}>Детальніше →</button>
      </div>
    </div>
  );
};
