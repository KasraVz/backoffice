import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Clock, CheckCircle, Calendar, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { assessmentCategories } from "@/data/categories";

const mockReviewSets = [
  {
    id: "RS-001",
    setName: "FPA: Financial Management & Fundraising - Seed Stage",
    questionCount: 25,
    dateAssigned: "2024-01-15",
    status: "Pending",
    description: "Review questions related to financial planning and fundraising strategies for seed-stage startups."
  },
  {
    id: "RS-002", 
    setName: "EEA: Human Resources - Early Stage",
    questionCount: 18,
    dateAssigned: "2024-01-12",
    status: "In Progress",
    description: "Evaluate HR-related questions for Early Stage companies."
  },
  {
    id: "RS-003",
    setName: "GEB: General Entrepreneurial Behavior - Growth Stage", 
    questionCount: 22,
    dateAssigned: "2024-01-10",
    status: "Completed",
    description: "Questions focusing on general entrepreneurial behavior for growth-stage companies."
  },
  {
    id: "RS-004",
    setName: "FPA: Investment & Valuation - Series A",
    questionCount: 30,
    dateAssigned: "2024-01-18", 
    status: "Pending",
    description: "Review investment and valuation questions for Series A stage companies."
  }
];

const mockKPIs = {
  pendingReviewSets: 2,
  inProgressSets: 1, 
  completedReviews: 1
};

const FacultyDashboard = () => {
  const navigate = useNavigate();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "In Progress": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <BookOpen className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "In Progress": return "secondary";
      default: return "outline";
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case "In Progress": return "Continue Review";
      default: return "Start Review";
    }
  };

  // Parse setName to extract assessment details
  const parseSetName = (setName: string) => {
    // Format: "FPA: Financial Management & Fundraising - Seed Stage"
    const parts = setName.split(' - ');
    const stage = parts[1] || 'Seed Stage';
    const assessmentPart = parts[0] || '';
    const assessmentType = assessmentPart.split(':')[0] || 'FPA';
    
    return {
      assessmentType,
      stage: stage.replace(' Stage', ''),
      industry: 'General'
    };
  };

  const getCategoriesForAssessment = (assessmentType: string, stage: string) => {
    // Use imported assessment categories to get both general and industry-specific
    const assessment = assessmentCategories[assessmentType as keyof typeof assessmentCategories];
    
    if (assessment) {
      // GEB has flat structure, FPA/EEA have general/industrySpecific
      if (assessmentType === 'GEB') {
        return Object.keys(assessment);
      }
      // Return both general and industry-specific categories for FPA/EEA
      return [
        ...Object.keys((assessment as any).general),
        ...Object.keys((assessment as any).industrySpecific)
      ];
    }
    
    return ['General Business'];
  };

  const handleStartReview = (setId: string) => {
    console.log('Navigating to review set:', setId);
    console.log('Target URL:', `/faculty/review/${setId}`);
    
    // Find the review set data to store it for the review page
    const reviewSet = mockReviewSets.find(set => set.id === setId);
    if (reviewSet) {
      const { assessmentType, stage, industry } = parseSetName(reviewSet.setName);
      const categories = getCategoriesForAssessment(assessmentType, stage);
      
      // Create proper ReviewSetData structure
      const reviewSetData = {
        id: reviewSet.id,
        assigneeName: "Current Faculty Member", // Mock assignee name
        questionnaireName: reviewSet.setName,
        description: reviewSet.description,
        totalQuestions: reviewSet.questionCount,
        assessmentType,
        stage,
        industry,
        categories: categories.map(category => ({
          category,
          questionCount: Math.floor(reviewSet.questionCount / categories.length)
        }))
      };
      
      localStorage.setItem(`reviewSet_${setId}`, JSON.stringify(reviewSetData));
      console.log('Stored review set data:', reviewSetData);
    }
    
    navigate(`/faculty/review/${setId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[28px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">My Question Review Dashboard</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50 mx-[28px]">
            <div className="max-w-7xl">
              {/* Page Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold">My Question Review Dashboard</h2>
                <p className="text-muted-foreground mt-2">
                  Review your assigned question sets and provide feedback to improve our assessment quality.
                </p>
              </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review Sets</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.pendingReviewSets}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your review
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress Sets</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.inProgressSets}</div>
              <p className="text-xs text-muted-foreground">
                Currently being reviewed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockKPIs.completedReviews}</div>
              <p className="text-xs text-muted-foreground">
                Successfully reviewed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Review Sets Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Review Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Set Name</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReviewSets.map((set) => (
                  <TableRow key={set.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{set.setName}</div>
                        <div className="text-sm text-muted-foreground">{set.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {set.questionCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(set.dateAssigned).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(set.status)}
                        <Badge variant={getStatusColor(set.status)}>
                          {set.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        disabled={set.status === "Completed"}
                        onClick={() => handleStartReview(set.id)}
                      >
                        {getButtonText(set.status)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

              {mockReviewSets.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Review Sets Available</h3>
                    <p className="text-muted-foreground text-center">
                      You don't have any question sets assigned for review at the moment.
                      Check back later or contact the admin if you believe this is an error.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FacultyDashboard;