export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  password: string
}

export interface VerifyEmailDto {
  token: string
}

export interface ResendVerificationDto {
  email: string
}

export interface AuthResponse {
  id: number
  email: string
  access_token: string
}

export interface UserProfile {
  id: number
  email: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  emailVerified: boolean
}

export interface RegisterResponse {
  id: number
  email: string
  emailVerified: boolean
}
