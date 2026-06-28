import css from './Loader.module.css';

interface Props {
  isLoading: boolean;
}

export const Loader = ({ isLoading }: Props) => {
  if (!isLoading) return null;

  return (
    <div className={css.overlay}>
      <div className={css.spinner}></div>
      <p className={css.text}>Завантаження...</p>
    </div>
  );
};
