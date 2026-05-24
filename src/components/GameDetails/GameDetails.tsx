import { selectToggleFavorite, useGamesStore } from '../../store/gameStore';
import type { Game } from '../../types/game';
import css from './GameDetails.module.css';

interface Props {
  game: Game;
}

export const GameDetails = ({ game }: Props) => {
  const toggleFavorite = useGamesStore(selectToggleFavorite);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

          <div className={css.favoriteSection}>
            <button
              className={`${css.favoriteBtn} ${game.isFavorite ? css.favoriteActive : ''}`}
              onClick={() => toggleFavorite(game.id)}
            >
              {game.isFavorite ? '❤️ Прибрати з обраного' : '♡ Додати в обране'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
