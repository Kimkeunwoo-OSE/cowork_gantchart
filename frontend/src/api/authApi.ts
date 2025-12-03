import api from './axiosInstance';
import { LoginRequest, LoginResponse, MeResponse } from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  me: () => api.get<MeResponse>('/auth/me'),
};
