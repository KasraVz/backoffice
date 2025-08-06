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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, MessageSquare, ExternalLink, Star, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const mockFeedback = [
  {
    id: "1",
    dateSubmitted: "2024-03-15",
    userEmail: "john.smith@example.com",
    questionnaireName: "FPA-GEN-PRE-1",
    feedbackText: "The risk assessment section was difficult to understand. The calculations were not clearly explained and I found myself guessing on several questions. Perhaps more examples or clarification would help future test takers navigate this section more effectively.",
    status: "New"
  },
  {
    id: "2",
    dateSubmitted: "2024-03-14",
    userEmail: "sarah.johnson@example.com",
    questionnaireName: "FPA-ETH-ADV-2",
    feedbackText: "Overall excellent assessment but one question about fiduciary responsibility seemed to have an error in the answer choices. Option C appeared to be missing words or incomplete. This affected my confidence in answering.",
    status: "Under Review"
  },
  {
    id: "3",
    dateSubmitted: "2024-03-13",
    userEmail: "mike.wilson@example.com",
    questionnaireName: "FPA-GEN-PRE-1",
    feedbackText: "The time limit felt too restrictive for the complexity of questions asked. I would have appreciated either more time or fewer questions to properly demonstrate my knowledge without feeling rushed.",
    status: "Action Taken"
  },
  {
    id: "4",
    dateSubmitted: "2024-03-12",
    userEmail: "emma.davis@example.com",
    questionnaireName: "FPA-TAX-INT-3",
    feedbackText: "Very comprehensive assessment! I particularly appreciated the real-world scenarios. My only suggestion would be to include more visual aids or charts for the tax calculation problems.",
    status: "Archived"
  },
  {
    id: "5",
    dateSubmitted: "2024-03-11",
    userEmail: "david.brown@example.com",
    questionnaireName: "FPA-INV-ADV-4",
    feedbackText: "Question 15 about portfolio optimization seemed to reference a case study that wasn't provided in the assessment materials. This made it impossible to answer accurately.",
    status: "New"
  },
  {
    id: "6",
    dateSubmitted: "2024-03-10",
    userEmail: "lisa.chen@example.com",
    questionnaireName: "FPA-EST-INT-2",
    feedbackText: "The assessment was well-structured and fair. However, some technical terms were used without definition, which might be challenging for candidates with different educational backgrounds.",
    status: "Under Review"
  }
];

const statusOptions = ["New", "Under Review", "Action Taken", "Archived"];
const questionnaireOptions = ["FPA-GEN-PRE-1", "FPA-ETH-ADV-2", "FPA-TAX-INT-3", "FPA-INV-ADV-4", "FPA-EST-INT-2", "FPA-RET-ADV-5"];

const FeedbackSubmissions = () => {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<typeof mockFeedback[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [questionnaireFilter, setQuestionnaireFilter] = useState("all");

  const filteredFeedback = feedback.filter(item => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesQuestionnaire = questionnaireFilter === "all" || item.questionnaireName === questionnaireFilter;
    return matchesStatus && matchesQuestionnaire;
  });

  const updateFeedbackStatus = (id: string, newStatus: string) => {
    setFeedback(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "New": return "destructive";
      case "Under Review": return "outline";
      case "Action Taken": return "default";
      case "Archived": return "secondary";
      default: return "outline";
    }
  };

  const openDetailModal = (feedbackItem: typeof mockFeedback[0]) => {
    setSelectedFeedback(feedbackItem);
    setIsDetailModalOpen(true);
  };

  const newFeedbackCount = feedback.filter(item => item.status === "New").length;
  const underReviewCount = feedback.filter(item => item.status === "Under Review").length;
  const actionTakenCount = feedback.filter(item => item.status === "Action Taken").length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Report Feedback Submissions</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px] space-y-6">
            {/* Feedback Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Feedback</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{newFeedbackCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{underReviewCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Action Taken</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{actionTakenCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{feedback.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Management */}
            <Card>
              <CardHeader>
                <CardTitle>Report Feedback Submissions</CardTitle>
                <p className="text-muted-foreground">
                  Review feedback submitted by users about their assessment reports
                </p>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Select value={questionnaireFilter} onValueChange={setQuestionnaireFilter}>
                    <SelectTrigger className="max-w-[220px]">
                      <SelectValue placeholder="Filter by Questionnaire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Questionnaires</SelectItem>
                      {questionnaireOptions.map((questionnaire) => (
                        <SelectItem key={questionnaire} value={questionnaire}>{questionnaire}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="max-w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Feedback Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Questionnaire</TableHead>
                      <TableHead>Feedback Snippet</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openDetailModal(item)}
                      >
                        <TableCell>{item.dateSubmitted}</TableCell>
                        <TableCell>{item.userEmail}</TableCell>
                        <TableCell>{item.questionnaireName}</TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="truncate">
                            {item.feedbackText.substring(0, 100)}
                            {item.feedbackText.length > 100 && '...'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Select 
                              value={item.status} 
                              onValueChange={(value) => updateFeedbackStatus(item.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <Badge variant={getStatusVariant(item.status)} className="border-0">
                                  {item.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    Full Feedback from {selectedFeedback?.userEmail}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedFeedback?.feedbackText}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setIsDetailModalOpen(false)}>
                    Close
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

export default FeedbackSubmissions;