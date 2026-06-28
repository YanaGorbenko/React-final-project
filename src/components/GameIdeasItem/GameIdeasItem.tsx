import { useState, useEffect } from 'react';
import {
  useGameIdeasStore,
  selectToggleVote,
} from '../../store/gameIdeasStore';
import { useAuthStore, selectUser } from '../../store/authStore';
import type { GameIdea } from '../../types/gameIdea';
import css from './GameIdeasItem.module.css';

interface Props {
  idea: GameIdea;
}

export const GameIdeasItem = ({ idea }: Props) => {
  const toggleVote = useGameIdeasStore(selectToggleVote);
  const currentUser = useAuthStore(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isOwnIdea, setIsOwnIdea] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const userId = currentUser?._id || null;

    const getAuthorId = (author: any): string => {
      if (!author) return '';
      if (typeof author === 'object') return author._id || '';
      return String(author);
    };

    const authorId = getAuthorId(idea.authorId);
    const isOwn = userId === authorId;

    setIsOwnIdea(isOwn);

    const hasUserVoted =
      userId && idea.voters ? idea.voters.includes(userId) : false;
    setHasVoted(hasUserVoted);
  }, [currentUser, idea]);

  const getAuthorName = (author: any): string => {
    if (!author) return 'Невідомий автор';
    if (typeof author === 'object') return author.name || 'Невідомий автор';
    return String(author);
  };

  const getAuthorPhoto = (author: any): string | undefined => {
    if (!author) return undefined;
    if (typeof author === 'object') return author.photo;
    return undefined;
  };

  const authorName = getAuthorName(idea.authorId);
  const authorPhoto = getAuthorPhoto(idea.authorId);

  const handleToggleVote = async () => {
    if (!currentUser) {
      alert('Будь ласка, увійдіть, щоб проголосувати');
      return;
    }

    if (isOwnIdea) {
      alert('Ви не можете голосувати за свою ідею');
      return;
    }

    setIsLoading(true);
    try {
      await toggleVote(idea._id);
    } catch (error) {
      console.error('❌ Помилка:', error);
    } finally {
      setIsLoading(false);
    }
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
          <div className={css.authorInfo}>
            {authorPhoto && (
              <img
                src={authorPhoto}
                alt={authorName}
                className={css.avatar}
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://cdn-icons-png.flaticon.com/512/4837/4837857.png';
                }}
              />
            )}
            <span className={css.metaValue}>{authorName}</span>
          </div>
        </div>
      </div>

      <p className={css.description}>{idea.description}</p>

      <div className={css.footer}>
        <div className={css.votes}>
          <span className={css.votesIcon}>👍</span>
          <span className={css.votesCount}>{idea.votes || 0} голосів</span>
        </div>

        {isOwnIdea && <span className={css.ownBadge}>👤 Ваша ідея</span>}

        {!isOwnIdea && currentUser && (
          <button
            className={`${css.voteButton} ${hasVoted ? css.voted : ''}`}
            onClick={handleToggleVote}
            disabled={isLoading}
          >
            {isLoading
              ? '⏳...'
              : hasVoted
                ? '🗳️ Прибрати голос'
                : '🗳️ Проголосувати'}
          </button>
        )}

        {!isOwnIdea && !currentUser && (
          <span className={css.loginBadge}>🔒 Увійдіть, щоб голосувати</span>
        )}
      </div>
    </div>
  );
};
