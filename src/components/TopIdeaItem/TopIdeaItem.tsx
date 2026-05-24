import type { GameIdea } from '../../types/gameIdea';
import css from './TopIdeaItem.module.css';

interface Props {
  idea: GameIdea;
  rank: number;
}

export const TopIdeaItem = ({ idea, rank }: Props) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '📌';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  return (
    <div className={css.card}>
      <div className={css.rank}>
        <span className={css.rankIcon}>{getRankIcon(rank)}</span>
        <span className={css.rankNumber}>#{rank}</span>
      </div>

      <h3 className={css.title}>{idea.title}</h3>

      <div className={css.meta}>
        <span className={css.genre}>{idea.genre}</span>
        <span className={css.author}>👤 {idea.userName}</span>
      </div>

      <p className={css.description}>
        {idea.description.length > 120
          ? idea.description.substring(0, 300) + '...'
          : idea.description}
      </p>

      <div className={css.footer}>
        <div className={css.votes}>
          <span className={css.votesIcon}>👍</span>
          <span className={css.votesCount}>{idea.votes} голосів</span>
        </div>
        <div className={css.date}>📅 {formatDate(idea.createdAt)}</div>
      </div>
    </div>
  );
};
