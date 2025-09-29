import type { $Fetch } from 'nitropack';
import type { RuntimeConfig } from 'nuxt/schema';
import type { AuthResponse, ForgotPassword, Login, Register, UserProfile } from '~/types/auth';

export class AuthService {
  constructor(
    protected api: $Fetch,
    protected runtimeConfig: RuntimeConfig
  ) {}

  async login(body: Login) {
    const result = await this.api<AuthResponse>(`/auth/login`, {
      method: 'post',
      body
    });

    if ('access_token' in result) {
      const { access_token: accessToken } = result;
      return { accessToken };
    }

    return result;
  }

  register(body: Register) {
    return this.api(`/auth/login`, {
      method: 'post',
      body
    });
  }

  forgotPassword(body: ForgotPassword) {
    return this.api(`/auth/forgot-password`, {
      method: 'post',
      body
    });
  }

  verifyEmail(token: string) {
    return this.api(`/auth/verify-email`, {
      method: 'post',
      body: { token }
    });
  }

  resetPassword(body: { token: string; password: string }) {
    return this.api(`/auth/reset-password`, {
      method: 'post',
      body
    });
  }

  me() {
    return this.api<UserProfile>(`/auth/me`);
  }
}
