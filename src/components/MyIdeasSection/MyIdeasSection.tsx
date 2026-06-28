import { useState } from 'react';
import { Error } from '../../components/Error/Error';
import { Loader } from '../../components/Loader/Loader';
import { GameIdeasForm } from '../GameIdeasForm/GameIdeasForm';
import {
  selectErrorMyIdeas,
  selectIsLoadingMyIdeas,
  selectLoadMoreMyIdeas,
  selectMyHasMore,
  selectMyIdeas,
  selectMyTotalCount,
  useMyIdeasStore,
} from '../../store/myIdeasStore';
import { MyIdeaItem } from '../MyIdeaItem/MyIdeaItem';
import css from './MyIdeasSection.module.css';
import type { GameIdea } from '../../types/gameIdea';

export const MyIdeasSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<GameIdea | null>(null);

  const isLoading = useMyIdeasStore(selectIsLoadingMyIdeas);
  const isError = useMyIdeasStore(selectErrorMyIdeas);
  const myIdeas = useMyIdeasStore(selectMyIdeas);
  const hasMore = useMyIdeasStore(selectMyHasMore);
  const totalCount = useMyIdeasStore(selectMyTotalCount);
  const loadMoreIdeas = useMyIdeasStore(selectLoadMoreMyIdeas);

  const handleAdd = () => {
    setEditingIdea(null);
    setIsModalOpen(true);
  };

  const handleEdit = (idea: GameIdea) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIdea(null);
  };

  return (
    <div className={css.page}>
      <div className={css.container}>
        <div className={css.header}>
          <h1 className={css.title}>💡 Мої ідеї</h1>
          <button className={css.addButton} onClick={handleAdd}>
            ➕ Додати ідею
          </button>
        </div>
        <Loader isLoading={isLoading} />

        {!isLoading && !isError && (
          <div className={css.content}>
            {myIdeas.length === 0 ? (
              <div className={css.emptyState}>
                <p>У вас ще немає ідей. Створіть свою першу ідею!</p>
              </div>
            ) : (
              <>
                <div className={css.listSection}>
                  <ul className={css.list}>
                    {myIdeas.map(idea => (
                      <li key={idea._id} className={css.listItem}>
                        <MyIdeaItem idea={idea} onEdit={handleEdit} />
                      </li>
                    ))}
                  </ul>
                </div>

                {hasMore && (
                  <div className={css.loadMoreContainer}>
                    <button
                      className={css.loadMoreButton}
                      onClick={loadMoreIdeas}
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳ Завантаження...' : '📥 Завантажити ще'}
                    </button>
                    <span className={css.loadMoreInfo}>
                      ({myIdeas.length} з {totalCount})
                    </span>
                  </div>
                )}

                {!hasMore && myIdeas.length > 0 && (
                  <div className={css.allLoaded}>
                    <p>✅ Всі ідеї завантажені ({myIdeas.length})</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {isError && <Error error={isError} />}
        <GameIdeasForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editIdea={editingIdea}
        />
      </div>
    </div>
  );
};
