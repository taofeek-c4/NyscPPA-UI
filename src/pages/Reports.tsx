import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, User, Building2, Calendar, Clock } from 'lucide-react';
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
import { reportService, MonthlyReportDto } from '@/services/reportService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());

const monthToNumber: Record<string, number> = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
  'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
};

const months = Object.keys(monthToNumber);

const getCurrentMonthName = () => {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
};

export default function Reports() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName());
  const [report, setReport] = useState<MonthlyReportDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerateReport = async () => {
    const targetUserId = user?.id;
    if (!targetUserId) {
      toast({
        title: 'Error',
        description: 'Please ensure you are logged in.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const year = parseInt(selectedYear);
      const month = monthToNumber[selectedMonth];
      const data = await reportService.getMonthlyReport(targetUserId, year, month);
      setReport(data);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const targetUserId = user?.id;
    if (!targetUserId) {
      toast({
        title: 'Error',
        description: 'Please ensure you are logged in.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);
    try {
      const year = parseInt(selectedYear);
      const month = monthToNumber[selectedMonth];
      const blob = await reportService.getMonthlyReportPdf(targetUserId, year, month);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const monthName = selectedMonth;
      link.download = `MonthlyReport_${monthName}_${year}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'PDF downloaded successfully.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to download PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reports</h2>
        <p className="text-muted-foreground mt-1">
          Generate and download service log reports
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Generate Report</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleGenerateReport} className="w-full" disabled={isLoading}>
              <FileText className="w-4 h-4" />
              {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Display */}
      {report && (
        <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
          {/* Report Header */}
          <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Service Log Report - {selectedMonth} {selectedYear}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Generated on {new Date().toLocaleDateString('en-NG')}
              </p>
            </div>
            <Button variant="secondary" onClick={handleDownloadPdf} disabled={isDownloading}>
              <Download className="w-4 h-4" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="p-6 grid md:grid-cols-2 gap-5 border-b border-border">
            {/* Corps Member Info */}
            <div className="bg-muted/50 rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Corps Member Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{report.corpsMemberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{report.corpsMemberEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PPA</span>
                  <span className="font-medium text-foreground">{report.ppa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supervisor</span>
                  <span className="font-medium text-foreground">{report.supervisorName}</span>
                </div>
              </div>
            </div>

            {/* Period Summary */}
            <div className="bg-muted/50 rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Period Summary
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Month/Year</span>
                  <span className="font-medium text-foreground">{selectedMonth} {selectedYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days Logged</span>
                  <span className="font-medium text-foreground">{report.totalDaysWorked} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span className="font-medium text-foreground">{report.totalHoursWorked} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Hours/Day</span>
                  <span className="font-medium text-foreground">
                    {report.totalDaysWorked > 0
                      ? (report.totalHoursWorked / report.totalDaysWorked).toFixed(1)
                      : '0'} hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="p-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Detailed Log Entries
            </h4>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead className="min-w-[300px]">Description</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.dailyLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No logs found for this period
                      </TableCell>
                    </TableRow>
                  ) : (
                    report.dailyLogs.map((log, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{formatDate(log.date)}</TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>{log.hours}h</TableCell>
                        <TableCell className="text-muted-foreground">{log.remarks || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
