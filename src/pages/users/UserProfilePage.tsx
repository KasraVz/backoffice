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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Download, Eye, Save, Plus, Trash2 } from "lucide-react";
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

// Comprehensive list of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria",
  "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic", "Denmark", "Ecuador",
  "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia", "Mexico",
  "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"
];

// Mock team data
const mockTeamData = {
  "1": [
    {
      id: "team1",
      startupName: "TechVenture Inc.",
      members: [
        { name: "John Smith", equityShare: "45", role: "CEO" }
      ],
      addTeamMembers: "yes",
      startupWebsite: "https://techventure.com",
      includeTestResults: "yes",
      memberEmails: ["john@techventure.com"]
    }
  ],
  "2": [
    {
      id: "team2", 
      startupName: "HealthTech Solutions",
      members: [
        { name: "Sarah Johnson", equityShare: "60", role: "Founder & CEO" }
      ],
      addTeamMembers: "no",
      startupWebsite: "",
      includeTestResults: "no",
      memberEmails: []
    }
  ]
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

  const [teamData, setTeamData] = useState<any[]>([]);
  const [teamForms, setTeamForms] = useState<any>({});

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

      // Initialize team data
      const userTeams = mockTeamData[userId as keyof typeof mockTeamData] || [];
      setTeamData(userTeams);
      
      // Initialize team forms
      const forms: any = {};
      userTeams.forEach(team => {
        forms[team.id] = { ...team };
      });
      setTeamForms(forms);
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

  const handleTeamFormChange = (teamId: string, field: string, value: string | string[]) => {
    setTeamForms((prev: any) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleMemberChange = (teamId: string, memberIndex: number, field: string, value: string) => {
    setTeamForms((prev: any) => {
      const team = prev[teamId];
      const updatedMembers = [...team.members];
      updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], [field]: value };
      
      return {
        ...prev,
        [teamId]: {
          ...team,
          members: updatedMembers
        }
      };
    });
    setHasChanges(true);
  };

  const addMember = (teamId: string) => {
    setTeamForms((prev: any) => {
      const team = prev[teamId];
      return {
        ...prev,
        [teamId]: {
          ...team,
          members: [...team.members, { name: "", equityShare: "", role: "" }]
        }
      };
    });
    setHasChanges(true);
  };

  const removeMember = (teamId: string, memberIndex: number) => {
    setTeamForms((prev: any) => {
      const team = prev[teamId];
      const updatedMembers = team.members.filter((_: any, index: number) => index !== memberIndex);
      
      return {
        ...prev,
        [teamId]: {
          ...team,
          members: updatedMembers
        }
      };
    });
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="identity">Identity Data</TabsTrigger>
                <TabsTrigger value="business">Business Profile</TabsTrigger>
                <TabsTrigger value="team">Team Profile</TabsTrigger>
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
                          <Select value={identityForm.nationality} onValueChange={(value) => handleIdentityFormChange("nationality", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="countryOfResidence">Country of Residence</Label>
                          <Select value={identityForm.countryOfResidence} onValueChange={(value) => handleIdentityFormChange("countryOfResidence", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select country of residence" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="idDocumentType">ID Document Type</Label>
                          <Select value={identityForm.idDocumentType} onValueChange={(value) => handleIdentityFormChange("idDocumentType", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">Passport</SelectItem>
                              <SelectItem value="National ID">National ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="documentNumber">Passport/National ID Number</Label>
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

              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {teamData.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {teamData.map((team) => {
                            const teamForm = teamForms[team.id] || team;
                            return (
                              <AccordionItem key={team.id} value={team.id}>
                                <AccordionTrigger>
                                  Team: {teamForm.startupName || "Unnamed Team"}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium">Do you want to add your team members right now? *</Label>
                                      <RadioGroup 
                                        value={teamForm.addTeamMembers} 
                                        onValueChange={(value) => handleTeamFormChange(team.id, "addTeamMembers", value)}
                                        className="flex gap-6 mt-2"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="yes" id={`yes-${team.id}`} />
                                          <Label htmlFor={`yes-${team.id}`}>Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="no" id={`no-${team.id}`} />
                                          <Label htmlFor={`no-${team.id}`}>No</Label>
                                        </div>
                                      </RadioGroup>
                                    </div>

                                    {teamForm.addTeamMembers === "yes" && (
                                      <>
                                        <div className="space-y-4">
                                          <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Team Members</Label>
                                            <Button 
                                              type="button" 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => addMember(team.id)}
                                            >
                                              <Plus className="h-4 w-4 mr-2" />
                                              Add Member
                                            </Button>
                                          </div>
                                          
                                          {teamForm.members?.map((member: any, index: number) => (
                                            <div key={index} className="border rounded-lg p-4 space-y-3">
                                              <div className="flex items-center justify-between">
                                                <Label className="text-sm font-medium">Member {index + 1}</Label>
                                                {teamForm.members.length > 1 && (
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMember(team.id, index)}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                )}
                                              </div>
                                              <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                  <Label htmlFor={`name-${team.id}-${index}`} className="text-xs">Name</Label>
                                                  <Input
                                                    id={`name-${team.id}-${index}`}
                                                    placeholder="Full name"
                                                    value={member.name}
                                                    onChange={(e) => handleMemberChange(team.id, index, "name", e.target.value)}
                                                    className="mt-1"
                                                  />
                                                </div>
                                                <div>
                                                  <Label htmlFor={`equity-${team.id}-${index}`} className="text-xs">Equity Share (%)</Label>
                                                  <Input
                                                    id={`equity-${team.id}-${index}`}
                                                    placeholder="0"
                                                    value={member.equityShare}
                                                    onChange={(e) => handleMemberChange(team.id, index, "equityShare", e.target.value)}
                                                    className="mt-1"
                                                  />
                                                </div>
                                                <div>
                                                  <Label htmlFor={`role-${team.id}-${index}`} className="text-xs">Role/Responsibility</Label>
                                                  <Input
                                                    id={`role-${team.id}-${index}`}
                                                    placeholder="e.g., CTO, CMO"
                                                    value={member.role}
                                                    onChange={(e) => handleMemberChange(team.id, index, "role", e.target.value)}
                                                    className="mt-1"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        <div>
                                          <Label htmlFor={`startup-name-${team.id}`}>Startup Name</Label>
                                          <Input
                                            id={`startup-name-${team.id}`}
                                            placeholder="Enter startup name"
                                            value={teamForm.startupName}
                                            onChange={(e) => handleTeamFormChange(team.id, "startupName", e.target.value)}
                                            className="mt-1"
                                          />
                                        </div>

                                        <div>
                                          <Label htmlFor={`startup-website-${team.id}`}>Startup Website</Label>
                                          <Input
                                            id={`startup-website-${team.id}`}
                                            placeholder="https://yourwebsite.com"
                                            value={teamForm.startupWebsite}
                                            onChange={(e) => handleTeamFormChange(team.id, "startupWebsite", e.target.value)}
                                            className="mt-1"
                                          />
                                        </div>

                                        <div>
                                          <Label className="text-sm font-medium">Include individual test results of these team members?</Label>
                                          <RadioGroup 
                                            value={teamForm.includeTestResults} 
                                            onValueChange={(value) => handleTeamFormChange(team.id, "includeTestResults", value)}
                                            className="flex gap-6 mt-2"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="yes" id={`include-yes-${team.id}`} />
                                              <Label htmlFor={`include-yes-${team.id}`}>Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="no" id={`include-no-${team.id}`} />
                                              <Label htmlFor={`include-no-${team.id}`}>No</Label>
                                            </div>
                                          </RadioGroup>
                                        </div>

                                        <div>
                                          <Label className="text-sm font-medium">Team Member Supsindex Account Emails</Label>
                                          <div className="space-y-2 mt-2">
                                            {teamForm.members?.map((member: any, index: number) => (
                                              <div key={index}>
                                                <Label htmlFor={`email-${team.id}-${index}`} className="text-xs">Email for Member {index + 1}</Label>
                                                <Input
                                                  id={`email-${team.id}-${index}`}
                                                  type="email"
                                                  placeholder="member@example.com"
                                                  value={teamForm.memberEmails?.[index] || ""}
                                                  onChange={(e) => {
                                                    const emails = [...(teamForm.memberEmails || [])];
                                                    emails[index] = e.target.value;
                                                    handleTeamFormChange(team.id, "memberEmails", emails);
                                                  }}
                                                  className="mt-1"
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No team profiles found for this user.
                        </div>
                      )}
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