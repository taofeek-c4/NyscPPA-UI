import { apiClient } from '@/lib/api';

export interface DailyLogSummaryDto {
  date: string;
  description: string;
  hours: number;
  remarks?: string;
}

export interface MonthlyReportDto {
  corpsMemberId: string;
  corpsMemberName: string;
  corpsMemberEmail: string;
  ppa: string;
  supervisorName: string;
  year: number;
  month: number;
  totalDaysWorked: number;
  totalHoursWorked: number;
  dailyLogs: DailyLogSummaryDto[];
}

export const reportService = {
  async getMonthlyReport(
    userId: string,
    year: number,
    month: number
  ): Promise<MonthlyReportDto> {
    const params = new URLSearchParams({
      userId,
      year: year.toString(),
      month: month.toString(),
    });
    
    return apiClient.get<MonthlyReportDto>(`/reports/monthly?${params.toString()}`);
  },

  async getMonthlyReportPdf(
    userId: string,
    year: number,
    month: number
  ): Promise<Blob> {
    const params = new URLSearchParams({
      userId,
      year: year.toString(),
      month: month.toString(),
    });
    
    return apiClient.getBlob(`/reports/monthly/pdf?${params.toString()}`);
  },
};

