import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectAllGames, useGamesStore } from '../../store/gameStore';
import { GameDetails } from '../../components/GameDetails/GameDetails';
import css from './GameDetailsPage.module.css';

export const GameDetailsPage = () => {
  const games = useGamesStore(selectAllGames);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoBack = () => {
    navigate(location.state?.from || '/games');
  };
  const game = games.find(item => item.id === gameId);

  if (!game) {
    return (
      <div className={css.page}>
        <div className={css.container}>
          <button onClick={handleGoBack} className={css.backButton}>
            Повернутись назад
          </button>
          <div style={{ color: 'white', textAlign: 'center' }}>
            Гру не знайдено
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.page}>
      <div className={css.container}>
        <button onClick={handleGoBack} className={css.backButton}>
          Повернутись назад
        </button>
        <GameDetails game={game} />
      </div>
    </div>
  );
};
