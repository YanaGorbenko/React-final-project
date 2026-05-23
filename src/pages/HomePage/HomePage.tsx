import { useGamesStore, selectAllGames } from '../../store/gameStore';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { TopGamesSection } from '../../components/TopGamesSection/TopGamesSection';
import { NewGamesSection } from '../../components/NewGamesSection/NewGameSection';

export const HomePage = () => {
  const games = useGamesStore(selectAllGames);

  return (
    <>
      {games.length > 0 ? <HeroSection /> : <p>Завантаження...</p>}
      {games.length > 0 ? <TopGamesSection /> : <p>Завантаження...</p>}
      {games.length > 0 ? <NewGamesSection /> : <p>Завантаження...</p>}
    </>
  );
};
