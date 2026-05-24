import { Outlet, useLocation } from 'react-router';
import { Navigation } from '../Navigation/Navigation';
import css from './Layout.module.css';
import {
  selectAllGames,
  selectFetchGames,
  useGamesStore,
} from '../../store/gameStore';
import { useEffect } from 'react';
import {
  selectFetchGamesIdeas,
  selectGamesIdeas,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';

export const Layout = () => {
  const location = useLocation();
  const games = useGamesStore(selectAllGames);
  const fetchGames = useGamesStore(selectFetchGames);
  const gameIdeas = useGameIdeasStore(selectGamesIdeas);
  const fetchGamesIdeas = useGameIdeasStore(selectFetchGamesIdeas);
  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
    if (gameIdeas.length === 0) {
      fetchGamesIdeas();
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
