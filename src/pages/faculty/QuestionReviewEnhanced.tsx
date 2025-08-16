import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Minus, AlertCircle, FileText, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type ReviewSetData, type ReviewSetCategory } from "@/services/promptCriteriaService";

interface Question {
  id: number;
  text: string;
  answers: string[];
  vote: 'upvote' | 'downvote' | 'neutral' | null;
  comment: string;
  category: string;
}

const QuestionReviewEnhanced = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [reviewSetData, setReviewSetData] = useState<ReviewSetData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Load review set data on component mount
  useEffect(() => {
    if (setId) {
      const storedData = localStorage.getItem(`reviewSet_${setId}`);
      if (storedData) {
        const data: ReviewSetData = JSON.parse(storedData);
        setReviewSetData(data);
        
        // Generate mock questions based on categories
        const generatedQuestions = generateQuestionsFromCategories(data.categories);
        setQuestions(generatedQuestions);
      } else {
        // Fallback to default data if no stored data found
        navigate('/faculty/dashboard');
      }
    }
  }, [setId, navigate]);

  // Generate mock questions for each category
  const generateQuestionsFromCategories = (categories: ReviewSetCategory[]): Question[] => {
    const questionTemplates = {
      "Financial Management": [
        "What is your current monthly burn rate, and how many months of runway do you have?",
        "How do you plan to achieve profitability?",
        "What is your customer acquisition cost (CAC) compared to lifetime value (LTV)?"
      ],
      "Human Resources": [
        "How do you plan to scale your team over the next 12 months?",
        "What is your current employee retention rate?",
        "How do you measure employee satisfaction and engagement?"
      ],
      "Marketing": [
        "What is your primary customer acquisition channel?",
        "How do you measure marketing ROI?",
        "What is your customer conversion rate from lead to purchase?"
      ],
      "Operations": [
        "What are your key operational metrics?",
        "How do you ensure quality control in your processes?",
        "What systems do you use for inventory management?"
      ]
    };

    let questionId = 1;
    const allQuestions: Question[] = [];

    categories.forEach(categoryData => {
      const templates = questionTemplates[categoryData.category as keyof typeof questionTemplates] || [
        `Sample question 1 for ${categoryData.category}`,
        `Sample question 2 for ${categoryData.category}`,
        `Sample question 3 for ${categoryData.category}`
      ];

      templates.forEach(template => {
        allQuestions.push({
          id: questionId++,
          text: template,
          answers: [
            "Option A - Strong position",
            "Option B - Moderate position", 
            "Option C - Needs improvement",
            "Option D - Significant concerns"
          ],
          vote: null,
          comment: "",
          category: categoryData.category
        });
      });
    });

    return allQuestions;
  };

  const handleVote = (questionId: number, vote: 'upvote' | 'downvote' | 'neutral') => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const updatedQuestion = { ...q, vote };
        // Clear comment if not neutral
        if (vote !== 'neutral') {
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
  const progressPercentage = questions.length > 0 ? (currentProgress / questions.length) * 100 : 0;

  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  if (!reviewSetData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading review set...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header with Review Set Info */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-6xl mx-auto p-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl text-blue-900">
                      {reviewSetData.questionnaireName} Review
                    </CardTitle>
                    <p className="text-sm text-blue-700 mt-1">
                      {reviewSetData.assessmentType} • {reviewSetData.stage} Stage • {reviewSetData.industry}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Users className="h-4 w-4" />
                  Assigned to: {reviewSetData.assigneeName}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold">Question Review Progress</h2>
            <span className="text-sm text-muted-foreground">
              {currentProgress} / {questions.length} Questions Reviewed
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full h-3" />
        </div>

        {/* Categories and Questions */}
        <div className="space-y-8">
          {reviewSetData.categories.map((categoryData, categoryIndex) => {
            const categoryQuestions = questionsByCategory[categoryData.category] || [];
            const categoryVotedQuestions = categoryQuestions.filter(q => q.vote).length;
            const categoryProgress = categoryQuestions.length > 0 ? (categoryVotedQuestions / categoryQuestions.length) * 100 : 0;

            return (
              <div key={categoryIndex} className="space-y-6">
                {/* Category Header with Prompt Criteria */}
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-amber-900 mb-2">
                          {categoryData.category} Review Instructions
                        </CardTitle>
                        <p className="text-amber-800 leading-relaxed">
                          {categoryData.promptCriterion?.promptText}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {categoryQuestions.length} Questions
                          </Badge>
                          <div className="flex-1 max-w-xs">
                            <Progress value={categoryProgress} className="h-2" />
                          </div>
                          <span className="text-sm text-amber-700">
                            {categoryVotedQuestions}/{categoryQuestions.length} Complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Questions for this Category */}
                <div className="space-y-6 ml-8">
                  {categoryQuestions.map((question) => (
                    <Card key={question.id} className="transition-all hover:shadow-lg border-l-4 border-l-amber-200">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {categoryData.category}
                          </Badge>
                          <CardTitle className="text-lg">Question {question.id}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3 text-gray-900">{question.text}</h4>
                          <div className="space-y-2">
                            {question.answers.map((answer, index) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-md border">
                                <span className="font-medium text-sm text-gray-700">Option {index + 1}:</span>
                                <span className="ml-2 text-gray-900">{answer}</span>
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
                              Approve
                            </Button>
                            <Button
                              variant={question.vote === 'downvote' ? 'destructive' : 'outline'}
                              onClick={() => handleVote(question.id, 'downvote')}
                              className="gap-2 flex-1"
                            >
                              <ThumbsDown className="h-4 w-4" />
                              Reject
                            </Button>
                            <Button
                              variant={question.vote === 'neutral' ? 'secondary' : 'outline'}
                              onClick={() => handleVote(question.id, 'neutral')}
                              className="gap-2 flex-1"
                            >
                              <Minus className="h-4 w-4" />
                              Needs Review
                            </Button>
                          </div>

                          {/* Comment Box - Show only when Neutral is selected */}
                          {question.vote === 'neutral' && (
                            <Textarea
                              placeholder="Please provide your suggestions or comments for improvement..."
                              value={question.comment}
                              onChange={(e) => handleCommentChange(question.id, e.target.value)}
                              rows={3}
                              className="border-orange-200 focus:border-orange-400"
                            />
                          )}

                          {/* Vote Status */}
                          {question.vote && (
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                question.vote === 'upvote' ? 'default' :
                                question.vote === 'downvote' ? 'destructive' : 'secondary'
                              }>
                                {question.vote === 'upvote' ? 'Approved' :
                                 question.vote === 'downvote' ? 'Rejected' : 'Needs Review'}
                              </Badge>
                              {question.vote === 'neutral' && question.comment && (
                                <span className="text-sm text-muted-foreground">
                                  Feedback provided
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-center">
          <Button 
            size="lg" 
            disabled={!allQuestionsVoted}
            className="px-12 py-3 text-base"
          >
            Submit Complete Review
          </Button>
        </div>

        {!allQuestionsVoted && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Please review all questions before submitting your feedback.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionReviewEnhanced;