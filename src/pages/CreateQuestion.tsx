import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BEHAVIORAL_CODES = [
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

const CATEGORIES = [
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

const SUB_CATEGORIES = {
  "Problem-Solution Fit & Market Validation": [
    "Customer Segments",
    "Value Proposition", 
    "Market Size & Trends",
    "Competitive Landscape"
  ],
  "Business Model & Revenue Strategy": [
    "Revenue Streams",
    "Pricing Model",
    "Go-to-Market Strategy", 
    "Customer Lifetime Value (LTV)"
  ],
  "Product Development & Technology": [
    "Product Roadmap",
    "Technology Stack",
    "Development Process",
    "Minimum Viable Product (MVP)"
  ]
};

interface AnswerChoice {
  id: number;
  text: string;
  weight?: number;
  expertWeight?: number;
  machineWeight?: number;
  showAdvanced?: boolean;
}

interface MatchItem {
  id: number;
  text: string;
}

interface MatchPair {
  columnA: string;
  columnB: string;
  id: number;
  weight?: number;
  expertWeight?: number;
  machineWeight?: number;
}

export default function CreateQuestion() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 data
  const [questionText, setQuestionText] = useState("");
  const [behavioralCode, setBehavioralCode] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [scope, setScope] = useState("general");
  const [industry, setIndustry] = useState("");

  // Step 2 data
  const [answerType, setAnswerType] = useState("");
  const [choices, setChoices] = useState<AnswerChoice[]>([
    { id: 1, text: "" },
    { id: 2, text: "" }
  ]);
  const [rankingItems, setRankingItems] = useState<AnswerChoice[]>([
    { id: 1, text: "" },
    { id: 2, text: "" }
  ]);
  const [columnA, setColumnA] = useState<MatchItem[]>([{ id: 1, text: "" }]);
  const [columnB, setColumnB] = useState<MatchItem[]>([]);

  // Step 3 data
  const [correctSingle, setCorrectSingle] = useState("");
  const [correctMultiple, setCorrectMultiple] = useState<string[]>([]);
  const [rankings, setRankings] = useState<Record<string, number>>({});
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{columnA?: string, columnB?: string}>({});

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addChoice = () => {
    const newId = Math.max(...choices.map(c => c.id)) + 1;
    setChoices([...choices, { id: newId, text: "" }]);
  };

  const addRankingItem = () => {
    const newId = Math.max(...rankingItems.map(i => i.id)) + 1;
    setRankingItems([...rankingItems, { id: newId, text: "" }]);
  };

  const addColumnAItem = () => {
    const newId = Math.max(...columnA.map(i => i.id)) + 1;
    setColumnA([...columnA, { id: newId, text: "" }]);
  };

  const addColumnBItem = () => {
    const newId = columnB.length > 0 ? Math.max(...columnB.map(i => i.id)) + 1 : 1;
    setColumnB([...columnB, { id: newId, text: "" }]);
  };

  const addColumn = () => {
    if (columnB.length === 0) {
      setColumnB([{ id: 1, text: "" }]);
    }
  };

  const handleMatching = (type: 'columnA' | 'columnB', text: string) => {
    if (type === 'columnA') {
      if (selectedMatch.columnA === text) {
        setSelectedMatch({});
      } else {
        setSelectedMatch({ columnA: text });
      }
    } else {
      if (selectedMatch.columnA && selectedMatch.columnA !== text) {
        const newPair: MatchPair = { 
          columnA: selectedMatch.columnA, 
          columnB: text, 
          id: matchPairs.length + 1,
          weight: 1
        };
        setMatchPairs([...matchPairs, newPair]);
        setSelectedMatch({});
      }
    }
  };

  const getMatchingColor = (text: string) => {
    const matchIndex = matchPairs.findIndex(
      m => m.columnA === text || m.columnB === text
    );
    if (matchIndex === -1) return "";
    
    const colors = ["bg-green-200", "bg-blue-200", "bg-purple-200", "bg-yellow-200", "bg-red-200"];
    return colors[matchIndex % colors.length];
  };

  const isMatched = (text: string) => {
    return matchPairs.some(m => m.columnA === text || m.columnB === text);
  };

  const handleSubmit = () => {
    toast({
      title: "Success",
      description: "Question created successfully."
    });
    navigate('/questionnaires/assessment-bank');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="mt-2"
          rows={4}
        />
      </div>

      <div>
        <Label>Select a Behavioral Code</Label>
        <Select value={behavioralCode} onValueChange={setBehavioralCode}>
          <SelectTrigger>
            <SelectValue placeholder="Select behavioral code" />
          </SelectTrigger>
          <SelectContent>
            {BEHAVIORAL_CODES.map((code) => (
              <SelectItem key={code} value={code}>{code}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Select a Category</Label>
        <Select value={category} onValueChange={(value) => {
          setCategory(value);
          setSubCategory("");
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category && SUB_CATEGORIES[category as keyof typeof SUB_CATEGORIES] && (
        <div>
          <Label>Select a Sub-Category</Label>
          <Select value={subCategory} onValueChange={setSubCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-category" />
            </SelectTrigger>
            <SelectContent>
              {SUB_CATEGORIES[category as keyof typeof SUB_CATEGORIES].map((subCat) => (
                <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Scope</Label>
        <RadioGroup value={scope} onValueChange={setScope} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general">General</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="industry-specific" id="industry-specific" />
            <Label htmlFor="industry-specific">Industry-Specific</Label>
          </div>
        </RadioGroup>

        {scope === "industry-specific" && (
          <div className="mt-4">
            <Label>Select an Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label>Select an Answer Type</Label>
        <Select value={answerType} onValueChange={setAnswerType}>
          <SelectTrigger>
            <SelectValue placeholder="Select answer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single-choice">Single Choice</SelectItem>
            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
            <SelectItem value="ranking">Ranking</SelectItem>
            <SelectItem value="matching">Matching</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(answerType === "single-choice" || answerType === "multiple-choice") && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Define Answer Choices & Select Correct Answers</h4>
            <div className="space-y-4">
              {choices.map((choice, index) => (
                <div key={choice.id} className="space-y-3 border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    {answerType === "single-choice" ? (
                      <input
                        type="radio"
                        name="correct-single"
                        value={choice.text}
                        checked={correctSingle === choice.text}
                        onChange={(e) => setCorrectSingle(e.target.value)}
                        disabled={!choice.text}
                      />
                    ) : (
                      <Checkbox
                        checked={correctMultiple.includes(choice.text)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCorrectMultiple([...correctMultiple, choice.text]);
                          } else {
                            setCorrectMultiple(correctMultiple.filter(c => c !== choice.text));
                          }
                        }}
                        disabled={!choice.text}
                      />
                    )}
                    <Input
                      placeholder={`Choice ${index + 1}`}
                      value={choice.text}
                      onChange={(e) => {
                        const updatedChoices = choices.map(c =>
                          c.id === choice.id ? { ...c, text: e.target.value } : c
                        );
                        setChoices(updatedChoices);
                      }}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <Label>Weight:</Label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="1"
                        className="w-20"
                        disabled={!choice.text}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedChoices = choices.map(c =>
                            c.id === choice.id ? { ...c, showAdvanced: !c.showAdvanced } : c
                          );
                          setChoices(updatedChoices);
                        }}
                        disabled={!choice.text}
                      >
                        Advanced
                      </Button>
                    </div>
                  </div>
                  {choice.showAdvanced && choice.text && (
                    <div className="flex space-x-2 ml-6">
                      <div>
                        <Label>Expert Weight:</Label>
                        <Input type="number" min="0" max="1" step="0.1" className="w-24" />
                      </div>
                      <div>
                        <Label>Machine Weight:</Label>
                        <Input type="number" min="0" max="1" step="0.1" className="w-24" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addChoice}>
                <Plus className="mr-2 h-4 w-4" />
                Add Choice
              </Button>
            </div>
          </div>
        </div>
      )}

      {answerType === "ranking" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Define Ranking Items & Set Order</h4>
            <div className="space-y-4">
              {rankingItems.map((item, index) => (
                <div key={item.id} className="space-y-3 border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder={`Item ${index + 1}`}
                      value={item.text}
                      onChange={(e) => {
                        const updatedItems = rankingItems.map(i =>
                          i.id === item.id ? { ...i, text: e.target.value } : i
                        );
                        setRankingItems(updatedItems);
                      }}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <Label>Rank:</Label>
                      <Input
                        type="number"
                        min="1"
                        className="w-20"
                        value={rankings[item.text] || ""}
                        onChange={(e) => setRankings({
                          ...rankings,
                          [item.text]: parseInt(e.target.value) || 0
                        })}
                        disabled={!item.text}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedItems = rankingItems.map(i =>
                          i.id === item.id ? { ...i, showAdvanced: !i.showAdvanced } : i
                        );
                        setRankingItems(updatedItems);
                      }}
                      disabled={!item.text}
                    >
                      Advanced
                    </Button>
                  </div>
                  {item.showAdvanced && item.text && (
                    <div className="flex space-x-2 ml-6">
                      <div>
                        <Label>Expert Weight:</Label>
                        <Input type="number" min="0" max="1" step="0.1" className="w-24" />
                      </div>
                      <div>
                        <Label>Machine Weight:</Label>
                        <Input type="number" min="0" max="1" step="0.1" className="w-24" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addRankingItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {answerType === "matching" && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">Define Matching Items & Create Pairs</h4>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-medium mb-3">Column A</h5>
                <div className="space-y-2">
                  {columnA.map((item, index) => (
                    <Input
                      key={item.id}
                      placeholder={`Item ${index + 1}`}
                      value={item.text}
                      onChange={(e) => {
                        const updatedColumnA = columnA.map(i =>
                          i.id === item.id ? { ...i, text: e.target.value } : i
                        );
                        setColumnA(updatedColumnA);
                      }}
                    />
                  ))}
                  <Button variant="outline" onClick={addColumnAItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </div>

              <div>
                {columnB.length === 0 ? (
                  <Button variant="outline" onClick={addColumn}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Column
                  </Button>
                ) : (
                  <>
                    <h5 className="font-medium mb-3">Column B</h5>
                    <div className="space-y-2">
                      {columnB.map((item, index) => (
                        <Input
                          key={item.id}
                          placeholder={`Item ${index + 1}`}
                          value={item.text}
                          onChange={(e) => {
                            const updatedColumnB = columnB.map(i =>
                              i.id === item.id ? { ...i, text: e.target.value } : i
                            );
                            setColumnB(updatedColumnB);
                          }}
                        />
                      ))}
                      <Button variant="outline" onClick={addColumnBItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {columnA.some(i => i.text) && columnB.some(i => i.text) && (
              <div>
                <h5 className="font-medium mb-4">Click items to create pairs:</h5>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h6 className="font-medium mb-2">Column A</h6>
                    {columnA.filter(i => i.text).map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className={`mb-2 mr-2 ${
                          selectedMatch.columnA === item.text ? 'border-blue-500' : ''
                        } ${getMatchingColor(item.text)} ${
                          isMatched(item.text) ? 'opacity-75' : ''
                        }`}
                        onClick={() => handleMatching('columnA', item.text)}
                        disabled={isMatched(item.text)}
                      >
                        {item.text}
                      </Button>
                    ))}
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">Column B</h6>
                    {columnB.filter(i => i.text).map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className={`mb-2 mr-2 ${getMatchingColor(item.text)} ${
                          isMatched(item.text) ? 'opacity-75' : ''
                        }`}
                        onClick={() => handleMatching('columnB', item.text)}
                        disabled={isMatched(item.text)}
                      >
                        {item.text}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {matchPairs.length > 0 && (
                  <div className="mt-6">
                    <h6 className="font-medium mb-3">Matched Pairs - Set Weights:</h6>
                    {matchPairs.map((pair) => (
                      <div key={pair.id} className="border rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <span>{pair.columnA} ↔ {pair.columnB}</span>
                          <div className="flex items-center space-x-2">
                            <Label>Weight:</Label>
                            <Input
                              type="number"
                              min="0"
                              max="1"
                              step="0.1"
                              defaultValue="1"
                              className="w-20"
                            />
                            <Button variant="outline" size="sm">
                              Advanced
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg">
        <h4 className="font-medium mb-4">Question Preview</h4>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Question</Label>
            <p className="text-lg">{questionText || "No question text entered"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Behavioral Code</Label>
              <p>{behavioralCode || "Not selected"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Category</Label>
              <p>{category || "Not selected"}</p>
            </div>
          </div>

          {answerType && (
            <div>
              <Label className="text-sm text-muted-foreground">Answer Type</Label>
              <p className="capitalize">{answerType.replace('-', ' ')}</p>
            </div>
          )}

          {(answerType === "single-choice" || answerType === "multiple-choice") && choices.some(c => c.text) && (
            <div>
              <Label className="text-sm text-muted-foreground">Answer Choices</Label>
              <div className="space-y-2 mt-2">
                {choices.filter(c => c.text).map((choice, index) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <span className="w-6 h-6 border rounded flex items-center justify-center text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{choice.text}</span>
                    {((answerType === "single-choice" && correctSingle === choice.text) || 
                      (answerType === "multiple-choice" && correctMultiple.includes(choice.text))) && (
                      <span className="text-green-600 font-medium">✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {answerType === "ranking" && rankingItems.some(i => i.text) && (
            <div>
              <Label className="text-sm text-muted-foreground">Ranking Items</Label>
              <div className="space-y-2 mt-2">
                {rankingItems.filter(i => i.text).map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <span className="text-sm">{item.text}</span>
                    {rankings[item.text] && (
                      <span className="text-blue-600 font-medium">Rank: {rankings[item.text]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {answerType === "matching" && matchPairs.length > 0 && (
            <div>
              <Label className="text-sm text-muted-foreground">Matching Pairs</Label>
              <div className="space-y-2 mt-2">
                {matchPairs.map((pair) => (
                  <div key={pair.id} className="text-sm">
                    {pair.columnA} ↔ {pair.columnB}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Create New Question</h1>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <Button
                    variant={currentStep === step ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStepClick(step)}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    {step}
                  </Button>
                  <span className={`ml-2 text-sm ${currentStep === step ? 'font-medium' : 'text-muted-foreground'}`}>
                    {step === 1 && "Details & Properties"}
                    {step === 2 && "Answer Choices & Scoring"}
                    {step === 3 && "Preview & Confirm"}
                  </span>
                  {step < 3 && <ChevronRight className="mx-4 h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="max-w-4xl">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
              </div>
              <div className="space-x-2">
                {currentStep === 3 ? (
                  <>
                    <Button variant="outline">Save as Draft</Button>
                    <Button onClick={handleSubmit}>Confirm & Save Question</Button>
                  </>
                ) : (
                  <Button onClick={handleNext}>
                    Next: {currentStep === 1 ? "Answer Choices & Scoring" : "Preview"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}