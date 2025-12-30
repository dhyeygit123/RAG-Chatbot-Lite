import { create } from 'zustand';
import api from '../lib/api';

export const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ loading: false });
        return;
      }
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  }
}));