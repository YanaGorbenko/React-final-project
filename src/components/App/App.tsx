import { Route, Routes } from 'react-router';
import { Layout } from '../Layout/Layout';
import { HomePage } from '../../pages/HomePage/HomePage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* <Route path="/selected" element={<SelectedGamePage />} /> */}

        {/* <Route path="products/:productId" element={<ProductDetailsPage />} /> */}
      </Route>
    </Routes>
  );
};
