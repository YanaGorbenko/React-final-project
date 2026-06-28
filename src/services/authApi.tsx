import { api } from './api';
import type {
  LoginData,
  RegisterData,
  User,
  AuthResponse,
} from '../types/auth';

export const registerUser = async (data: RegisterData): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/sign-up', data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<User> => {
  const response = await api.post<AuthResponse>('/auth/sign-in', data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const refreshSession = async (): Promise<boolean> => {
  try {
    await api.post('/auth/refresh');
    return true;
  } catch {
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>('/auth/current');
    return response.data;
  } catch {
    return null;
  }
};

export const updateUserPhoto = async (photoUrl: string): Promise<User> => {
  const response = await api.put('/users/avatar', {
    avatarUrl: photoUrl,
  });
  return response.data.data;
};
