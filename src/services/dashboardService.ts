import { apiClient } from '@/lib/api';

export interface CorpsMemberDashboardDto {
  totalLogsThisMonth: number;
  approvedLogs: number;
  rejectedLogs: number;
  pendingLogs: number;
  draftLogs: number;
}

export interface SupervisorDashboardDto {
  assignedCorpsMembers: number;
  pendingLogsCount: number;
  students: AssignedStudentDto[];
}

export interface AssignedStudentDto {
  id: string;
  name: string;
  email: string;
  stateCode: string;
  ppa: string;
}

export const dashboardService = {
  async getCorpsMemberDashboard(): Promise<CorpsMemberDashboardDto> {
    return apiClient.get<CorpsMemberDashboardDto>('/dashboard/corps');
  },

  async getSupervisorDashboard(): Promise<SupervisorDashboardDto> {
    return apiClient.get<SupervisorDashboardDto>('/dashboard/supervisor');
  },
};

