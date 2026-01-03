import { apiClient } from '@/lib/api';

export interface PendingLogDto {
  id: string;
  date: string;
  description: string;
  hours: number;
  remarks?: string;
  createdAt: string;
  corpsMemberName: string;
  corpsMemberEmail: string;
  ppa: string;
}

export interface ApproveLogRequest {
  comment?: string;
}

export interface RejectLogRequest {
  comment: string;
}

export const approvalService = {
  async getPendingLogs(): Promise<PendingLogDto[]> {
    return apiClient.get<PendingLogDto[]>('/approvals/pending');
  },

  async approveLog(logId: string, request: ApproveLogRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/approvals/${logId}/approve`, request);
  },

  async rejectLog(logId: string, request: RejectLogRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/approvals/${logId}/reject`, request);
  },
};

