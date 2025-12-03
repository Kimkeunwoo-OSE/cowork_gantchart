export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}
