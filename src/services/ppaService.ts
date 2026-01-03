import { apiClient } from '@/lib/api';

export interface CreatePPARequest {
  name: string;
  address: string;
  description?: string;
}

export interface PPADto {
  id: string;
  name: string;
  address: string;
  description?: string;
  joinCode: string;
  supervisorId: string;
  supervisorName: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  corpsMembersCount: number;
}

export const ppaService = {
  async createPPA(request: CreatePPARequest): Promise<PPADto> {
    return apiClient.post<PPADto>('/ppa', request);
  },

  async getMyPPA(): Promise<PPADto> {
    return apiClient.get<PPADto>('/ppa/me');
  },

  async getMyPPAs(): Promise<PPADto[]> {
    return apiClient.get<PPADto[]>('/ppa/mine/all');
  },

  async validateJoinCode(joinCode: string): Promise<{ isValid: boolean }> {
    return apiClient.get<{ isValid: boolean }>(`/ppa/validate/${joinCode}`);
  },
};

