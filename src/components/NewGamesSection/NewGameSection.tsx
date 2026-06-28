import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { selectFiveNewestGames, useGamesStore } from '../../store/gameStore';
import { NewGameItem } from '../NewGameItem/NewGameItem';
import css from './NewGameSection.module.css';

export const NewGamesSection = () => {
  const newGames = useGamesStore(selectFiveNewestGames);

  return (
    <section className={css.section}>
      <div className={css.container}>
        <h2 className={css.title}>Новинки ігрового світу</h2>
        <h3 className={css.subtitle}>Останні релізи, які варті вашої уваги</h3>

        <Carousel
          indicators={true}
          interval={4000}
          nextLabel="Наступна гра"
          prevLabel="Попередня гра"
          className={css.carousel}
          controls={true}
        >
          {newGames.map(game => (
            <Carousel.Item key={game._id}>
              <div className={css.slideWrapper}>
                <NewGameItem game={game} />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
};
