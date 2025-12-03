import api from './axiosInstance';
import { LoginRequest, LoginResponse, MeResponse, SignupRequest } from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  signup: (data: SignupRequest) => api.post('/auth/signup', data),
  me: () => api.get<MeResponse>('/auth/me'),
};
