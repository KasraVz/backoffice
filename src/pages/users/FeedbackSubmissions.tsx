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
    user: "john.smith@example.com",
    userName: "John Smith",
    submittedDate: "2024-03-10",
    content: "The question about derivatives was confusing. The wording could be clearer.",
    context: "Question ID: Q-FPA-001",
    contextType: "Question",
    status: "New",
    priority: "Medium",
    category: "Content Quality"
  },
  {
    id: "2",
    user: "sarah.j@example.com",
    userName: "Sarah Johnson",
    submittedDate: "2024-03-09",
    content: "Love the new user interface! Much easier to navigate between sections.",
    context: "User Interface",
    contextType: "Platform",
    status: "Acknowledged",
    priority: "Low",
    category: "UI/UX"
  },
  {
    id: "3",
    user: "m.wilson@example.com",
    userName: "Mike Wilson",
    submittedDate: "2024-03-08",
    content: "Assessment timer seems to be running too fast. Lost 5 minutes somehow.",
    context: "FPA General Knowledge Assessment",
    contextType: "Assessment",
    status: "Under Review",
    priority: "High",
    category: "Technical Issue"
  },
  {
    id: "4",
    user: "emma.davis@example.com",
    userName: "Emma Davis",
    submittedDate: "2024-03-07",
    content: "Would love to see more practice questions for portfolio management topics.",
    context: "Portfolio Management Module",
    contextType: "Content",
    status: "Resolved",
    priority: "Medium",
    category: "Feature Request"
  },
  {
    id: "5",
    user: "d.brown@example.com",
    userName: "David Brown",
    submittedDate: "2024-03-06",
    content: "Mobile app crashes when trying to save progress during assessments.",
    context: "Mobile Application",
    contextType: "Platform",
    status: "New",
    priority: "High",
    category: "Technical Issue"
  },
];

const statusOptions = ["New", "Acknowledged", "Under Review", "Resolved", "No Action Needed"];
const priorityOptions = ["Low", "Medium", "High", "Critical"];
const categoryOptions = ["Content Quality", "UI/UX", "Technical Issue", "Feature Request", "Other"];

const FeedbackSubmissions = () => {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<typeof mockFeedback[0] | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.context.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
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
      case "Acknowledged": return "secondary";
      case "Under Review": return "outline";
      case "Resolved": return "default";
      case "No Action Needed": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "outline";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
      case "High":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const openDetailModal = (feedbackItem: typeof mockFeedback[0]) => {
    setSelectedFeedback(feedbackItem);
    setIsDetailModalOpen(true);
  };

  const newFeedbackCount = feedback.filter(item => item.status === "New").length;
  const underReviewCount = feedback.filter(item => item.status === "Under Review").length;
  const highPriorityCount = feedback.filter(item => item.priority === "High" || item.priority === "Critical").length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Feedback Submissions</h1>
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
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highPriorityCount}</div>
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
                <CardTitle>Feedback Inbox</CardTitle>
                <p className="text-muted-foreground">
                  Manage and respond to user feedback submissions
                </p>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search feedback content, user, or context..."
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
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="max-w-[180px]">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Feedback Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead>Context</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.userName}</p>
                            <p className="text-sm text-muted-foreground">{item.user}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.submittedDate}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate">{item.content}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {item.contextType === "Question" && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/questionnaires/assessment-bank`}>
                                  <ExternalLink className="mr-1 h-3 w-3" />
                                  {item.context}
                                </Link>
                              </Button>
                            )}
                            {item.contextType !== "Question" && (
                              <span className="text-sm">{item.context}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(item.priority)} className="flex items-center gap-1 w-fit">
                            {getPriorityIcon(item.priority)}
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailModal(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
                  <DialogTitle>Feedback Details</DialogTitle>
                  <DialogDescription>
                    Review and manage this feedback submission
                  </DialogDescription>
                </DialogHeader>
                {selectedFeedback && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Submitted By</Label>
                        <p className="text-sm">{selectedFeedback.userName}</p>
                        <p className="text-xs text-muted-foreground">{selectedFeedback.user}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Date Submitted</Label>
                        <p className="text-sm">{selectedFeedback.submittedDate}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm">{selectedFeedback.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Context</Label>
                        <p className="text-sm">{selectedFeedback.context}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Feedback Content</Label>
                      <div className="mt-1 p-3 bg-muted/50 rounded border">
                        <p className="text-sm">{selectedFeedback.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <Label className="text-sm font-medium">Priority</Label>
                        <Badge variant={getPriorityVariant(selectedFeedback.priority)} className="ml-2">
                          {selectedFeedback.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={getStatusVariant(selectedFeedback.status)} className="ml-2">
                          {selectedFeedback.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
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