import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { X, GripVertical } from "lucide-react";

// Hierarchical questions data with categories and subcategories
interface Question {
  id: string;
  text: string;
  category: string;
  subcategory: string;
}

const questionsData = {
  general: [
    // Problem-Solution Fit & Market Validation
    {
      id: "gen-1",
      text: "Which of the following best defines a 'problem worth solving'?",
      category: "Problem-Solution Fit & Market Validation",
      subcategory: "Market Research"
    },
    {
      id: "gen-2", 
      text: "What is the primary purpose of a startup's vision statement?",
      category: "Problem-Solution Fit & Market Validation",
      subcategory: "Customer Discovery"
    },
    // Business Model & Revenue Strategy
    {
      id: "gen-3",
      text: "Match each revenue model with the typical product or service.",
      category: "Business Model & Revenue Strategy", 
      subcategory: "Revenue Models"
    },
    {
      id: "gen-4",
      text: "For a B2B SaaS startup, which is the most effective go-to-market strategy?",
      category: "Business Model & Revenue Strategy",
      subcategory: "Market Entry"
    },
    // Product Development & Technology
    {
      id: "gen-5",
      text: "A core principle of Agile software development is...",
      category: "Product Development & Technology",
      subcategory: "Development Process"
    },
    // Team Building & Leadership
    {
      id: "gen-6",
      text: "Which option represents the most balanced founding-team?",
      category: "Team Building & Leadership",
      subcategory: "Team Formation"
    },
    {
      id: "gen-7",
      text: "After multiple rejections from investors, which response is most productive?",
      category: "Team Building & Leadership",
      subcategory: "Leadership Skills"
    },
    // Financial Management & Fundraising
    {
      id: "gen-8",
      text: "Which unit-economic metric is most critical for a SaaS startup?",
      category: "Financial Management & Fundraising",
      subcategory: "Financial Planning"
    },
    // Legal & IP
    {
      id: "gen-9",
      text: "Which legal-entity type is most common for startups?",
      category: "Legal & IP",
      subcategory: "Legal Structure"
    },
    // Strategy & Vision
    {
      id: "gen-10",
      text: "Which framework is most commonly used for goal-setting?",
      category: "Strategy & Vision",
      subcategory: "Goal Setting"
    }
  ],
  industrySpecific: {
    "HR Tech": [
      {
        id: "hr-1",
        text: "What is a unique characteristic of the Dutch labor market?",
        category: "Ecosystem & Market Specifics",
        subcategory: "Market Analysis"
      },
      {
        id: "hr-2", 
        text: "Match the Dutch employment-law concept with its primary implication.",
        category: "Ecosystem & Market Specifics",
        subcategory: "Industry Dynamics"
      },
      {
        id: "hr-3",
        text: "Which emerging technological trend is most impactful for HR?",
        category: "Industry Trends & Future of Work",
        subcategory: "Emerging Trends"
      },
      {
        id: "hr-4",
        text: "How can HR tech facilitate the shift toward 'skills-based organizations'?",
        category: "Product & Technology Vision",
        subcategory: "Product Innovation"
      },
      {
        id: "hr-5",
        text: "Why is a well-designed UX especially critical for HR technology?",
        category: "Product & Technology Vision", 
        subcategory: "Technical Vision"
      },
      {
        id: "hr-6",
        text: "Which customer segment offers the most practical initial opportunity for market entry?",
        category: "Business Model & Go-to-Market Strategy",
        subcategory: "Market Strategy"
      },
      {
        id: "hr-7",
        text: "Match the pricing model with the HR-tech solution it is best suited for.",
        category: "Business Model & Go-to-Market Strategy",
        subcategory: "Business Model Innovation"
      },
      {
        id: "hr-8",
        text: "What is the most compelling evidence of strong problem-solution fit for an HR-tech idea?",
        category: "Founder & Team Vision",
        subcategory: "Founder Vision"
      }
    ],
    "Fintech": [
      {
        id: "fin-1",
        text: "What is the most critical regulatory consideration for fintech startups?",
        category: "Ecosystem & Market Specifics",
        subcategory: "Industry Dynamics"
      },
      {
        id: "fin-2",
        text: "Which payment processing model offers the best scalability?",
        category: "Product & Technology Vision",
        subcategory: "Technology Roadmap"
      },
      {
        id: "fin-3",
        text: "How do KYC requirements impact fintech product development?",
        category: "Product & Technology Vision",
        subcategory: "Product Innovation"
      },
      {
        id: "fin-4",
        text: "What is the primary challenge in achieving financial inclusion through technology?",
        category: "Business Model & Go-to-Market Strategy",
        subcategory: "Market Strategy"
      }
    ],
    "Healthtech": [
      {
        id: "health-1",
        text: "What is the most important compliance requirement for healthcare technology?",
        category: "Ecosystem & Market Specifics",
        subcategory: "Industry Dynamics"
      },
      {
        id: "health-2",
        text: "Which data privacy regulation has the greatest impact on healthtech startups?",
        category: "Ecosystem & Market Specifics",
        subcategory: "Market Analysis"
      },
      {
        id: "health-3",
        text: "How do clinical validation requirements affect product development timelines?",
        category: "Product & Technology Vision",
        subcategory: "Product Innovation"
      },
      {
        id: "health-4",
        text: "What is the key to successful adoption of healthtech solutions by medical professionals?",
        category: "Business Model & Go-to-Market Strategy",
        subcategory: "Launch Strategy"
      }
    ]
  }
};

// Question limits by index code
const questionLimits = {
  FPA: { general: 50, industrySpecific: 25 },
  EEA: { general: 20, industrySpecific: 20 }
};

export default function QuestionnaireBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
  const questionnaireData = location.state;
  
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [generalCount, setGeneralCount] = useState(0);
  const [industryCount, setIndustryCount] = useState(0);

  // Get the correct questionnaire data based on mode
  const currentQuestionnaire = questionnaireData?.mode === 'edit' ? questionnaireData.questionnaire : questionnaireData;

  // Get question limits based on index code
  const limits = questionLimits[currentQuestionnaire?.indexCode as keyof typeof questionLimits] || { general: 50, industrySpecific: 25 };
  
  // Get industry-specific questions
  const industryQuestions = currentQuestionnaire?.industry && currentQuestionnaire.industry !== "General" && currentQuestionnaire.industry !== "None (General)"
    ? questionsData.industrySpecific[currentQuestionnaire.industry as keyof typeof questionsData.industrySpecific] || []
    : [];

  // Helper functions to organize questions by hierarchy
  const organizeQuestionsByCategory = (questions: Question[]) => {
    const organized: { [category: string]: { [subcategory: string]: Question[] } } = {};
    
    questions.forEach(question => {
      if (!organized[question.category]) {
        organized[question.category] = {};
      }
      if (!organized[question.category][question.subcategory]) {
        organized[question.category][question.subcategory] = [];
      }
      organized[question.category][question.subcategory].push(question);
    });
    
    return organized;
  };

  const organizeSelectedQuestions = () => {
    return organizeQuestionsByCategory(selectedQuestions);
  };

  // Initialize questions for edit mode
  useEffect(() => {
    if (questionnaireData?.mode === 'edit' && questionnaireData?.questionnaire?.selectedQuestions) {
      const questionTexts = questionnaireData.questionnaire.selectedQuestions;
      const questions: Question[] = [];
      
      // Convert question texts back to Question objects
      questionTexts.forEach((text: string) => {
        // Find in general questions
        const generalQuestion = questionsData.general.find(q => q.text === text);
        if (generalQuestion) {
          questions.push(generalQuestion);
          return;
        }
        
        // Find in industry questions
        Object.values(questionsData.industrySpecific).forEach(industryQuestions => {
          const industryQuestion = industryQuestions.find(q => q.text === text);
          if (industryQuestion) {
            questions.push(industryQuestion);
          }
        });
      });
      
      setSelectedQuestions(questions);
      
      // Count general and industry questions
      let generalCnt = 0;
      let industryCnt = 0;
      questions.forEach((question: Question) => {
        if (questionsData.general.some(q => q.id === question.id)) {
          generalCnt++;
        } else {
          industryCnt++;
        }
      });
      setGeneralCount(generalCnt);
      setIndustryCount(industryCnt);
    }
  }, [questionnaireData]);

  const addQuestion = (question: Question, type: 'general' | 'industry') => {
    if (type === 'general' && generalCount >= limits.general) return;
    if (type === 'industry' && industryCount >= limits.industrySpecific) return;
    
    setSelectedQuestions(prev => [...prev, question]);
    if (type === 'general') {
      setGeneralCount(prev => prev + 1);
    } else {
      setIndustryCount(prev => prev + 1);
    }
  };

  const removeQuestion = (index: number, question: Question) => {
    const isGeneral = questionsData.general.some(q => q.id === question.id);
    setSelectedQuestions(prev => prev.filter((_, i) => i !== index));
    if (isGeneral) {
      setGeneralCount(prev => Math.max(0, prev - 1));
    } else {
      setIndustryCount(prev => Math.max(0, prev - 1));
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedQuestions(items);
  };

  const handleSaveAndClose = () => {
    // Convert Question objects back to text strings for storage
    const questionTexts = selectedQuestions.map(q => q.text);
    
    // Create updated questionnaire data with selected questions
    if (questionnaireData?.mode === 'edit') {
      const updatedQuestionnaire = {
        ...questionnaireData.questionnaire,
        selectedQuestions: questionTexts,
        questions: selectedQuestions.length, // Update question count
        lastModified: new Date().toISOString().split('T')[0]
      };

      // Navigate back to management with the updated data
      navigate('/questionnaires/management', { 
        state: { 
          updatedQuestionnaire: updatedQuestionnaire
        } 
      });
    } else {
      // New questionnaire
      const newQuestionnaire = {
        ...questionnaireData,
        selectedQuestions: questionTexts,
        questions: selectedQuestions.length,
        lastModified: new Date().toISOString().split('T')[0]
      };

      navigate('/questionnaires/management', { 
        state: { 
          newQuestionnaire: newQuestionnaire
        } 
      });
    }
  };

  if (!questionnaireData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No questionnaire data found</h2>
          <Button onClick={() => navigate('/questionnaires/management')}>
            Back to Management
          </Button>
        </div>
      </div>
    );
  }


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Questionnaire Builder</h1>
                <p className="text-muted-foreground mt-1">{currentQuestionnaire.name}</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/questionnaires/management')}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveAndClose}>Save and Close</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* Left Panel: Available Questions */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Available Questions Bank</CardTitle>
                  
                  {/* Filter Context Display */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Showing questions matching:</p>
                     <div className="flex flex-wrap gap-2">
                       <Badge variant="secondary">Index: {currentQuestionnaire.indexCode}</Badge>
                       <Badge variant="secondary">Stage: {currentQuestionnaire.stage}</Badge>
                       {currentQuestionnaire.industry && currentQuestionnaire.industry !== "General" && currentQuestionnaire.industry !== "None (General)" && (
                         <Badge variant="secondary">Industry: {currentQuestionnaire.industry}</Badge>
                       )}
                     </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4">
                  {/* Section 1: General Questions */}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3 flex items-center justify-between">
                      General Questions
                      <span className="text-sm text-muted-foreground">
                        {generalCount >= limits.general ? 'Limit reached' : `${questionsData.general.length} available`}
                      </span>
                    </h3>
                    <div className="overflow-y-auto max-h-64">
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(organizeQuestionsByCategory(questionsData.general)).map(([category, subcategories]) => (
                          <AccordionItem key={category} value={category}>
                            <AccordionTrigger className="text-sm font-medium">
                              {category}
                            </AccordionTrigger>
                            <AccordionContent>
                              <Accordion type="multiple" className="w-full pl-4">
                                {Object.entries(subcategories).map(([subcategory, questions]) => (
                                  <AccordionItem key={subcategory} value={subcategory}>
                                    <AccordionTrigger className="text-xs">
                                      {subcategory}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="space-y-2">
                                        {questions.map((question) => (
                                          <div 
                                            key={question.id}
                                            className="flex items-center justify-between p-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                          >
                                            <div className="flex-1">
                                              <p className="text-sm">{question.text}</p>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => addQuestion(question, 'general')}
                                              disabled={generalCount >= limits.general || selectedQuestions.some(q => q.id === question.id)}
                                            >
                                              Add →
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>

                  <Separator />

                  {/* Section 2: Industry-Specific Questions */}
                   {currentQuestionnaire.industry && currentQuestionnaire.industry !== "General" && currentQuestionnaire.industry !== "None (General)" && (
                     <div className="flex-1">
                       <h3 className="font-semibold mb-3 flex items-center justify-between">
                         {currentQuestionnaire.industry}-Specific Questions
                         <span className="text-sm text-muted-foreground">
                           {industryCount >= limits.industrySpecific ? 'Limit reached' : `${industryQuestions.length} available`}
                         </span>
                       </h3>
                      <div className="overflow-y-auto max-h-64">
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(organizeQuestionsByCategory(industryQuestions)).map(([category, subcategories]) => (
                            <AccordionItem key={category} value={category}>
                              <AccordionTrigger className="text-sm font-medium">
                                {category}
                              </AccordionTrigger>
                              <AccordionContent>
                                <Accordion type="multiple" className="w-full pl-4">
                                  {Object.entries(subcategories).map(([subcategory, questions]) => (
                                    <AccordionItem key={subcategory} value={subcategory}>
                                      <AccordionTrigger className="text-xs">
                                        {subcategory}
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="space-y-2">
                                          {questions.map((question) => (
                                            <div 
                                              key={question.id}
                                              className="flex items-center justify-between p-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                            >
                                              <div className="flex-1">
                                                <p className="text-sm">{question.text}</p>
                                              </div>
                                              <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => addQuestion(question, 'industry')}
                                                disabled={industryCount >= limits.industrySpecific || selectedQuestions.some(q => q.id === question.id)}
                                              >
                                                Add →
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Right Panel: Selected Questions */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Building: {currentQuestionnaire.name}</CardTitle>
                  
                  {/* Question Limit Counters */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>General Questions:</span>
                      <span className={generalCount >= limits.general ? "text-red-500" : "text-foreground"}>
                        {generalCount} / {limits.general}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Industry-Specific Questions:</span>
                      <span className={industryCount >= limits.industrySpecific ? "text-red-500" : "text-foreground"}>
                        {industryCount} / {limits.industrySpecific}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Questions: {selectedQuestions.length}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-hidden">
                  {selectedQuestions.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                      <div>
                        <p className="text-lg mb-2">Add questions from the bank on the left to get started.</p>
                        <p className="text-sm">Questions can be reordered via drag-and-drop once added.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-y-auto">
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="selected-questions">
                          {(provided) => (
                            <div 
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-4"
                            >
                              <Accordion type="multiple" className="w-full" defaultValue={Object.keys(organizeSelectedQuestions())}>
                                {Object.entries(organizeSelectedQuestions()).map(([category, subcategories]) => (
                                  <AccordionItem key={category} value={category}>
                                    <AccordionTrigger className="text-sm font-medium">
                                      {category}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <Accordion type="multiple" className="w-full pl-4" defaultValue={Object.keys(subcategories)}>
                                        {Object.entries(subcategories).map(([subcategory, questions]) => (
                                          <AccordionItem key={subcategory} value={subcategory}>
                                            <AccordionTrigger className="text-xs">
                                              {subcategory}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              <div className="space-y-2">
                                                {questions.map((question, questionIndex) => {
                                                  const globalIndex = selectedQuestions.findIndex(q => q.id === question.id);
                                                  return (
                                                    <Draggable 
                                                      key={question.id} 
                                                      draggableId={question.id} 
                                                      index={globalIndex}
                                                    >
                                                      {(provided, snapshot) => (
                                                        <div
                                                          ref={provided.innerRef}
                                                          {...provided.draggableProps}
                                                          className={`flex items-center gap-3 p-3 border border-border rounded-lg bg-background transition-colors ${
                                                            snapshot.isDragging ? 'shadow-lg' : 'hover:bg-muted/50'
                                                          }`}
                                                        >
                                                          <div 
                                                            {...provided.dragHandleProps}
                                                            className="text-muted-foreground cursor-grab active:cursor-grabbing"
                                                          >
                                                            <GripVertical className="h-4 w-4" />
                                                          </div>
                                                          <div className="flex-1">
                                                            <p className="text-sm">{question.text}</p>
                                                          </div>
                                                          <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => removeQuestion(globalIndex, question)}
                                                            className="text-muted-foreground hover:text-destructive"
                                                          >
                                                            <X className="h-4 w-4" />
                                                          </Button>
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  );
                                                })}
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        ))}
                                      </Accordion>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}