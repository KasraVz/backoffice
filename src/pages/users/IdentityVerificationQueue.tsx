import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

const mockVerificationQueue = [
  {
    id: "1",
    userId: "USR-001",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    submittedDate: "2024-03-10",
    documentType: "Driver's License",
    status: "Pending Review",
    documents: ["id_front.jpg", "id_back.jpg"],
  },
  {
    id: "2",
    userId: "USR-002",
    name: "Michael Chen",
    email: "m.chen@example.com",
    submittedDate: "2024-03-09",
    documentType: "Passport",
    status: "Pending Review",
    documents: ["passport.jpg"],
  },
  {
    id: "3",
    userId: "USR-003",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    submittedDate: "2024-03-08",
    documentType: "National ID",
    status: "Under Review",
    documents: ["national_id.jpg"],
  },
];

const IdentityVerificationQueue = () => {
  const [verificationQueue, setVerificationQueue] = useState(mockVerificationQueue);
  const [selectedUser, setSelectedUser] = useState<typeof mockVerificationQueue[0] | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleApprove = (userId: string) => {
    setVerificationQueue(queue => 
      queue.map(user => 
        user.id === userId 
          ? { ...user, status: "Approved" }
          : user
      )
    );
    toast.success("Identity verification approved");
    setIsReviewModalOpen(false);
    setSelectedUser(null);
    setReviewNotes("");
  };

  const handleReject = (userId: string) => {
    setVerificationQueue(queue => 
      queue.map(user => 
        user.id === userId 
          ? { ...user, status: "Rejected" }
          : user
      )
    );
    toast.error("Identity verification rejected");
    setIsReviewModalOpen(false);
    setSelectedUser(null);
    setReviewNotes("");
  };

  const openReviewModal = (user: typeof mockVerificationQueue[0]) => {
    setSelectedUser(user);
    setIsReviewModalOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending Review": return "outline";
      case "Under Review": return "secondary";
      case "Approved": return "default";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  const pendingCount = verificationQueue.filter(user => 
    user.status === "Pending Review" || user.status === "Under Review"
  ).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Identity Verification Queue</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* Queue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submitted</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{verificationQueue.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                </CardContent>
              </Card>
            </div>

            {/* Verification Queue Table */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Queue</CardTitle>
                <p className="text-muted-foreground">
                  Review and process identity verification submissions
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verificationQueue.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.submittedDate}</TableCell>
                        <TableCell>{user.documentType}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {(user.status === "Pending Review" || user.status === "Under Review") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openReviewModal(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Review Modal */}
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Identity Verification Review</DialogTitle>
                  <DialogDescription>
                    Review the submitted documents and profile information
                  </DialogDescription>
                </DialogHeader>
                {selectedUser && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">User</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">User ID</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.userId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Document Type</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.documentType}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Submitted Documents</Label>
                      <div className="mt-2 space-y-2">
                        {selectedUser.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">{doc}</span>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="review-notes">Review Notes (Optional)</Label>
                      <Textarea
                        id="review-notes"
                        placeholder="Add any notes about this verification review..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => selectedUser && handleReject(selectedUser.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => selectedUser && handleApprove(selectedUser.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default IdentityVerificationQueue;