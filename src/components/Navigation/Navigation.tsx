import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthModal } from '../AuthModal/AuthModal';
import {
  useAuthStore,
  selectUser,
  selectClearAuth,
  selectIsAuth,
} from '../../store/authStore';
import { logoutUser } from '../../services/authApi';
import css from './Navigation.module.css';

export const Navigation = () => {
  const user = useAuthStore(selectUser);
  const isAuth = useAuthStore(selectIsAuth);
  const clearAuth = useAuthStore(selectClearAuth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
    } catch (error) {
      console.error('❌ Помилка виходу:', error);
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
    setModalMode('login');
  };

  return (
    <>
      <nav className={css.nav}>
        <ul className={css.navList}>
          <li className={css.navItem}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${css.navLink} ${css.active}` : css.navLink
              }
            >
              Головна
            </NavLink>
          </li>
          <li className={css.navItem}>
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? `${css.navLink} ${css.active}` : css.navLink
              }
            >
              Всі ігри
            </NavLink>
          </li>
          <li className={css.navItem}>
            <NavLink
              to="/gameIdeas"
              className={({ isActive }) =>
                isActive ? `${css.navLink} ${css.active}` : css.navLink
              }
            >
              Ідеї
            </NavLink>
          </li>
          <li className={css.navItem}>
            <NavLink
              to="/genres"
              className={({ isActive }) =>
                isActive ? `${css.navLink} ${css.active}` : css.navLink
              }
            >
              Жанри
            </NavLink>
          </li>
          {isAuth && user && (
            <li className={css.navItem}>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? `${css.navLink} ${css.active}` : css.navLink
                }
              >
                <div className={css.profileLink}>
                  <img
                    src={
                      user.photo ||
                      'https://cdn-icons-png.flaticon.com/512/4837/4837857.png'
                    }
                    alt={user.name}
                    className={css.navAvatar}
                  />
                  <span>{user.name}</span>
                </div>
              </NavLink>
            </li>
          )}
        </ul>

        <div className={css.authSection}>
          {isAuth && user ? (
            <div className={css.userMenu}>
              <button className={css.logoutButton} onClick={handleLogout}>
                Вийти
              </button>
            </div>
          ) : (
            <div className={css.authButtons}>
              <button
                className={css.loginButton}
                onClick={() => openAuthModal('login')}
              >
                Увійти
              </button>
              <button
                className={css.registerButton}
                onClick={() => openAuthModal('register')}
              >
                Зареєструватися
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeModal}
        defaultMode={modalMode}
      />
    </>
  );
};
