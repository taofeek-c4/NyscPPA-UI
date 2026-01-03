import { useAuth } from '@/contexts/AuthContext';
import { CorpsMemberDashboard } from '@/components/dashboard/CorpsMemberDashboard';
import { SupervisorDashboard } from '@/components/dashboard/SupervisorDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'supervisor') {
    return <SupervisorDashboard />;
  }

  return <CorpsMemberDashboard />;
}
