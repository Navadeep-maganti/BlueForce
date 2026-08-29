import { apiClient } from './apiClient';
import { UserRole } from '../../types';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  avatar_url?: string;
  language_preference: string;
  is_verified: boolean;
  profile_id?: number;
  display_name: string;
  profile_data?: any;
  created_at: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  username?: string;
  phone?: string;
  location?: string;
  full_name?: string;
  primary_trade?: string;
  years_of_experience?: number;
  education?: string;
  company_name?: string;
  trade_industry?: string;
  gst_or_cin_number?: string;
}

export const authApi = {
  async register(payload: RegisterPayload) {
    const res = await apiClient.post('/auth/register/', payload);
    return res.data;
  },

  async login(usernameOrEmail: string, password: string) {
    const res = await apiClient.post('/auth/login/', {
      username_or_email: usernameOrEmail,
      password: password,
    });
    return res.data;
  },

  async refreshToken(refreshToken: string) {
    const res = await apiClient.post('/auth/refresh/', {
      refresh: refreshToken,
    });
    return res.data;
  },

  async logout(refreshToken?: string) {
    try {
      const res = await apiClient.post('/auth/logout/', { refresh: refreshToken });
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },

  async getMe() {
    const res = await apiClient.get('/auth/me/');
    return res.data;
  },
};
