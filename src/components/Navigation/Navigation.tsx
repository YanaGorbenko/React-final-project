import { NavLink } from 'react-router';
import css from './Navigation.module.css';

export const Navigation = () => {
  return (
    <nav className={css.nav}>
      <ul className={css.navList}>
        <li className={css.navItem}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            Головна
          </NavLink>
        </li>
        <li className={css.navItem}>
          <NavLink
            to="/games"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            Усі ігри
          </NavLink>
        </li>
        <li className={css.navItem}>
          <NavLink
            to="/selected"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            Обрані ігри
          </NavLink>
        </li>
        <li className={css.navItem}>
          <NavLink
            to="/gamesIdeas"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            Ідеї для ігор
          </NavLink>
        </li>
        <li className={css.navItem}>
          <NavLink
            to="/genres"
            className={({ isActive }) =>
              isActive ? `${css.navLink} ${css.active}` : css.navLink
            }
          >
            Жанри
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
