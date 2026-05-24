import { GENRES } from '../../data/genres';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as yup from 'yup';
import type { CreateGameIdea } from '../../types/gameIdea';
import {
  selectAddNewIdea,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import css from './GameIdeasForm.module.css';

type GenresValues =
  | 'Shooter'
  | 'RPG'
  | 'Strategy'
  | 'Simulation'
  | 'Racing'
  | 'Horror'
  | 'Action'
  | 'Puzzle'
  | 'Adventure';

interface FormValues {
  title: string;
  genre: GenresValues;
  userName: string;
  description: string;
}

const initialValues: FormValues = {
  title: '',
  genre: 'Action',
  userName: '',
  description: '',
};

const ideaSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, 'В назві має бути мінімум два символи')
    .required('Назва гри є обовя`зковим полем  '),
  genre: yup
    .string()
    .oneOf([
      'Shooter',
      'RPG',
      'Strategy',
      'Simulation',
      'Racing',
      'Action',
      'Puzzle',
      'Adventure',
      'Horror',
    ])
    .required("Жанр обов'язкове поле"),
  userName: yup
    .string()
    .min(2, 'В вашому імені має бути мінімум два символи')
    .required(`Ваше ім'я на зображення є обовя'зковим полем  `),

  description: yup
    .string()
    .max(500, 'Максимум 500 символів')
    .min(50, 'В описі має бути мінімум 50 символи'),
});

export const GameIdeasForm = () => {
  const addNewIdea = useGameIdeasStore(selectAddNewIdea);
  const handleSubmit = (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const newIdea: CreateGameIdea = {
      ...values,
      ...values,
      votes: 0, // початкова кількість голосів
      createdAt: formattedDate, // Початкова кількість голосів
    };
    addNewIdea(newIdea);
    formikHelpers.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ideaSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={css.form}>
          <h3 className={css.formTitle}>✨ Запропонувати ідею</h3>

          <div className={css.formGroup}>
            <label className={css.label}>Назва гри</label>
            <Field type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Жанр гри</label>
            <Field as="select" name="genre" className={css.select}>
              {GENRES.map(genre => (
                <option key={genre.id} value={genre.name}>
                  {genre.icon} {genre.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="genre" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Ваше ім'я</label>
            <Field type="text" name="userName" className={css.input} />
            <ErrorMessage name="userName" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Опис ідеї</label>
            <Field as="textarea" name="description" className={css.textarea} />
            <ErrorMessage
              name="description"
              component="p"
              className={css.error}
            />
          </div>

          <button
            type="submit"
            className={css.submitButton}
            disabled={!isValid || !dirty}
          >
            💡 Відправити ідею
          </button>
        </Form>
      )}
    </Formik>
  );
};
