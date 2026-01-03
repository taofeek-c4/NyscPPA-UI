export type UserRole = 'corps_member' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ppaId?: string;
  ppaName?: string;
  supervisorId?: string;
  supervisorName?: string;
}

export interface Log {
  id: string;
  date: string;
  description: string;
  hours: number;
  status: 'approved' | 'rejected' | 'pending';
  remarks?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  ppaName?: string;
  createdAt: string;
}

export interface PPA {
  id: string;
  name: string;
  address: string;
  description?: string;
  joinCode: string;
  supervisorId: string;
}

export interface CorpsMemberStats {
  totalLogsThisMonth: number;
  approvedLogs: number;
  rejectedLogs: number;
  pendingLogs: number;
}

export interface SupervisorStats {
  assignedCorpsMembers: number;
  pendingLogs: number;
}
