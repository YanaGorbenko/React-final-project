import {
  useGamesStore,
  selectAllGames,
  selectIsLoading,
  selectError,
} from '../../store/gameStore';
import { HeroSection } from '../../components/HeroSection/HeroSection';
import { TopGamesSection } from '../../components/TopGamesSection/TopGamesSection';
import { NewGamesSection } from '../../components/NewGamesSection/NewGameSection';
import {
  selectGamesIdeas,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import { TopIdeasSection } from '../../components/TopIdeasSection/TopIdeasSection';
import { Loader } from '../../components/Loader/Loader';
import { Error } from '../../components/Error/Error';

export const HomePage = () => {
  const games = useGamesStore(selectAllGames);
  const ideas = useGameIdeasStore(selectGamesIdeas);
  const isLoading = useGamesStore(selectIsLoading);
  const isError = useGamesStore(selectError);
  return (
    <>
      <Loader isLoading={isLoading} />
      {!isLoading && !isError && (
        <>
          {games.length > 0 && <HeroSection />}
          {games.length > 0 && <TopGamesSection />}
          {games.length > 0 && <NewGamesSection />}
          {ideas.length > 0 && <TopIdeasSection />}
        </>
      )}
      {isError && <Error error={isError} />}
    </>
  );
};
