import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Eye, MessageSquare, Users, ClipboardCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AssignReviewSetModal } from "@/components/AssignReviewSetModal";
import { toast } from "@/components/ui/use-toast";
const mockKPIs = {
  pendingReview: 14,
  activeReviewers: 28,
  totalFeedback: 1204
};
const mockReviewSets = [{
  id: "101",
  assignedTo: "Dr. Sarah Johnson",
  description: "FPA - General - Finance - Pre-seed",
  status: "Pending",
  progress: {
    completed: 0,
    total: 25
  }
}, {
  id: "102",
  assignedTo: "Prof. Michael Chen",
  description: "EEA - HR Tech - Early Stage",
  status: "In Progress",
  progress: {
    completed: 15,
    total: 25
  }
}, {
  id: "103",
  assignedTo: "Dr. Emily Rodriguez",
  description: "TDA - HealthTech - Seed",
  status: "Completed",
  progress: {
    completed: 20,
    total: 20
  }
}];
const mockFeedbackData = [{
  question: "What is your burn rate strategy?",
  reviewer: "Dr. Sarah Johnson",
  comment: "Consider adding more specific timeframe options",
  date: "2024-01-15"
}, {
  question: "How do you plan to scale your team?",
  reviewer: "Prof. Michael Chen",
  comment: "This question needs clearer context for different stages",
  date: "2024-01-14"
}];
const QuestionReviewDashboard = () => {
  const navigate = useNavigate();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [reviewSets, setReviewSets] = useState(mockReviewSets);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };
  const handleAssignmentComplete = (assignmentData: {
    assigneeName: string;
    questionnaireName: string;
    description: string;
    questionCount: number;
  }) => {
    // Generate a new unique ID
    const newId = (Math.max(...reviewSets.map(set => parseInt(set.id))) + 1).toString();
    
    // Create new review set object
    const newReviewSet = {
      id: newId,
      assignedTo: assignmentData.assigneeName,
      description: assignmentData.description,
      status: "Pending" as const,
      progress: {
        completed: 0,
        total: assignmentData.questionCount
      }
    };
    
    // Add to beginning of array
    setReviewSets(prev => [newReviewSet, ...prev]);
    
    toast({
      title: "Review Set Assigned",
      description: `Successfully assigned ${assignmentData.questionCount} questions from ${assignmentData.questionnaireName} to ${assignmentData.assigneeName}.`
    });
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-background px-6 mx-[28px]">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold">Question Review Dashboard</h1>
            </div>
            <Button onClick={() => setIsAssignModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Assign New Review Set
            </Button>
          </header>
          <main className="flex-1 p-8 bg-gray-50 mx-[28px]">
            <div className="max-w-7xl">
              <h2 className="text-2xl font-bold mb-6">Question Review Dashboard</h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sets Pending Review</CardTitle>
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockKPIs.pendingReview}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockKPIs.activeReviewers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Feedback Submitted</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockKPIs.totalFeedback}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabbed Interface */}
              <Tabs defaultValue="review-sets">
                <TabsList>
                  <TabsTrigger value="review-sets">Review Sets</TabsTrigger>
                  <TabsTrigger value="feedback-analysis">Feedback Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="review-sets" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Sets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Set ID</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Set Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reviewSets.map(set => <TableRow key={set.id}>
                              <TableCell className="font-medium">#{set.id}</TableCell>
                              <TableCell>{set.assignedTo}</TableCell>
                              <TableCell>{set.description}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(set.status)}>
                                  {set.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm">
                                    {set.progress.completed}/{set.progress.total} Questions Reviewed
                                  </div>
                                  <Progress value={set.progress.completed / set.progress.total * 100} className="w-24" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate(`/partners/operational/review-set/${set.id}`)}>
                                  <Eye className="h-3 w-3" />
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="feedback-analysis" className="mt-4">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Most Downvoted Questions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-32 flex items-center justify-center text-muted-foreground">
                          Chart visualization would go here
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Comments & Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Question</TableHead>
                              <TableHead>Faculty Member</TableHead>
                              <TableHead>Comment</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockFeedbackData.map((feedback, index) => <TableRow key={index}>
                                <TableCell className="max-w-xs">
                                  <p className="truncate">{feedback.question}</p>
                                </TableCell>
                                <TableCell>{feedback.reviewer}</TableCell>
                                <TableCell className="max-w-md">
                                  <p className="truncate">{feedback.comment}</p>
                                </TableCell>
                                <TableCell>{feedback.date}</TableCell>
                              </TableRow>)}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      <AssignReviewSetModal open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen} onAssignmentComplete={handleAssignmentComplete} />
    </SidebarProvider>;
};
export default QuestionReviewDashboard;