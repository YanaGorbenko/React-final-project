import { selectTopEightRatedGames, useGamesStore } from '../../store/gameStore';
import { GameItem } from '../GameItem/GameItem';
import css from './TopGameSection.module.css';

export const TopGamesSection = () => {
  const topGames = useGamesStore(selectTopEightRatedGames);

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h2 className={css.title}>Топ-8 ігор за рейтингом</h2>
        <h3 className={css.subtitle}>
          Обрані найкращою спільнотою ігрові шедеври
        </h3>
        <ul className={css.grid}>
          {topGames.map(game => (
            <li key={game.id} className={css.gridItem}>
              <GameItem game={game} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
