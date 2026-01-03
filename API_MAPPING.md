# API Endpoint Mapping

## Base URL
`http://localhost:5193/api`

## Authentication Endpoints

### POST /api/auth/login
**Payload:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  token: string;
  user: UserDto;
}
```

### POST /api/auth/register
**Payload:**
```typescript
{
  name: string;
  email: string;
  password: string;
  stateCode?: string;
  callUpNumber?: string;
}
```

**Response:**
```typescript
{
  token: string;
  user: UserDto;
}
```

### POST /api/auth/join-ppa
**Payload:**
```typescript
{
  joinCode: string;
}
```

**Response:**
```typescript
{
  message: string;
}
```

### GET /api/auth/me
**Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: string; // "CorpsMember" or "Supervisor"
  profile?: {
    ppaId: string;
    ppa: string;
    supervisorId: string;
    supervisorName: string;
    stateCode?: string;
    callUpNumber?: string;
  };
}
```

## Daily Logs Endpoints

### POST /api/dailylogs
**Payload:**
```typescript
{
  date: string; // YYYY-MM-DD format
  description: string;
  hours: number;
  remarks?: string;
}
```

### GET /api/dailylogs?year=2024&month=12
**Response:**
```typescript
Array<{
  id: string;
  date: string;
  description: string;
  hours: number;
  remarks?: string;
  status: string; // "Approved", "Rejected", "Pending"
  createdAt: string;
  updatedAt: string;
  approvalRecord?: {
    id: string;
    decision: string;
    comment: string;
    approvedAt: string;
    supervisorName: string;
  };
}>
```

### GET /api/dailylogs/{id}
**Response:** DailyLogDto

### PUT /api/dailylogs/{id}
**Payload:**
```typescript
{
  description: string;
  hours: number;
  remarks?: string;
}
```

### DELETE /api/dailylogs/{id}
**Response:** 204 No Content

## Approval Endpoints

### GET /api/approvals/pending
**Response:**
```typescript
Array<{
  id: string;
  date: string;
  description: string;
  hours: number;
  remarks?: string;
  createdAt: string;
  corpsMemberName: string;
  corpsMemberEmail: string;
  ppa: string;
}>
```

### POST /api/approvals/{logId}/approve
**Payload:**
```typescript
{
  comment?: string;
}
```

### POST /api/approvals/{logId}/reject
**Payload:**
```typescript
{
  comment: string; // Required
}
```

## Dashboard Endpoints

### GET /api/dashboard/corps
**Response:**
```typescript
{
  totalLogsThisMonth: number;
  approvedLogs: number;
  rejectedLogs: number;
  pendingLogs: number;
}
```

### GET /api/dashboard/supervisor
**Response:**
```typescript
{
  assignedCorpsMembers: number;
  pendingLogsCount: number;
}
```

## PPA Endpoints

### POST /api/ppa
**Payload:**
```typescript
{
  name: string;
  address: string;
  description?: string;
}
```

**Response:**
```typescript
{
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
```

### GET /api/ppa/me
**Response:** PPADto

### GET /api/ppa/validate/{joinCode}
**Response:**
```typescript
{
  isValid: boolean;
}
```

## Reports Endpoints

### GET /api/reports/monthly?userId={guid}&year={int}&month={int}
**Response:**
```typescript
{
  corpsMemberId: string;
  corpsMemberName: string;
  corpsMemberEmail: string;
  ppa: string;
  supervisorName: string;
  year: number;
  month: number;
  totalDaysWorked: number;
  totalHoursWorked: number;
  dailyLogs: Array<{
    date: string;
    description: string;
    hours: number;
    remarks?: string;
  }>;
}
```

### GET /api/reports/monthly/pdf?userId={guid}&year={int}&month={int}
**Response:** PDF Blob

## Authentication Header
All authenticated endpoints require:
```
Authorization: Bearer {token}
```

