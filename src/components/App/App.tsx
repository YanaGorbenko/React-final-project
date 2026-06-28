import { Route, Routes } from 'react-router-dom';
import { Layout } from '../Layout/Layout';
import { HomePage } from '../../pages/HomePage/HomePage';
import { AllGamesPage } from '../../pages/AllGamesPage/AllGamesPage';
import { GenresPage } from '../../pages/GenresPage/GenresPage';
import { GameDetailsPage } from '../../pages/GameDetailsPage/GameDetailsPage';
import { GameIdeasPage } from '../../pages/GameIdeasPage/GameIdeasPage';
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage';
import { FavoritesTab } from '../FavoritesTab/FavoritesTab';
import { MyIdeasSection } from '../MyIdeasSection/MyIdeasSection';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/games" element={<AllGamesPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/gameIdeas" element={<GameIdeasPage />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route path="favorites" element={<FavoritesTab />} />
          <Route path="my-ideas" element={<MyIdeasSection />} />
        </Route>
        <Route path="/:gameId/details" element={<GameDetailsPage />} />
      </Route>
    </Routes>
  );
};
