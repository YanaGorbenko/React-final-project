import { GenreSection } from '../../components/GenreSection/GenreSection';
import { GENRES } from '../../data/genres';
import css from './GenresPage.module.css';

export const GenresPage = () => {
  return (
    <div className={css.page}>
      <div className={css.container}>
        <h1 className={css.mainTitle}>Жанри відеоігор</h1>
        <p className={css.subtitle}>
          Оберіть свій улюблений жанр та відкрийте для себе найкращі ігрові
          всесвіти
        </p>
        <div className={css.genresList}>
          {GENRES.map(genre => (
            <GenreSection key={genre.id} genre={genre} />
          ))}
        </div>
      </div>
    </div>
  );
};
