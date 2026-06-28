import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as yup from 'yup';
import type { RegisterData } from '../../types/auth';
import { registerUser } from '../../services/authApi';
import {
  useAuthStore,
  selectSetUser,
  selectSetError,
} from '../../store/authStore';
import css from './RegistrationForm.module.css';

interface FormValues {
  name: string;
  email: string;
  password: string;
  photo: string;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  photo: 'https://cdn-icons-png.flaticon.com/512/4837/4837857.png',
};

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'В імені користувача має бути мінімум два символи')
    .required("Ім'я користувача є обов'язковим полем"),
  email: yup
    .string()
    .email('Електронна пошта має включати знак @')
    .required("Електронна пошта обов'язкове поле"),
  password: yup
    .string()
    .min(10, 'В паролі має бути мінімум десять символів')
    .required("Пароль є обов'язковим полем"),
  photo: yup.string().url('Фото має бути посиланням').optional(),
});

interface RegistrationFormProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegistrationForm = ({
  onClose,
  onSwitchToLogin,
}: RegistrationFormProps) => {
  const setUser = useAuthStore(selectSetUser);
  const setError = useAuthStore(selectSetError);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>,
  ) => {
    try {
      setError(null);

      const data: RegisterData = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        photo:
          values.photo.trim() ||
          'https://cdn-icons-png.flaticon.com/512/4837/4837857.png',
      };

      const user = await registerUser(data);
      setUser(user);

      if (onClose) onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setFieldError(
          'email',
          'Користувач з такою електронною поштою вже існує',
        );
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        const validationBody = errorData?.validation?.body;

        if (validationBody) {
          const keys = Object.keys(validationBody);
          if (keys.length > 0) {
            setFieldError(keys[0], validationBody[keys[0]]);
          } else {
            setFieldError('name', errorData?.message || 'Невірні дані');
          }
        } else {
          setFieldError(
            'name',
            errorData?.message || 'Невірні дані. Перевірте всі поля.',
          );
        }
      } else {
        setError(error.response?.data?.message || 'Помилка реєстрації');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form className={css.form}>
          <h3 className={css.formTitle}>✨ Реєстрація</h3>

          <div className={css.formGroup}>
            <label className={css.label}>Ім'я користувача:</label>
            <Field type="text" name="name" placeholder="Введіть ім'я..." />
            <ErrorMessage name="name" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Електронна пошта:</label>
            <Field type="email" name="email" placeholder="example@mail.com" />
            <ErrorMessage name="email" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Пароль:</label>
            <Field
              type="password"
              name="password"
              placeholder="Мінімум 10 символів"
            />
            <ErrorMessage name="password" component="p" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label className={css.label}>Фото профілю (необов'язково):</label>
            <Field type="text" name="photo" placeholder="https://..." />
            <ErrorMessage name="photo" component="p" className={css.error} />
          </div>

          <button
            type="submit"
            className={css.submitButton}
            disabled={!isValid || !dirty || isSubmitting}
          >
            {isSubmitting ? 'Реєстрація...' : '💡 Зареєструватись'}
          </button>

          <p className={css.switchText}>
            Вже є акаунт?{' '}
            <button
              type="button"
              className={css.switchButton}
              onClick={onSwitchToLogin}
            >
              Увійти
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
};
