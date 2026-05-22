import { Outlet } from 'react-router';
import { Navigation } from '../Navigation/Navigation';
import css from './Layout.module.css';

export const Layout = () => {
  return (
    <div className={css.layout}>
      <header className={css.header}>
        <Navigation />
      </header>
      <main className={css.main}>
        <Outlet />
      </main>
    </div>
  );
};
