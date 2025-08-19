import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, XCircle, AlertCircle, FileText, Users, ChevronRight, FolderOpen, Folder } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type ReviewSetData, type ReviewSetCategory } from "@/services/promptCriteriaService";
import { assessmentCategories } from "@/data/categories";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
interface Question {
  id: number;
  text: string;
  answers: string[];
  vote: 'approve' | 'reject' | 'neutral' | null;
  comment: string;
  category: string;
  scope: 'General' | 'Industry-Specific';
}
const QuestionReviewEnhanced = () => {
  const {
    setId
  } = useParams<{
    setId: string;
  }>();
  const navigate = useNavigate();
  const [reviewSetData, setReviewSetData] = useState<ReviewSetData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");

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
    // Get real categories from the assessment data
    const getQuestionTemplates = (assessmentType: string) => {
      const assessment = assessmentCategories[assessmentType as keyof typeof assessmentCategories];
      if (!assessment) return {};
      const templates: Record<string, string[]> = {};

      // Add templates for general categories
      assessment.general.forEach(category => {
        templates[category] = [`What is your approach to ${category.toLowerCase()}?`, `How do you measure success in ${category.toLowerCase()}?`, `What challenges have you faced in ${category.toLowerCase()}?`];
      });

      // Add templates for industry-specific categories
      assessment.industrySpecific.forEach(category => {
        templates[category] = [`How does ${category.toLowerCase()} impact your business?`, `What specific requirements do you have for ${category.toLowerCase()}?`, `How do you stay compliant with ${category.toLowerCase()}?`];
      });
      return templates;
    };
    const questionTemplates = getQuestionTemplates(reviewSetData?.assessmentType || 'FPA');
    let questionId = 1;
    const allQuestions: Question[] = [];

    // Get assessment type and determine scope for categories
    const assessmentType = reviewSetData?.assessmentType || 'FPA';
    const assessment = assessmentCategories[assessmentType as keyof typeof assessmentCategories];
    if (assessment) {
      // Add general categories
      assessment.general.forEach((category, index) => {
        const templates = questionTemplates[category] || [`Sample question 1 for ${category}`, `Sample question 2 for ${category}`, `Sample question 3 for ${category}`];
        templates.forEach(template => {
          allQuestions.push({
            id: questionId++,
            text: template,
            answers: ["Option A - Strong position", "Option B - Moderate position", "Option C - Needs improvement", "Option D - Significant concerns"],
            vote: null,
            comment: "",
            category: category,
            scope: 'General'
          });
        });
      });

      // Add industry-specific categories
      assessment.industrySpecific.forEach((category, index) => {
        const templates = questionTemplates[category] || [`Sample question 1 for ${category}`, `Sample question 2 for ${category}`, `Sample question 3 for ${category}`];
        templates.forEach(template => {
          allQuestions.push({
            id: questionId++,
            text: template,
            answers: ["Option A - Strong position", "Option B - Moderate position", "Option C - Needs improvement", "Option D - Significant concerns"],
            vote: null,
            comment: "",
            category: category,
            scope: 'Industry-Specific'
          });
        });
      });
    }
    return allQuestions;
  };
  const handleVote = (questionId: number, vote: 'approve' | 'reject' | 'neutral') => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const updatedQuestion = {
          ...q,
          vote
        };
        // Clear comment if approve (since it's optional)
        if (vote === 'approve') {
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
    setQuestions(prev => prev.map(q => q.id === questionId ? {
      ...q,
      comment
    } : q));
  };

  // Validation: Check if all questions are voted and comments are provided where required
  const allQuestionsValid = questions.every(q => {
    if (!q.vote) return false;
    // Comments required for reject and neutral
    if ((q.vote === 'reject' || q.vote === 'neutral') && !q.comment.trim()) return false;
    return true;
  });
  const progressPercentage = questions.length > 0 ? currentProgress / questions.length * 100 : 0;

  // Group questions by scope and then by category
  const questionsByScope = questions.reduce((acc, question) => {
    if (!acc[question.scope]) {
      acc[question.scope] = {};
    }
    if (!acc[question.scope][question.category]) {
      acc[question.scope][question.category] = [];
    }
    acc[question.scope][question.category].push(question);
    return acc;
  }, {} as Record<string, Record<string, Question[]>>);

  // Update current prompt when a question is selected
  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestionId(questionId);
    const question = questions.find(q => q.id === questionId);
    if (question && reviewSetData) {
      const categoryData = reviewSetData.categories.find(cat => cat.category === question.category);
      if (categoryData?.promptCriterion) {
        setCurrentPrompt(categoryData.promptCriterion.promptText);
      }
    }
  };

  // Get the selected question
  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
  if (!reviewSetData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading review set...</p>
          </CardContent>
        </Card>
      </div>;
  }
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-background border-b mx-[27px]">
            <div className="h-14 flex items-center px-6 mx-0">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-blue-900">
                    {reviewSetData.questionnaireName} Review
                  </h1>
                  <p className="text-sm text-blue-700 mt-1">
                    {reviewSetData.assessmentType} • {reviewSetData.stage} Stage • {reviewSetData.industry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800 ml-auto">
                <Users className="h-4 w-4" />
                Assigned to: {reviewSetData.assigneeName}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-background">
            <div className="max-w-7xl p-4 sm:p-6 md:p-8 mx-[28px]">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold">Question Review Progress</h2>
            <span className="text-sm text-muted-foreground">
              {currentProgress} / {questions.length} Questions Reviewed
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full h-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" defaultValue={["general", "industry-specific"]} className="w-full">
                  {Object.entries(questionsByScope).map(([scope, categories]) => <AccordionItem key={scope} value={scope.toLowerCase().replace(' ', '-')}>
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-2">
                          {scope === 'General' ? <FolderOpen className="h-4 w-4 text-blue-600" /> : <Folder className="h-4 w-4 text-purple-600" />}
                          <span className="font-medium">{scope}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {Object.values(categories).flat().length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(categories).map(([category, questions]) => <AccordionItem key={category} value={category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}>
                              <AccordionTrigger className="px-2 py-2 text-sm hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium text-muted-foreground">{category}</span>
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {questions.filter(q => q.vote).length}/{questions.length}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-2 pb-2">
                                <div className="space-y-1 ml-2">
                                  {questions.map(question => <button key={question.id} onClick={() => handleQuestionSelect(question.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${selectedQuestionId === question.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                                      <div className="flex items-center gap-2 flex-1">
                                        <span>Q{question.id}</span>
                                        {question.vote && (question.vote === 'approve' ? <CheckCircle className="h-3 w-3 text-green-500" /> : question.vote === 'reject' ? <XCircle className="h-3 w-3 text-red-500" /> : <AlertCircle className="h-3 w-3 text-yellow-500" />)}
                                      </div>
                                      <ChevronRight className="h-3 w-3" />
                                    </button>)}
                                </div>
                              </AccordionContent>
                            </AccordionItem>)}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Main Review Area */}
          <div className="lg:col-span-2">
            {selectedQuestion ? <div className="space-y-6">
                {/* Dynamic Prompt Display */}
                {currentPrompt && <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-1" />
                        <div>
                          <CardTitle className="text-lg text-amber-900 mb-2">
                            Review Instructions - {selectedQuestion.category}
                          </CardTitle>
                          <p className="text-amber-800 leading-relaxed">
                            {currentPrompt}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>}

                {/* Question Content */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {selectedQuestion.scope} - {selectedQuestion.category}
                      </Badge>
                      <CardTitle className="text-lg">Question {selectedQuestion.id}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 text-gray-900">{selectedQuestion.text}</h4>
                      <div className="space-y-2">
                        {selectedQuestion.answers.map((answer, index) => <div key={index} className="p-3 bg-gray-50 rounded-md border">
                            <span className="font-medium text-sm text-gray-700">Option {index + 1}:</span>
                            <span className="ml-2 text-gray-900">{answer}</span>
                          </div>)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provide Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Your Assessment</Label>
                      <RadioGroup value={selectedQuestion.vote || ''} onValueChange={value => handleVote(selectedQuestion.id, value as 'approve' | 'reject' | 'neutral')} className="mt-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="approve" id="approve" />
                          <Label htmlFor="approve" className="flex items-center gap-2 cursor-pointer">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Approve
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reject" id="reject" />
                          <Label htmlFor="reject" className="flex items-center gap-2 cursor-pointer">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Reject
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="neutral" id="neutral" />
                          <Label htmlFor="neutral" className="flex items-center gap-2 cursor-pointer">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            Neutral
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Conditional Comment Section */}
                    {(selectedQuestion.vote === 'reject' || selectedQuestion.vote === 'neutral') && <div>
                        <Label htmlFor="comment" className="text-base font-medium">
                          Comments <span className="text-red-500">*</span>
                        </Label>
                        <Textarea id="comment" placeholder="Please provide your feedback and suggestions..." value={selectedQuestion.comment} onChange={e => handleCommentChange(selectedQuestion.id, e.target.value)} rows={4} className="mt-2" required />
                        {(selectedQuestion.vote === 'reject' || selectedQuestion.vote === 'neutral') && !selectedQuestion.comment.trim() && <p className="text-sm text-red-600 mt-1">Comment is required for this assessment.</p>}
                      </div>}

                    {selectedQuestion.vote === 'approve' && <div>
                        <Label htmlFor="optional-comment" className="text-base font-medium">
                          Additional Comments <span className="text-gray-500">(Optional)</span>
                        </Label>
                        <Textarea id="optional-comment" placeholder="Any additional feedback or suggestions..." value={selectedQuestion.comment} onChange={e => handleCommentChange(selectedQuestion.id, e.target.value)} rows={3} className="mt-2" />
                      </div>}

                    {/* Vote Status */}
                    {selectedQuestion.vote && <div className="flex items-center gap-2 pt-2">
                        <Badge variant={selectedQuestion.vote === 'approve' ? 'default' : selectedQuestion.vote === 'reject' ? 'destructive' : 'secondary'}>
                          {selectedQuestion.vote === 'approve' ? 'Approved' : selectedQuestion.vote === 'reject' ? 'Rejected' : 'Neutral'}
                        </Badge>
                        {selectedQuestion.comment && <span className="text-sm text-muted-foreground">
                            Comment provided
                          </span>}
                      </div>}
                  </CardContent>
                </Card>
              </div> : <Card className="h-96 flex items-center justify-center">
                <CardContent>
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a question from the navigator to begin reviewing</p>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button size="lg" disabled={!allQuestionsValid} className="px-12 py-3 text-base">
            Submit Complete Review
          </Button>
        </div>

        {!allQuestionsValid && <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Please complete all questions with required feedback before submitting.</p>
            {questions.some(q => (q.vote === 'reject' || q.vote === 'neutral') && !q.comment.trim()) && <p className="text-red-600 mt-1">Comments are required for rejected or neutral assessments.</p>}
           </div>}
             </div>
           </div>
         </div>
       </div>
     </SidebarProvider>;
};
export default QuestionReviewEnhanced;