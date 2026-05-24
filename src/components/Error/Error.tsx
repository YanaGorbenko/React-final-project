import css from './Error.module.css';

interface Props {
  error: string | null;
}

export const Error = ({ error }: Props) => {
  if (!error) return null;
  return (
    <div className={css.container}>
      <div className={css.content}>
        <div className={css.icon}>⚠️</div>
        <h3 className={css.title}>Щось пішло не так</h3>
        <p className={css.message}>{error}</p>
      </div>
    </div>
  );
};
