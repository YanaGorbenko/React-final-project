import {
  selectChangeIdeasVotes,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import type { GameIdea } from '../../types/gameIdea';
import css from './GameIdeasItem.module.css';

interface Props {
  idea: GameIdea;
}

export const GameIdeasItem = ({ idea }: Props) => {
  const changeVotes = useGameIdeasStore(selectChangeIdeasVotes);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  return (
    <div className={css.card}>
      <h3 className={css.title}>{idea.title}</h3>

      <div className={css.meta}>
        <div className={css.metaItem}>
          <span className={css.metaLabel}>Жанр:</span>
          <span className={css.genreBadge}>{idea.genre}</span>
        </div>
        <div className={css.metaItem}>
          <span className={css.metaLabel}>Автор:</span>
          <span className={css.metaValue}>{idea.userName}</span>
        </div>
        <div className={css.metaItem}>
          <span className={css.metaLabel}>Дата:</span>
          <span className={css.metaValue}>{formatDate(idea.createdAt)}</span>
        </div>
      </div>

      <p className={css.description}>{idea.description}</p>

      <div className={css.footer}>
        <div className={css.votes}>
          <span className={css.votesIcon}>👍</span>
          <span className={css.votesCount}>{idea.votes} голосів</span>
        </div>
        <button className={css.voteButton} onClick={() => changeVotes(idea.id)}>
          Проголосувати
        </button>
      </div>
    </div>
  );
};
