import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Plus, Pencil, Trash2, FileText, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dailyLogService, DailyLogDto, CreateDailyLogRequest } from '@/services/dailyLogService';
import { useToast } from '@/hooks/use-toast';

const currentYear = new Date().getFullYear();
const years = ['all', ...Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())];

const monthToNumber: Record<string, number> = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
  'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
};

export default function MyLogs() {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<DailyLogDto | null>(null);
  const [logs, setLogs] = useState<DailyLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    hours: '',
    remarks: '',
  });

  const [editFormData, setEditFormData] = useState({
    description: '',
    hours: '',
    remarks: '',
  });

  useEffect(() => {
    loadLogs();
  }, [selectedYear, selectedMonth]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const year = selectedYear === 'all' ? undefined : parseInt(selectedYear);
      const month = selectedMonth === 'all' ? undefined : monthToNumber[selectedMonth];
      const data = await dailyLogService.getLogs(year, month);
      setLogs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load logs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLog = async (isDraft: boolean = false) => {
    if (!formData.description || !formData.hours) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.description.length < 10) {
      toast({
        title: 'Validation Error',
        description: 'Description must be at least 10 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const request: CreateDailyLogRequest = {
        date: formData.date,
        description: formData.description,
        hours: parseFloat(formData.hours),
        remarks: formData.remarks || undefined,
        isDraft,
      };

      await dailyLogService.createLog(request);
      toast({
        title: 'Success',
        description: isDraft ? 'Log saved as draft.' : 'Log submitted successfully.',
      });
      setIsCreateOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        hours: '',
        remarks: '',
      });
      loadLogs();
    } catch (error: unknown) {
      let errorMessage = 'Failed to create log. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const responseData = (error as any).response?.data;
        if (responseData?.errors?.Description) {
          errorMessage = `Description: ${responseData.errors.Description.join(', ')}`;
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
      setIsSubmitting(false);
    }
  };

  const handleEditLog = (log: DailyLogDto) => {
    setEditingLog(log);
    setEditFormData({
      description: log.description,
      hours: log.hours.toString(),
      remarks: log.remarks || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdateLog = async (isDraft: boolean = false) => {
    if (!editingLog) return;

    if (!editFormData.description || !editFormData.hours) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (editFormData.description.length < 10) {
      toast({
        title: 'Validation Error',
        description: 'Description must be at least 10 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dailyLogService.updateLog(editingLog.id, {
        description: editFormData.description,
        hours: parseFloat(editFormData.hours),
        remarks: editFormData.remarks || undefined,
        isDraft,
      });
      toast({
        title: 'Success',
        description: isDraft ? 'Draft updated.' : 'Log submitted successfully.',
      });
      setIsEditOpen(false);
      setEditingLog(null);
      loadLogs();
    } catch (error: unknown) {
      let errorMessage = 'Failed to update log. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const responseData = (error as any).response?.data;
        if (responseData?.errors?.Description) {
          errorMessage = `Description: ${responseData.errors.Description.join(', ')}`;
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
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) {
      return;
    }

    try {
      await dailyLogService.deleteLog(id);
      toast({
        title: 'Success',
        description: 'Log deleted successfully.',
      });
      loadLogs();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete log. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusFromBackend = (status: string): 'approved' | 'rejected' | 'submitted' | 'draft' | 'pending' => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'approved') return 'approved';
    if (lowerStatus === 'rejected') return 'rejected';
    if (lowerStatus === 'submitted') return 'submitted';
    if (lowerStatus === 'draft') return 'draft';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Daily Logs</h2>
          <p className="text-muted-foreground mt-1">Track and manage your service activities</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Create New Log
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Log</DialogTitle>
              <DialogDescription>
                Record your daily service activities. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hours">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0.1"
                  max="24"
                  step="0.1"
                  placeholder="Enter hours"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Description</Label>
                  <span className={`text-xs ${formData.description.length < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formData.description.length}/10 min characters
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe your activities for this day... (Min 10 characters)"
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  placeholder="Any additional remarks..."
                  className="min-h-[60px]"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="sm:mr-auto">
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCreateLog(true)}
                disabled={isSubmitting || formData.description.length < 10}
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => handleCreateLog(false)}
                disabled={isSubmitting || formData.description.length < 10}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Log'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {Object.keys(monthToNumber).map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead className="min-w-[300px]">Description</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="w-8 h-8 animate-pulse" />
                    <p>Loading logs...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="w-8 h-8" />
                    <p>No logs found for the selected period</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="group">
                  <TableCell className="font-medium">{formatDate(log.date)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-foreground">{log.description}</p>
                      {log.remarks && (
                        <p className="text-sm text-muted-foreground mt-1">Remarks: {log.remarks}</p>
                      )}
                      {log.status === 'Rejected' && log.approvalRecord?.comment && (
                        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                          <p className="font-semibold flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" />
                            Rejection Reason:
                          </p>
                          <p className="mt-0.5">{log.approvalRecord.comment}</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{log.hours}h</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusFromBackend(log.status)} />
                  </TableCell>
                  <TableCell className="text-right">
                    {(getStatusFromBackend(log.status) === 'submitted' || getStatusFromBackend(log.status) === 'pending' || getStatusFromBackend(log.status) === 'rejected' || getStatusFromBackend(log.status) === 'draft') && (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" onClick={() => handleEditLog(log)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLog(log.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Log</DialogTitle>
            <DialogDescription>
              Update your daily log entry. Date cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editingLog?.date || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-hours">Hours Worked</Label>
              <Input
                id="edit-hours"
                type="number"
                min="0.1"
                max="24"
                step="0.1"
                placeholder="Enter hours"
                value={editFormData.hours}
                onChange={(e) => setEditFormData({ ...editFormData, hours: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="edit-description">Description</Label>
                <span className={`text-xs ${editFormData.description.length < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {editFormData.description.length}/10 min characters
                </span>
              </div>
              <Textarea
                id="edit-description"
                placeholder="Describe your activities for this day... (Min 10 characters)"
                className="min-h-[100px]"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-remarks">Remarks (Optional)</Label>
              <Textarea
                id="edit-remarks"
                placeholder="Any additional remarks..."
                className="min-h-[60px]"
                value={editFormData.remarks}
                onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="sm:mr-auto">
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleUpdateLog(true)}
              disabled={isSubmitting || editFormData.description.length < 10}
            >
              Update Draft
            </Button>
            <Button
              onClick={() => handleUpdateLog(false)}
              disabled={isSubmitting || editFormData.description.length < 10}
            >
              {isSubmitting ? 'Submit Log' : 'Submit Log'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
