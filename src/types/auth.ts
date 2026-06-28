export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  photo: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
