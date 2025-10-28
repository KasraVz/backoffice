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
import { ArrowLeft, Download, Eye, Save, Plus, Trash2, ExternalLink } from "lucide-react";
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
    startupWebsite: "https://techventure.com",
    primaryIndustry: "AI & Machine Learning",
    developmentStage: "Scaling",
    scientificBackground: "Strong (PhD)",
    ecosystemExperience: ["Previous Founder", "VC/Angel"],
    targetEcosystem: "Silicon Valley",
    mostExperiencedEcosystem: "London",
    currentTeamSize: "6-15",
    spending: "£5k-20k",
    fundingSources: ["VC", "Angel", "Personal"],
    reasonForPlatform: "Assess capabilities"
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
    idDocumentType: "National ID",
    documentNumber: "987654321",
    startupName: "HealthTech Solutions",
    startupWebsite: "",
    primaryIndustry: "Healthcare",
    developmentStage: "Revenue",
    scientificBackground: "Some (Bachelor's)",
    ecosystemExperience: ["No Experience"],
    targetEcosystem: "Toronto",
    mostExperiencedEcosystem: "Toronto",
    currentTeamSize: "1-5",
    spending: "< £1,000",
    fundingSources: ["Personal", "Bootstrapped"],
    reasonForPlatform: "Training needs"
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
    startupWebsite: "",
    primaryIndustry: "",
    developmentStage: "",
    scientificBackground: "",
    ecosystemExperience: [] as string[],
    targetEcosystem: "",
    mostExperiencedEcosystem: "",
    currentTeamSize: "",
    spending: "",
    fundingSources: [] as string[],
    reasonForPlatform: ""
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
        startupName: userData.startupName || "",
        startupWebsite: userData.startupWebsite || "",
        primaryIndustry: userData.primaryIndustry || "",
        developmentStage: userData.developmentStage || "",
        scientificBackground: userData.scientificBackground || "",
        ecosystemExperience: userData.ecosystemExperience || [],
        targetEcosystem: userData.targetEcosystem || "",
        mostExperiencedEcosystem: userData.mostExperiencedEcosystem || "",
        currentTeamSize: userData.currentTeamSize || "",
        spending: userData.spending || "",
        fundingSources: userData.fundingSources || [],
        reasonForPlatform: userData.reasonForPlatform || ""
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

  const handleBusinessFormChange = (field: string, value: string | string[]) => {
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
                    <BreadcrumbLink href="/test-takers/directory">Test Takers</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/test-takers/directory">Test Taker Directory</BreadcrumbLink>
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
                     <ScrollArea className="h-[600px]">
                       <div className="space-y-6">
                         {/* Your Startup Name */}
                         <div>
                           <Label htmlFor="startupName">Your Startup Name</Label>
                           <Input
                             id="startupName"
                             value={businessForm.startupName}
                             onChange={(e) => handleBusinessFormChange("startupName", e.target.value)}
                             className="mt-1"
                             placeholder="Enter your startup name"
                           />
                         </div>

                         {/* Your Startup Website */}
                         <div>
                           <Label htmlFor="startupWebsite">Your Startup Website</Label>
                           <Input
                             id="startupWebsite"
                             type="url"
                             value={businessForm.startupWebsite}
                             onChange={(e) => handleBusinessFormChange("startupWebsite", e.target.value)}
                             className="mt-1"
                             placeholder="https://yourcompany.com"
                           />
                         </div>

                         {/* Startup's Primary Industry */}
                        <div>
                          <Label htmlFor="primaryIndustry">Startup's Primary Industry *</Label>
                          <Select value={businessForm.primaryIndustry} onValueChange={(value) => handleBusinessFormChange("primaryIndustry", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                              <SelectItem value="Biotech">Biotech</SelectItem>
                              <SelectItem value="SaaS">SaaS</SelectItem>
                              <SelectItem value="Fintech">Fintech</SelectItem>
                              <SelectItem value="E-commerce">E-commerce</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="CleanTech">CleanTech</SelectItem>
                              <SelectItem value="EdTech">EdTech</SelectItem>
                              <SelectItem value="Gaming">Gaming</SelectItem>
                              <SelectItem value="IoT">IoT</SelectItem>
                              <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Development Stage */}
                        <div>
                          <Label>Development Stage *</Label>
                          <RadioGroup
                            value={businessForm.developmentStage}
                            onValueChange={(value) => handleBusinessFormChange("developmentStage", value)}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Idea" id="idea" />
                              <Label htmlFor="idea">Idea</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="MVP" id="mvp" />
                              <Label htmlFor="mvp">MVP</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Traction" id="traction" />
                              <Label htmlFor="traction">Traction</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Revenue" id="revenue" />
                              <Label htmlFor="revenue">Revenue</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Scaling" id="scaling" />
                              <Label htmlFor="scaling">Scaling</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Established" id="established" />
                              <Label htmlFor="established">Established</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Scientific Background */}
                        <div>
                          <Label>Scientific Background *</Label>
                          <RadioGroup
                            value={businessForm.scientificBackground}
                            onValueChange={(value) => handleBusinessFormChange("scientificBackground", value)}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Strong (PhD)" id="strong" />
                              <Label htmlFor="strong">Strong (PhD)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Significant (Master's)" id="significant" />
                              <Label htmlFor="significant">Significant (Master's)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Some (Bachelor's)" id="some" />
                              <Label htmlFor="some">Some (Bachelor's)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="None" id="none" />
                              <Label htmlFor="none">None</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Ecosystem Experience */}
                        <div>
                          <Label>Ecosystem Experience</Label>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {[
                              "Previous Founder",
                              "VC/Angel", 
                              "Community Involvement",
                              "Incubator Experience",
                              "Mentor",
                              "No Experience"
                            ].map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={option.replace(/\s+/g, '').toLowerCase()}
                                  checked={businessForm.ecosystemExperience?.includes(option) || false}
                                  onChange={(e) => {
                                    const current = businessForm.ecosystemExperience || [];
                                    const updated = e.target.checked
                                      ? [...current, option]
                                      : current.filter(item => item !== option);
                                    handleBusinessFormChange("ecosystemExperience", updated);
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <Label htmlFor={option.replace(/\s+/g, '').toLowerCase()}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Target Ecosystem */}
                        <div>
                          <Label htmlFor="targetEcosystem">Target Ecosystem</Label>
                          <Select value={businessForm.targetEcosystem} onValueChange={(value) => handleBusinessFormChange("targetEcosystem", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select target ecosystem" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Silicon Valley">Silicon Valley</SelectItem>
                              <SelectItem value="London">London</SelectItem>
                              <SelectItem value="Berlin">Berlin</SelectItem>
                              <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
                              <SelectItem value="Singapore">Singapore</SelectItem>
                              <SelectItem value="Toronto">Toronto</SelectItem>
                              <SelectItem value="Sydney">Sydney</SelectItem>
                              <SelectItem value="Boston">Boston</SelectItem>
                              <SelectItem value="New York">New York</SelectItem>
                              <SelectItem value="Paris">Paris</SelectItem>
                              <SelectItem value="Stockholm">Stockholm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Most Experienced Ecosystem */}
                        <div>
                          <Label htmlFor="mostExperiencedEcosystem">Most Experienced Ecosystem</Label>
                          <Select value={businessForm.mostExperiencedEcosystem} onValueChange={(value) => handleBusinessFormChange("mostExperiencedEcosystem", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select most experienced ecosystem" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Silicon Valley">Silicon Valley</SelectItem>
                              <SelectItem value="London">London</SelectItem>
                              <SelectItem value="Berlin">Berlin</SelectItem>
                              <SelectItem value="Tel Aviv">Tel Aviv</SelectItem>
                              <SelectItem value="Singapore">Singapore</SelectItem>
                              <SelectItem value="Toronto">Toronto</SelectItem>
                              <SelectItem value="Sydney">Sydney</SelectItem>
                              <SelectItem value="Boston">Boston</SelectItem>
                              <SelectItem value="New York">New York</SelectItem>
                              <SelectItem value="Paris">Paris</SelectItem>
                              <SelectItem value="Stockholm">Stockholm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Current Team Size */}
                        <div>
                          <Label>Current Team Size</Label>
                          <RadioGroup
                            value={businessForm.currentTeamSize}
                            onValueChange={(value) => handleBusinessFormChange("currentTeamSize", value)}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Founders only" id="foundersonly" />
                              <Label htmlFor="foundersonly">Founders only</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1-5" id="oneToFive" />
                              <Label htmlFor="oneToFive">1-5</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="6-15" id="sixToFifteen" />
                              <Label htmlFor="sixToFifteen">6-15</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="16+" id="sixteenPlus" />
                              <Label htmlFor="sixteenPlus">16+</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Spending */}
                        <div>
                          <Label>Spending</Label>
                          <RadioGroup
                            value={businessForm.spending}
                            onValueChange={(value) => handleBusinessFormChange("spending", value)}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="< £1,000" id="under1k" />
                              <Label htmlFor="under1k">&lt; £1,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="£1k-5k" id="oneToFiveK" />
                              <Label htmlFor="oneToFiveK">£1k-5k</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="£5k-20k" id="fiveToTwentyK" />
                              <Label htmlFor="fiveToTwentyK">£5k-20k</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="> £20k" id="overTwentyK" />
                              <Label htmlFor="overTwentyK">&gt; £20k</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Funding Sources */}
                        <div>
                          <Label>Funding Sources</Label>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {[
                              "Personal",
                              "Family",
                              "Revenue", 
                              "VC",
                              "Grants",
                              "Loans",
                              "Angel",
                              "Bootstrapped"
                            ].map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={option.toLowerCase()}
                                  checked={businessForm.fundingSources?.includes(option) || false}
                                  onChange={(e) => {
                                    const current = businessForm.fundingSources || [];
                                    const updated = e.target.checked
                                      ? [...current, option]
                                      : current.filter(item => item !== option);
                                    handleBusinessFormChange("fundingSources", updated);
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <Label htmlFor={option.toLowerCase()}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reason for Using Platform */}
                        <div>
                          <Label htmlFor="reasonForPlatform">Reason for Using Platform</Label>
                          <Select value={businessForm.reasonForPlatform} onValueChange={(value) => handleBusinessFormChange("reasonForPlatform", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Assess capabilities">Assess capabilities</SelectItem>
                              <SelectItem value="Gain certification">Gain certification</SelectItem>
                              <SelectItem value="Benchmark">Benchmark</SelectItem>
                              <SelectItem value="Training needs">Training needs</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <div className="space-y-3">
                          {teamData.map((team) => {
                            const teamForm = teamForms[team.id] || team;
                            return (
                              <Card key={team.id} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Team: {teamForm.startupName || "Unnamed Team"}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      window.open('/users/teams', '_blank');
                                    }}
                                    title="View team profile"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
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