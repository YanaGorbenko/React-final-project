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
import { ProtectedRoute } from '../PtotectedRoute/PtotectedRoute';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/games" element={<AllGamesPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/gameIdeas" element={<GameIdeasPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />}>
            <Route index element={<FavoritesTab />} />
            <Route path="favorites" element={<FavoritesTab />} />
            <Route path="my-ideas" element={<MyIdeasSection />} />
          </Route>
        </Route>
        <Route path="/:gameId/details" element={<GameDetailsPage />} />
      </Route>
    </Routes>
  );
};
