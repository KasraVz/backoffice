import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const mockQuestions = [
  {
    id: 1,
    text: "What is your current burn rate and how many months of runway do you have?",
    feedback: { type: "upvote", comment: null },
    reviewer: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    text: "How do you plan to achieve product-market fit in the next 12 months?",
    feedback: { type: "neutral", comment: "Consider adding more specific metrics for measuring product-market fit. The timeframe should be flexible based on the startup's current stage." },
    reviewer: "Dr. Sarah Johnson"
  },
  {
    id: 3,
    text: "What are your key performance indicators for growth?",
    feedback: { type: "downvote", comment: null },
    reviewer: "Dr. Sarah Johnson"
  },
  {
    id: 4,
    text: "Describe your customer acquisition strategy and cost per acquisition.",
    feedback: { type: "upvote", comment: null },
    reviewer: "Dr. Sarah Johnson"
  },
  {
    id: 5,
    text: "How do you plan to scale your team in the next 6 months?",
    feedback: { type: "neutral", comment: "This question should include budget considerations and role prioritization framework." },
    reviewer: "Dr. Sarah Johnson"
  }
];

const mockReviewSets = {
  "101": {
    id: "101",
    assignedTo: "Dr. Sarah Johnson",
    description: "FPA - General - Finance - Pre-seed",
    status: "Completed"
  },
  "102": {
    id: "102", 
    assignedTo: "Prof. Michael Chen",
    description: "EEA - HR Tech - Early Stage",
    status: "In Progress"
  },
  "103": {
    id: "103",
    assignedTo: "Dr. Emily Rodriguez",
    description: "TDA - HealthTech - Seed",
    status: "Completed"
  }
};

const ReviewSetDetails = () => {
  const { setId } = useParams();
  const navigate = useNavigate();
  
  const reviewSet = mockReviewSets[setId as keyof typeof mockReviewSets];
  
  if (!reviewSet) {
    return <div>Review set not found</div>;
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "upvote":
        return <ThumbsUp className="h-5 w-5 text-green-600" />;
      case "downvote":
        return <ThumbsDown className="h-5 w-5 text-red-600" />;
      case "neutral":
        return <Minus className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getFeedbackBadge = (type: string) => {
    switch (type) {
      case "upvote":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Upvoted</Badge>;
      case "downvote":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Downvoted</Badge>;
      case "neutral":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Neutral</Badge>;
      default:
        return <Badge variant="outline">No Feedback</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/partners/operational/review-dashboard")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-semibold">Review Details</h1>
          </header>
          <main className="flex-1 p-8 bg-gray-50 mx-[27px]">
            <div className="max-w-4xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Review Details for Set #{reviewSet.id} - {reviewSet.assignedTo}
                </h2>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{reviewSet.description}</Badge>
                  <Badge variant={reviewSet.status === "Completed" ? "default" : "secondary"}>
                    {reviewSet.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {mockQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-relaxed pr-4">
                          {question.text}
                        </CardTitle>
                        <div className="flex flex-col items-end gap-2">
                          {getFeedbackIcon(question.feedback.type)}
                          {getFeedbackBadge(question.feedback.type)}
                        </div>
                      </div>
                    </CardHeader>
                    {question.feedback.comment && (
                      <CardContent>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-800 mb-2">Faculty Comment:</h4>
                          <p className="text-yellow-700">{question.feedback.comment}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg border">
                <h3 className="font-semibold mb-2">Review Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {mockQuestions.filter(q => q.feedback.type === "upvote").length}
                    </div>
                    <div className="text-muted-foreground">Upvoted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {mockQuestions.filter(q => q.feedback.type === "neutral").length}
                    </div>
                    <div className="text-muted-foreground">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {mockQuestions.filter(q => q.feedback.type === "downvote").length}
                    </div>
                    <div className="text-muted-foreground">Downvoted</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReviewSetDetails;