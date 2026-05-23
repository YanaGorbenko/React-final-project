import { useMemo } from 'react';
import { selectTop3GamesByGenre, useGamesStore } from '../../store/gameStore';
import type { Genre } from '../../types/genre';
import { GameItem } from '../GameItem/GameItem';
import css from './GenresSection.module.css';

interface Props {
  genre: Genre;
}

export const GenreSection = ({ genre }: Props) => {
  const top3GamesByGenre = useGamesStore(selectTop3GamesByGenre);

  const top3Games = useMemo(() => {
    return top3GamesByGenre[genre.name] || [];
  }, [top3GamesByGenre, genre.name]);
  return (
    <section className={css.section}>
      <div className={css.header}>
        <span className={css.icon}>{genre.icon}</span>
        <h2 className={css.title}>
          <span className={css.titleText}>
            <span className={css.genreName}>{genre.name}</span>
          </span>
        </h2>
      </div>

      <p className={css.description}>{genre.description}</p>

      <div className={css.topLabel}>
        <span className={css.topIcon}>🏆</span>
        <span className={css.topText}>Топ-3 гри жанру {genre.name}</span>
      </div>

      <div className={css.gamesContainer}>
        <div className={css.gamesGrid}>
          {top3Games.map(game => (
            <div key={game.id} className={css.gameCard}>
              <GameItem game={game} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
