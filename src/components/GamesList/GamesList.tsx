import type { Game } from '../../types/game';
import { GameItem } from '../GameItem/GameItem';
import css from './GamesList.module.css';

interface Props {
  games: Game[];
}

export const GamesList = ({ games }: Props) => {
  if (games.length === 0) {
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
      <ul className={css.grid}>
        {games.map(game => (
          <li key={game.id} className={css.gridItem}>
            <GameItem game={game} />
          </li>
        ))}
      </ul>
    </div>
  );
};
