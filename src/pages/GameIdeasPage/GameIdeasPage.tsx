import { Error } from '../../components/Error/Error';
import { GameIdeasList } from '../../components/GameIdeasList/GameIdeasList';
import { Loader } from '../../components/Loader/Loader';
import {
  selectErrorIdeas,
  selectIsLoadingIdeas,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import css from './GameIdeasPage.module.css';

export const GameIdeasPage = () => {
  const isLoading = useGameIdeasStore(selectIsLoadingIdeas);
  const isError = useGameIdeasStore(selectErrorIdeas);

  return (
    <div className={css.page}>
      <div className={css.container}>
        <h1 className={css.title}>💡 Ідеї для ігор</h1>
        <p className={css.subtitle}>
          Діліться своїми ідеями, надихайте інших та голосуйте за найкращі
          концепти!
        </p>
        <Loader isLoading={isLoading} />
        {!isLoading && !isError && (
          <div className={css.content}>
            <div className={css.listSection}>
              <GameIdeasList />
            </div>
          </div>
        )}
        {isError && <Error error={isError} />}
      </div>
    </div>
  );
};
