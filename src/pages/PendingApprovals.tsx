import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { CheckCircle, XCircle, Clock, Building2, Mail, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { approvalService, PendingLogDto, ApproveLogRequest, RejectLogRequest } from '@/services/approvalService';
import { useToast } from '@/hooks/use-toast';

type ActionType = 'approve' | 'reject' | null;

export default function PendingApprovals() {
  const { toast } = useToast();
  const [pendingLogs, setPendingLogs] = useState<PendingLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<PendingLogDto | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPendingLogs();
  }, []);

  const loadPendingLogs = async () => {
    setIsLoading(true);
    try {
      const data = await approvalService.getPendingLogs();
      setPendingLogs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load pending logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (log: PendingLogDto, action: ActionType) => {
    setSelectedLog(log);
    setActionType(action);
    setComment('');
  };

  const handleConfirm = async () => {
    if (!selectedLog || !actionType) return;

    if (actionType === 'reject' && !comment.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (actionType === 'approve') {
        const request: ApproveLogRequest = {
          comment: comment.trim() || undefined,
        };
        await approvalService.approveLog(selectedLog.id, request);
        toast({
          title: 'Success',
          description: 'Log approved successfully.',
        });
      } else {
        const request: RejectLogRequest = {
          comment: comment.trim(),
        };
        await approvalService.rejectLog(selectedLog.id, request);
        toast({
          title: 'Success',
          description: 'Log rejected successfully.',
        });
      }

      setSelectedLog(null);
      setActionType(null);
      setComment('');
      loadPendingLogs();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCreatedAt = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pending Approvals</h2>
        <p className="text-muted-foreground mt-1">
          Review and approve service logs from your assigned corps members
        </p>
      </div>

      {/* Pending count badge */}
      {!isLoading && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning font-medium">
            <Clock className="w-4 h-4" />
            {pendingLogs.length} logs pending review
          </span>
        </div>
      )}

      {/* Log Cards */}
      {isLoading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-48 mb-4" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : pendingLogs.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No pending logs to approve.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {pendingLogs.map((log) => (
            <div
              key={log.id}
              className="bg-card rounded-xl border border-border p-6 shadow-card transition-all hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {log.corpsMemberName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{log.corpsMemberName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                        <Building2 className="w-3 h-3" />
                        {log.ppa}
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status="pending" />
              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(log.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{log.corpsMemberEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{log.hours} hours</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-accent/50 rounded-lg p-4 border-l-4 border-primary mb-5">
                <p className="text-foreground">{log.description}</p>
                {log.remarks && (
                  <p className="text-sm text-muted-foreground mt-2">Remarks: {log.remarks}</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Submitted {formatCreatedAt(log.createdAt)}
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="success"
                    onClick={() => handleAction(log, 'approve')}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAction(log, 'reject')}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval/Rejection Modal */}
      <Dialog open={!!selectedLog && !!actionType} onOpenChange={() => {
        if (!isSubmitting) {
          setSelectedLog(null);
          setActionType(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Log' : 'Reject Log'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `You are about to approve the log submitted by ${selectedLog?.corpsMemberName}.`
                : `You are about to reject the log submitted by ${selectedLog?.corpsMemberName}. Please provide a reason.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="comment">
              {actionType === 'approve' ? 'Comment (optional)' : 'Reason for rejection (required)'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                actionType === 'approve'
                  ? 'Add any comments...'
                  : 'Please explain why this log is being rejected...'
              }
              className="mt-2 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLog(null);
                setActionType(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'success' : 'destructive'}
              onClick={handleConfirm}
              disabled={isSubmitting || (actionType === 'reject' && !comment.trim())}
            >
              {isSubmitting
                ? 'Processing...'
                : actionType === 'approve'
                  ? 'Confirm Approval'
                  : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
