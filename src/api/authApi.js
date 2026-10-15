import { apiFetch } from './index.js';

export const register = (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
export const login = (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
export const getCurrentUser = () => apiFetch('/auth/me');
export const changePasswordApi = (passwords) => apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) });
