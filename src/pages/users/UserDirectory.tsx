import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Users, UserPlus, TrendingUp, Edit, UserX, CheckCircle, XCircle, Eye, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

const mockUsers = [
  { id: "1", name: "John Smith", email: "john.smith@example.com", status: "Active", dateJoined: "2024-01-15", assessmentsCompleted: 5 },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com", status: "Active", dateJoined: "2024-02-03", assessmentsCompleted: 3 },
  { id: "3", name: "Mike Wilson", email: "m.wilson@example.com", status: "Inactive", dateJoined: "2024-01-28", assessmentsCompleted: 1 },
  { id: "4", name: "Emma Davis", email: "emma.davis@example.com", status: "Pending Verification", dateJoined: "2024-03-10", assessmentsCompleted: 0 },
  { id: "5", name: "David Brown", email: "d.brown@example.com", status: "Active", dateJoined: "2024-02-20", assessmentsCompleted: 8 },
];

const kpiData = [
  { title: "Total Users", value: "1,247", icon: Users },
  { title: "New Users (Last 30 Days)", value: "89", icon: UserPlus },
  { title: "Total Assessments Completed", value: "3,456", icon: TrendingUp },
];

// Mock verification queue data
const mockVerificationQueue = [
  {
    id: "1",
    userId: "USR-001",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    submittedDate: "2024-03-10",
    issue: "New Submission",
    status: "Pending Review",
  },
  {
    id: "2",
    userId: "USR-002",
    name: "Michael Chen",
    email: "m.chen@example.com",
    submittedDate: "2024-03-09",
    issue: "Photo Unclear",
    status: "Pending Review",
  },
  {
    id: "3",
    userId: "USR-003",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    submittedDate: "2024-03-08",
    issue: "Document Expired",
    status: "Under Review",
  },
];

// Mock assessment history for users with standardized names
const mockAssessmentHistory = {
  "1": [
    { id: "A1", name: "FPA-GEN-PRE-1", status: "Completed", score: "85%", date: "2024-03-01" },
    { id: "A2", name: "FPA-ADV-POST-3", status: "Completed", score: "92%", date: "2024-02-15" },
  ],
  "2": [
    { id: "A3", name: "FPA-INT-MID-2", status: "In Progress", score: "N/A", date: "2024-03-05" },
  ],
  // Add more as needed
};

const UserDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [verificationQueue, setVerificationQueue] = useState(mockVerificationQueue);
  const [reviewNotes, setReviewNotes] = useState("");
  
  // Editable form fields for Identity Data
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    countryOfResidence: "",
    idDocumentType: "",
    documentNumber: ""
  });
  const [hasChanges, setHasChanges] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "Pending Verification": return "outline";
      default: return "default";
    }
  };

  const getVerificationStatusVariant = (status: string) => {
    switch (status) {
      case "Pending Review": return "outline";
      case "Under Review": return "secondary";
      case "Approved": return "default";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  const openEditModal = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    // Initialize form with current user data
    const [firstName, lastName] = user.name.split(' ');
    setEditForm({
      firstName: firstName || "",
      lastName: lastName || "",
      dateOfBirth: "1990-05-15", // Mock data - in real app would come from user object
      nationality: "United States",
      countryOfResidence: "United States", 
      idDocumentType: "Passport",
      documentNumber: "123456789"
    });
    setHasChanges(false);
    setIsEditModalOpen(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // In real app, this would update the global state/database
    toast.success("User profile updated successfully");
    setHasChanges(false);
  };

  const handleApproveVerification = (userId: string) => {
    setVerificationQueue(queue => 
      queue.map(user => 
        user.id === userId 
          ? { ...user, status: "Approved" }
          : user
      )
    );
    toast.success("Identity verification approved");
  };

  const handleRejectVerification = (userId: string) => {
    setVerificationQueue(queue => 
      queue.map(user => 
        user.id === userId 
          ? { ...user, status: "Rejected" }
          : user
      )
    );
    toast.error("Identity verification rejected");
  };

  const pendingVerificationsCount = verificationQueue.filter(user => 
    user.status === "Pending Review" || user.status === "Under Review"
  ).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">User Management</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kpiData.map((kpi) => {
                const IconComponent = kpi.icon;
                return (
                  <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpi.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingVerificationsCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="directory" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="directory">User Directory</TabsTrigger>
                <TabsTrigger value="verification">Identity Verification Queue</TabsTrigger>
              </TabsList>
              
              <TabsContent value="directory" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="max-w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Users Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Joined</TableHead>
                          <TableHead>Assessments Completed</TableHead>
                          <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.dateJoined}</TableCell>
                            <TableCell>{user.assessmentsCompleted}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditModal(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate Account
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identity Verification Queue</CardTitle>
                    <p className="text-muted-foreground">
                      Review and process identity verification submissions
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User Name</TableHead>
                          <TableHead>Date Submitted</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verificationQueue.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.submittedDate}</TableCell>
                            <TableCell>{user.issue}</TableCell>
                            <TableCell>
                              <Badge variant={getVerificationStatusVariant(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {(user.status === "Pending Review" || user.status === "Under Review") && (
                                <Button variant="ghost" size="sm">
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
              </TabsContent>
            </Tabs>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile: {selectedUser?.name}</DialogTitle>
                  <DialogDescription>
                    View and manage user profile information and assessment history
                  </DialogDescription>
                </DialogHeader>
                {selectedUser && (
                  <Tabs defaultValue="identity" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="identity">Identity Data</TabsTrigger>
                      <TabsTrigger value="assessments">Assessment History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="identity" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            value={editForm.firstName}
                            onChange={(e) => handleFormChange("firstName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editForm.lastName}
                            onChange={(e) => handleFormChange("lastName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={editForm.dateOfBirth}
                            onChange={(e) => handleFormChange("dateOfBirth", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationality" className="text-sm font-medium">Nationality</Label>
                          <Input
                            id="nationality"
                            value={editForm.nationality}
                            onChange={(e) => handleFormChange("nationality", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="countryOfResidence" className="text-sm font-medium">Country of Residence</Label>
                          <Input
                            id="countryOfResidence"
                            value={editForm.countryOfResidence}
                            onChange={(e) => handleFormChange("countryOfResidence", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="idDocumentType" className="text-sm font-medium">ID Document Type</Label>
                          <Select value={editForm.idDocumentType} onValueChange={(value) => handleFormChange("idDocumentType", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">Passport</SelectItem>
                              <SelectItem value="Driver's License">Driver's License</SelectItem>
                              <SelectItem value="National ID">National ID</SelectItem>
                              <SelectItem value="State ID">State ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="documentNumber" className="text-sm font-medium">Document Number</Label>
                          <Input
                            id="documentNumber"
                            value={editForm.documentNumber}
                            onChange={(e) => handleFormChange("documentNumber", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Team</Label>
                          <div className="mt-1 p-2 border rounded-md">
                            <span className="text-primary cursor-pointer hover:underline">
                              TechVenture Solutions
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm" className="mt-6">
                            <Eye className="mr-2 h-4 w-4" />
                            View Uploaded Document
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assessments" className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Questionnaire Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(mockAssessmentHistory[selectedUser.id as keyof typeof mockAssessmentHistory] || []).map((assessment) => (
                            <TableRow key={assessment.id}>
                              <TableCell className="font-medium">{assessment.name}</TableCell>
                              <TableCell>
                                <Badge variant={assessment.status === "Completed" ? "default" : "secondary"}>
                                  {assessment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{assessment.score}</TableCell>
                              <TableCell>
                                {assessment.status === "Completed" && (
                                  <Button variant="ghost" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Submission
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                )}
                <DialogFooter>
                  <Button 
                    onClick={handleSaveChanges} 
                    disabled={!hasChanges}
                    className="w-full sm:w-auto"
                  >
                    Save Changes
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

export default UserDirectory;