import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, X, Plus } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Mock data for available questions with enhanced filtering properties
const mockQuestions = [
  {
    id: "q1",
    title: "What is your company's current revenue?",
    type: "Multiple Choice",
    category: "Financial Management & Fundraising",
    subCategory: "Revenue Tracking",
    indexCode: "FPA",
    stage: "Pre-seed",
    scope: "General"
  },
  {
    id: "q2", 
    title: "How many employees does your company have?",
    type: "Number Input",
    category: "Team Building & Leadership",
    subCategory: "Team Size",
    indexCode: "FPA", 
    stage: "Seed",
    scope: "General"
  },
  {
    id: "q3",
    title: "Describe your business model",
    type: "Text Area",
    category: "Business Model & Revenue Strategy",
    subCategory: "Business Model Definition",
    indexCode: "FPA",
    stage: "Pre-seed",
    scope: "General"
  },
  {
    id: "q4",
    title: "What is your target market?",
    type: "Multiple Choice", 
    category: "Sales, Marketing & Customer Acquisition",
    subCategory: "Market Definition",
    indexCode: "FPA",
    stage: "Pre-seed",
    scope: "General"
  },
  {
    id: "q5",
    title: "Rate your team's technical expertise",
    type: "Rating Scale",
    category: "Team Building & Leadership",
    subCategory: "Technical Skills",
    indexCode: "FPA",
    stage: "Seed",
    scope: "General"
  },
  {
    id: "q6",
    title: "How many startups are in your ecosystem?",
    type: "Number Input",
    category: "Quantity and Quality of Startups",
    subCategory: "Startup Count",
    indexCode: "EEA",
    stage: "Pre-seed",
    scope: "General"
  },
  {
    id: "q7",
    title: "What funding sources are available?",
    type: "Multiple Choice",
    category: "Availability of Funding and Investment",
    subCategory: "Funding Sources",
    indexCode: "EEA",
    stage: "Seed",
    scope: "General"
  },
  {
    id: "q8",
    title: "Describe the fintech regulatory environment",
    type: "Text Area",
    category: "Government and Policy",
    subCategory: "Industry Regulation",
    indexCode: "EEA",
    stage: "Pre-seed",
    scope: "Industry-Specific",
    industry: "Fintech"
  }
];

export default function QuestionnaireBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [selectedQuestions, setSelectedQuestions] = useState<typeof mockQuestions>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get questionnaire data from location state (for new questionnaires) or load from API (for existing)
  const questionnaireData = location.state || {
    name: "Sample Questionnaire",
    indexCode: "FPA",
    stage: "Seed",
    scope: "General",
    industry: "General"
  };

  const questionnaireName = questionnaireData.name;

  // Pre-filter questions based on questionnaire criteria
  const preFilteredQuestions = mockQuestions.filter(question => {
    const matchesIndex = question.indexCode === questionnaireData.indexCode;
    const matchesStage = question.stage === questionnaireData.stage;
    const matchesScope = question.scope === questionnaireData.scope;
    const matchesIndustry = questionnaireData.scope === "General" || 
      (questionnaireData.scope === "Industry-Specific" && question.industry === questionnaireData.industry);
    
    return matchesIndex && matchesStage && matchesScope && matchesIndustry;
  });

  // Apply additional filters on pre-filtered questions
  const filteredQuestions = preFilteredQuestions.filter(question => {
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const notSelected = !selectedQuestions.find(sq => sq.id === question.id);
    return matchesCategory && matchesSearch && notSelected;
  });

  // Get unique categories from pre-filtered questions for the category dropdown
  const availableCategories = [...new Set(preFilteredQuestions.map(q => q.category))];

  const addQuestion = (question: typeof mockQuestions[0]) => {
    setSelectedQuestions([...selectedQuestions, question]);
  };

  const removeQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };

  const handleSaveAndClose = () => {
    // In real app, save the questionnaire
    navigate('/questionnaires/management');
  };

  const handleCancel = () => {
    navigate('/questionnaires/management');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="h-screen flex flex-col">
            {/* Fixed Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold">Questionnaire Builder</h1>
                  <span className="text-sm text-muted-foreground">
                    Building: {questionnaireName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAndClose}>
                    Save and Close
                  </Button>
                </div>
              </div>
            </div>

            {/* Two Panel Layout */}
            <div className="flex-1 flex">
              {/* Left Panel - Available Questions (40%) */}
              <div className="w-2/5 border-r bg-background p-6">
                <h2 className="text-lg font-semibold mb-4">Available Questions Bank</h2>
                
                {/* Filter Context Display */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Showing questions matching:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Index: {questionnaireData.indexCode}</Badge>
                    <Badge variant="secondary">Stage: {questionnaireData.stage}</Badge>
                    <Badge variant="secondary">Scope: {questionnaireData.scope}</Badge>
                    {questionnaireData.scope === "Industry-Specific" && (
                      <Badge variant="secondary">Industry: {questionnaireData.industry}</Badge>
                    )}
                  </div>
                </div>

                {/* Additional Filter Controls */}
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-1 gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="all">All Categories</SelectItem>
                        {availableCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Input
                    placeholder="Search by question title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Question List */}
                <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {filteredQuestions.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-center">
                      <p className="text-muted-foreground text-sm">
                        No questions match the current criteria.
                      </p>
                    </div>
                  ) : (
                    filteredQuestions.map((question) => (
                      <Card key={question.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm mb-1">{question.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {question.type} • {question.category}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => addQuestion(question)}
                              className="ml-3 flex items-center gap-1"
                            >
                              Add →
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel - Selected Questions (60%) */}
              <div className="w-3/5 bg-muted/30 p-6">
                <h2 className="text-lg font-semibold mb-2">Building: {questionnaireName}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Total Questions: {selectedQuestions.length}
                </p>

                {/* Selected Questions List */}
                <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {selectedQuestions.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-center">
                      <p className="text-muted-foreground">
                        Add questions from the bank on the left to get started.
                      </p>
                    </div>
                  ) : (
                    selectedQuestions.map((question, index) => (
                      <Card key={question.id} className="bg-background">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground mt-1 cursor-grab" />
                            <div className="flex-1">
                              <h3 className="font-medium text-sm mb-1">{question.title}</h3>
                              <p className="text-xs text-muted-foreground">{question.type}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeQuestion(question.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}