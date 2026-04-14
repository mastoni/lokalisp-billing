import api from '@/lib/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  role_description?: string;
  permissions: Array<{
    name: string;
    description: string;
    resource: string;
    action: string;
  }>;
}

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data);
    if (response.data.success && response.data.data.token) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to get user info');
  },
};
