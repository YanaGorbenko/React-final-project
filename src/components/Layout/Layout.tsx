import { Outlet, useLocation } from 'react-router';
import { Navigation } from '../Navigation/Navigation';
import css from './Layout.module.css';
import {
  selectAllGames,
  selectFetchGames,
  useGamesStore,
} from '../../store/gameStore';
import { useEffect } from 'react';

export const Layout = () => {
  const location = useLocation();
  const games = useGamesStore(selectAllGames);
  const fetchGames = useGamesStore(selectFetchGames);
  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
  });
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
