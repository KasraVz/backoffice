import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Eye, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockQuestions = [
  {
    id: 101,
    title: "When a key feature launch is delayed, what is the best course of action?",
    type: "SJT",
    category: "Crisis",
    group: "Resilience",
    lastModified: "2025-07-22"
  },
  {
    id: 102,
    title: "Is validating market fit before building an MVP essential?",
    type: "True/False",
    category: "Market Entry",
    group: "Strategy",
    lastModified: "2025-07-21"
  }
];

const mockAnswerItems = [
  {
    id: 5501,
    answerText: "Immediately inform all stakeholders and provide a revised timeline.",
    dateCreated: "2025-07-20"
  },
  {
    id: 5502,
    answerText: "Increase team overtime to meet the original deadline.",
    dateCreated: "2025-07-20"
  }
];

const mockBehavioralCodes = [
  {
    id: 1,
    codeName: "Resilience and persistence",
    description: "The ability to recover from setbacks and maintain effort."
  }
];

const mockAnswerLibrary = [
  { id: 1, text: "Immediately inform all stakeholders and provide a revised timeline." },
  { id: 2, text: "Increase team overtime to meet the original deadline." },
  { id: 3, text: "Reassess priorities and adjust scope accordingly." },
  { id: 4, text: "Communicate transparently with the team about challenges." }
];

interface AnswerChoice {
  id: number;
  text: string;
  weight: number;
}

export default function AssessmentBank() {
  const [activeTab, setActiveTab] = useState("questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isAnswerLibraryModalOpen, setIsAnswerLibraryModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerChoice[]>([]);
  const [questionForm, setQuestionForm] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    behavioralCode: ""
  });
  const { toast } = useToast();

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      title: "",
      description: "",
      type: "",
      category: "",
      behavioralCode: ""
    });
    setSelectedAnswers([]);
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setQuestionForm({
      title: question.title,
      description: question.description || "",
      type: question.type,
      category: question.category,
      behavioralCode: question.group
    });
    setSelectedAnswers([]);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!questionForm.title || !questionForm.type || !questionForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Save logic would go here
    toast({
      title: "Success",
      description: editingQuestion ? "Question updated successfully." : "Question created successfully."
    });
    
    setIsQuestionModalOpen(false);
    setEditingQuestion(null);
    setQuestionForm({
      title: "",
      description: "",
      type: "",
      category: "",
      behavioralCode: ""
    });
    setSelectedAnswers([]);
  };

  const handleAddAnswerChoice = (answer: any) => {
    const newChoice: AnswerChoice = {
      id: answer.id,
      text: answer.text,
      weight: 1
    };
    setSelectedAnswers([...selectedAnswers, newChoice]);
    setIsAnswerLibraryModalOpen(false);
  };

  const handleRemoveAnswerChoice = (id: number) => {
    setSelectedAnswers(selectedAnswers.filter(answer => answer.id !== id));
  };

  const handleWeightChange = (id: number, weight: number) => {
    setSelectedAnswers(selectedAnswers.map(answer => 
      answer.id === id ? { ...answer, weight } : answer
    ));
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="answer-items">Answer Items</TabsTrigger>
                <TabsTrigger value="behavioral-codes">Behavioral Codes</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search by question title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleCreateQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Question
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-24">Type</TableHead>
                      <TableHead className="w-32">Category</TableHead>
                      <TableHead className="w-32">Group</TableHead>
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
                        <TableCell>{question.group}</TableCell>
                        <TableCell>{question.lastModified}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditQuestion(question)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="answer-items" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search answer texts..."
                      className="pl-10"
                    />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Answer Item
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">ID</TableHead>
                      <TableHead>Answer Text</TableHead>
                      <TableHead className="w-32">Date Created</TableHead>
                      <TableHead className="w-24 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAnswerItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell>{item.answerText}</TableCell>
                        <TableCell>{item.dateCreated}</TableCell>
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

      {/* Create/Edit Question Modal */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {editingQuestion ? "Edit Question" : "Create New Question"}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsQuestionModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section 1: Core Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Core Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={questionForm.title}
                    onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Question Text)</Label>
                  <Textarea
                    id="description"
                    value={questionForm.description}
                    onChange={(e) => setQuestionForm({...questionForm, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Properties & Categorization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Properties & Categorization</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Question Type</Label>
                  <Select value={questionForm.type} onValueChange={(value) => setQuestionForm({...questionForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="SJT">SJT</SelectItem>
                      <SelectItem value="True/False">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={questionForm.category} onValueChange={(value) => setQuestionForm({...questionForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Market Entry">Market Entry</SelectItem>
                      <SelectItem value="Crisis">Crisis</SelectItem>
                      <SelectItem value="Strategy">Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Behavioral Code (Group)</Label>
                  <Select value={questionForm.behavioralCode} onValueChange={(value) => setQuestionForm({...questionForm, behavioralCode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Resilience">Resilience</SelectItem>
                      <SelectItem value="Strategic Thinking">Strategic Thinking</SelectItem>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Answer Logic & Scoring */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Answer Logic & Scoring</h3>
              <div>
                <h4 className="font-medium mb-3">Answer Choices & Scoring</h4>
                <Button
                  variant="outline"
                  onClick={() => setIsAnswerLibraryModalOpen(true)}
                  className="mb-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Answer Choice
                </Button>
                
                {selectedAnswers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    Add questions from the answer library to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedAnswers.map((answer) => (
                      <div key={answer.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1 text-sm">{answer.text}</div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`weight-${answer.id}`} className="text-xs">Weight:</Label>
                          <Input
                            id={`weight-${answer.id}`}
                            type="number"
                            value={answer.weight}
                            onChange={(e) => handleWeightChange(answer.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAnswerChoice(answer.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuestion}>
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Answer Library Selection Modal */}
      <Dialog open={isAnswerLibraryModalOpen} onOpenChange={setIsAnswerLibraryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Answer Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search answer items..."
                className="pl-10"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {mockAnswerLibrary.map((answer) => (
                <div
                  key={answer.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted"
                  onClick={() => handleAddAnswerChoice(answer)}
                >
                  <p className="text-sm">{answer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}