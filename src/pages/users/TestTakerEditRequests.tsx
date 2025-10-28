import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { testTakerService } from "@/services/testTakerService";
import { TestTakerEditRequest } from "@/types/testTaker";
import { getEditRequestStatusVariant, formatValue, getUniqueCategories } from "@/lib/testTakerUtils";
import { formatDate } from "@/lib/utils";

const TestTakerEditRequests = () => {
  const [requests, setRequests] = useState<TestTakerEditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<TestTakerEditRequest | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await testTakerService.getAllEditRequests();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load edit requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesSearch = request.testTakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.testTakerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedThisMonth = requests.filter(r => r.status === 'Approved').length;
  const rejectedThisMonth = requests.filter(r => r.status === 'Rejected').length;

  const openReviewModal = (request: TestTakerEditRequest) => {
    setSelectedRequest(request);
    setReviewNotes("");
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedRequest(null);
    setReviewNotes("");
    setReviewModalOpen(false);
  };

  const handleReview = async (decision: 'Approved' | 'Rejected') => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);
      await testTakerService.reviewEditRequest(selectedRequest.id, decision, reviewNotes);
      toast.success(`Request ${decision.toLowerCase()} successfully`);
      closeReviewModal();
      loadRequests();
    } catch (error) {
      toast.error(`Failed to ${decision.toLowerCase()} request`);
    } finally {
      setProcessing(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = statusFilter !== "all" || searchQuery !== "";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Test Taker Edit Requests</h1>
          </header>
          
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="max-w-7xl space-y-6">
              {/* Page Header */}
              <div>
                <h2 className="text-2xl font-bold">Profile Change Requests</h2>
                <p className="text-muted-foreground">
                  Review and approve profile changes submitted by test takers
                </p>
              </div>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Total Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalRequests}</div>
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
                    <div className="text-2xl font-bold text-orange-600">
                      {pendingCount}
                    </div>
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
                    <div className="text-2xl font-bold text-green-600">
                      {approvedThisMonth}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {rejectedThisMonth}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Filters */}
              <div className="flex gap-4 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px]"
                />
                
                {hasActiveFilters && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Requests Table */}
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Taker</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No edit requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map(request => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.testTakerName}</div>
                              <div className="text-sm text-muted-foreground">
                                {request.testTakerEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(request.requestedAt)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {request.changes.length} field(s)
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {getUniqueCategories(request.changes).map(category => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getEditRequestStatusVariant(request.status)}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReviewModal(request)}
                            >
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
        
        {/* Review Modal */}
        <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Review Profile Change Request</DialogTitle>
              <DialogDescription>
                Request from {selectedRequest?.testTakerName}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Group changes by category */}
                {['Identity', 'Business', 'Team'].map(category => {
                  const categoryChanges = selectedRequest?.changes.filter(
                    c => c.category === category
                  );
                  
                  if (!categoryChanges || categoryChanges.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3">{category} Changes</h3>
                      <div className="space-y-3">
                        {categoryChanges.map((change, idx) => (
                          <Card key={idx}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">{change.fieldLabel}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm text-muted-foreground">Current Value</Label>
                                  <div className="p-3 bg-muted rounded-md mt-1">
                                    {formatValue(change.oldValue)}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm text-muted-foreground">Requested Value</Label>
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-1">
                                    {formatValue(change.newValue)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Justification */}
                {selectedRequest?.justification && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Justification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedRequest.justification}
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Admin Review Notes */}
                {selectedRequest?.status === 'Pending' && (
                  <div>
                    <Label htmlFor="reviewNotes">Admin Review Notes</Label>
                    <Textarea
                      id="reviewNotes"
                      placeholder="Add notes about your decision (optional)..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                )}
                
                {/* Previous Review Info */}
                {selectedRequest?.status !== 'Pending' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Review Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Reviewed By:</span> {selectedRequest?.reviewedBy}
                      </div>
                      <div>
                        <span className="font-medium">Reviewed At:</span> {selectedRequest?.reviewedAt ? formatDate(selectedRequest.reviewedAt) : 'N/A'}
                      </div>
                      {selectedRequest?.reviewNotes && (
                        <div>
                          <span className="font-medium">Notes:</span>
                          <p className="mt-1 text-muted-foreground">{selectedRequest.reviewNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={closeReviewModal}>
                Close
              </Button>
              {selectedRequest?.status === 'Pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleReview('Rejected')}
                    disabled={processing}
                  >
                    Reject Changes
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleReview('Approved')}
                    disabled={processing}
                  >
                    Approve Changes
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default TestTakerEditRequests;
