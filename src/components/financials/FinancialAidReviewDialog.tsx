import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FinancialAidApplication } from '@/types/financialAid';
import { financialAidService } from '@/services/financialAidService';
import { formatDate } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface FinancialAidReviewDialogProps {
  application: FinancialAidApplication | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

export function FinancialAidReviewDialog({ application, open, onClose, onStatusUpdate }: FinancialAidReviewDialogProps) {
  const [approvedAmount, setApprovedAmount] = useState('');
  const [aidType, setAidType] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    if (!application || !approvedAmount || !aidType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      await financialAidService.approveApplication(
        application.id,
        Number(approvedAmount),
        aidType,
        reviewNotes
      );
      toast.success('Application approved successfully');
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!application) return;

    try {
      setProcessing(true);
      await financialAidService.rejectApplication(application.id, reviewNotes || 'Application rejected');
      toast.success('Application rejected');
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!application || !reviewNotes) {
      toast.error('Please provide a message');
      return;
    }

    try {
      setProcessing(true);
      await financialAidService.requestMoreInfo(application.id, reviewNotes);
      toast.success('Information request sent');
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to request information');
    } finally {
      setProcessing(false);
    }
  };

  if (!application) return null;

  const isPendingReview = application.status === 'Pending' || application.status === 'Under Review';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Financial Aid Application Review</DialogTitle>
          <DialogDescription>Application from {application.applicantName}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Application Details</TabsTrigger>
              <TabsTrigger value="documents">Supporting Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Applicant Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <div className="font-medium">{application.applicantName}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <div className="font-medium">{application.applicantEmail}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Application Date</Label>
                    <div className="font-medium">{formatDate(application.applicationDate)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Current Status</Label>
                    <Badge>{application.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Requested Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Requested Assessments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {application.requestedAssessments.map(assessment => (
                    <div key={assessment.assessmentId} className="p-3 border rounded-lg">
                      <div className="font-medium">{assessment.assessmentName}</div>
                      <div className="text-sm text-muted-foreground">
                        Type: {assessment.assessmentType}
                        {assessment.stage && ` | Stage: ${assessment.stage}`}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Justification Sections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Financial Situation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{application.financialSituation}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reason for Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{application.reasonForRequest}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How Aid Will Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{application.howItHelps}</p>
                </CardContent>
              </Card>

              {/* Admin Review Section */}
              {isPendingReview && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Admin Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Approved Amount</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount..."
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Aid Type</Label>
                      <Select value={aidType} onValueChange={setAidType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select aid type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full Waiver">Full Waiver</SelectItem>
                          <SelectItem value="Partial Discount">Partial Discount</SelectItem>
                          <SelectItem value="Deferred Payment">Deferred Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Review Notes</Label>
                      <Textarea
                        placeholder="Add notes about your decision..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents">
              {application.supportingDocuments && application.supportingDocuments.length > 0 ? (
                <div className="space-y-2">
                  {application.supportingDocuments.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{doc.fileName}</div>
                            <div className="text-sm text-muted-foreground">
                              Uploaded: {formatDate(doc.uploadedAt)}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No supporting documents provided
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Close
          </Button>

          {isPendingReview && (
            <>
              <Button variant="outline" onClick={handleRequestMoreInfo} disabled={processing}>
                Request More Info
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={processing}>
                Reject
              </Button>
              <Button 
                onClick={handleApprove} 
                disabled={!approvedAmount || !aidType || processing}
              >
                Approve Application
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
