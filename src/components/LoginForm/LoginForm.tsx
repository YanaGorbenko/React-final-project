import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as yup from 'yup';
import { loginUser } from '../../services/authApi';
import {
  useAuthStore,
  selectSetUser,
  selectSetError,
} from '../../store/authStore';
import css from './LoginForm.module.css';

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Електронна пошта має включати знак @')
    .required("Електронна пошта обов'язкове поле"),
  password: yup.string().required("Пароль є обов'язковим полем"),
});

interface LoginFormProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onClose, onSwitchToRegister }: LoginFormProps) => {
  const setUser = useAuthStore(selectSetUser);
  const setError = useAuthStore(selectSetError);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>,
  ) => {
    try {
      setError(null);
      const user = await loginUser(values);
      setUser(user);

      if (onClose) onClose();
    } catch (error: any) {
      console.error('❌ Помилка входу:', error);

      if (error.response?.status === 401) {
        setFieldError('password', 'Невірна електронна пошта або пароль');
      } else {
        setError(error.response?.data?.message || 'Помилка входу');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form className={css.form}>
          <h3 className={css.formTitle}>🔐 Вхід</h3>

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
              placeholder="Введіть пароль"
            />
            <ErrorMessage name="password" component="p" className={css.error} />
          </div>

          <button
            type="submit"
            className={css.submitButton}
            disabled={!isValid || !dirty || isSubmitting}
          >
            {isSubmitting ? 'Вхід...' : '🔑 Увійти'}
          </button>

          <p className={css.switchText}>
            Немає акаунта?{' '}
            <button
              type="button"
              className={css.switchButton}
              onClick={onSwitchToRegister}
            >
              Зареєструватися
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
};
