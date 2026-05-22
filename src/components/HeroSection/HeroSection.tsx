import { useNavigate } from 'react-router';
import { selectGetTopRatedGame, useGamesStore } from '../../store/gameStore';
import css from './HeroSection.module.css';

export const HeroSection = () => {
  const getTopGame = useGamesStore(selectGetTopRatedGame);
  const topGame = getTopGame(); // тепер тут завжди будуть дані!
  const navigate = useNavigate();

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.textContent}>
            <span className={css.badge}>🏆 ТОПОВА ГРА</span>
            <h1 className={css.title}>Найпопулярніша гра тижня</h1>
            <h3 className={css.gameTitle}>{topGame?.title}</h3>
            <div className={css.meta}>
              <span className={css.rating}>⭐ {topGame?.rating}/10</span>
              <span className={css.genre}>🎮 {topGame?.genre}</span>
            </div>
            <p className={css.description}>
              {topGame?.description.split('.')[0]}. Понад 250 нагород та
              визнання найкращою {topGame?.genre} усіх часів.
            </p>
            <button className={css.button} onClick={() => navigate('/games')}>
              Дослідити ігри →
            </button>
          </div>
          <div className={css.imageContent}>
            <img
              className={css.image}
              src={topGame?.imageURL}
              alt={topGame?.title}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
