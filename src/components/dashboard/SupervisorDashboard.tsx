import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { dashboardService, SupervisorDashboardDto } from '@/services/dashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { ppaService, PPADto } from '@/services/ppaService';
import { approvalService, PendingLogDto } from '@/services/approvalService';
import { Button } from '@/components/ui/button';
import { Check, X, MessageSquare, Users, Clock, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RealTimeDate } from './RealTimeDate';

export function SupervisorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SupervisorDashboardDto | null>(null);
  const [ppas, setPpas] = useState<PPADto[]>([]);
  const [pendingLogs, setPendingLogs] = useState<PendingLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [rejectLogId, setRejectLogId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const { toast } = useToast();

  const loadDashboard = async () => {
    try {
      const [statsData, ppasData, pendingData] = await Promise.all([
        dashboardService.getSupervisorDashboard(),
        ppaService.getMyPPAs(),
        approvalService.getPendingLogs()
      ]);
      setStats(statsData);
      setPpas(ppasData);
      setPendingLogs(pendingData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'supervisor') {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const handleApprove = async (logId: string) => {
    setIsProcessing(logId);
    try {
      await approvalService.approveLog(logId, { comment: 'Approved' });
      toast({
        title: 'Success',
        description: 'Log approved successfully.',
      });
      loadDashboard();
    } catch (error: unknown) {
      let errorMessage = 'Failed to approve log.';
      if (error && typeof error === 'object' && 'response' in error) {
        const responseData = (error as any).response?.data;
        if (responseData?.message) {
          errorMessage = responseData.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectLogId || !rejectComment.trim()) return;

    setIsProcessing(rejectLogId);
    try {
      await approvalService.rejectLog(rejectLogId, { comment: rejectComment });
      toast({
        title: 'Success',
        description: 'Log rejected.',
      });
      setRejectLogId(null);
      setRejectComment('');
      loadDashboard();
    } catch (error: unknown) {
      let errorMessage = 'Failed to reject log.';
      if (error && typeof error === 'object' && 'response' in error) {
        const responseData = (error as any).response?.data;
        if (responseData?.errors?.Comment) {
          errorMessage = `Comment: ${responseData.errors.Comment.join(', ')}`;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Supervisor Dashboard</h2>
          <p className="text-muted-foreground">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Supervisor Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your corps members and review their service logs.
          </p>
        </div>
        <RealTimeDate />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard
          label="Assigned Corps Members"
          value={stats.assignedCorpsMembers}
          icon={<Users className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          label="Pending Logs"
          value={stats.pendingLogsCount}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
        />
      </div>

      {/* Assigned Students List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">My Students</h3>
          <p className="text-sm text-muted-foreground">List of corps members currently assigned to you</p>
        </div>
        <div className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-left">
                <th className="px-6 py-4 font-medium text-foreground">Name</th>
                <th className="px-6 py-4 font-medium text-foreground">Email</th>
                <th className="px-6 py-4 font-medium text-foreground">State Code</th>
                <th className="px-6 py-4 font-medium text-foreground">PPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No corps members assigned to you yet.
                  </td>
                </tr>
              ) : (
                stats.students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {student.stateCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{student.ppa}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PPA List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">My PPAs</h3>
          <p className="text-sm text-muted-foreground">List of PPAs you have created</p>
        </div>
        <div className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-left font-medium text-foreground">Name</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Join Code</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Created At</th>
                <th className="px-6 py-4 text-left font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ppas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No PPAs created yet.
                  </td>
                </tr>
              ) : (
                ppas.map((ppa) => (
                  <tr key={ppa.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium text-foreground">{ppa.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {ppa.joinCode}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => {
                            navigator.clipboard.writeText(ppa.joinCode);
                            toast({
                              title: "Copied!",
                              description: "Invite code copied to clipboard.",
                            });
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(ppa.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ppa.isActive
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-destructive/10 text-destructive'
                          }`}
                      >
                        {ppa.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pending Approvals */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pending Log Approvals</h3>
            <p className="text-sm text-muted-foreground">Review and approve daily logs from your corps members</p>
          </div>
          <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-xs font-bold">
            {pendingLogs.length} Pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-left">
                <th className="px-6 py-4 font-medium text-foreground">Corps Member</th>
                <th className="px-6 py-4 font-medium text-foreground">Date</th>
                <th className="px-6 py-4 font-medium text-foreground">Hours</th>
                <th className="px-6 py-4 font-medium text-foreground">Description</th>
                <th className="px-6 py-4 text-right font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No pending logs to approve.
                  </td>
                </tr>
              ) : (
                pendingLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.corpsMemberName}</div>
                      <div className="text-xs text-muted-foreground">{log.corpsMemberEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(log.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{log.hours}h</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-muted-foreground line-clamp-1 max-w-xs" title={log.description}>
                        {log.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                          onClick={() => handleApprove(log.id)}
                          disabled={isProcessing === log.id}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setRejectLogId(log.id)}
                          disabled={isProcessing === log.id}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={!!rejectLogId} onOpenChange={(open) => !open && setRejectLogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Service Log</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="comment">Reason for rejection *</Label>
                <span className={`text-xs ${rejectComment.trim().length < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {rejectComment.trim().length}/5 min characters
                </span>
              </div>
              <Textarea
                id="comment"
                placeholder="Please explain why you are rejecting this log... (Min 5 characters)"
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectLogId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectComment.trim().length < 5 || isProcessing === rejectLogId}
            >
              Reject Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
