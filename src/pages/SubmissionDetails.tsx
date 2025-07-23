import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

// Mock submission data
const mockSubmissionData = {
  9501: {
    id: 9501,
    userName: "Priya Sharma",
    userEmail: "priya.s@example.com",
    questionnaireName: "FPA - Seed Stage v1.3",
    dateSubmitted: "July 22, 2025, 10:30 AM",
    finalScore: "88/100",
    answers: [
      {
        questionNumber: 1,
        questionText: "When a key feature launch is delayed, what is the best course of action?",
        choices: [
          { text: "Immediately inform all stakeholders and provide a revised timeline.", weight: 1, isCorrect: true },
          { text: "Increase team overtime to meet the original deadline.", weight: 0, isCorrect: false },
          { text: "Launch the feature with reduced functionality.", weight: 0.5, isCorrect: false },
          { text: "Cancel the feature entirely to focus on other priorities.", weight: 0, isCorrect: false }
        ],
        userSelectedIndex: 0,
        scoreAwarded: 1.0,
        maxScore: 1.0,
        behavioralCode: "Resilience"
      },
      {
        questionNumber: 2,
        questionText: "Is validating market fit before building an MVP essential?",
        choices: [
          { text: "True - Market validation is critical before development.", weight: 1, isCorrect: true },
          { text: "False - Building first allows for faster iteration.", weight: 0, isCorrect: false }
        ],
        userSelectedIndex: 0,
        scoreAwarded: 1.0,
        maxScore: 1.0,
        behavioralCode: "Strategic Thinking"
      },
      {
        questionNumber: 3,
        questionText: "How should a startup prioritize feature development?",
        choices: [
          { text: "Focus on features that generate immediate revenue.", weight: 0.5, isCorrect: false },
          { text: "Prioritize based on user feedback and data analysis.", weight: 1, isCorrect: true },
          { text: "Build features that competitors don't have.", weight: 0, isCorrect: false },
          { text: "Develop the most technically challenging features first.", weight: 0, isCorrect: false }
        ],
        userSelectedIndex: 0,
        scoreAwarded: 0.5,
        maxScore: 1.0,
        behavioralCode: "Strategic Thinking"
      }
    ]
  }
};

export default function SubmissionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const submissionId = parseInt(id || "9501");
  const submission = mockSubmissionData[submissionId as keyof typeof mockSubmissionData];

  if (!submission) {
    return <div>Submission not found</div>;
  }

  const handleExportPDF = () => {
    // PDF export logic would go here
    console.log("Exporting submission to PDF...");
  };

  const getChoiceBackgroundColor = (choice: any, isUserSelected: boolean) => {
    if (!isUserSelected) return "";
    
    if (choice.weight === 1) return "bg-green-100 border-green-300";
    if (choice.weight > 0 && choice.weight < 1) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  const getScoreIcon = (scoreAwarded: number, maxScore: number) => {
    if (scoreAwarded === maxScore) {
      return <Check className="h-4 w-4 text-green-600" />;
    }
    return <X className="h-4 w-4 text-red-600" />;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6">
            <SidebarTrigger className="mr-4" />
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <button
                onClick={() => navigate('/questionnaires/submission-review')}
                className="hover:text-foreground flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                User Submission Review
              </button>
              <span>/</span>
              <span>Submission #{submission.id}</span>
            </div>
            
            <div className="ml-auto">
              <Button onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-background">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-6">
              Submission Details: {submission.userName} - {submission.questionnaireName}
            </h1>

            {/* Summary Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">User Name</div>
                    <div className="text-lg">{submission.userName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">User Email</div>
                    <div className="text-lg">{submission.userEmail}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Questionnaire Taken</div>
                    <div className="text-lg">{submission.questionnaireName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Date Submitted</div>
                    <div className="text-lg">{submission.dateSubmitted}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Final Score</div>
                    <div className="text-lg font-bold text-green-600">{submission.finalScore}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answers List */}
            <div className="space-y-6">
              {submission.answers.map((answer) => (
                <Card key={answer.questionNumber} className="border">
                  <CardContent className="p-6">
                    {/* Question Header */}
                    <h3 className="text-lg font-bold mb-4">
                      Question {answer.questionNumber}: {answer.questionText}
                    </h3>

                    {/* Answer Choices */}
                    <div className="space-y-3 mb-4">
                      {answer.choices.map((choice, index) => {
                        const isUserSelected = index === answer.userSelectedIndex;
                        const isCorrect = choice.isCorrect;
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "p-3 border rounded-lg flex items-center justify-between",
                              getChoiceBackgroundColor(choice, isUserSelected),
                              isUserSelected && "border-2"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                {choice.text}
                              </div>
                              {isCorrect && (
                                <Check className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            
                            {/* Detailed Feedback for User's Selection */}
                            {isUserSelected && (
                              <div className="ml-4 border-l-2 border-gray-300 pl-4">
                                <div className="text-sm space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">Your Answer:</span>
                                    {getScoreIcon(answer.scoreAwarded, answer.maxScore)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Score Awarded:</span>
                                    <span className="ml-1">
                                      {answer.scoreAwarded.toFixed(1)} / {answer.maxScore.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Behavioral Code Tag */}
                    <div className="flex justify-end">
                      <Badge variant="secondary">
                        Behavioral Code: {answer.behavioralCode}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}