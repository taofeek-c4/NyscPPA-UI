import { apiClient } from '@/lib/api';

export interface CreateDailyLogRequest {
  date: string; // DateOnly format: YYYY-MM-DD
  description: string;
  hours: number;
  remarks?: string;
  isDraft?: boolean;
}

export interface UpdateDailyLogRequest {
  description: string;
  hours: number;
  remarks?: string;
  isDraft?: boolean;
}

export interface DailyLogDto {
  id: string;
  date: string;
  description: string;
  hours: number;
  remarks?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  approvalRecord?: ApprovalRecordDto;
}

export interface ApprovalRecordDto {
  id: string;
  decision: string;
  comment: string;
  approvedAt: string;
  supervisorName: string;
}

export const dailyLogService = {
  async createLog(request: CreateDailyLogRequest): Promise<DailyLogDto> {
    return apiClient.post<DailyLogDto>('/dailylogs', request);
  },

  async getLogs(year?: number, month?: number): Promise<DailyLogDto[]> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());

    const queryString = params.toString();
    return apiClient.get<DailyLogDto[]>(`/dailylogs${queryString ? `?${queryString}` : ''}`);
  },

  async getLog(id: string): Promise<DailyLogDto> {
    return apiClient.get<DailyLogDto>(`/dailylogs/${id}`);
  },

  async updateLog(id: string, request: UpdateDailyLogRequest): Promise<DailyLogDto> {
    return apiClient.put<DailyLogDto>(`/dailylogs/${id}`, request);
  },

  async deleteLog(id: string): Promise<void> {
    return apiClient.delete<void>(`/dailylogs/${id}`);
  },
};

