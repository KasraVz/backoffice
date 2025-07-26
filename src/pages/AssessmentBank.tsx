import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Search, Edit, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockQuestions = [
  {
    id: 101,
    title: "When a key feature launch is delayed, what is the best course of action?",
    type: "SJT",
    category: "Crisis",
    lastModified: "2025-07-22"
  },
  {
    id: 102,
    title: "Is validating market fit before building an MVP essential?",
    type: "True/False",
    category: "Market Entry",
    lastModified: "2025-07-21"
  }
];

const mockBehavioralCodes = [
  {
    id: 1,
    codeName: "Resilience and persistence",
    description: "The ability to recover from setbacks and maintain effort."
  },
  {
    id: 2,
    codeName: "Strategic thinking",
    description: "The ability to think long-term and make strategic decisions."
  }
];

interface AnswerChoice {
  id: number;
  text: string;
}

interface MatchPair {
  columnA: string;
  columnB: string;
  id: number;
}

export default function AssessmentBank() {
  const [activeTab, setActiveTab] = useState("questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const { toast } = useToast();

  // Step 1 form data
  const [step1Data, setStep1Data] = useState({
    questionText: "",
    behavioralCode: "",
    category: "",
    subCategory: "",
    scope: "general",
    industry: ""
  });

  // Step 2 form data
  const [step2Data, setStep2Data] = useState({
    answerType: "",
    choices: [{ id: 1, text: "" }, { id: 2, text: "" }],
    items: [{ id: 1, text: "" }, { id: 2, text: "" }],
    columnsData: {
      columnA: [{ id: 1, text: "" }],
      columnB: []
    }
  });

  // Step 3 form data
  const [step3Data, setStep3Data] = useState({
    singleCorrect: "",
    multipleCorrect: [] as string[],
    rankings: {} as Record<string, number>,
    matchings: [] as MatchPair[]
  });

  const [selectedMatching, setSelectedMatching] = useState<{columnA?: string, columnB?: string}>({});

  const handleCreateQuestion = () => {
    setWizardStep(1);
    setStep1Data({
      questionText: "",
      behavioralCode: "",
      category: "",
      subCategory: "",
      scope: "general",
      industry: ""
    });
    setStep2Data({
      answerType: "",
      choices: [{ id: 1, text: "" }, { id: 2, text: "" }],
      items: [{ id: 1, text: "" }, { id: 2, text: "" }],
      columnsData: {
        columnA: [{ id: 1, text: "" }],
        columnB: []
      }
    });
    setStep3Data({
      singleCorrect: "",
      multipleCorrect: [],
      rankings: {},
      matchings: []
    });
    setIsWizardOpen(true);
  };

  const handleNextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleSubmitQuestion = () => {
    toast({
      title: "Success",
      description: "Question created successfully."
    });
    setIsWizardOpen(false);
  };

  const addChoice = () => {
    const newId = Math.max(...step2Data.choices.map(c => c.id)) + 1;
    setStep2Data({
      ...step2Data,
      choices: [...step2Data.choices, { id: newId, text: "" }]
    });
  };

  const addItem = () => {
    const newId = Math.max(...step2Data.items.map(i => i.id)) + 1;
    setStep2Data({
      ...step2Data,
      items: [...step2Data.items, { id: newId, text: "" }]
    });
  };

  const addColumnAItem = () => {
    const newId = Math.max(...step2Data.columnsData.columnA.map(i => i.id)) + 1;
    setStep2Data({
      ...step2Data,
      columnsData: {
        ...step2Data.columnsData,
        columnA: [...step2Data.columnsData.columnA, { id: newId, text: "" }]
      }
    });
  };

  const addColumnBItem = () => {
    const newId = step2Data.columnsData.columnB.length > 0 
      ? Math.max(...step2Data.columnsData.columnB.map(i => i.id)) + 1 
      : 1;
    setStep2Data({
      ...step2Data,
      columnsData: {
        ...step2Data.columnsData,
        columnB: [...step2Data.columnsData.columnB, { id: newId, text: "" }]
      }
    });
  };

  const addColumn = () => {
    if (step2Data.columnsData.columnB.length === 0) {
      setStep2Data({
        ...step2Data,
        columnsData: {
          ...step2Data.columnsData,
          columnB: [{ id: 1, text: "" }]
        }
      });
    }
  };

  const handleMatching = (type: 'columnA' | 'columnB', text: string) => {
    if (type === 'columnA') {
      if (selectedMatching.columnA === text) {
        setSelectedMatching({});
      } else {
        setSelectedMatching({ columnA: text });
      }
    } else {
      if (selectedMatching.columnA && selectedMatching.columnA !== text) {
        const newPair = { 
          columnA: selectedMatching.columnA, 
          columnB: text, 
          id: step3Data.matchings.length + 1 
        };
        setStep3Data({
          ...step3Data,
          matchings: [...step3Data.matchings, newPair]
        });
        setSelectedMatching({});
      }
    }
  };

  const getMatchingColor = (text: string) => {
    const matchIndex = step3Data.matchings.findIndex(
      m => m.columnA === text || m.columnB === text
    );
    if (matchIndex === -1) return "";
    
    const colors = ["bg-green-200", "bg-blue-200", "bg-purple-200", "bg-yellow-200", "bg-red-200"];
    return colors[matchIndex % colors.length];
  };

  const isMatched = (text: string) => {
    return step3Data.matchings.some(m => m.columnA === text || m.columnB === text);
  };

  const renderWizardContent = () => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="questionText">Question Text</Label>
              <Textarea
                id="questionText"
                value={step1Data.questionText}
                onChange={(e) => setStep1Data({...step1Data, questionText: e.target.value})}
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Properties</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Select a Behavioral Code</Label>
                  <Select value={step1Data.behavioralCode} onValueChange={(value) => setStep1Data({...step1Data, behavioralCode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select behavioral code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resilience">Resilience and persistence</SelectItem>
                      <SelectItem value="strategic">Strategic thinking</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select a Category</Label>
                  <Select value={step1Data.category} onValueChange={(value) => setStep1Data({...step1Data, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market-entry">Market Entry</SelectItem>
                      <SelectItem value="crisis">Crisis</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select a Sub-Category</Label>
                  <Select value={step1Data.subCategory} onValueChange={(value) => setStep1Data({...step1Data, subCategory: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funding">Funding</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Scope</Label>
                <RadioGroup value={step1Data.scope} onValueChange={(value) => setStep1Data({...step1Data, scope: value})} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">General</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="industry-specific" id="industry-specific" />
                    <Label htmlFor="industry-specific">Industry-Specific</Label>
                  </div>
                </RadioGroup>

                {step1Data.scope === "industry-specific" && (
                  <div className="mt-4">
                    <Label>Select an Industry</Label>
                    <Select value={step1Data.industry} onValueChange={(value) => setStep1Data({...step1Data, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Select an Answer Type</Label>
              <Select value={step2Data.answerType} onValueChange={(value) => setStep2Data({...step2Data, answerType: value})}>
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

            {step2Data.answerType === "single-choice" || step2Data.answerType === "multiple-choice" ? (
              <div className="space-y-4">
                {step2Data.choices.map((choice, index) => (
                  <Input
                    key={choice.id}
                    placeholder={`Choice ${index + 1}`}
                    value={choice.text}
                    onChange={(e) => {
                      const updatedChoices = step2Data.choices.map(c =>
                        c.id === choice.id ? { ...c, text: e.target.value } : c
                      );
                      setStep2Data({...step2Data, choices: updatedChoices});
                    }}
                  />
                ))}
                <Button variant="outline" onClick={addChoice}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Choice
                </Button>
              </div>
            ) : step2Data.answerType === "ranking" ? (
              <div className="space-y-4">
                {step2Data.items.map((item, index) => (
                  <Input
                    key={item.id}
                    placeholder={`Item ${index + 1}`}
                    value={item.text}
                    onChange={(e) => {
                      const updatedItems = step2Data.items.map(i =>
                        i.id === item.id ? { ...i, text: e.target.value } : i
                      );
                      setStep2Data({...step2Data, items: updatedItems});
                    }}
                  />
                ))}
                <Button variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            ) : step2Data.answerType === "matching" ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Column A</h4>
                  <div className="space-y-2">
                    {step2Data.columnsData.columnA.map((item, index) => (
                      <Input
                        key={item.id}
                        placeholder={`Item ${index + 1}`}
                        value={item.text}
                        onChange={(e) => {
                          const updatedColumnA = step2Data.columnsData.columnA.map(i =>
                            i.id === item.id ? { ...i, text: e.target.value } : i
                          );
                          setStep2Data({
                            ...step2Data,
                            columnsData: { ...step2Data.columnsData, columnA: updatedColumnA }
                          });
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
                  {step2Data.columnsData.columnB.length === 0 ? (
                    <Button variant="outline" onClick={addColumn}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Column
                    </Button>
                  ) : (
                    <>
                      <h4 className="font-medium mb-3">Column B</h4>
                      <div className="space-y-2">
                        {step2Data.columnsData.columnB.map((item, index) => (
                          <Input
                            key={item.id}
                            placeholder={`Item ${index + 1}`}
                            value={item.text}
                            onChange={(e) => {
                              const updatedColumnB = step2Data.columnsData.columnB.map(i =>
                                i.id === item.id ? { ...i, text: e.target.value } : i
                              );
                              setStep2Data({
                                ...step2Data,
                                columnsData: { ...step2Data.columnsData, columnB: updatedColumnB }
                              });
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
            ) : null}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {step2Data.answerType === "single-choice" && (
              <div className="space-y-3">
                <h4 className="font-medium">Select the correct answer:</h4>
                <RadioGroup value={step3Data.singleCorrect} onValueChange={(value) => setStep3Data({...step3Data, singleCorrect: value})}>
                  {step2Data.choices.filter(c => c.text).map((choice) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice.text} id={choice.id.toString()} />
                      <Label htmlFor={choice.id.toString()}>{choice.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {step2Data.answerType === "multiple-choice" && (
              <div className="space-y-3">
                <h4 className="font-medium">Select the correct answers:</h4>
                {step2Data.choices.filter(c => c.text).map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={choice.id.toString()}
                      checked={step3Data.multipleCorrect.includes(choice.text)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStep3Data({
                            ...step3Data,
                            multipleCorrect: [...step3Data.multipleCorrect, choice.text]
                          });
                        } else {
                          setStep3Data({
                            ...step3Data,
                            multipleCorrect: step3Data.multipleCorrect.filter(text => text !== choice.text)
                          });
                        }
                      }}
                      className="rounded border-input"
                    />
                    <Label htmlFor={choice.id.toString()}>{choice.text}</Label>
                  </div>
                ))}
              </div>
            )}

            {step2Data.answerType === "ranking" && (
              <div className="space-y-3">
                <h4 className="font-medium">Set the correct ranking (1 = highest rank):</h4>
                {step2Data.items.filter(i => i.text).map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Label className="flex-1">{item.text}</Label>
                    <Input
                      type="number"
                      placeholder="Rank"
                      min="1"
                      className="w-24"
                      value={step3Data.rankings[item.text] || ""}
                      onChange={(e) => setStep3Data({
                        ...step3Data,
                        rankings: { ...step3Data.rankings, [item.text]: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                ))}
              </div>
            )}

            {step2Data.answerType === "matching" && (
              <div className="space-y-6">
                <h4 className="font-medium">Click items to create matches:</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Column A</h5>
                    <div className="space-y-2">
                      {step2Data.columnsData.columnA.filter(i => i.text).map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 border rounded cursor-pointer transition-all ${
                            isMatched(item.text) 
                              ? getMatchingColor(item.text)
                              : selectedMatching.columnA === item.text 
                              ? "border-primary bg-primary/10" 
                              : "hover:bg-muted"
                          }`}
                          onClick={() => !isMatched(item.text) && handleMatching('columnA', item.text)}
                        >
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Column B</h5>
                    <div className="space-y-2">
                      {step2Data.columnsData.columnB.filter(i => i.text).map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 border rounded cursor-pointer transition-all ${
                            isMatched(item.text) 
                              ? getMatchingColor(item.text)
                              : "hover:bg-muted"
                          }`}
                          onClick={() => !isMatched(item.text) && handleMatching('columnB', item.text)}
                        >
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {step3Data.matchings.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Current Matches:</h5>
                    {step3Data.matchings.map((match, index) => (
                      <div key={match.id} className="text-sm text-muted-foreground">
                        {match.columnA} ↔ {match.columnB}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">Assessment Bank</h1>
          </header>
          
          <main className="flex-1 p-6 bg-background">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="behavioral-codes">Behavioral Codes</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <Button onClick={handleCreateQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Question
                  </Button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search by question title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="sjt">SJT</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="crisis">Crisis</SelectItem>
                        <SelectItem value="market-entry">Market Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-24">Type</TableHead>
                      <TableHead className="w-32">Category</TableHead>
                      <TableHead className="w-32">Last Modified</TableHead>
                      <TableHead className="w-24 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="text-center">{question.id}</TableCell>
                        <TableCell>{question.title}</TableCell>
                        <TableCell>{question.type}</TableCell>
                        <TableCell>{question.category}</TableCell>
                        <TableCell>{question.lastModified}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="behavioral-codes" className="mt-6">
                <div className="flex justify-end items-center mb-6">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Code
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">ID</TableHead>
                      <TableHead className="w-48">Code Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBehavioralCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="text-center">{code.id}</TableCell>
                        <TableCell>{code.codeName}</TableCell>
                        <TableCell>{code.description}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Create New Question Wizard Modal */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Step {wizardStep} of 3: {
                wizardStep === 1 ? "Define Question Details" :
                wizardStep === 2 ? "Define Answer Structure" :
                "Define Correct Answers"
              }
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {renderWizardContent()}
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t">
            <div>
              {wizardStep > 1 && (
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {wizardStep === 3 && (
                <Button variant="outline">
                  Save as Draft
                </Button>
              )}
              
              {wizardStep < 3 ? (
                <Button onClick={handleNextStep}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmitQuestion}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}