import type { Game } from '../../types/game';
import css from './GameItem.module.css';

interface Props {
  game: Game;
}

export const GameItem = ({ game }: Props) => {
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
          <span
            className={game.isFavorite ? css.favoriteTrue : css.favoriteFalse}
          >
            {game.isFavorite ? '★ В обраному' : '☆ Не в обраному'}
          </span>
        </div>
        <button className={css.button}>Детальніше →</button>
      </div>
    </div>
  );
};
