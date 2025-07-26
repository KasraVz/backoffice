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

const indexCodes = ["FPA", "EEA"];

const categoriesData = {
  "FPA": {
    "General": [
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
    ],
    "Industry-Specific": [
      "Industry Trends & Future of Work",
      "Ecosystem & Market Specifics",
      "Product & Technology Vision", 
      "Business Model & Go-to-Market Strategy",
      "Founder & Team Vision"
    ]
  },
  "EEA": {
    "General": [
      "Quantity and Quality of Startups",
      "Availability of Funding and Investment",
      "Support Systems and Infrastructure", 
      "Networking and Community",
      "Government and Policy",
      "Culture and Mindset",
      "Recurring problems"
    ],
    "Industry-Specific": [
      "Quantity and Quality of Startups",
      "Availability of Funding and Investment",
      "Talent and Human Capital",
      "Support Systems and Infrastructure",
      "Networking and Community", 
      "Government and Policy",
      "Culture and Mindset",
      "Startup Domains",
      "Environmental Awareness"
    ]
  }
};

const subCategoriesData = {
  // FPA General sub-categories
  "Problem-Solution Fit & Market Validation": ["Market Research", "Customer Discovery", "MVP Development"],
  "Business Model & Revenue Strategy": ["Revenue Models", "Pricing Strategy", "Market Entry"],
  "Product Development & Technology": ["Technology Stack", "Development Process", "Innovation"],
  "Team Building & Leadership": ["Team Formation", "Leadership Skills", "Culture Building"],
  "Sales, Marketing & Customer Acquisition": ["Sales Strategy", "Marketing Channels", "Customer Retention"],
  "Financial Management & Fundraising": ["Financial Planning", "Investment Strategy", "Cash Flow Management"],
  "Legal & IP": ["Intellectual Property", "Legal Structure", "Compliance"],
  "Operations & Execution": ["Process Management", "Quality Control", "Scaling Operations"],
  "Strategy & Vision": ["Strategic Planning", "Vision Development", "Goal Setting"],
  "Personal & Entrepreneurial Skills": ["Entrepreneurial Mindset", "Personal Development", "Skill Building"],
  
  // FPA Industry-Specific sub-categories
  "Industry Trends & Future of Work": ["Emerging Trends", "Future Predictions", "Market Evolution"],
  "Ecosystem & Market Specifics": ["Market Analysis", "Competitive Landscape", "Industry Dynamics"],
  "Product & Technology Vision": ["Technology Roadmap", "Product Innovation", "Technical Vision"],
  "Business Model & Go-to-Market Strategy": ["Market Strategy", "Business Model Innovation", "Launch Strategy"],
  "Founder & Team Vision": ["Founder Vision", "Team Alignment", "Leadership Vision"],
  
  // EEA General sub-categories  
  "Quantity and Quality of Startups": ["Startup Metrics", "Quality Assessment", "Growth Indicators"],
  "Availability of Funding and Investment": ["Funding Sources", "Investment Climate", "Capital Access"],
  "Support Systems and Infrastructure": ["Incubators", "Accelerators", "Support Networks"],
  "Networking and Community": ["Community Building", "Professional Networks", "Collaboration"],
  "Government and Policy": ["Policy Framework", "Regulatory Environment", "Government Support"],
  "Culture and Mindset": ["Entrepreneurial Culture", "Risk Tolerance", "Innovation Mindset"],
  "Recurring problems": ["Common Challenges", "Systemic Issues", "Problem Patterns"],
  
  // EEA Industry-Specific sub-categories
  "Talent and Human Capital": ["Skill Development", "Talent Acquisition", "Human Resources"],
  "Startup Domains": ["Industry Sectors", "Domain Expertise", "Specialization Areas"],
  "Environmental Awareness": ["Sustainability", "Environmental Impact", "Green Innovation"]
};

export function CreateQuestionModal({ open, onOpenChange, onQuestionCreated, editingQuestion }: CreateQuestionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedColumnAIndex, setSelectedColumnAIndex] = useState<number | null>(null);
  const [selectedColumnBIndex, setSelectedColumnBIndex] = useState<number | null>(null);
  const [usedItems, setUsedItems] = useState<{ columnA: number[], columnB: number[] }>({ columnA: [], columnB: [] });
  
  const [questionData, setQuestionData] = useState({
    questionText: "",
    behavioralCode: "",
    indexCode: "",
    category: "",
    subCategory: "",
    scope: "General" as "General" | "Industry-Specific",
    industry: "",
    answerType: "" as "single-choice" | "multiple-choice" | "ranking" | "matching",
    choices: [] as string[],
    columnA: [] as string[],
    columnB: [] as string[],
    weights: {} as Record<string, { weight?: number; expertWeight?: number; machineWeight?: number }>,
    rankings: {} as Record<string, number>,
    matchedPairs: [] as Array<{ a: string; b: string; aIndex: number; bIndex: number }>,
    correctAnswers: [] as number[], // For single/multiple choice
    correctRanking: {} as Record<string, number> // For ranking
  });
  
  const { toast } = useToast();

  // Pre-populate form when editing
  useEffect(() => {
    if (editingQuestion && open) {
      setQuestionData({
        questionText: editingQuestion.questionText || editingQuestion.title || "",
        behavioralCode: editingQuestion.behavioralCode || "",
        indexCode: editingQuestion.indexCode || "",
        category: editingQuestion.category || "",
        subCategory: editingQuestion.subCategory || "",
        scope: editingQuestion.scope || "General",
        industry: editingQuestion.industry || "",
        answerType: editingQuestion.answerType || editingQuestion.type || "" as any,
        choices: editingQuestion.choices || [],
        columnA: editingQuestion.columnA || [],
        columnB: editingQuestion.columnB || [],
        weights: editingQuestion.weights || {},
        rankings: editingQuestion.rankings || {},
        matchedPairs: editingQuestion.matchedPairs || [],
        correctAnswers: editingQuestion.correctAnswers || [],
        correctRanking: editingQuestion.correctRanking || {}
      });

      // Restore used items for matching questions
      if (editingQuestion.matchedPairs && editingQuestion.matchedPairs.length > 0) {
        const usedColumnA: number[] = [];
        const usedColumnB: number[] = [];
        
        editingQuestion.matchedPairs.forEach((pair: any) => {
          if (typeof pair.aIndex === 'number') usedColumnA.push(pair.aIndex);
          if (typeof pair.bIndex === 'number') usedColumnB.push(pair.bIndex);
        });

        setUsedItems({ columnA: usedColumnA, columnB: usedColumnB });
      }
    } else if (!editingQuestion && open) {
      resetForm();
    }
  }, [editingQuestion, open]);

  const steps = [
    { number: 1, title: "Details & Properties" },
    { number: 2, title: "Define Answer Choices" }, 
    { number: 3, title: "Correct Answers and Weights" },
    { number: 4, title: "Preview & Confirm" }
  ];

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedColumnAIndex(null);
    setSelectedColumnBIndex(null);
    setUsedItems({ columnA: [], columnB: [] });
    setQuestionData({
      questionText: "",
      behavioralCode: "",
      indexCode: "",
      category: "",
      subCategory: "",
      scope: "General",
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
      id: editingQuestion?.id || Date.now(),
      title: questionData.questionText,
      type: questionData.answerType,
      category: questionData.category,
      status: status === "draft" ? "Draft" : "Published",
      lastModified: new Date().toISOString().split('T')[0],
      // Save all question data for editing
      questionText: questionData.questionText,
      behavioralCode: questionData.behavioralCode,
      indexCode: questionData.indexCode,
      subCategory: questionData.subCategory,
      scope: questionData.scope,
      industry: questionData.industry,
      answerType: questionData.answerType,
      choices: questionData.choices,
      columnA: questionData.columnA,
      columnB: questionData.columnB,
      weights: questionData.weights,
      rankings: questionData.rankings,
      matchedPairs: questionData.matchedPairs,
      correctAnswers: questionData.correctAnswers,
      correctRanking: questionData.correctRanking
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

  // Helper functions for matching pairs
  const handleColumnASelection = (index: number) => {
    if (usedItems.columnA.includes(index)) return;
    setSelectedColumnAIndex(selectedColumnAIndex === index ? null : index);
  };

  const handleColumnBSelection = (index: number) => {
    if (usedItems.columnB.includes(index)) return;
    setSelectedColumnBIndex(selectedColumnBIndex === index ? null : index);
  };

  const canCreatePair = selectedColumnAIndex !== null && selectedColumnBIndex !== null;

  const createPair = () => {
    if (!canCreatePair || selectedColumnAIndex === null || selectedColumnBIndex === null) return;
    
    const newPair = {
      a: questionData.columnA[selectedColumnAIndex],
      b: questionData.columnB[selectedColumnBIndex],
      aIndex: selectedColumnAIndex,
      bIndex: selectedColumnBIndex
    };

    setQuestionData(prev => ({
      ...prev,
      matchedPairs: [...prev.matchedPairs, newPair]
    }));

    setUsedItems(prev => ({
      columnA: [...prev.columnA, selectedColumnAIndex],
      columnB: [...prev.columnB, selectedColumnBIndex]
    }));

    setSelectedColumnAIndex(null);
    setSelectedColumnBIndex(null);
  };

  const removePair = (pairIndex: number) => {
    const pair = questionData.matchedPairs[pairIndex];
    
    setQuestionData(prev => ({
      ...prev,
      matchedPairs: prev.matchedPairs.filter((_, i) => i !== pairIndex)
    }));

    setUsedItems(prev => ({
      columnA: prev.columnA.filter(index => index !== pair.aIndex),
      columnB: prev.columnB.filter(index => index !== pair.bIndex)
    }));
  };

  const WeightPopover = ({ choiceId, choiceText }: { choiceId: string; choiceText: string }) => {
    const [weights, setWeights] = useState(questionData.weights[choiceId] || {});

    // Update local weights when parent weights change (for editing)
    useEffect(() => {
      setWeights(questionData.weights[choiceId] || {});
    }, [questionData.weights, choiceId]);

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
              <Label htmlFor="index-code">Select an Index Code</Label>
              <Select 
                value={questionData.indexCode} 
                onValueChange={(value) => setQuestionData(prev => ({ 
                  ...prev, 
                  indexCode: value, 
                  category: "", 
                  subCategory: "",
                  scope: "General" 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an index code" />
                </SelectTrigger>
                <SelectContent>
                  {indexCodes.map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {questionData.indexCode && (
              <div className="space-y-4">
                <Label>Scope</Label>
                <RadioGroup 
                  value={questionData.scope} 
                  onValueChange={(value: "General" | "Industry-Specific") => setQuestionData(prev => ({ 
                    ...prev, 
                    scope: value,
                    category: "",
                    subCategory: ""
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="General" id="general" />
                    <Label htmlFor="general">General</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Industry-Specific" id="industry-specific" />
                    <Label htmlFor="industry-specific">Industry-Specific</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {questionData.indexCode && questionData.scope && (
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
                    {categoriesData[questionData.indexCode as keyof typeof categoriesData]?.[questionData.scope as keyof typeof categoriesData.FPA]?.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {questionData.category && subCategoriesData[questionData.category] && (
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
                    {subCategoriesData[questionData.category].map((subCat) => (
                      <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {questionData.scope === "Industry-Specific" && (
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

            {questionData.answerType === "matching" && questionData.columnA.length > 0 && questionData.columnB.length > 0 && (
              <div className="space-y-6">
                {/* Pairing Area */}
                <div className="space-y-4">
                  <h4 className="font-medium">Create Matching Pairs and Set Weights</h4>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Column A */}
                    <div className="space-y-2">
                      <Label className="font-medium">Column A</Label>
                      {questionData.columnA.map((item, index) => (
                        <Button
                          key={index}
                          variant={selectedColumnAIndex === index ? "default" : "outline"}
                          className={`w-full h-auto p-3 text-left justify-start ${
                            usedItems.columnA.includes(index) 
                              ? "opacity-50 cursor-not-allowed bg-muted" 
                              : selectedColumnAIndex === index 
                                ? "border-2 border-primary" 
                                : ""
                          }`}
                          onClick={() => handleColumnASelection(index)}
                          disabled={usedItems.columnA.includes(index)}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>

                    {/* Create Pair Button */}
                    <div className="flex justify-center">
                      <Button
                        variant="default"
                        disabled={!canCreatePair}
                        onClick={createPair}
                        className="whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Pair
                      </Button>
                    </div>

                    {/* Column B */}
                    <div className="space-y-2">
                      <Label className="font-medium">Column B</Label>
                      {questionData.columnB.map((item, index) => (
                        <Button
                          key={index}
                          variant={selectedColumnBIndex === index ? "default" : "outline"}
                          className={`w-full h-auto p-3 text-left justify-start ${
                            usedItems.columnB.includes(index) 
                              ? "opacity-50 cursor-not-allowed bg-muted" 
                              : selectedColumnBIndex === index 
                                ? "border-2 border-primary" 
                                : ""
                          }`}
                          onClick={() => handleColumnBSelection(index)}
                          disabled={usedItems.columnB.includes(index)}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Correctly Matched Pairs */}
                <div className="space-y-4">
                  <h4 className="font-medium">Correctly Matched Pairs</h4>
                  {questionData.matchedPairs.length === 0 ? (
                    <div className="p-6 border rounded-lg bg-muted/10 text-center">
                      <p className="text-muted-foreground">No pairs created yet. Select items from both columns and click "Create Pair".</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {questionData.matchedPairs.map((pair, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                          <span className="font-medium">{pair.a} ↔ {pair.b}</span>
                          <div className="flex items-center gap-2">
                            <WeightPopover choiceId={`pair-${index}`} choiceText={`${pair.a} ↔ ${pair.b}`} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePair(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {questionData.answerType === "matching" && (questionData.columnA.length === 0 || questionData.columnB.length === 0) && (
              <div className="p-6 border rounded-lg bg-muted/10 text-center">
                <p className="text-muted-foreground">Please go back to Step 2 to add items to both columns first.</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Section 1: Properties Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Question Details Summary</h3>
              <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/10">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Behavioral Code</Label>
                    <p className="text-sm">{questionData.behavioralCode || "Not selected"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <p className="text-sm">{questionData.category || "Not selected"}</p>
                  </div>
                  {questionData.subCategory && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Sub-Category</Label>
                      <p className="text-sm">{questionData.subCategory}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Scope</Label>
                    <p className="text-sm">{questionData.scope}</p>
                  </div>
                  {questionData.scope === "Industry-Specific" && questionData.industry && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                      <p className="text-sm">{questionData.industry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: End-User Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Live Preview</h3>
              <div className="p-6 border rounded-lg bg-background">
                <div className="space-y-6">
                  {/* Question Text */}
                  <div>
                    <p className="text-lg font-medium">{questionData.questionText}</p>
                  </div>
                  
                  {/* Answer Options */}
                  <div className="space-y-4">
                    {questionData.answerType === "single-choice" && (
                      <div className="space-y-3">
                        {questionData.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input type="radio" name="preview-radio" disabled className="text-primary" />
                            <span className="text-sm">{choice}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {questionData.answerType === "multiple-choice" && (
                      <div className="space-y-3">
                        {questionData.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input type="checkbox" disabled className="text-primary" />
                            <span className="text-sm">{choice}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {questionData.answerType === "ranking" && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Rank the following options (drag to reorder):</Label>
                        {questionData.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 border rounded bg-muted/20">
                            <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
                            <span className="text-sm">{choice}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {questionData.answerType === "matching" && (
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Match items from Column A with Column B:</Label>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Column A</Label>
                            {questionData.columnA.map((item, index) => (
                              <div key={index} className="p-2 border rounded bg-muted/20">
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Column B</Label>
                            {questionData.columnB.map((item, index) => (
                              <div key={index} className="p-2 border rounded bg-muted/20">
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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