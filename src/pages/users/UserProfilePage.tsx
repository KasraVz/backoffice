import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download, Eye, Save } from "lucide-react";
import { toast } from "sonner";

// Mock user data - in real app would come from API
const mockUserData = {
  "1": {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "Active",
    dateJoined: "2024-01-15",
    assessmentsCompleted: 5,
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1990-05-15",
    nationality: "United States",
    countryOfResidence: "United States",
    idDocumentType: "Passport",
    documentNumber: "123456789",
    startupName: "TechVenture Inc.",
    industry: "Technology",
    companyStage: "Series A",
    website: "https://techventure.com",
    linkedin: "https://linkedin.com/in/johnsmith"
  },
  "2": {
    id: "2",
    name: "Sarah Johnson", 
    email: "sarah.j@example.com",
    status: "Active",
    dateJoined: "2024-02-03",
    assessmentsCompleted: 3,
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1988-09-22",
    nationality: "Canada",
    countryOfResidence: "Canada",
    idDocumentType: "Driver's License",
    documentNumber: "987654321",
    startupName: "HealthTech Solutions",
    industry: "Healthcare",
    companyStage: "Seed",
    website: "https://healthtech.ca",
    linkedin: "https://linkedin.com/in/sarahjohnson"
  }
};

const mockAssessmentHistory = {
  "1": [
    { id: "A1", name: "FPA-GEN-PRE-1", status: "Completed", score: "85%", date: "2024-03-01", questionnaire: "General Pre-Assessment" },
    { id: "A2", name: "FPA-ADV-POST-3", status: "Completed", score: "92%", date: "2024-02-15", questionnaire: "Advanced Post-Assessment" },
    { id: "A3", name: "EEA-INT-MID-1", status: "In Progress", score: "N/A", date: "2024-03-10", questionnaire: "Intermediate Mid-Assessment" },
  ],
  "2": [
    { id: "A4", name: "FPA-INT-MID-2", status: "In Progress", score: "N/A", date: "2024-03-05", questionnaire: "Intermediate Mid-Assessment" },
  ]
};

const mockReportHistory = {
  "1": [
    { id: "RPT-001", questionnaireName: "FPA-GEN-PRE-1", dateGenerated: "2024-03-02", status: "Generated" },
    { id: "RPT-002", questionnaireName: "FPA-ADV-POST-3", dateGenerated: "2024-02-16", status: "Generated" },
  ],
  "2": [
    { id: "RPT-003", questionnaireName: "FPA-INT-MID-2", dateGenerated: "2024-03-06", status: "Pending" },
  ]
};

const mockCertificateHistory = {
  "1": [
    { id: "CERT-001", certificationName: "FPA Level 1 Certification", dateIssued: "2024-03-02", status: "Issued" },
    { id: "CERT-002", certificationName: "Advanced Entrepreneur Certification", dateIssued: "2024-02-16", status: "Issued" },
  ],
  "2": []
};

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Form states for editable tabs
  const [identityForm, setIdentityForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    countryOfResidence: "",
    idDocumentType: "",
    documentNumber: ""
  });

  const [businessForm, setBusinessForm] = useState({
    startupName: "",
    industry: "",
    companyStage: "",
    website: "",
    linkedin: ""
  });

  useEffect(() => {
    if (userId && mockUserData[userId as keyof typeof mockUserData]) {
      const userData = mockUserData[userId as keyof typeof mockUserData];
      setUser(userData);
      
      // Initialize forms
      setIdentityForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        nationality: userData.nationality,
        countryOfResidence: userData.countryOfResidence,
        idDocumentType: userData.idDocumentType,
        documentNumber: userData.documentNumber
      });

      setBusinessForm({
        startupName: userData.startupName,
        industry: userData.industry,
        companyStage: userData.companyStage,
        website: userData.website,
        linkedin: userData.linkedin
      });
    }
  }, [userId]);

  const handleIdentityFormChange = (field: string, value: string) => {
    setIdentityForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleBusinessFormChange = (field: string, value: string) => {
    setBusinessForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // In real app, this would update the database
    toast.success("User profile updated successfully");
    setHasChanges(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Inactive": return "secondary";
      case "Pending Verification": return "outline";
      default: return "default";
    }
  };

  if (!user) {
    return <div>User not found</div>;
  }

  const assessmentHistory = mockAssessmentHistory[userId as keyof typeof mockAssessmentHistory] || [];
  const reportHistory = mockReportHistory[userId as keyof typeof mockReportHistory] || [];
  const certificateHistory = mockCertificateHistory[userId as keyof typeof mockCertificateHistory] || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center space-x-4 flex-1">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/users">Users</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/users/directory">User Directory</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{user.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto">
                {hasChanges && (
                  <Button onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* User Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Joined: {user.dateJoined} • Assessments Completed: {user.assessmentsCompleted}
                </div>
              </CardHeader>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="identity">Identity Data</TabsTrigger>
                <TabsTrigger value="business">Business Profile</TabsTrigger>
                <TabsTrigger value="assessments">Assessment History</TabsTrigger>
                <TabsTrigger value="reports">Report History</TabsTrigger>
                <TabsTrigger value="certificates">Certificate History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="identity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identity Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={identityForm.firstName}
                            onChange={(e) => handleIdentityFormChange("firstName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={identityForm.lastName}
                            onChange={(e) => handleIdentityFormChange("lastName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={identityForm.dateOfBirth}
                            onChange={(e) => handleIdentityFormChange("dateOfBirth", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationality">Nationality</Label>
                          <Input
                            id="nationality"
                            value={identityForm.nationality}
                            onChange={(e) => handleIdentityFormChange("nationality", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="countryOfResidence">Country of Residence</Label>
                          <Input
                            id="countryOfResidence"
                            value={identityForm.countryOfResidence}
                            onChange={(e) => handleIdentityFormChange("countryOfResidence", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="idDocumentType">ID Document Type</Label>
                          <Select value={identityForm.idDocumentType} onValueChange={(value) => handleIdentityFormChange("idDocumentType", value)}>
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
                          <Label htmlFor="documentNumber">Document Number</Label>
                          <Input
                            id="documentNumber"
                            value={identityForm.documentNumber}
                            onChange={(e) => handleIdentityFormChange("documentNumber", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startupName">Startup Name</Label>
                          <Input
                            id="startupName"
                            value={businessForm.startupName}
                            onChange={(e) => handleBusinessFormChange("startupName", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select value={businessForm.industry} onValueChange={(value) => handleBusinessFormChange("industry", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technology">Technology</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="companyStage">Company Stage</Label>
                          <Select value={businessForm.companyStage} onValueChange={(value) => handleBusinessFormChange("companyStage", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Idea">Idea</SelectItem>
                              <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                              <SelectItem value="Seed">Seed</SelectItem>
                              <SelectItem value="Series A">Series A</SelectItem>
                              <SelectItem value="Series B">Series B</SelectItem>
                              <SelectItem value="Series C+">Series C+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            value={businessForm.website}
                            onChange={(e) => handleBusinessFormChange("website", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="linkedin">LinkedIn Profile</Label>
                          <Input
                            id="linkedin"
                            type="url"
                            value={businessForm.linkedin}
                            onChange={(e) => handleBusinessFormChange("linkedin", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assessment ID</TableHead>
                          <TableHead>Questionnaire</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessmentHistory.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.name}</TableCell>
                            <TableCell>{assessment.questionnaire}</TableCell>
                            <TableCell>
                              <Badge variant={assessment.status === "Completed" ? "default" : "secondary"}>
                                {assessment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{assessment.score}</TableCell>
                            <TableCell>{assessment.date}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Submission
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Report History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Questionnaire Name</TableHead>
                          <TableHead>Date Generated</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportHistory.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.questionnaireName}</TableCell>
                            <TableCell>{report.dateGenerated}</TableCell>
                            <TableCell>
                              <Badge variant={report.status === "Generated" ? "default" : "secondary"}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certificates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Certificate History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Certificate ID</TableHead>
                          <TableHead>Certification Name</TableHead>
                          <TableHead>Date Issued</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certificateHistory.length > 0 ? (
                          certificateHistory.map((certificate) => (
                            <TableRow key={certificate.id}>
                              <TableCell className="font-medium">{certificate.id}</TableCell>
                              <TableCell>{certificate.certificationName}</TableCell>
                              <TableCell>{certificate.dateIssued}</TableCell>
                              <TableCell>
                                <Badge variant={certificate.status === "Issued" ? "default" : "secondary"}>
                                  {certificate.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  View/Download PDF
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No certificates issued yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserProfilePage;