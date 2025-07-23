import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, X, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Mock data for available questions
const mockQuestions = [
  {
    id: "q1",
    title: "What is your company's current revenue?",
    type: "Multiple Choice",
    category: "Financial Performance"
  },
  {
    id: "q2", 
    title: "How many employees does your company have?",
    type: "Number Input",
    category: "Company Size"
  },
  {
    id: "q3",
    title: "Describe your business model",
    type: "Text Area",
    category: "Business Strategy"
  },
  {
    id: "q4",
    title: "What is your target market?",
    type: "Multiple Choice",
    category: "Market Analysis"
  },
  {
    id: "q5",
    title: "Rate your team's technical expertise",
    type: "Rating Scale",
    category: "Team Assessment"
  }
];

export default function QuestionnaireBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedQuestions, setSelectedQuestions] = useState<typeof mockQuestions>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock questionnaire data - in real app this would come from API
  const questionnaireName = "FPA - Seed Stage v1.3";

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const notSelected = !selectedQuestions.find(sq => sq.id === question.id);
    return matchesCategory && matchesSearch && notSelected;
  });

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
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Questionnaire Builder</h1>
            <span className="text-sm text-muted-foreground">
              Editing: {questionnaireName}
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
          
          {/* Filter Controls */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Financial Performance">Financial Performance</SelectItem>
                  <SelectItem value="Company Size">Company Size</SelectItem>
                  <SelectItem value="Business Strategy">Business Strategy</SelectItem>
                  <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                  <SelectItem value="Team Assessment">Team Assessment</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="behavioral">Behavioral Code</SelectItem>
                  <SelectItem value="technical">Technical Code</SelectItem>
                  <SelectItem value="strategic">Strategic Code</SelectItem>
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
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredQuestions.map((question) => (
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
                      Add <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Selected Questions (60%) */}
        <div className="w-3/5 bg-muted/30 p-6">
          <h2 className="text-lg font-semibold mb-2">Building: {questionnaireName}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Total Questions in this Questionnaire: {selectedQuestions.length}
          </p>

          {/* Selected Questions List */}
          <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
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
  );
}