import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuth } from '../../store/authStore';

export const ProtectedRoute = () => {
  const isAuth = useAuthStore(selectIsAuth);

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
