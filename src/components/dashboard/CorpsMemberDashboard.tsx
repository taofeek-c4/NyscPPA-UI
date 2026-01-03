import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { CorpsMemberDashboardDto } from '@/services/dashboardService';
import { Button } from '@/components/ui/button';
import { RealTimeDate } from './RealTimeDate';

export function CorpsMemberDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CorpsMemberDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getCorpsMemberDashboard();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'corps_member') {
      loadDashboard();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2" />
          <div className="h-4 bg-muted rounded w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's a summary of your service logs this month.
          </p>
        </div>
        <RealTimeDate />
      </div>

      {!user?.ppaId && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Join a PPA</h3>
              <p className="text-muted-foreground">
                You haven't joined a Place of Primary Assignment yet. Please join one to start logging your daily activities.
              </p>
            </div>
          </div>
          <Button onClick={() => window.location.href = '/join-ppa'} className="shrink-0">
            Join Now
          </Button>
        </div>
      )}

      {/* PPA & Supervisor Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {user?.ppaName && (
          <div className="bg-accent/50 rounded-xl p-5 border border-accent flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Place of Primary Assignment</p>
              <p className="text-lg font-semibold text-foreground">{user.ppaName}</p>
            </div>
          </div>
        )}

        {user?.supervisorName && (
          <div className="bg-accent/50 rounded-xl p-5 border border-accent flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned Supervisor</p>
              <p className="text-lg font-semibold text-foreground">{user.supervisorName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          label="Total Logs"
          value={stats.totalLogsThisMonth}
          icon={<FileText className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          label="Approved"
          value={stats.approvedLogs}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          label="Rejected"
          value={stats.rejectedLogs}
          icon={<XCircle className="w-6 h-6" />}
          variant="destructive"
        />
        <StatCard
          label="Submitted"
          value={stats.pendingLogs}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          label="Drafts"
          value={stats.draftLogs}
          icon={<FileText className="w-6 h-6" />}
          variant="default"
        />
      </div>
    </div>
  );
}
