import { Route, Routes } from 'react-router';
import { Layout } from '../Layout/Layout';
import { HomePage } from '../../pages/HomePage/HomePage';
import { AllGamesPage } from '../../pages/AllGamesPage/AllGamesPage';
import { SelectedGamesPage } from '../../pages/SelectedGamesPage/SelectedGamesPage';
import { GenresPage } from '../../pages/GenresPage/GenresPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/games" element={<AllGamesPage />} />
        <Route path="/selected" element={<SelectedGamesPage />} />
        <Route path="/genres" element={<GenresPage />} />
        {/* <Route path="/selected" element={<SelectedGamePage />} /> */}

        {/* <Route path="products/:productId" element={<ProductDetailsPage />} /> */}
      </Route>
    </Routes>
  );
};
