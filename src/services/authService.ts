import { apiClient } from '@/lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCorpsMemberRequest {
  name: string;
  email: string;
  password: string;
  stateCode: string;
  callUpNumber: string;
  joinCode: string;
}

export interface JoinPPARequest {
  joinCode: string;
}

export interface LoginResponse {
  token: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: CorpsMemberProfileDto;
}

export interface CorpsMemberProfileDto {
  ppaId: string;
  ppa: string;
  supervisorId: string;
  supervisorName: string;
  stateCode?: string;
  callUpNumber?: string;
}

export interface RegisterSupervisorRequest {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', request);
  },

  async register(request: RegisterCorpsMemberRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/register', request);
  },

  async registerSupervisor(request: RegisterSupervisorRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/register/supervisor', request);
  },

  async joinPPA(request: JoinPPARequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/join-ppa', request);
  },

  async getCurrentUser(): Promise<UserDto> {
    return apiClient.get<UserDto>('/auth/me');
  },
};

