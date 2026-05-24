import {
  selectGamesIdeas,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import { GameIdeasItem } from '../GameIdeasItem/GameIdeasItem';
import css from './GameIdeasList.module.css';

export const GameIdeasList = () => {
  const gameIdeas = useGameIdeasStore(selectGamesIdeas);

  if (gameIdeas.length === 0) {
    return (
      <div className={css.emptyState}>
        <div className={css.emptyIcon}>💭</div>
        <h3 className={css.emptyTitle}>Ідей не знайдено</h3>
        <p className={css.emptyText}>Додайте першу ідею для гри через форму</p>
      </div>
    );
  }
  return (
    <div className={css.container}>
      <div className={css.header}>
        <h2 className={css.listTitle}>
          💡 Усі ідеї <span className={css.count}>({gameIdeas.length})</span>
        </h2>
      </div>
      <ul className={css.list}>
        {gameIdeas.map(idea => (
          <li key={idea.id} className={css.listItem}>
            <GameIdeasItem idea={idea} />
          </li>
        ))}
      </ul>
    </div>
  );
};
