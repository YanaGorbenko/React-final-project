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

  const getAuthorName = (author: any): string => {
    if (!author) return 'Невідомий автор';
    if (typeof author === 'object') return author.name || 'Невідомий автор';
    return String(author);
  };

  const authorName = getAuthorName(idea.authorId);

  return (
    <div className={css.card}>
      <div className={css.rank}>
        <span className={css.rankIcon}>{getRankIcon(rank)}</span>
        <span className={css.rankNumber}>#{rank}</span>
      </div>

      <h3 className={css.title}>{idea.title}</h3>

      <div className={css.meta}>
        <span className={css.genre}>🎮 {idea.genre}</span>
        <span className={css.author}>👤 {authorName}</span>
      </div>

      <p className={css.description}>
        {idea.description && idea.description.length > 120
          ? idea.description.substring(0, 120) + '...'
          : idea.description || 'Опис відсутній'}
      </p>

      <div className={css.footer}>
        <div className={css.votes}>
          <span className={css.votesIcon}>👍</span>
          <span className={css.votesCount}>{idea.votes || 0} голосів</span>
        </div>
      </div>
    </div>
  );
};
