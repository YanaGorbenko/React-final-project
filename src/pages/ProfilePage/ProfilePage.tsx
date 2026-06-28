import { useState } from 'react';
import {
  useAuthStore,
  selectUser,
  selectClearAuth,
  selectSetUser,
} from '../../store/authStore';
import { logoutUser, updateUserPhoto } from '../../services/authApi';
import {
  useGameIdeasStore,
  selectFetchGamesIdeas,
  selectIsLoadingIdeas,
} from '../../store/gameIdeasStore';
import {
  useMyIdeasStore,
  selectFetchMyIdeas,
  selectIsLoadingMyIdeas,
} from '../../store/myIdeasStore';
import { Loader } from '../../components/Loader/Loader';
import { NavLink, Outlet } from 'react-router-dom';
import css from './ProfilePage.module.css';

export const ProfilePage = () => {
  const user = useAuthStore(selectUser);
  const setUser = useAuthStore(selectSetUser);
  const clearAuth = useAuthStore(selectClearAuth);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useGameIdeasStore(selectFetchGamesIdeas);
  const fetchMyIdeas = useMyIdeasStore(selectFetchMyIdeas);

  const isLoadingIdeas = useGameIdeasStore(selectIsLoadingIdeas);
  const isLoadingMyIdeas = useMyIdeasStore(selectIsLoadingMyIdeas);

  if (!user) {
    return (
      <div className={css.notAuth}>
        <h2>⚠️ Ви не авторизовані</h2>
        <p>Будь ласка, увійдіть або зареєструйтесь</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
    } catch (error) {
      console.error('❌ Помилка виходу:', error);
    }
  };

  const handleChangePhoto = async () => {
    if (!newPhoto.trim()) {
      setError('Будь ласка, введіть посилання на фото');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserPhoto(newPhoto.trim());
      setUser(updatedUser);

      await fetchIdeas(1);
      await fetchMyIdeas(1);

      setIsEditingPhoto(false);
      setNewPhoto('');
    } catch (error) {
      console.error('❌ Помилка оновлення фото:', error);
      setError('Не вдалося оновити фото. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.profilePage}>
      {(isLoadingIdeas || isLoadingMyIdeas) && <Loader isLoading={true} />}

      <div className={css.sidebar}>
        <div className={css.avatarSection}>
          <img
            src={
              user.photo ||
              'https://cdn-icons-png.flaticon.com/512/4837/4837857.png'
            }
            alt={user.name}
            className={css.avatar}
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://cdn-icons-png.flaticon.com/512/4837/4837857.png';
            }}
          />
          <h3 className={css.userName}>{user.name}</h3>
          <p className={css.userEmail}>{user.email}</p>

          <button
            className={css.editPhotoBtn}
            onClick={() => setIsEditingPhoto(true)}
          >
            📷 Змінити фото
          </button>
        </div>

        <nav className={css.profileNav}>
          <NavLink
            to="/profile/favorites"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            ❤️ Обрані ігри
          </NavLink>
          <NavLink
            to="/profile/my-ideas"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            💡 Мої ідеї
          </NavLink>
        </nav>

        <button className={css.logoutBtn} onClick={handleLogout}>
          🚪 Вийти
        </button>
      </div>

      <div className={css.content}>
        <Outlet />
      </div>

      {isEditingPhoto && (
        <div className={css.modal} onClick={() => setIsEditingPhoto(false)}>
          <div className={css.modalContent} onClick={e => e.stopPropagation()}>
            <h3>📷 Змінити фото</h3>

            <input
              type="text"
              placeholder="Введіть посилання на нове фото"
              value={newPhoto}
              onChange={e => setNewPhoto(e.target.value)}
            />

            {error && <p className={css.error}>{error}</p>}

            <div className={css.modalButtons}>
              <button onClick={handleChangePhoto} disabled={isLoading}>
                {isLoading ? '⏳ Збереження...' : '💾 Зберегти'}
              </button>
              <button
                onClick={() => {
                  setIsEditingPhoto(false);
                  setNewPhoto('');
                  setError(null);
                }}
              >
                ❌ Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
