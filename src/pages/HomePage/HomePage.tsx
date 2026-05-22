import { useEffect } from 'react';
import {
  useGamesStore,
  selectAllGames,
  selectFetchGames,
} from '../../store/gameStore';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { TopGamesSection } from '../../components/TopGamesSection/TopGamesSection';
import { NewGamesSection } from '../../components/NewGamesSection/NewGameSection';

export const HomePage = () => {
  const games = useGamesStore(selectAllGames);
  const fetchGames = useGamesStore(selectFetchGames);
  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
  });

  return (
    <>
      {games.length > 0 ? <HeroSection /> : <p>Завантаження...</p>}
      {games.length > 0 ? <TopGamesSection /> : <p>Завантаження...</p>}
      {games.length > 0 ? <NewGamesSection /> : <p>Завантаження...</p>}
    </>
  );
};
