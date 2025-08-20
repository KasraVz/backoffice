import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Minus, AlertCircle } from "lucide-react";
import { useState } from "react";

const mockPromptCriteria = {
  title: "Review Context",
  text: "Based on your expertise in Financial Management for Seed-stage startups, please review the following questions for clarity, relevance, and accuracy."
};

const mockQuestions = [
  {
    id: 1,
    text: "What is your current monthly burn rate, and how many months of runway do you have?",
    answers: [
      "Less than $10k/month, 12+ months runway",
      "$10k-$50k/month, 6-12 months runway", 
      "$50k-$100k/month, 3-6 months runway",
      "More than $100k/month, less than 3 months runway"
    ],
    vote: null,
    comment: ""
  },
  {
    id: 2,
    text: "How do you plan to achieve profitability?",
    answers: [
      "Within 6 months through existing revenue streams",
      "Within 12 months by scaling current operations",
      "Within 18-24 months through new product lines",
      "Beyond 24 months, focusing on growth first"
    ],
    vote: null,
    comment: ""
  },
  {
    id: 3,
    text: "What is your customer acquisition cost (CAC) compared to lifetime value (LTV)?",
    answers: [
      "LTV/CAC ratio > 3:1",
      "LTV/CAC ratio 2-3:1",
      "LTV/CAC ratio 1-2:1",
      "LTV/CAC ratio < 1:1"
    ],
    vote: null,
    comment: ""
  }
];

const QuestionReview = () => {
  const [questions, setQuestions] = useState(mockQuestions);
  const [currentProgress, setCurrentProgress] = useState(0);

  const handleVote = (questionId: number, vote: 'upvote' | 'downvote' | 'conditionally_approved') => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const updatedQuestion = { ...q, vote };
        // Clear comment if not conditionally approved
        if (vote !== 'conditionally_approved') {
          updatedQuestion.comment = '';
        }
        return updatedQuestion;
      }
      return q;
    }));

    // Update progress
    const votedQuestions = questions.filter(q => q.vote || q.id === questionId).length;
    setCurrentProgress(votedQuestions);
  };

  const handleCommentChange = (questionId: number, comment: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, comment } : q
    ));
  };

  const allQuestionsVoted = questions.every(q => q.vote);
  const progressPercentage = (currentProgress / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Prompt Criteria */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                {mockPromptCriteria.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-blue-800">{mockPromptCriteria.text}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Question Review Progress</h2>
            <span className="text-sm text-muted-foreground">
              {currentProgress} / {questions.length} Questions Reviewed
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>

        {/* Question List */}
        <div className="space-y-6">
          {questions.map((question) => (
            <Card key={question.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Question {question.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">{question.text}</h4>
                  <div className="space-y-2">
                    {question.answers.map((answer, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <span className="font-medium text-sm">Option {index + 1}:</span> {answer}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voting Actions */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button
                      variant={question.vote === 'upvote' ? 'default' : 'outline'}
                      onClick={() => handleVote(question.id, 'upvote')}
                      className="gap-2 flex-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Upvote
                    </Button>
                    <Button
                      variant={question.vote === 'downvote' ? 'destructive' : 'outline'}
                      onClick={() => handleVote(question.id, 'downvote')}
                      className="gap-2 flex-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Downvote
                    </Button>
                    <Button
                      variant={question.vote === 'conditionally_approved' ? 'secondary' : 'outline'}
                      onClick={() => handleVote(question.id, 'conditionally_approved')}
                      className="gap-2 flex-1"
                    >
                      <Minus className="h-4 w-4" />
                      Conditionally Approved
                    </Button>
                  </div>

                  {/* Comment Box - Show only when Conditionally Approved is selected */}
                  {question.vote === 'conditionally_approved' && (
                    <Textarea
                      placeholder="Please provide your suggestions or comments..."
                      value={question.comment}
                      onChange={(e) => handleCommentChange(question.id, e.target.value)}
                      rows={3}
                    />
                  )}

                  {/* Vote Status */}
                  {question.vote && (
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        question.vote === 'upvote' ? 'default' :
                        question.vote === 'downvote' ? 'destructive' : 'secondary'
                      }>
                        {question.vote === 'upvote' ? 'Upvoted' :
                         question.vote === 'downvote' ? 'Downvoted' : 'Conditionally Approved'}
                      </Badge>
                      {question.vote === 'conditionally_approved' && question.comment && (
                        <span className="text-sm text-muted-foreground">
                          Comment provided
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            disabled={!allQuestionsVoted}
            className="px-8"
          >
            Submit Completed Review
          </Button>
        </div>

        {!allQuestionsVoted && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Please vote on all questions before submitting your review.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionReview;