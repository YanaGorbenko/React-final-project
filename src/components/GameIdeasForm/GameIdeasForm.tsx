import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import Select from 'react-select';
import * as yup from 'yup';
import type { CreateGameIdea, GameIdea } from '../../types/gameIdea';
import { GENRES } from '../../data/genres';
import {
  selectAddMyIdea,
  selectUpdateMyIdea,
  useMyIdeasStore,
} from '../../store/myIdeasStore';
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
  description: string;
}

interface GameIdeasFormProps {
  isOpen: boolean;
  onClose: () => void;
  editIdea?: GameIdea | null;
}

const initialValues: FormValues = {
  title: '',
  genre: 'Action',
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
    .min(2, 'В назві має бути мінімум два символи')
    .required("Назва гри є обов'язковим полем"),
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
  description: yup
    .string()
    .max(1000, 'Максимум 350 символів')
    .min(50, 'В описі має бути мінімум 50 символів')
    .required("Опис є обов'язковим полем"),
});

export const GameIdeasForm = ({
  isOpen,
  onClose,
  editIdea,
}: GameIdeasFormProps) => {
  const addNewIdea = useMyIdeasStore(selectAddMyIdea);
  const updateMyIdea = useMyIdeasStore(selectUpdateMyIdea);
  const isEditing = !!editIdea;

  if (!isOpen) return null;

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const newIdea: CreateGameIdea = {
        title: values.title.trim(),
        genre: values.genre,
        description: values.description.trim(),
      };

      if (isEditing && editIdea) {
        await updateMyIdea(editIdea._id, values);
      } else {
        await addNewIdea(newIdea);
      }

      resetForm();
      onClose();
    } catch (error: any) {
      console.error('❌ Ошибка сохранения идеи:', error);
      console.error('❌ Ответ сервера:', error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitialValues = (): FormValues => {
    if (isEditing && editIdea) {
      return {
        title: editIdea.title,
        genre: editIdea.genre as GenresValues,
        description: editIdea.description,
      };
    }
    return initialValues;
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal}>
        <button className={css.closeButton} onClick={onClose}>
          ✕
        </button>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={ideaSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid,
            dirty,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form className={css.form}>
              <h3 className={css.formTitle}>
                {isEditing ? '✏️ Редагувати ідею' : '✨ Запропонувати ідею'}
              </h3>

              <div className={css.formGroup}>
                <label className={css.label}>Назва гри</label>
                <Field
                  type="text"
                  name="title"
                  className={
                    errors.title && touched.title ? css.inputError : css.input
                  }
                  placeholder="Введіть назву гри..."
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className={css.error}
                />
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
                  className={
                    errors.genre && touched.genre ? css.selectError : ''
                  }
                />
                <ErrorMessage
                  name="genre"
                  component="p"
                  className={css.error}
                />
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
                  placeholder="Опишіть вашу ідею (мінімум 50 символів)..."
                  rows={5}
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
                disabled={!isValid || !dirty || isSubmitting}
              >
                {isSubmitting
                  ? 'Збереження...'
                  : isEditing
                    ? '💾 Зберегти зміни'
                    : '💡 Відправити ідею'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
