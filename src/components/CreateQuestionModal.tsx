import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionCreated: (question: any) => void;
  editingQuestion?: any;
}

const behavioralCodes = [
  "Comfortable with risk",
  "Comfortable with being the center of attention", 
  "Energetic",
  "Comfortable with long-term goals",
  "Curious",
  "Responsibility",
  "Achievement",
  "Organized",
  "Managing emotions",
  "Self-efficacy",
  "Resilience and persistence",
  "Ability to delegate responsibility to others"
];

const categories = [
  "Problem-Solution Fit & Market Validation",
  "Business Model & Revenue Strategy",
  "Product Development & Technology",
  "Team Building & Leadership",
  "Sales, Marketing & Customer Acquisition",
  "Financial Management & Fundraising",
  "Legal & IP",
  "Operations & Execution",
  "Strategy & Vision",
  "Personal & Entrepreneurial Skills"
];

const subCategories: Record<string, string[]> = {
  "Problem-Solution Fit & Market Validation": ["Customer Segments", "Value Proposition", "Market Size & Trends", "Competitive Landscape"],
  "Business Model & Revenue Strategy": ["Revenue Streams", "Pricing Model", "Go-to-Market Strategy", "Customer Lifetime Value (LTV)"],
  "Product Development & Technology": ["Product Roadmap", "Technology Stack", "Development Process", "Minimum Viable Product (MVP)"]
};

export function CreateQuestionModal({ open, onOpenChange, onQuestionCreated, editingQuestion }: CreateQuestionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [questionData, setQuestionData] = useState({
    questionText: "",
    behavioralCode: "",
    category: "",
    subCategory: "",
    scope: "general" as "general" | "industry-specific",
    industry: "",
    answerType: "" as "single-choice" | "multiple-choice" | "ranking" | "matching",
    choices: [] as string[],
    columnA: [] as string[],
    columnB: [] as string[],
    weights: {} as Record<string, { weight?: number; expertWeight?: number; machineWeight?: number }>,
    rankings: {} as Record<string, number>,
    matchedPairs: [] as Array<{ a: string; b: string }>,
    correctAnswers: [] as number[], // For single/multiple choice
    correctRanking: {} as Record<string, number> // For ranking
  });
  
  const { toast } = useToast();

  // Pre-populate form when editing
  useEffect(() => {
    if (editingQuestion && open) {
      setQuestionData({
        questionText: editingQuestion.title || "",
        behavioralCode: editingQuestion.behavioralCode || "",
        category: editingQuestion.category || "",
        subCategory: editingQuestion.subCategory || "",
        scope: editingQuestion.scope || "general",
        industry: editingQuestion.industry || "",
        answerType: editingQuestion.type || "" as any,
        choices: editingQuestion.choices || [],
        columnA: editingQuestion.columnA || [],
        columnB: editingQuestion.columnB || [],
        weights: editingQuestion.weights || {},
        rankings: editingQuestion.rankings || {},
        matchedPairs: editingQuestion.matchedPairs || [],
        correctAnswers: editingQuestion.correctAnswers || [],
        correctRanking: editingQuestion.correctRanking || {}
      });
    } else if (!editingQuestion && open) {
      resetForm();
    }
  }, [editingQuestion, open]);

  const steps = [
    { number: 1, title: "Details & Properties" },
    { number: 2, title: "Define Answer Choices" }, 
    { number: 3, title: "Set Scoring & Weights" },
    { number: 4, title: "Preview & Confirm" }
  ];

  const resetForm = () => {
    setCurrentStep(1);
    setQuestionData({
      questionText: "",
      behavioralCode: "",
      category: "",
      subCategory: "",
      scope: "general",
      industry: "",
      answerType: "" as any,
      choices: [],
      columnA: [],
      columnB: [],
      weights: {},
      rankings: {},
      matchedPairs: [],
      correctAnswers: [],
      correctRanking: {}
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = (status: "draft" | "published") => {
    const newQuestion = {
      id: Date.now(),
      title: questionData.questionText.substring(0, 50) + "...",
      type: questionData.answerType,
      category: questionData.category,
      status: status === "draft" ? "Draft" : "Published",
      lastModified: new Date().toISOString().split('T')[0]
    };

    onQuestionCreated(newQuestion);
    toast({
      title: `Question ${status === "draft" ? "saved as draft" : "published"} successfully`,
      description: "The question has been added to the assessment bank."
    });
    onOpenChange(false);
    resetForm();
  };

  const addChoice = () => {
    setQuestionData(prev => ({
      ...prev,
      choices: [...prev.choices, ""]
    }));
  };

  const updateChoice = (index: number, value: string) => {
    setQuestionData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => i === index ? value : choice)
    }));
  };

  const removeChoice = (index: number) => {
    setQuestionData(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index)
    }));
  };

  const WeightPopover = ({ choiceId, choiceText }: { choiceId: string; choiceText: string }) => {
    const [weights, setWeights] = useState(questionData.weights[choiceId] || {});

    const handleSaveWeights = () => {
      setQuestionData(prev => ({
        ...prev,
        weights: {
          ...prev.weights,
          [choiceId]: weights
        }
      }));
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Set Weights
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Set Weights for: {choiceText}</h4>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weights.weight || ""}
                onChange={(e) => setWeights(prev => ({ ...prev, weight: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expert-weight">Expert Weight</Label>
              <Input
                id="expert-weight"
                type="number"
                placeholder="Enter expert weight"
                value={weights.expertWeight || ""}
                onChange={(e) => setWeights(prev => ({ ...prev, expertWeight: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machine-weight">Machine Weight</Label>
              <Input
                id="machine-weight"
                type="number"
                placeholder="Enter machine weight"
                value={weights.machineWeight || ""}
                onChange={(e) => setWeights(prev => ({ ...prev, machineWeight: Number(e.target.value) }))}
              />
            </div>
            <Button onClick={handleSaveWeights} className="w-full">Done</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                placeholder="Enter your question..."
                value={questionData.questionText}
                onChange={(e) => setQuestionData(prev => ({ ...prev, questionText: e.target.value }))}
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="behavioral-code">Select a Behavioral Code</Label>
              <Select 
                value={questionData.behavioralCode} 
                onValueChange={(value) => setQuestionData(prev => ({ ...prev, behavioralCode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a behavioral code" />
                </SelectTrigger>
                <SelectContent>
                  {behavioralCodes.map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Select a Category</Label>
              <Select 
                value={questionData.category} 
                onValueChange={(value) => setQuestionData(prev => ({ ...prev, category: value, subCategory: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {questionData.category && subCategories[questionData.category] && (
              <div className="space-y-2">
                <Label htmlFor="sub-category">Select a Sub-Category</Label>
                <Select 
                  value={questionData.subCategory} 
                  onValueChange={(value) => setQuestionData(prev => ({ ...prev, subCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a sub-category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories[questionData.category].map((subCat) => (
                      <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-4">
              <Label>Scope</Label>
              <RadioGroup 
                value={questionData.scope} 
                onValueChange={(value: "general" | "industry-specific") => setQuestionData(prev => ({ ...prev, scope: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">General</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="industry-specific" id="industry-specific" />
                  <Label htmlFor="industry-specific">Industry-Specific</Label>
                </div>
              </RadioGroup>
            </div>

            {questionData.scope === "industry-specific" && (
              <div className="space-y-2">
                <Label htmlFor="industry">Select an Industry</Label>
                <Select 
                  value={questionData.industry} 
                  onValueChange={(value) => setQuestionData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="answer-type">Select an Answer Type</Label>
              <Select 
                value={questionData.answerType} 
                onValueChange={(value: any) => setQuestionData(prev => ({ ...prev, answerType: value, choices: [], columnA: [], columnB: [] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose answer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-choice">Single Choice</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="ranking">Ranking</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(questionData.answerType === "single-choice" || questionData.answerType === "multiple-choice" || questionData.answerType === "ranking") && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Answer Choices</Label>
                  <Button variant="outline" size="sm" onClick={addChoice}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Choice
                  </Button>
                </div>
                <div className="space-y-2">
                  {questionData.choices.map((choice, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Choice ${index + 1}`}
                        value={choice}
                        onChange={(e) => updateChoice(index, e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeChoice(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questionData.answerType === "matching" && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Column A</Label>
                  <div className="space-y-2">
                    {questionData.columnA.map((item, index) => (
                      <Input
                        key={index}
                        placeholder={`Item ${index + 1}`}
                        value={item}
                        onChange={(e) => {
                          const newColumnA = [...questionData.columnA];
                          newColumnA[index] = e.target.value;
                          setQuestionData(prev => ({ ...prev, columnA: newColumnA }));
                        }}
                      />
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setQuestionData(prev => ({ ...prev, columnA: [...prev.columnA, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Column B</Label>
                  <div className="space-y-2">
                    {questionData.columnB.map((item, index) => (
                      <Input
                        key={index}
                        placeholder={`Item ${index + 1}`}
                        value={item}
                        onChange={(e) => {
                          const newColumnB = [...questionData.columnB];
                          newColumnB[index] = e.target.value;
                          setQuestionData(prev => ({ ...prev, columnB: newColumnB }));
                        }}
                      />
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setQuestionData(prev => ({ ...prev, columnB: [...prev.columnB, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Set Scoring & Weights</h3>
            
            {(questionData.answerType === "single-choice" || questionData.answerType === "multiple-choice") && questionData.choices.length > 0 && (
              <>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Select the correct answer(s) and set weights.</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the checkbox/radio button to mark the correct answer(s). Use the 'Set Weights' button to assign specific scores for partial credit or penalties.
                  </p>
                </div>
                <div className="space-y-4">
                  {questionData.choices.map((choice, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      {questionData.answerType === "single-choice" ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="correct-answer"
                            checked={questionData.correctAnswers.includes(index)}
                            onChange={() => setQuestionData(prev => ({ 
                              ...prev, 
                              correctAnswers: [index] 
                            }))}
                          />
                        </div>
                      ) : (
                        <Checkbox
                          checked={questionData.correctAnswers.includes(index)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setQuestionData(prev => ({ 
                                ...prev, 
                                correctAnswers: [...prev.correctAnswers, index] 
                              }));
                            } else {
                              setQuestionData(prev => ({ 
                                ...prev, 
                                correctAnswers: prev.correctAnswers.filter(i => i !== index) 
                              }));
                            }
                          }}
                        />
                      )}
                      <span className="flex-1">{choice}</span>
                      <WeightPopover choiceId={`choice-${index}`} choiceText={choice} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {(questionData.answerType === "single-choice" || questionData.answerType === "multiple-choice") && questionData.choices.length === 0 && (
              <div className="p-6 border rounded-lg bg-muted/10 text-center">
                <p className="text-muted-foreground">Please go back to Step 2 to add answer choices first.</p>
              </div>
            )}

            {questionData.answerType === "ranking" && (
              <div className="space-y-4">
                {questionData.choices.map((choice, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <span className="flex-1">{choice}</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`rank-${index}`}>Rank:</Label>
                      <Input
                        id={`rank-${index}`}
                        type="number"
                        className="w-20"
                        placeholder="1"
                        value={questionData.rankings[`choice-${index}`] || ""}
                        onChange={(e) => setQuestionData(prev => ({
                          ...prev,
                          rankings: { ...prev.rankings, [`choice-${index}`]: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <WeightPopover choiceId={`choice-${index}`} choiceText={choice} />
                  </div>
                ))}
              </div>
            )}

            {questionData.answerType === "matching" && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Create matching pairs and set their weights:</p>
                {questionData.matchedPairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <span>{pair.a} ↔ {pair.b}</span>
                    <WeightPopover choiceId={`pair-${index}`} choiceText={`${pair.a} ↔ ${pair.b}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Preview & Confirm</h3>
            
            <div className="p-6 border rounded-lg bg-muted/20">
              <h4 className="font-medium mb-4">Question Preview</h4>
              <div className="space-y-4">
                <p className="text-lg">{questionData.questionText}</p>
                
                {questionData.behavioralCode && (
                  <Badge variant="secondary">Behavioral Code: {questionData.behavioralCode}</Badge>
                )}
                
                {questionData.category && (
                  <Badge variant="outline">Category: {questionData.category}</Badge>
                )}

                <div className="space-y-2">
                  <Label>Answer Options:</Label>
                  {questionData.answerType === "single-choice" && (
                    <div className="space-y-2">
                      {questionData.choices.map((choice, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input type="radio" disabled />
                          <span>{choice}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {questionData.answerType === "multiple-choice" && (
                    <div className="space-y-2">
                      {questionData.choices.map((choice, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input type="checkbox" disabled />
                          <span>{choice}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? "Edit Question" : "Create New Question"}</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.number 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              <span className={`ml-2 text-sm ${currentStep === step.number ? "font-medium" : "text-muted-foreground"}`}>
                {step.title}
              </span>
              {step.number < 4 && <div className="w-8 h-px bg-muted mx-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {currentStep === 4 ? (
              <>
                <Button variant="outline" onClick={() => handleSave("draft")}>
                  Save as Draft
                </Button>
                <Button onClick={() => handleSave("published")}>
                  Confirm & Publish
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>
                Next →
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}