import { useState } from 'react';
import type { GameIdea } from '../../types/gameIdea';
import { useMyIdeasStore, selectDeleteMyIdea } from '../../store/myIdeasStore';
import css from './MyIdeaItem.module.css';

interface Props {
  idea: GameIdea;
  onEdit: (idea: GameIdea) => void;
}

export const MyIdeaItem = ({ idea, onEdit }: Props) => {
  const deleteIdea = useMyIdeasStore(selectDeleteMyIdea);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Ви впевнені, що хочете видалити ідею "${idea.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteIdea(idea._id);
    } catch (error) {
      console.error('❌ Помилка видалення:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    onEdit(idea);
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
          <span className={css.metaLabel}>Голосів:</span>
          <span className={css.votesCount}>👍 {idea.votes}</span>
        </div>
      </div>

      <p className={css.description}>{idea.description}</p>

      <div className={css.footer}>
        <button
          className={css.editButton}
          onClick={handleEdit}
          disabled={isDeleting}
        >
          ✏️ Редагувати
        </button>
        <button
          className={css.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '⏳ Видалення...' : '🗑️ Видалити'}
        </button>
      </div>
    </div>
  );
};
