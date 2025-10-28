import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PartnerTypeBadge } from '@/components/partners/PartnerTypeBadge';
import { functionalPartnerService } from '@/services/functionalPartnerService';
import { PartnerEditRequest } from '@/types/functionalPartner';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function PartnerEditRequests() {
  const [requests, setRequests] = useState<PartnerEditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PartnerEditRequest | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await functionalPartnerService.getPendingEditRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load edit requests:', error);
      toast.error('Failed to load edit requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch = request.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openReviewModal = (request: PartnerEditRequest) => {
    setSelectedRequest(request);
    setReviewNotes('');
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedRequest(null);
    setReviewNotes('');
  };

  const handleReview = async (decision: 'Approved' | 'Rejected') => {
    if (!selectedRequest) return;
    
    try {
      await functionalPartnerService.reviewEditRequest(selectedRequest.id, decision, reviewNotes);
      toast.success(`Edit request ${decision.toLowerCase()} successfully`);
      closeReviewModal();
      loadRequests();
    } catch (error) {
      toast.error(`Failed to ${decision.toLowerCase()} edit request`);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b px-6 bg-background">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-lg font-semibold">Partner Edit Requests</h1>
        </header>

        <main className="flex-1 p-8 bg-muted/30 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Partner Edit Requests</h2>
              <p className="text-muted-foreground">Review and approve partner-submitted profile changes</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by partner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs bg-background"
              />

              {(statusFilter !== 'all' || searchQuery) && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Requests Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Partner Type</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Loading requests...
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No edit requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.partnerName}</TableCell>
                        <TableCell>
                          <PartnerTypeBadge type={request.partnerType} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(request.requestedAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.changes.length} field(s)</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Rejected' ? 'destructive' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'Pending' && (
                            <Button size="sm" onClick={() => openReviewModal(request)}>
                              Review
                            </Button>
                          )}
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

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Edit Request</DialogTitle>
            <DialogDescription>
              Review changes requested by {selectedRequest?.partnerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRequest?.changes.map((change, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{change.field}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Current Value</Label>
                      <div className="p-3 bg-muted rounded-md mt-1">
                        {String(change.oldValue)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Requested Value</Label>
                      <div className="p-3 bg-primary/10 rounded-md mt-1">
                        {String(change.newValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {selectedRequest?.justification && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Justification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedRequest.justification}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label>Review Notes</Label>
              <Textarea
                placeholder="Add notes about your decision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeReviewModal}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleReview('Rejected')}
            >
              Reject
            </Button>
            <Button onClick={() => handleReview('Approved')}>
              Approve Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
