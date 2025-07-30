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
import { questionTaxonomy } from "@/components/CreateQuestionModal";

// Question interface based on taxonomy structure
interface Question {
  id: string;
  text: string;
  category: string;
  subcategory: string;
  scope: "General" | "Industry-Specific";
  indexCode: "FPA" | "EEA";
  industry?: string;
}

// Sample questions data organized according to the questionTaxonomy
const questionsData: Record<"FPA" | "EEA", Record<"General" | "Industry-Specific", Question[]>> = {
  FPA: {
    General: [
      // Problem-Solution Fit & Market Validation
      {
        id: "fpa-gen-1",
        text: "Which of the following best defines a 'problem worth solving'?",
        category: "Problem-Solution Fit & Market Validation",
        subcategory: "Market Research",
        scope: "General",
        indexCode: "FPA"
      },
      {
        id: "fpa-gen-2", 
        text: "What is the primary purpose of customer discovery interviews?",
        category: "Problem-Solution Fit & Market Validation",
        subcategory: "Customer Discovery",
        scope: "General",
        indexCode: "FPA"
      },
      {
        id: "fpa-gen-3",
        text: "Which characteristic is most important for a minimum viable product (MVP)?",
        category: "Problem-Solution Fit & Market Validation",
        subcategory: "MVP Development",
        scope: "General",
        indexCode: "FPA"
      },
      // Business Model & Revenue Strategy
      {
        id: "fpa-gen-4",
        text: "Match each revenue model with the typical product or service.",
        category: "Business Model & Revenue Strategy", 
        subcategory: "Revenue Models",
        scope: "General",
        indexCode: "FPA"
      },
      {
        id: "fpa-gen-5",
        text: "For a B2B SaaS startup, which is the most effective go-to-market strategy?",
        category: "Business Model & Revenue Strategy",
        subcategory: "Market Entry",
        scope: "General",
        indexCode: "FPA"
      },
      // Product Development & Technology
      {
        id: "fpa-gen-6",
        text: "A core principle of Agile software development is...",
        category: "Product Development & Technology",
        subcategory: "Development Process",
        scope: "General",
        indexCode: "FPA"
      },
      // Team Building & Leadership
      {
        id: "fpa-gen-7",
        text: "Which option represents the most balanced founding-team?",
        category: "Team Building & Leadership",
        subcategory: "Team Formation",
        scope: "General",
        indexCode: "FPA"
      },
      {
        id: "fpa-gen-8",
        text: "After multiple rejections from investors, which response is most productive?",
        category: "Team Building & Leadership",
        subcategory: "Leadership Skills",
        scope: "General",
        indexCode: "FPA"
      },
      // Financial Management & Fundraising
      {
        id: "fpa-gen-9",
        text: "Which unit-economic metric is most critical for a SaaS startup?",
        category: "Financial Management & Fundraising",
        subcategory: "Financial Planning",
        scope: "General",
        indexCode: "FPA"
      },
      // Legal & IP
      {
        id: "fpa-gen-10",
        text: "Which legal-entity type is most common for startups?",
        category: "Legal & IP",
        subcategory: "Legal Structure",
        scope: "General",
        indexCode: "FPA"
      },
      // Strategy & Vision
      {
        id: "fpa-gen-11",
        text: "Which framework is most commonly used for goal-setting?",
        category: "Strategy & Vision",
        subcategory: "Goal Setting",
        scope: "General",
        indexCode: "FPA"
      }
    ],
    "Industry-Specific": [
      // Industry Trends & Future of Work
      {
        id: "fpa-ind-1",
        text: "What is the most significant emerging trend affecting HR technology in 2024?",
        category: "Industry Trends & Future of Work",
        subcategory: "Emerging Trends",
        scope: "Industry-Specific",
        indexCode: "FPA",
        industry: "HR Tech"
      },
      // Ecosystem & Market Specifics
      {
        id: "fpa-ind-2",
        text: "What is a unique characteristic of the Dutch labor market?",
        category: "Ecosystem & Market Specifics",
        subcategory: "Market Analysis",
        scope: "Industry-Specific",
        indexCode: "FPA",
        industry: "HR Tech"
      },
      {
        id: "fpa-ind-3", 
        text: "Match the Dutch employment-law concept with its primary implication.",
        category: "Ecosystem & Market Specifics",
        subcategory: "Industry Dynamics",
        scope: "Industry-Specific",
        indexCode: "FPA",
        industry: "HR Tech"
      },
      // Product & Technology Vision
      {
        id: "fpa-ind-4",
        text: "How can HR tech facilitate the shift toward 'skills-based organizations'?",
        category: "Product & Technology Vision",
        subcategory: "Product Innovation",
        scope: "Industry-Specific",
        indexCode: "FPA",
        industry: "HR Tech"
      },
      {
        id: "fpa-ind-5",
        text: "Why is a well-designed UX especially critical for HR technology?",
        category: "Product & Technology Vision", 
        subcategory: "Technical Vision",
        scope: "Industry-Specific",
        indexCode: "FPA",
        industry: "HR Tech"
      },
      // Business Model & Go-to-Market Strategy
      {
        id: "fpa-ind-6",
        text: "Which customer segment offers the most practical initial opportunity for market entry?",
        category: "Business Model & Go-to-Market Strategy",
        subcategory: "Market Strategy",
        scope: "Industry-Specific",
        indexCode: "FPA",
        industry: "HR Tech"
      }
    ]
  },
  EEA: {
    General: [
      // Quantity and Quality of Startups
      {
        id: "eea-gen-1",
        text: "Which factor most significantly indicates a high-quality startup ecosystem?",
        category: "Quantity and Quality of Startups",
        subcategory: "Startup Success Rate",
        scope: "General",
        indexCode: "EEA"
      },
      {
        id: "eea-gen-2",
        text: "What metric best measures innovation level in a startup ecosystem?",
        category: "Quantity and Quality of Startups",
        subcategory: "Innovation Level",
        scope: "General",
        indexCode: "EEA"
      },
      // Availability of Funding and Investment
      {
        id: "eea-gen-3",
        text: "Which type of investor typically provides the most value beyond capital?",
        category: "Availability of Funding and Investment",
        subcategory: "Angel Investors",
        scope: "General",
        indexCode: "EEA"
      },
      // Culture and Mindset
      {
        id: "eea-gen-4",
        text: "What cultural factor most encourages entrepreneurship in a region?",
        category: "Culture and Mindset",
        subcategory: "Entrepreneurial Culture",
        scope: "General",
        indexCode: "EEA"
      }
    ],
    "Industry-Specific": [
      // Talent and Human Capital
      {
        id: "eea-ind-1",
        text: "Which educational institution factor most contributes to startup success?",
        category: "Talent and Human Capital",
        subcategory: "Educational Institutions",
        scope: "Industry-Specific",
        indexCode: "EEA"
      },
      // Support Systems and Infrastructure
      {
        id: "eea-ind-2",
        text: "What is the most important service an incubator should provide?",
        category: "Support Systems and Infrastructure",
        subcategory: "Incubators and Accelerators",
        scope: "Industry-Specific",
        indexCode: "EEA"
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
  
  // Get available questions based on index code and scope
  const availableQuestions = currentQuestionnaire?.indexCode ? questionsData[currentQuestionnaire.indexCode as keyof typeof questionsData] : null;

  // Helper functions to organize questions by taxonomy hierarchy
  const organizeQuestionsByTaxonomy = (questions: Question[], indexCode: string, scope: "General" | "Industry-Specific") => {
    const organized: { [category: string]: { [subcategory: string]: Question[] } } = {};
    const taxonomy = questionTaxonomy[indexCode as keyof typeof questionTaxonomy]?.[scope] || {};
    
    // Initialize structure from taxonomy
    Object.entries(taxonomy).forEach(([category, subcategories]) => {
      organized[category] = {};
      (subcategories as string[]).forEach(subcategory => {
        organized[category][subcategory] = [];
      });
    });
    
    // Place questions in the organized structure
    questions.forEach(question => {
      if (organized[question.category] && organized[question.category][question.subcategory]) {
        organized[question.category][question.subcategory].push(question);
      }
    });
    
    return organized;
  };

  const organizeSelectedQuestions = () => {
    const organized: { [category: string]: { [subcategory: string]: Question[] } } = {};
    
    selectedQuestions.forEach(question => {
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

  // Initialize questions for edit mode
  useEffect(() => {
    if (questionnaireData?.mode === 'edit' && questionnaireData?.questionnaire?.selectedQuestions) {
      const questionTexts = questionnaireData.questionnaire.selectedQuestions;
      const questions: Question[] = [];
      
      // Convert question texts back to Question objects
      questionTexts.forEach((text: string) => {
        // Search through all questions to find matches
        if (availableQuestions) {
          [...availableQuestions.General, ...availableQuestions["Industry-Specific"]].forEach(question => {
            if (question.text === text) {
              questions.push(question);
            }
          });
        }
      });
      
      setSelectedQuestions(questions);
      
      // Count general and industry questions
      let generalCnt = 0;
      let industryCnt = 0;
      questions.forEach((question: Question) => {
        if (question.scope === "General") {
          generalCnt++;
        } else {
          industryCnt++;
        }
      });
      setGeneralCount(generalCnt);
      setIndustryCount(industryCnt);
    }
  }, [questionnaireData, availableQuestions]);

  const addQuestion = (question: Question) => {
    const type = question.scope === "General" ? 'general' : 'industry';
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
    const isGeneral = question.scope === "General";
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

    if (!availableQuestions) {

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid questionnaire configuration</h2>
            <Button onClick={() => navigate('/questionnaires/management')}>
              Back to Management
            </Button>
          </div>
        </div>
      );
    }

    const generalQuestions = availableQuestions.General || [];
    const industryQuestions = availableQuestions["Industry-Specific"] || [];

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
                  
                  <CardContent className="flex-1 overflow-hidden">
                    <div className="overflow-y-auto h-full">
                      <Accordion type="multiple" className="w-full">
                        {/* General Questions Section */}
                        <AccordionItem value="general-section">
                          <AccordionTrigger className="text-base font-semibold">
                            General Questions ({generalCount}/{limits.general})
                          </AccordionTrigger>
                          <AccordionContent>
                            <Accordion type="multiple" className="w-full pl-4">
                              {Object.entries(organizeQuestionsByTaxonomy(generalQuestions, currentQuestionnaire.indexCode, "General")).map(([category, subcategories]) => (
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
                                                    onClick={() => addQuestion(question)}
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
                          </AccordionContent>
                        </AccordionItem>

                        {/* Industry-Specific Questions Section */}
                        {industryQuestions.length > 0 && (
                          <AccordionItem value="industry-section">
                            <AccordionTrigger className="text-base font-semibold">
                              Industry-Specific Questions ({industryCount}/{limits.industrySpecific})
                            </AccordionTrigger>
                            <AccordionContent>
                              <Accordion type="multiple" className="w-full pl-4">
                                {Object.entries(organizeQuestionsByTaxonomy(industryQuestions, currentQuestionnaire.indexCode, "Industry-Specific")).map(([category, subcategories]) => (
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
                                                      onClick={() => addQuestion(question)}
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
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    </div>
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
                      <div className="overflow-y-auto h-full">
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