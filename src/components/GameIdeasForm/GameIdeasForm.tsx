import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import Select from 'react-select';
import * as yup from 'yup';
import type { CreateGameIdea } from '../../types/gameIdea';
import {
  selectAddNewIdea,
  useGameIdeasStore,
} from '../../store/gameIdeasStore';
import { GENRES } from '../../data/genres';
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

const genreOptions = GENRES.map(genre => ({
  value: genre.name,
  label: `${genre.icon} ${genre.name}`,
}));

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    background: '#0a0a0a',
    borderColor: state.isFocused ? '#e63946' : '#2a2a2a',
    borderRadius: '10px',
    padding: '2px',
    boxShadow: state.isFocused ? '0 0 0 1px #e63946' : 'none',
    '&:hover': {
      borderColor: '#e63946',
    },
  }),
  menu: (base: any) => ({
    ...base,
    background: '#1a1a1a',
    borderRadius: '10px',
    overflow: 'hidden',
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 0,
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#0a0a0a',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e63946',
      borderRadius: '4px',
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? '#e63946' : '#1a1a1a',
    color: state.isFocused ? 'white' : '#e5e7eb',
    cursor: 'pointer',
    '&:active': {
      background: '#c1121f',
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'white',
  }),
  input: (base: any) => ({
    ...base,
    color: 'white',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#6c757d',
  }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? '#e63946' : '#9ca3af',
    '&:hover': {
      color: '#e63946',
    },
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: '#9ca3af',
    '&:hover': {
      color: '#e63946',
    },
  }),
};

const ideaSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, ' В назві має бути мінімум два символи')
    .required(" Назва гри є обов'язковим полем"),
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
    .required(" Жанр обов'язкове поле"),
  userName: yup
    .string()
    .min(2, ' В вашому імені має бути мінімум два символи')
    .required("Ваше ім'я є обов'язковим полем"),
  description: yup
    .string()
    .max(500, ' Максимум 500 символів')
    .min(50, ' В описі має бути мінімум 50 символів')
    .required(" Опис є обов'язковим полем"),
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
      title: values.title,
      genre: values.genre,
      userName: values.userName,
      description: values.description,
      votes: 0,
      createdAt: formattedDate,
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
      {({ isValid, dirty, setFieldValue, values, errors, touched }) => (
        <Form className={css.form}>
          <h3 className={css.formTitle}>✨ Запропонувати ідею</h3>

          <div className={css.formGroup}>
            <label className={css.label}>Назва гри</label>
            <Field
              type="text"
              name="title"
              className={
                errors.title && touched.title ? css.inputError : css.input
              }
            />
            <ErrorMessage name="title" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Жанр гри</label>
            <Select
              instanceId="game-genre"
              options={genreOptions}
              value={genreOptions.find(opt => opt.value === values.genre)}
              onChange={option => setFieldValue('genre', option?.value)}
              styles={customSelectStyles}
              placeholder="Оберіть жанр..."
              isSearchable
              className={errors.genre && touched.genre ? css.selectError : ''}
            />
            <ErrorMessage name="genre" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Ваше ім'я</label>
            <Field
              type="text"
              name="userName"
              className={
                errors.userName && touched.userName ? css.inputError : css.input
              }
            />
            <ErrorMessage name="userName" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Опис ідеї</label>
            <Field
              as="textarea"
              name="description"
              className={
                errors.description && touched.description
                  ? css.textareaError
                  : css.textarea
              }
            />
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
