import {
  selectGamesIdeas,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import { TopIdeaItem } from '../TopIdeaItem/TopIdeaItem';
import css from './TopIdeasSection.module.css';

export const TopIdeasSection = () => {
  const gameIdeas = useGameIdeasStore(selectGamesIdeas);

  // Отримуємо топ-3 ідеї за кількістю голосів
  const topIdeas = [...gameIdeas].sort((a, b) => b.votes - a.votes).slice(0, 3);

  if (topIdeas.length === 0) {
    return null; // Якщо немає ідей, секція не відображається
  }
  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <h2 className={css.title}>🌟 Найпопулярніші ідеї</h2>
          <p className={css.subtitle}>
            Найкращі концепти ігор, які отримали найбільше голосів від спільноти
          </p>
        </div>

        <div className={css.grid}>
          {topIdeas.map((idea, index) => (
            <TopIdeaItem key={idea.id} idea={idea} rank={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};
