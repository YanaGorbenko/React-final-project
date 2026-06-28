import { Outlet, useLocation } from 'react-router';
import { Navigation } from '../Navigation/Navigation';
import css from './Layout.module.css';
import {
  selectAllGames,
  selectFetchAllGames,
  useGamesStore,
} from '../../store/gameStore';
import { useEffect, useRef } from 'react';
import {
  selectFetchGamesIdeas,
  selectGamesIdeas,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import { refreshSession, getCurrentUser } from '../../services/authApi';
import {
  useAuthStore,
  selectSetUser,
  selectClearAuth,
  selectIsAuth,
} from '../../store/authStore';
import {
  selectFetchSelected,
  useSelectedStore,
} from '../../store/selectedStore';
import { selectFetchMyIdeas, useMyIdeasStore } from '../../store/myIdeasStore';

export const Layout = () => {
  const location = useLocation();
  const games = useGamesStore(selectAllGames);
  const fetchGames = useGamesStore(selectFetchAllGames);
  const gameIdeas = useGameIdeasStore(selectGamesIdeas);
  const fetchGamesIdeas = useGameIdeasStore(selectFetchGamesIdeas);
  const setUser = useAuthStore(selectSetUser);
  const clearAuth = useAuthStore(selectClearAuth);
  const isAuth = useAuthStore(selectIsAuth);
  const fetchSelected = useSelectedStore(selectFetchSelected);
  const fetchMyIdeas = useMyIdeasStore(selectFetchMyIdeas);

  const hasLoadedGames = useRef(false);
  const hasLoadedIdeas = useRef(false);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (isAuth) {
      fetchSelected();
      fetchMyIdeas();
    }
  }, [isAuth]);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      try {
        const isRefreshed = await refreshSession();
        if (isRefreshed) {
          const user = await getCurrentUser();
          if (user) {
            setUser(user);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      }
    };

    checkAuth();
  }, [setUser, clearAuth]);

  useEffect(() => {
    if (games.length === 0 && !hasLoadedGames.current) {
      hasLoadedGames.current = true;
      fetchGames();
    }

    if (gameIdeas.length === 0 && !hasLoadedIdeas.current) {
      hasLoadedIdeas.current = true;
      fetchGamesIdeas(1);
    }
  }, [games.length, gameIdeas.length, fetchGames, fetchGamesIdeas]);

  return (
    <div className={css.layout}>
      {!location.pathname.includes('details') && (
        <header className={css.header}>
          <Navigation />
        </header>
      )}
      <main className={css.main}>
        <Outlet />
      </main>
    </div>
  );
};
