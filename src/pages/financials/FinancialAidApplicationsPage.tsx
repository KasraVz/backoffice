import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinancialAidReviewDialog } from '@/components/financials/FinancialAidReviewDialog';
import { financialAidService } from '@/services/financialAidService';
import { FinancialAidApplication } from '@/types/financialAid';
import { getFinancialAidStatusVariant } from '@/lib/partnerStatusUtils';
import { formatDate, formatCurrency } from '@/lib/utils';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function FinancialAidApplicationsPage() {
  const [applications, setApplications] = useState<FinancialAidApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<FinancialAidApplication | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await financialAidService.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openReviewDialog = (application: FinancialAidApplication) => {
    setSelectedApplication(application);
    setReviewDialogOpen(true);
  };

  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleStatusUpdate = () => {
    loadApplications();
    closeReviewDialog();
  };

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedThisMonth = applications.filter(a => 
    a.status === 'Approved' && 
    new Date(a.reviewedAt || '').getMonth() === new Date().getMonth()
  ).length;
  const totalAidGranted = applications
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + (a.approvedAmount || 0), 0);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Financial Aid Applications</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Financial Aid Applications</h2>
              <p className="text-muted-foreground">Review and manage financial aid requests from founders</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approved This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{approvedThisMonth}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Aid Granted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalAidGranted)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="More Info Needed">More Info Needed</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by applicant name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm bg-background"
              />

              {(statusFilter !== 'all' || searchQuery) && (
                <Button variant="ghost" onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Applications Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Requested Assessments</TableHead>
                    <TableHead>Requested Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Loading applications...
                      </TableCell>
                    </TableRow>
                  ) : filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.applicantName}</div>
                            <div className="text-sm text-muted-foreground">{application.applicantEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(application.applicationDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {application.requestedAssessments.map(assessment => (
                              <Badge key={assessment.assessmentId} variant="outline">
                                {assessment.assessmentType}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {application.requestedAmount ? formatCurrency(application.requestedAmount) : 'Not specified'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getFinancialAidStatusVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => openReviewDialog(application)}>
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>

      <FinancialAidReviewDialog
        application={selectedApplication}
        open={reviewDialogOpen}
        onClose={closeReviewDialog}
        onStatusUpdate={handleStatusUpdate}
      />
    </SidebarProvider>
  );
}
