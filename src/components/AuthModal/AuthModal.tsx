
import { useState, useEffect } from 'react';
import { LoginForm } from '../LoginForm/LoginForm';
import { RegistrationForm } from '../RegistrationForm/RegistrationForm';
import css from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  return (
    <div
      className={css.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {mode === 'login' ? (
          <LoginForm onClose={onClose} onSwitchToRegister={switchToRegister} />
        ) : (
          <RegistrationForm onClose={onClose} onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};
