import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

const mockQuestionSets = [
  {
    id: "101",
    title: "FPA: Financial Management & Fundraising - Seed Stage",
    questionCount: 25,
    status: "Not Started",
    description: "Review questions related to financial planning and fundraising strategies for seed-stage startups."
  },
  {
    id: "102",
    title: "EEA: Human Resources - Series A",
    questionCount: 18,
    status: "In Progress",
    description: "Evaluate HR-related questions for Series A stage companies."
  },
  {
    id: "103",
    title: "TDA: Technology Development - Pre-seed",
    questionCount: 22,
    status: "Completed",
    description: "Questions focusing on technical development aspects for early-stage startups."
  }
];

const FacultyDashboard = () => {
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, Dr. Sharma</h1>
          <p className="text-muted-foreground mt-2">
            Review your assigned question sets and provide feedback to improve our assessment quality.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Assigned Question Sets for Review</h2>
        </div>

        <div className="grid gap-6">
          {mockQuestionSets.map((set) => (
            <Card key={set.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{set.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {set.questionCount} Questions
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(set.status)}
                        <Badge variant={getStatusColor(set.status)}>
                          {set.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="shrink-0"
                    disabled={set.status === "Completed"}
                  >
                    {getButtonText(set.status)}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{set.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockQuestionSets.length === 0 && (
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
    </div>
  );
};

export default FacultyDashboard;