import { create } from 'zustand';

export interface Permission {
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'customer' | 'teknisi' | 'agen';
  role_description?: string;
  permissions: Permission[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permissionName: string) => boolean;
  hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => {
    try {
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch {
    }
    set({ user });
  },
  
  setToken: (token) => {
    try {
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch {
    }
    set({ token });
  },

  login: (user, token) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch {
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch {
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  hasPermission: (permissionName: string) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.name === permissionName);
  },

  hasRole: (roles: string[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },
}));
