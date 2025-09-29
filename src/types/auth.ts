export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  token: string;
  password: string;
}

export interface VerifyEmail {
  token: string;
}

export interface ResendVerification {
  email: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  access_token: string;
}

export interface UserProfile {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  emailVerified: boolean;
}

export interface RegisterResponse {
  id: number;
  email: string;
  emailVerified: boolean;
}
